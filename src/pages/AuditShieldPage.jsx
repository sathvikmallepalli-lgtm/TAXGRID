import ReceiptScanner from '../components/ReceiptScanner';
import DemoNotice from '../components/DemoNotice';
import { Shield } from 'lucide-react';

export default function AuditShieldPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Demo Notice */}
      <DemoNotice variant="info" />
      <div className="mb-8">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
          <Shield className="w-12 h-12 text-emerald-600" />
          <h1 className="text-4xl font-bold text-gray-900">Audit Shield</h1>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          <strong>All-in-One</strong> Invoice Scanner: OCR Extraction + Fraud Detection + Real-Time Analytics + Export
        </p>

        {/* Quick Feature Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            📸 OCR Scanning
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ GSTIN Verification
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            📊 Session Analytics
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            🚨 GI Fraud Detection
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            📥 PDF/CSV/JSON Export
          </span>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">How It Works:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[24px]">1.</span>
              <span><strong>Upload</strong> invoice images or PDFs (drag & drop supported)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
              <span><strong>Auto-Extract</strong> GSTIN, vendor details, amounts using OCR</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
              <span><strong>Verify</strong> GSTIN format, checksum, and business registration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
              <span><strong>Analyze</strong> risk levels, trust scores, and GI fraud alerts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[24px]">5.</span>
              <span><strong>Export</strong> results as PDF reports, CSV, or JSON for records</span>
            </li>
          </ol>
        </div>
      </div>

      {/* The Unified Scanner Component */}
      <ReceiptScanner />

      {/* Feature Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">📸</div>
          <h3 className="font-bold text-gray-900 mb-2">Intelligent OCR</h3>
          <p className="text-sm text-gray-600">
            Powered by Tesseract.js, extracts GSTIN, vendor, dates, and amounts from images and PDFs with high accuracy.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl mb-4">🛡️</div>
          <h3 className="font-bold text-gray-900 mb-2">Trust Scoring Engine</h3>
          <p className="text-sm text-gray-600">
            AI-powered reputation analysis evaluates filing history, business age, and entity type for 0-100 trust score.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-4">📊</div>
          <h3 className="font-bold text-gray-900 mb-2">Real-Time Analytics</h3>
          <p className="text-sm text-gray-600">
            Live session analytics show risk distribution, top vendors, and spending patterns as you scan.
          </p>
        </div>
      </div>
    </div>
  );
}
