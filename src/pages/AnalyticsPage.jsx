import { useState, useEffect } from 'react';
import { getAllInvoices } from '../utils/invoiceDB';
import { getComprehensiveStats, formatCurrency, formatCompactNumber } from '../utils/analytics';
import {
  BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle,
  Users, Calendar, DollarSign, Database, PieChart
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const invoices = await getAllInvoices();
      const comprehensiveStats = getComprehensiveStats(invoices);
      setStats(comprehensiveStats);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Database className="w-8 h-8 text-primary animate-pulse mr-3" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalInvoices === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
          <p className="text-gray-600">
            Start scanning invoices to see analytics and insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Comprehensive insights from your invoice data
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Database}
          label="Total Invoices"
          value={stats.totalInvoices}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Total Amount"
          value={formatCompactNumber(stats.totalAmount)}
          color="emerald"
        />
        <StatCard
          icon={Shield}
          label="Avg Trust Score"
          value={stats.averageTrustScore.toFixed(1)}
          suffix="/100"
          color="purple"
        />
        <StatCard
          icon={AlertTriangle}
          label="High Risk"
          value={stats.highRiskCount}
          color="red"
        />
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-primary" />
          Risk Distribution
        </h2>

        <div className="space-y-4">
          {Object.entries(stats.riskDistribution).map(([level, data]) => (
            data.count > 0 && (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="font-medium text-gray-900">{level}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {data.count} invoice{data.count !== 1 ? 's' : ''} ({data.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${data.percentage}%`,
                      backgroundColor: data.color
                    }}
                  />
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Verification Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-primary" />
          Verification Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-3xl font-bold text-green-600">{stats.verificationRate.valid}</p>
            <p className="text-sm text-green-800 mt-1">Valid GSTIN ({stats.verificationRate.validPercentage.toFixed(1)}%)</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-3xl font-bold text-red-600">{stats.verificationRate.invalid}</p>
            <p className="text-sm text-red-800 mt-1">Invalid GSTIN ({stats.verificationRate.invalidPercentage.toFixed(1)}%)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-3xl font-bold text-gray-600">{stats.verificationRate.noGSTIN}</p>
            <p className="text-sm text-gray-800 mt-1">No GSTIN ({stats.verificationRate.noGSTINPercentage.toFixed(1)}%)</p>
          </div>
        </div>
      </div>

      {/* Top Vendors */}
      {stats.topVendors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Top Vendors
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Transactions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Trust Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Risk</th>
                </tr>
              </thead>
              <tbody>
                {stats.topVendors.map((vendor, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{vendor.name}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{vendor.count}</td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900">
                      {formatCurrency(vendor.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {vendor.averageTrustScore !== null ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {vendor.averageTrustScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {vendor.mostCommonRisk && (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskBadgeClass(vendor.mostCommonRisk)}`}>
                          {vendor.mostCommonRisk}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats.categories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" />
            Category Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.categories.map((category, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.percentage.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {category.count} invoice{category.count !== 1 ? 's' : ''} • {formatCurrency(category.totalAmount)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {stats.monthlyTrends.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Monthly Trends
          </h2>

          <div className="space-y-4">
            {stats.monthlyTrends.map((month, index) => {
              const maxCount = Math.max(...stats.monthlyTrends.map(m => m.count));
              const heightPercentage = (month.count / maxCount) * 100;

              return (
                <div key={index} className="flex items-end gap-4">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {month.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-end gap-2">
                      <div
                        className="bg-primary rounded-t transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPercentage, 20)}px`,
                          width: '100%',
                          maxHeight: '100px'
                        }}
                      />
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {month.count} invoice{month.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm font-mono text-gray-900">
                    {formatCompactNumber(month.totalAmount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Average Invoice Amount:</span>
            <span className="font-bold text-gray-900">{formatCurrency(stats.averageAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Verified Invoices:</span>
            <span className="font-bold text-green-600">{stats.verifiedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">High-Risk Alerts:</span>
            <span className="font-bold text-red-600">{stats.highRiskCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">GI Fraud Alerts:</span>
            <span className="font-bold text-orange-600">{stats.giAlertCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon: Icon, label, value, suffix = '', color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  return (
    <div className={`p-6 rounded-xl shadow-sm border ${colorClasses[color]}`}>
      <Icon className="w-8 h-8 mb-3" />
      <p className="text-3xl font-bold text-gray-900">
        {value}{suffix && <span className="text-lg text-gray-600">{suffix}</span>}
      </p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
    </div>
  );
}

function getRiskBadgeClass(risk) {
  const classes = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  };
  return classes[risk] || 'bg-gray-100 text-gray-800';
}
