import { CheckCircle, XCircle, Building2, Tag, MapPin, Briefcase, FileText, AlertTriangle, Calendar, Shield } from 'lucide-react';
import { getFilingStatusDetails, getStatusBadge, getRiskBadgeStyle } from '../utils/mockGSTPortal';

export default function ValidationResult({ result, risk, recommendation }) {
  if (!result) return null;

  const { valid, error, gstin, stateName, stateCode, pan, legalName, tradeName, category, status, filingStatus, lastFiledReturn, lastFiledDate, registrationDate, address } = result;

  // Get risk badge styling if risk data available
  const riskStyle = risk ? getRiskBadgeStyle(risk.level) : null;

  if (valid) {
    return (
      <div className="w-full max-w-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg animate-slide-up">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-green-900 mb-1">✓ Valid GSTIN</h3>
            <p className="text-sm text-green-700">All validations passed successfully</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Legal Name */}
          <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Legal Name</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{legalName || 'Not Available'}</p>
          </div>

          {/* Trade Name */}
          <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Trade Name</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{tradeName || 'Not Available'}</p>
          </div>

          {/* Category */}
          <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Business Category</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{category || 'Not Available'}</p>
          </div>

          {/* State */}
          <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">State</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{stateName} ({stateCode})</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">GSTIN:</span>
              <span className="font-mono font-semibold text-gray-900">{gstin}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">PAN:</span>
              <span className="font-mono font-semibold text-gray-900">{pan}</span>
            </div>
          </div>
        </div>

        {/* Filing Status Badge (if available) */}
        {filingStatus && (
          <div className="mt-4">
            {filingStatus === 'GREEN' && (
              <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-900">
                    {getFilingStatusDetails(filingStatus).icon} {getFilingStatusDetails(filingStatus).label}
                  </span>
                </div>
                <p className="text-sm text-green-800">{getFilingStatusDetails(filingStatus).message}</p>
                {lastFiledReturn && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                    <Calendar className="w-4 h-4" />
                    <span>Last Filed: {lastFiledReturn} on {lastFiledDate}</span>
                  </div>
                )}
              </div>
            )}

            {filingStatus === 'YELLOW' && (
              <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-900">
                    {getFilingStatusDetails(filingStatus).icon} {getFilingStatusDetails(filingStatus).label}
                  </span>
                </div>
                <p className="text-sm text-yellow-800">{getFilingStatusDetails(filingStatus).message}</p>
                {lastFiledReturn && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700">
                    <Calendar className="w-4 h-4" />
                    <span>Last Filed: {lastFiledReturn} on {lastFiledDate}</span>
                  </div>
                )}
              </div>
            )}

            {filingStatus === 'RED' && (
              <div className="p-4 bg-red-100 rounded-lg border border-red-300">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-900">
                    {getFilingStatusDetails(filingStatus).icon} {getFilingStatusDetails(filingStatus).label}
                  </span>
                </div>
                <p className="text-sm text-red-800 font-semibold">{getFilingStatusDetails(filingStatus).message}</p>
                {lastFiledReturn && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-700">
                    <Calendar className="w-4 h-4" />
                    <span>Last Filed: {lastFiledReturn} on {lastFiledDate}</span>
                  </div>
                )}
              </div>
            )}

            {(filingStatus === 'CANCELLED' || filingStatus === 'SUSPENDED') && (
              <div className="p-4 bg-red-100 rounded-lg border-2 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-900 text-lg">
                    {getFilingStatusDetails(filingStatus).icon} {getFilingStatusDetails(filingStatus).label}
                  </span>
                </div>
                <p className="text-sm text-red-800 font-bold">{getFilingStatusDetails(filingStatus).message}</p>
              </div>
            )}
          </div>
        )}

        {/* Advanced Trust Score Assessment */}
        {risk && recommendation && (
          <div className="mt-4">
            <div className={`p-5 rounded-xl border-2 shadow-sm ${riskStyle?.bg} ${riskStyle?.border} transition-all`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className={`w-8 h-8 ${riskStyle?.text}`} />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl">Trust Score</h4>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                      Business Reputation Engine
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-gray-900">
                    {risk.trustScore}<span className="text-lg text-gray-500 font-medium">/100</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${riskStyle?.bg} ${riskStyle?.text} border ${riskStyle?.border}`}>
                    {risk.level} RISK
                  </span>
                </div>
              </div>

              {/* Trust Meter Bar */}
              <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-gray-200 mb-4 shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${risk.trustScore >= 80 ? 'bg-green-500' :
                      risk.trustScore >= 50 ? 'bg-yellow-500' :
                        risk.trustScore >= 30 ? 'bg-orange-500' : 'bg-red-600'
                    }`}
                  style={{ width: `${risk.trustScore}%` }}
                ></div>
              </div>

              <div className="flex-1">
                {/* Trust Factors Breakdown */}
                {risk.reasons && risk.reasons.length > 0 && (
                  <div className="bg-white/60 rounded-lg p-3 mb-4 backdrop-blur-sm border border-gray-200/50">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Score Analysis:</p>
                    <ul className="text-sm space-y-1.5">
                      {risk.reasons.map((reason, idx) => {
                        // reason string format: "Label (+20)" or "Label (-50)"
                        const isPositive = reason.includes('+');
                        return (
                          <li key={idx} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                            <span className="text-gray-700 font-medium">{reason.split('(')[0]}</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {reason.match(/\((.*?)\)/)?.[1] || reason}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Recommendation Action */}
                <div className={`p-4 rounded-lg border-l-4 shadow-sm ${recommendation.canClaimITC ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {recommendation.canClaimITC ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}

                    <h5 className={`font-bold ${recommendation.canClaimITC ? 'text-green-900' : 'text-red-900'}`}>
                      {recommendation.message}
                    </h5>
                  </div>
                  <p className={`text-sm mt-1 pl-7 ${recommendation.canClaimITC ? 'text-green-800' : 'text-red-800'}`}>
                    <strong>Recommended Action:</strong> {recommendation.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {!filingStatus && !risk && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
            <p className="text-sm text-green-800 text-center">
              ✓ This GSTIN has passed all format validations including checksum verification
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-xl shadow-lg animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-red-900 mb-2">✗ Invalid GSTIN</h3>
          <div className="p-4 bg-white rounded-lg border border-red-200 mb-3">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
          {gstin && (
            <div className="p-3 bg-red-100 rounded-lg border border-red-300">
              <p className="text-xs text-red-700 mb-1">Input GSTIN:</p>
              <p className="text-sm text-red-900 font-mono font-semibold">{gstin}</p>
            </div>
          )}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Tip:</span> GSTIN must be exactly 15 characters with valid state code, PAN format, and checksum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
