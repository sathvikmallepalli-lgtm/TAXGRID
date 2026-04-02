import GSTINValidator from '../components/GSTINValidator';
import DemoNotice from '../components/DemoNotice';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ValidatorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Demo Notice */}
      <DemoNotice variant="info" />
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Shield className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">GSTIN Validator</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Instantly verify any Indian GSTIN with our advanced validation engine.
          Check format, checksum, state codes, and business registration status.
        </p>
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Format Validation</h3>
          <p className="text-sm text-gray-600">
            Validates 15-character GSTIN format with state code and entity type verification
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Shield className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Checksum Verification</h3>
          <p className="text-sm text-gray-600">
            Mod 36 Luhn algorithm checksum validation for authenticity
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <AlertTriangle className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Trust Scoring</h3>
          <p className="text-sm text-gray-600">
            Advanced risk assessment with filing status and business age analysis
          </p>
        </div>
      </div>

      {/* Validator Component */}
      <GSTINValidator />

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">What is GSTIN?</h3>
        <p className="text-sm text-gray-700 mb-3">
          A <strong>Goods and Services Tax Identification Number (GSTIN)</strong> is a unique 15-digit
          identification number assigned to every taxpayer registered under the GST system in India.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Format:</strong> The GSTIN follows the pattern:
          <code className="bg-white px-2 py-1 rounded mx-1 font-mono text-xs">
            [2-State Code][10-PAN][1-Entity][1-Z][1-Checksum]
          </code>
        </p>
      </div>

      {/* Quick Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">Try These Examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-300">
            <code className="text-sm font-mono text-primary">27AAPFU0939F1ZV</code>
            <p className="text-xs text-gray-600 mt-1">Valid GSTIN - Maharashtra</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-300">
            <code className="text-sm font-mono text-primary">29AABCU9603R1ZM</code>
            <p className="text-xs text-gray-600 mt-1">Valid GSTIN - Karnataka</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-300">
            <code className="text-sm font-mono text-primary">09AAECI5529B1ZP</code>
            <p className="text-xs text-gray-600 mt-1">Valid GSTIN - Uttar Pradesh</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-300">
            <code className="text-sm font-mono text-primary">33AAHCS4874E1Z0</code>
            <p className="text-xs text-gray-600 mt-1">Valid GSTIN - Tamil Nadu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
