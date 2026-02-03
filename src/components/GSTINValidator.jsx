import { useState } from 'react';
import { validateGSTIN } from '../utils/validateGSTIN';
import GSTINInput from './GSTINInput';
import ValidationResult from './ValidationResult';
import { Shield, Copy, Check } from 'lucide-react';
import { TEST_GSTINS } from '../utils/appData';

export default function GSTINValidator() {
  const [validationResult, setValidationResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleValidate = (gstin) => {
    const result = validateGSTIN(gstin);
    setValidationResult(result);
  };

  const handleCopy = async (gstin, index) => {
    await navigator.clipboard.writeText(gstin);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GSTIN Validator</h2>
          <p className="text-sm text-gray-600">Verify GST numbers instantly</p>
        </div>
      </div>

      <div className="space-y-4">
        <GSTINInput onValidate={handleValidate} />
        <ValidationResult result={validationResult} />
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">📋 Test GSTINs (Click to Copy):</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TEST_GSTINS.slice(0, 6).map((item, index) => (
            <button
              key={index}
              onClick={() => handleCopy(item.gstin, index)}
              className="flex items-center justify-between p-2 bg-white rounded hover:bg-blue-50 transition-colors text-left border border-blue-100 hover:border-blue-300"
            >
              <div className="flex-1">
                <p className="text-xs font-mono text-gray-700">{item.gstin}</p>
                <p className="text-xs text-gray-500">{item.state}</p>
              </div>
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-3 text-center">
          Click any GSTIN to copy, then paste it in the validator above ✓
        </p>
      </div>
    </section>
  );
}
