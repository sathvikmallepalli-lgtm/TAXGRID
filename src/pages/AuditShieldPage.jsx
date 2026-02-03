import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import ReceiptUploader from '../components/ReceiptUploader';
import { Shield, FileCheck, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { extractGSTIN, extractAmount, extractDate, extractVendor } from '../utils/extractGSTIN';
import { verifyInvoice } from '../utils/taxGridEngine';
import { downloadAuditShieldPDF } from '../utils/generatePDF';
import { checkGIOrigin } from '../utils/giProducts';

export default function AuditShieldPage() {
  const [invoices, setInvoices] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImagesSelect = useCallback((newImages) => {
    const items = newImages.map((img, i) => ({
      id: Date.now() + i,
      name: img.name,
      preview: img.preview,
      status: 'pending',
      progress: 0,
      extractedData: null,
      validationResult: null,
      ocrText: '',
    }));

    setInvoices((prev) => {
      const updated = [...prev, ...items];
      items.forEach((item) => processInvoice(item.id, item.preview));
      return updated;
    });
  }, []);

  const processInvoice = async (id, imageData) => {
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

      let verification = null;
      let giAlerts = [];

      if (gstin) {
        verification = await verifyInvoice(gstin, text, amount || 0, null, 18);
        if (verification.validation.isValid) {
          giAlerts = checkGIOrigin(text, verification.validation.stateCode);
        }
      }

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? {
                ...inv,
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
                giAlerts,
              }
            : inv
        )
      );
    } catch (error) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'error', progress: 0 } : inv))
      );
    }
  };

  const handleGeneratePDF = async () => {
    if (invoices.length === 0) {
      alert('Please upload invoices first');
      return;
    }

    const doneInvoices = invoices.filter((i) => i.status === 'done');
    if (doneInvoices.length === 0) {
      alert('Please wait for invoice processing to complete');
      return;
    }

    setIsGenerating(true);
    try {
      downloadAuditShieldPDF(doneInvoices);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const doneInvoices = invoices.filter((i) => i.status === 'done');
  const totalAmount = doneInvoices.reduce((sum, inv) => sum + (inv.extractedData?.amount || 0), 0);
  const verifiedCount = doneInvoices.filter((inv) => inv.validationResult?.isValid).length;
  const highRiskCount = doneInvoices.filter(
    (inv) => inv.risk && (inv.risk.level === 'HIGH' || inv.risk.level === 'CRITICAL')
  ).length;
  const giAlertCount = doneInvoices.filter((inv) => inv.giAlerts && inv.giAlerts.length > 0).length;

  const removeInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const previewsForUploader = invoices.map((inv) => ({
    preview: inv.preview,
    name: inv.name,
    onRemove: () => removeInvoice(inv.id),
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-10 h-10 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">TaxGrid Audit Shield</h1>
        </div>
        <p className="text-gray-600">
          Upload invoices, verify GSTIN compliance, detect fraud, and generate comprehensive audit reports
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
        <ReceiptUploader onImagesSelect={handleImagesSelect} previews={previewsForUploader} />
      </div>

      {/* Stats Dashboard */}
      {doneInvoices.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            Audit Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-3xl font-bold text-blue-600">{doneInvoices.length}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Total Invoices</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Verified</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">High Risk</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-3xl font-bold text-orange-600">{giAlertCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">GI Alerts</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Invoice Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Generate PDF Button */}
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Audit Shield Report
              </>
            )}
          </button>
        </div>
      )}

      {/* Invoice List */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Invoice Details ({invoices.length})
          </h3>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <InvoiceRow key={inv.id} invoice={inv} onRemove={() => removeInvoice(inv.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Invoices Uploaded</h3>
          <p className="text-gray-500">Upload invoice images to begin audit verification</p>
        </div>
      )}
    </div>
  );
}

function InvoiceRow({ invoice, onRemove }) {
  const { name, status, progress, extractedData, validationResult, risk, giAlerts } = invoice;

  const getStatusBadge = () => {
    if (status === 'processing') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          {progress}%
        </span>
      );
    }

    if (status === 'done') {
      if (risk?.level === 'HIGH' || risk?.level === 'CRITICAL') {
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" /> {risk.level} RISK
          </span>
        );
      }
      if (validationResult?.isValid) {
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Verified
          </span>
        );
      }
    }

    return (
      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {status === 'error' ? 'Error' : 'Pending'}
      </span>
    );
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <img
        src={invoice.preview}
        alt={name}
        className="w-16 h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {status === 'done' && extractedData && (
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
            {extractedData.gstin && <span>GSTIN: {extractedData.gstin}</span>}
            {extractedData.amount && (
              <span>₹{extractedData.amount.toLocaleString('en-IN')}</span>
            )}
            {giAlerts && giAlerts.length > 0 && (
              <span className="text-orange-600 font-semibold">⚠️ {giAlerts.length} GI Alert(s)</span>
            )}
          </div>
        )}
      </div>
      {getStatusBadge()}
      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}
