import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import ReceiptUploader from './ReceiptUploader';
import ValidationResult from './ValidationResult';
import GIAlert from './GIAlert';
import AuditShieldButton from './AuditShieldButton';
import { extractGSTIN, extractAmount, extractDate, extractVendor } from '../utils/extractGSTIN';
import { verifyInvoice } from '../utils/taxGridEngine';
import {
  Scan, Trash2, ChevronDown, ChevronUp, FileText, Store,
  DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle, RotateCcw,
} from 'lucide-react';

export default function ReceiptScanner() {
  // Each item: { id, name, preview, status, progress, extractedData, validationResult, ocrText }
  const [invoices, setInvoices] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
      if (gstin) {
        verification = await verifyInvoice(gstin, text, amount || 0, null, 18);
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
            }
            : inv
        )
      );
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

  const removeInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const clearAll = () => {
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

  const previewsForUploader = invoices.map((inv, index) => ({
    preview: inv.preview,
    name: inv.name,
    onRemove: () => removeInvoice(inv.id),
  }));

  const doneInvoices = invoices.filter((i) => i.status === 'done');
  const totalAmount = doneInvoices.reduce(
    (sum, inv) => sum + (inv.extractedData?.amount || 0),
    0
  );
  const validGSTCount = doneInvoices.filter(
    (inv) => inv.validationResult?.valid
  ).length;
  const invalidGSTCount = doneInvoices.filter(
    (inv) => inv.extractedData?.gstin && !inv.validationResult?.valid
  ).length;
  const noGSTCount = doneInvoices.filter(
    (inv) => !inv.extractedData?.gstin
  ).length;

  return (
    <section className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Scan className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Scanner</h2>
          <p className="text-sm text-gray-600">
            Upload multiple invoices — we'll extract GSTIN, amount, date & vendor from each
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ReceiptUploader
          onImagesSelect={handleImagesSelect}
          previews={previewsForUploader}
        />

        {/* Summary Stats */}
        {doneInvoices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <p className="text-2xl font-bold text-blue-700">{doneInvoices.length}</p>
              <p className="text-xs text-blue-600 font-medium">Scanned</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <p className="text-2xl font-bold text-green-700">{validGSTCount}</p>
              <p className="text-xs text-green-600 font-medium">Valid GSTIN</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
              <p className="text-2xl font-bold text-red-700">{invalidGSTCount}</p>
              <p className="text-xs text-red-600 font-medium">Invalid GSTIN</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <p className="text-2xl font-bold text-purple-700">
                {totalAmount > 0 ? `Rs.${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
              </p>
              <p className="text-xs text-purple-600 font-medium">Total Amount</p>
            </div>
          </div>
        )}

        {/* Audit Shield Button */}
        {doneInvoices.length > 0 && (
          <AuditShieldButton invoices={invoices} />
        )}

        {/* Invoice Results List */}
        {invoices.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Results ({invoices.length} invoice{invoices.length > 1 ? 's' : ''})
              </h3>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {invoices.map((inv) => (
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
