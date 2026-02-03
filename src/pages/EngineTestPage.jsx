import { useState } from 'react';
import { verifyInvoice, getRiskBadgeStyle } from '../utils/taxGridEngine';
import { TEST_INVOICES_ENHANCED } from '../data/testInvoicesEnhanced';
import { CheckCircle, XCircle, Play, Loader2, AlertTriangle, FileText } from 'lucide-react';

export default function EngineTestPage() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    const testResults = [];

    for (let i = 0; i < TEST_INVOICES_ENHANCED.length; i++) {
      setCurrentTest(i + 1);
      const test = TEST_INVOICES_ENHANCED[i];

      try {
        const result = await verifyInvoice(
          test.invoiceData.seller.gstin,
          test.invoiceData.ocrText,
          test.invoiceData.taxableAmount,
          test.invoiceData.buyer.stateCode,
          18
        );

        const passed = result.risk.level === test.expectedRisk &&
                      result.recommendation.canClaimITC === test.expectedITC;

        testResults.push({
          test,
          result,
          passed,
          error: null
        });
      } catch (error) {
        testResults.push({
          test,
          result: null,
          passed: false,
          error: error.message
        });
      }

      setResults([...testResults]);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
    }

    setIsRunning(false);
    setCurrentTest(0);
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎯 TaxGrid Engine Test Suite
        </h1>
        <p className="text-gray-600">
          Comprehensive testing of unified verification engine with all 10 scenarios
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Test Control</h2>
            <p className="text-sm text-gray-600">
              {TEST_INVOICES_ENHANCED.length} test scenarios available
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Testing {currentTest}/{TEST_INVOICES_ENHANCED.length}...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentTest / TEST_INVOICES_ENHANCED.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && !isRunning && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">{results.length}</p>
              <p className="text-sm text-blue-600">Tests Run</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-700">{passedCount}</p>
              <p className="text-sm text-green-600">Passed ✅</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-700">{failedCount}</p>
              <p className="text-sm text-red-600">Failed ❌</p>
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>

          {results.map((testResult, index) => {
            const { test, result, passed, error } = testResult;
            const isExpanded = expandedId === test.id;
            const riskStyle = result ? getRiskBadgeStyle(result.risk.level) : null;

            return (
              <div
                key={test.id}
                className={`bg-white rounded-xl border-2 shadow-sm transition-all ${
                  passed ? 'border-green-300' : 'border-red-300'
                }`}
              >
                {/* Test Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : test.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Pass/Fail Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {passed ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600" />
                        )}
                      </div>

                      {/* Test Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Test #{index + 1}: {test.testCase}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {passed ? '✅ PASS' : '❌ FAIL'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>GSTIN:</strong> {test.invoiceData.seller.gstin} ({test.invoiceData.seller.name})
                        </p>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Expected:</strong> {test.expectedResult}
                        </p>

                        {result && (
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Risk:</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${riskStyle?.bg} ${riskStyle?.text}`}>
                                {riskStyle?.icon} {result.risk.level}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">ITC:</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                result.recommendation.canClaimITC
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {result.recommendation.canClaimITC ? '✅ Yes' : '❌ No'}
                              </span>
                            </div>
                            {result.giCheck.hasGIProducts && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                <span className="text-xs font-semibold text-orange-800">
                                  {result.giCheck.count} GI Alert(s)
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {error && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">
                              <strong>Error:</strong> {error}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Expand Icon */}
                      <div className="flex-shrink-0 text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && result && (
                  <div className="border-t border-gray-200 p-5 bg-gray-50 space-y-4">
                    {/* Validation */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Validation
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded border">
                          <p className="text-xs text-gray-500">Valid</p>
                          <p className="font-semibold">{result.validation.isValid ? '✅ Yes' : '❌ No'}</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <p className="text-xs text-gray-500">State</p>
                          <p className="font-semibold">{result.validation.stateName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Portal Data */}
                    {result.portalData.found && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Portal Data</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded border">
                            <p className="text-xs text-gray-500">Legal Name</p>
                            <p className="font-semibold text-sm">{result.portalData.legalName}</p>
                          </div>
                          <div className="p-3 bg-white rounded border">
                            <p className="text-xs text-gray-500">Filing Status</p>
                            <p className="font-semibold" style={{ color: result.portalData.filingStatusColor }}>
                              {result.portalData.filingStatus}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded border col-span-2">
                            <p className="text-xs text-gray-500">Last Filed</p>
                            <p className="text-sm">{result.portalData.lastFiledReturn} on {result.portalData.lastFiledDate}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GI Check */}
                    {result.giCheck.hasGIProducts && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          GI Fraud Alerts
                        </h4>
                        {result.giCheck.alerts.map((alert, idx) => (
                          <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded mb-2">
                            <p className="font-semibold text-red-900">{alert.product}</p>
                            <p className="text-sm text-red-700">
                              Expected: {alert.expectedRegion} | Actual: State {alert.actualState}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tax Calculation */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Tax Calculation</h4>
                      <div className="p-3 bg-white rounded border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Base Amount:</div>
                          <div className="font-semibold">₹{result.tax.baseAmount.toLocaleString('en-IN')}</div>
                          {result.tax.cgst > 0 && (
                            <>
                              <div>CGST (9%):</div>
                              <div>₹{result.tax.cgst.toLocaleString('en-IN')}</div>
                              <div>SGST (9%):</div>
                              <div>₹{result.tax.sgst.toLocaleString('en-IN')}</div>
                            </>
                          )}
                          {result.tax.igst > 0 && (
                            <>
                              <div>IGST (18%):</div>
                              <div>₹{result.tax.igst.toLocaleString('en-IN')}</div>
                            </>
                          )}
                          <div className="font-bold">Total:</div>
                          <div className="font-bold">₹{result.tax.totalAmount.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Recommendation</h4>
                      <div className="p-4 rounded border" style={{ backgroundColor: `${result.risk.color}20` }}>
                        <p className="font-bold mb-1" style={{ color: result.risk.color }}>
                          {result.recommendation.message}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Action:</strong> {result.recommendation.action}
                        </p>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-gray-600">
                            <strong>Reasons:</strong> {result.risk.reasons.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Initial State */}
      {results.length === 0 && !isRunning && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to Test
          </h3>
          <p className="text-gray-500">
            Click "Run All Tests" to begin comprehensive engine testing
          </p>
        </div>
      )}
    </div>
  );
}
