import { useState, useCallback, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import ReceiptUploader from './ReceiptUploader';
import ValidationResult from './ValidationResult';
import GIAlert from './GIAlert';
import { extractGSTIN, extractAmount, extractDate, extractVendor } from '../utils/extractGSTIN';
import { verifyInvoice } from '../utils/taxGridEngine';
import { downloadAuditShieldPDF } from '../utils/generatePDF';
import { getAllInvoices, saveInvoice, deleteInvoice, initDB } from '../utils/invoiceDB';
import { exportToCSV, exportToJSON } from '../utils/exportData';
import { getComprehensiveStats, formatCurrency, formatCompactNumber } from '../utils/analytics';
import {
  Scan, Trash2, ChevronDown, ChevronUp, FileText, Store,
  DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle, RotateCcw,
  FileCheck, Download, Shield, Upload, Database, TrendingUp, Users,
  PieChart, BarChart3, List, Grid, Search
} from 'lucide-react';

export default function ReceiptScanner() {
  // Each item: { id, name, preview, status, progress, extractedData, validationResult, ocrText }
  const [invoices, setInvoices] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize database and load existing invoices on mount
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        await initDB();
        setDbInitialized(true);
        const savedInvoices = await getAllInvoices();
        setInvoices(savedInvoices);
        console.log(`✅ Loaded ${savedInvoices.length} invoices from IndexedDB`);
      } catch (error) {
        console.error('Failed to load invoices from database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const processInvoice = useCallback(async (id, imageData) => {
    // Mark processing
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'processing', progress: 0 } : inv))
    );

    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setInvoices((prev) =>
              prev.map((inv) =>
                inv.id === id ? { ...inv, progress: Math.round(info.progress * 100) } : inv
              )
            );
          }
        },
      });

      const text = result.data.text;
      const gstin = extractGSTIN(text);
      const amount = extractAmount(text);
      const date = extractDate(text);
      const vendor = extractVendor(text);

      // Use unified engine for comprehensive verification
      let verification = null;
      let giAlerts = []; // Check for GI alerts

      if (gstin) {
        verification = await verifyInvoice(gstin, text, amount || 0, null, 18);
        if (verification.validation.isValid) {
          // Additional check for GI logic if verification succeeds
          // Note: verifyInvoice calls checkGIOrigin internally and returns it in .giCheck
          // But we can also access it directly or use what comes back
          if (verification.giCheck && verification.giCheck.alerts) {
            giAlerts = verification.giCheck.alerts;
          }
        }
      }

      const updatedInvoice = {
        status: 'done',
        progress: 100,
        ocrText: text,
        extractedData: { gstin, amount, date, vendor },
        validationResult: verification ? verification.validation : null,
        portalData: verification ? verification.portalData : null,
        giCheck: verification ? verification.giCheck : null,
        tax: verification ? verification.tax : null,
        risk: verification ? verification.risk : null,
        recommendation: verification ? verification.recommendation : null,
        giAlerts: giAlerts,
      };

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, ...updatedInvoice } : inv
        )
      );

      // Save to IndexedDB
      if (dbInitialized) {
        try {
          const invoiceToSave = invoices.find(inv => inv.id === id);
          if (invoiceToSave) {
            await saveInvoice({ ...invoiceToSave, ...updatedInvoice });
            console.log(`💾 Saved invoice ${id} to database`);
          }
        } catch (dbError) {
          console.error('Failed to save invoice to database:', dbError);
        }
      }
    } catch (error) {
      console.error("OCR Processing Error:", error);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'error', progress: 0 } : inv))
      );
    }
  }, []);

  const handleImagesSelect = useCallback(async (newImages) => {
    const items = newImages.map((img, i) => ({
      id: Date.now() + i,
      name: img.name,
      preview: img.preview,
      status: 'pending', // pending | processing | done | error
      progress: 0,
      extractedData: null,
      validationResult: null,
      ocrText: '',
    }));

    setInvoices((prev) => {
      const updated = [...prev, ...items];
      return updated;
    });

    // Process sequentially to prevent Tesseract worker conflicts
    for (const item of items) {
      await processInvoice(item.id, item.preview);
    }
  }, [processInvoice]);

  const removeInvoice = async (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (expandedId === id) setExpandedId(null);

    // Delete from IndexedDB
    if (dbInitialized) {
      try {
        await deleteInvoice(id);
        console.log(`🗑️ Deleted invoice ${id} from database`);
      } catch (error) {
        console.error('Failed to delete invoice from database:', error);
      }
    }
  };

  const clearAll = async () => {
    // Delete all from IndexedDB
    if (dbInitialized) {
      try {
        const deletePromises = invoices.map(inv => deleteInvoice(inv.id));
        await Promise.all(deletePromises);
        console.log('🗑️ Cleared all invoices from database');
      } catch (error) {
        console.error('Failed to clear invoices from database:', error);
      }
    }

    setInvoices([]);
    setExpandedId(null);
  };

  const retryInvoice = (id) => {
    const inv = invoices.find((i) => i.id === id);
    if (inv) processInvoice(id, inv.preview);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleGeneratePDF = async () => {
    const doneInvoices = invoices.filter((i) => i.status === 'done');
    if (doneInvoices.length === 0) return;

    setIsGenerating(true);
    try {
      downloadAuditShieldPDF(doneInvoices);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const doneInvoices = invoices.filter((i) => i.status === 'done');
    if (doneInvoices.length === 0) {
      alert('No invoices to export');
      return;
    }
    exportToCSV(doneInvoices, `taxgrid-invoices-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportJSON = () => {
    const doneInvoices = invoices.filter((i) => i.status === 'done');
    if (doneInvoices.length === 0) {
      alert('No invoices to export');
      return;
    }
    exportToJSON(doneInvoices, `taxgrid-invoices-${new Date().toISOString().split('T')[0]}`);
  };

  const previewsForUploader = invoices.map((inv, index) => ({
    preview: inv.preview,
    name: inv.name,
    onRemove: () => removeInvoice(inv.id),
  }));

  // Stats Calculations
  const doneInvoices = invoices.filter((i) => i.status === 'done');
  const totalAmount = doneInvoices.reduce((sum, inv) => sum + (inv.extractedData?.amount || 0), 0);
  const verifiedCount = doneInvoices.filter((inv) => inv.validationResult?.isValid).length;
  const highRiskCount = doneInvoices.filter((inv) => inv.risk && (inv.risk.level === 'HIGH' || inv.risk.level === 'CRITICAL')).length;
  const giAlertCount = doneInvoices.filter((inv) => inv.giCheck?.hasGIProducts).length;

  // Comprehensive analytics
  const stats = doneInvoices.length > 0 ? getComprehensiveStats(doneInvoices) : null;

  // Filtered invoices for search
  const filteredInvoices = doneInvoices.filter(inv => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase();
    return (
      inv.extractedData?.vendor?.toLowerCase().includes(search) ||
      inv.extractedData?.gstin?.toLowerCase().includes(search) ||
      inv.portalData?.legalName?.toLowerCase().includes(search) ||
      inv.category?.toLowerCase().includes(search)
    );
  });

  // Show loading state while initializing database
  if (isLoading) {
    return (
      <section className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-center gap-3 py-12">
          <Database className="w-8 h-8 text-primary animate-pulse" />
          <p className="text-gray-600">Loading invoices from database...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Scan className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice Scanner & Audit Shield</h2>
            <p className="text-sm text-gray-600">
              Unified Tool: OCR Scanning + Fraud Detection + Audit Reports
            </p>
          </div>
        </div>
        {dbInitialized && doneInvoices.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Database className="w-4 h-4" />
            <span>{doneInvoices.length} saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <ReceiptUploader
          onImagesSelect={handleImagesSelect}
          previews={previewsForUploader}
        />

        {/* Enhanced Analytics Dashboard */}
        {doneInvoices.length > 0 && stats && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Session Analytics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <Database className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{doneInvoices.length}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">Total Scanned</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">Verified Safe</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">High Risk</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCompactNumber(totalAmount)}
                  </p>
                  <p className="text-xs text-gray-600 font-medium mt-1">Total Value</p>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Risk Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.riskDistribution).map(([level, data]) => (
                    data.count > 0 && (
                      <div key={level} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{level}</span>
                            <span className="text-xs text-gray-600">{data.count} ({data.percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${data.percentage}%`,
                                backgroundColor: data.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Top Vendors */}
              {stats.topVendors.length > 0 && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Top Vendors (This Session)
                  </h4>
                  <div className="space-y-2">
                    {stats.topVendors.slice(0, 3).map((vendor, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 truncate">{vendor.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600">{vendor.count} invoice{vendor.count > 1 ? 's' : ''}</span>
                          <span className="text-xs font-mono text-gray-900">{formatCompactNumber(vendor.totalAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden md:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span className="hidden md:inline">PDF Report</span>
                      <span className="md:hidden">PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden md:inline">Export CSV</span>
                  <span className="md:hidden">CSV</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden md:inline">Export JSON</span>
                  <span className="md:hidden">JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Results with Search and View Toggle */}
        {invoices.length > 0 && (
          <div className="space-y-4">
            {/* Header with Search and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Invoice Results ({filteredInvoices.length}/{doneInvoices.length})
                </h3>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by vendor, GSTIN, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear All */}
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Clear All</span>
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="space-y-3">
                {filteredInvoices.map((inv) => (
                  <InvoiceCard
                    key={inv.id}
                    invoice={inv}
                    expanded={expandedId === inv.id}
                    onToggle={() => toggleExpand(inv.id)}
                    onRemove={() => removeInvoice(inv.id)}
                    onRetry={() => retryInvoice(inv.id)}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">Vendor</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">GSTIN</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700">Amount</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700">Risk</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700">Verification</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {inv.status === 'done' ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                <CheckCircle className="w-3 h-3" />
                                Done
                              </span>
                            ) : inv.status === 'processing' ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                {inv.progress}%
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">Pending</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {inv.extractedData?.vendor || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-700">
                            {inv.extractedData?.gstin || '-'}
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-mono text-gray-900">
                            {inv.extractedData?.amount ? `₹${inv.extractedData.amount.toFixed(2)}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {inv.risk?.level && (
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskBadgeClass(inv.risk.level)}`}>
                                {inv.risk.level}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {inv.validationResult?.isValid ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                Valid
                              </span>
                            ) : inv.extractedData?.gstin ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                Invalid
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                                No GSTIN
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => toggleExpand(inv.id)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                {expandedId === inv.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => removeInvoice(inv.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Expanded details in table view */}
                {filteredInvoices.map((inv) => (
                  expandedId === inv.id && inv.status === 'done' && (
                    <div key={`detail-${inv.id}`} className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Extracted fields grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field icon={Store} label="Vendor" value={inv.extractedData?.vendor} />
                          <Field
                            icon={DollarSign}
                            label="Amount"
                            value={inv.extractedData?.amount ? `Rs. ${inv.extractedData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : null}
                          />
                          <Field icon={Calendar} label="Date" value={inv.extractedData?.date} />
                          <Field icon={FileText} label="GSTIN" value={inv.extractedData?.gstin} mono />
                        </div>

                        {/* GSTIN validation */}
                        {inv.validationResult && <ValidationResult result={inv.validationResult} risk={inv.risk} recommendation={inv.recommendation} />}

                        {/* GI Origin Check */}
                        {inv.validationResult && inv.ocrText && (
                          <GIAlert
                            ocrText={inv.ocrText}
                            stateCode={inv.validationResult.stateCode}
                            stateName={inv.validationResult.stateName}
                          />
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* No results message */}
            {filteredInvoices.length === 0 && doneInvoices.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No invoices match your search
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function InvoiceCard({ invoice, expanded, onToggle, onRemove, onRetry }) {
  const { name, preview, status, progress, extractedData, validationResult, ocrText } = invoice;

  const statusBadge = () => {
    switch (status) {
      case 'processing':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            <span className="animate-spin w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full inline-block"></span>
            {progress}%
          </span>
        );
      case 'done':
        if (validationResult?.valid)
          return (
            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Valid GSTIN
            </span>
          );
        if (extractedData?.gstin && !validationResult?.valid)
          return (
            <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
              <XCircle className="w-3 h-3" /> Invalid GSTIN
            </span>
          );
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" /> No GSTIN
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" /> Error
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <img
          src={preview}
          alt={name}
          className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {status === 'done' && extractedData?.vendor && (
              <span className="text-xs text-gray-500 truncate max-w-[150px]">
                <Store className="w-3 h-3 inline mr-0.5" />
                {extractedData.vendor}
              </span>
            )}
            {status === 'done' && extractedData?.amount && (
              <span className="text-xs text-gray-500">
                <DollarSign className="w-3 h-3 inline mr-0.5" />
                Rs.{extractedData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            )}
            {status === 'done' && extractedData?.date && (
              <span className="text-xs text-gray-500">
                <Calendar className="w-3 h-3 inline mr-0.5" />
                {extractedData.date}
              </span>
            )}
          </div>
        </div>
        {statusBadge()}
        <div className="flex items-center gap-1 flex-shrink-0">
          {status === 'error' && (
            <button
              onClick={(e) => { e.stopPropagation(); onRetry(); }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Retry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {status === 'done' && (
            expanded
              ? <ChevronUp className="w-5 h-5 text-gray-400" />
              : <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Progress bar during processing */}
      {status === 'processing' && (
        <div className="px-4 pb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && status === 'done' && (
        <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
          {/* Extracted fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field icon={Store} label="Vendor" value={extractedData?.vendor} />
            <Field
              icon={DollarSign}
              label="Amount"
              value={extractedData?.amount ? `Rs. ${extractedData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : null}
            />
            <Field icon={Calendar} label="Date" value={extractedData?.date} />
            <Field icon={FileText} label="GSTIN" value={extractedData?.gstin} mono />
          </div>

          {/* GSTIN validation */}
          {validationResult && <ValidationResult result={validationResult} />}

          {/* GI Origin Check */}
          {validationResult && ocrText && (
            <GIAlert
              ocrText={ocrText}
              stateCode={validationResult.stateCode}
              stateName={validationResult.stateName}
            />
          )}

          {!extractedData?.gstin && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                No GSTIN was detected in this invoice.
              </p>
            </div>
          )}

          {/* Raw OCR text */}
          <details className="p-3 bg-white rounded-lg border border-gray-200">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              View Full OCR Text
            </summary>
            <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border border-gray-200 max-h-48 overflow-y-auto">
              {ocrText}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

function getRiskBadgeClass(risk) {
  const classes = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  };
  return classes[risk] || 'bg-gray-100 text-gray-800';
}
