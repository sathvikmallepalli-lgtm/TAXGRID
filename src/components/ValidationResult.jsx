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

        {/* Risk Assessment */}
        {risk && recommendation && (
          <div className="mt-4">
            <div className={`p-4 rounded-lg border-2 ${riskStyle?.bg} ${riskStyle?.border}`}>
              <div className="flex items-start gap-3 mb-3">
                <Shield className={`w-6 h-6 ${riskStyle?.text} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">Risk Assessment</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${riskStyle?.bg} ${riskStyle?.text}`}>
                      {riskStyle?.icon} {risk.level} RISK
                    </span>
                    <span className="text-sm text-gray-600">
                      Score: {risk.score}/100
                    </span>
                  </div>

                  {/* Reasons */}
                  {risk.reasons && risk.reasons.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Risk Factors:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {risk.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className={`p-3 rounded-lg border ${recommendation.canClaimITC ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {recommendation.canClaimITC ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <p className={`font-bold ${recommendation.canClaimITC ? 'text-green-900' : 'text-red-900'}`}>
                        {recommendation.message}
                      </p>
                    </div>
                    <p className={`text-sm ${recommendation.canClaimITC ? 'text-green-800' : 'text-red-800'} ml-7`}>
                      <strong>Action:</strong> {recommendation.action}
                    </p>
                  </div>
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
