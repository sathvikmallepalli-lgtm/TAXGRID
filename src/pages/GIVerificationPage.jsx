import { useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { GI_PRODUCTS, checkGIOrigin } from '../utils/giProducts';

export default function GIVerificationPage() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [result, setResult] = useState(null);

  const productList = Object.keys(GI_PRODUCTS);

  const handleVerify = () => {
    if (!selectedProduct || !stateCode) {
      alert('Please select a product and enter state code');
      return;
    }

    // Create mock OCR text with the product name
    const mockOcrText = `Invoice containing ${selectedProduct}`;
    const alerts = checkGIOrigin(mockOcrText, stateCode);

    setResult({
      product: selectedProduct,
      stateCode,
      isLegitimate: alerts.length === 0,
      alerts,
      expectedRegion: GI_PRODUCTS[selectedProduct].region
    });
  };

  const handleReset = () => {
    setSelectedProduct('');
    setStateCode('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🗺️ GI Location Verification
        </h1>
        <p className="text-gray-600">
          Verify Geographical Indication (GI) products to detect location fraud
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-6">
        <div className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select GI Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-gray-900"
            >
              <option value="">-- Choose a product --</option>
              {productList.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Region Display */}
          {selectedProduct && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Expected Origin:</strong> {GI_PRODUCTS[selectedProduct].region} (State {GI_PRODUCTS[selectedProduct].states.join('/')})
              </p>
            </div>
          )}

          {/* State Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seller's State Code (2 digits)
            </label>
            <input
              type="text"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value.toUpperCase())}
              placeholder="e.g., 01, 27, 29"
              maxLength={2}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-gray-900 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 2-digit state code from the seller's GSTIN
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <Search className="w-5 h-5" />
              Verify Origin
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div
          className={`p-8 rounded-xl shadow-lg border-2 animate-slide-up ${
            result.isLegitimate
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.isLegitimate ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {result.isLegitimate ? (
                  <CheckCircle className="w-7 h-7 text-white" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  result.isLegitimate ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.isLegitimate ? '✓ Legitimate Origin' : '⚠️ FRAUD ALERT'}
              </h3>
              <p
                className={`text-sm ${
                  result.isLegitimate ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {result.isLegitimate
                  ? 'This product is from its authentic geographical region'
                  : 'This product claims to be from the wrong region!'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Product</p>
              <p className="font-bold text-gray-900">{result.product}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Expected Region</p>
              <p className="font-bold text-gray-900">{result.expectedRegion}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Seller's State Code</p>
              <p className="font-bold text-gray-900">{result.stateCode}</p>
            </div>
          </div>

          {/* Alert Details */}
          {!result.isLegitimate && result.alerts.length > 0 && (
            <div className="p-4 bg-red-100 rounded-lg border border-red-300">
              <p className="font-bold text-red-900 mb-2">Fraud Details:</p>
              {result.alerts.map((alert, idx) => (
                <p key={idx} className="text-sm text-red-800">
                  • {alert.product} is registered to {alert.expectedRegion}, but
                  seller is from State {alert.actualState}
                </p>
              ))}
            </div>
          )}

          {result.isLegitimate && (
            <div className="p-4 bg-green-100 rounded-lg border border-green-300">
              <p className="text-sm text-green-800">
                ✓ The seller's state code matches the expected geographical origin
                for this GI-tagged product. This product appears to be authentic.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">
          What is GI Verification?
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          Geographical Indication (GI) products are registered to specific regions.
          For example, "Darjeeling Tea" can only come from Darjeeling, West Bengal.
          This tool helps detect fraud when products claim to be from the wrong
          location.
        </p>
        <p className="text-xs text-blue-700">
          <strong>Currently tracking {productList.length} GI products</strong>{' '}
          including Kashmiri Saffron, Darjeeling Tea, Banarasi Sarees, and more.
        </p>
      </div>
    </div>
  );
}
