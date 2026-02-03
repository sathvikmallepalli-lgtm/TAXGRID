import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function RiskAlerts({ user, alerts, onMarkAsRead }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-300 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'low':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  const unreadAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <div>
            <h3 className="font-bold text-gray-900">Risk Alert System</h3>
            <p className="text-sm text-gray-700">
              {unreadAlerts.length} unread alert{unreadAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Unread Alerts</h3>
          <div className="space-y-3">
            {unreadAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-lg border-2 shadow-md ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 bg-white bg-opacity-50 text-xs font-semibold rounded uppercase mb-2">
                          {alert.severity} Priority
                        </span>
                        <p className="font-bold text-lg">{alert.message}</p>
                      </div>
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded transition-colors"
                      >
                        Mark as Read
                      </button>
                    </div>
                    {alert.supplierName && (
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Supplier:</span> {alert.supplierName}
                      </p>
                    )}
                    <p className="text-xs opacity-75">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Read Alerts</h3>
          <div className="space-y-3">
            {readAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 opacity-70"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-gray-200 text-xs font-semibold rounded uppercase mb-2">
                      {alert.severity} Priority
                    </span>
                    <p className="font-semibold text-gray-700">{alert.message}</p>
                    {alert.supplierName && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Supplier:</span> {alert.supplierName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900">All Clear!</p>
          <p className="text-gray-600 mt-2">No risk alerts at this time</p>
        </div>
      )}
    </div>
  );
}
