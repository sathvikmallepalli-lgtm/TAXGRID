/**
 * 📊 TAXGRID ANALYTICS ENGINE
 *
 * Calculate statistics and insights from invoice data
 */

/**
 * Calculate total spending across all invoices
 * @param {Array} invoices - Array of invoice objects
 * @returns {number} - Total amount
 */
export function calculateTotalSpending(invoices) {
  return invoices.reduce((sum, inv) => {
    return sum + (inv.extractedData?.amount || 0);
  }, 0);
}

/**
 * Calculate average trust score
 * @param {Array} invoices - Array of invoice objects
 * @returns {number} - Average trust score (0-100)
 */
export function getAverageTrustScore(invoices) {
  const withTrustScore = invoices.filter(inv => inv.risk?.trustScore !== undefined);

  if (withTrustScore.length === 0) return 0;

  const total = withTrustScore.reduce((sum, inv) => sum + inv.risk.trustScore, 0);
  return total / withTrustScore.length;
}

/**
 * Get risk distribution breakdown
 * @param {Array} invoices - Array of invoice objects
 * @returns {object} - Risk level counts and percentages
 */
export function getRiskDistribution(invoices) {
  const distribution = {
    LOW: { count: 0, percentage: 0, color: '#22c55e' },
    MEDIUM: { count: 0, percentage: 0, color: '#eab308' },
    HIGH: { count: 0, percentage: 0, color: '#f97316' },
    CRITICAL: { count: 0, percentage: 0, color: '#ef4444' },
    UNKNOWN: { count: 0, percentage: 0, color: '#6b7280' }
  };

  invoices.forEach(inv => {
    const level = inv.risk?.level || 'UNKNOWN';
    if (distribution[level]) {
      distribution[level].count++;
    }
  });

  // Calculate percentages
  const total = invoices.length;
  Object.keys(distribution).forEach(level => {
    distribution[level].percentage = total > 0 ? (distribution[level].count / total) * 100 : 0;
  });

  return distribution;
}

/**
 * Get top vendors by transaction count and amount
 * @param {Array} invoices - Array of invoice objects
 * @param {number} limit - Number of top vendors to return
 * @returns {Array} - Top vendors with stats
 */
export function getTopVendors(invoices, limit = 10) {
  const vendorMap = {};

  invoices.forEach(inv => {
    const vendor = inv.extractedData?.vendor;
    if (!vendor) return;

    if (!vendorMap[vendor]) {
      vendorMap[vendor] = {
        name: vendor,
        count: 0,
        totalAmount: 0,
        trustScores: [],
        riskLevels: []
      };
    }

    vendorMap[vendor].count++;
    vendorMap[vendor].totalAmount += inv.extractedData?.amount || 0;

    if (inv.risk?.trustScore !== undefined) {
      vendorMap[vendor].trustScores.push(inv.risk.trustScore);
    }

    if (inv.risk?.level) {
      vendorMap[vendor].riskLevels.push(inv.risk.level);
    }
  });

  // Convert to array and calculate averages
  const vendors = Object.values(vendorMap).map(vendor => ({
    ...vendor,
    averageTrustScore: vendor.trustScores.length > 0
      ? vendor.trustScores.reduce((a, b) => a + b, 0) / vendor.trustScores.length
      : null,
    averageAmount: vendor.totalAmount / vendor.count,
    mostCommonRisk: getMostCommon(vendor.riskLevels)
  }));

  // Sort by total amount (descending)
  vendors.sort((a, b) => b.totalAmount - a.totalAmount);

  return vendors.slice(0, limit);
}

/**
 * Get category breakdown
 * @param {Array} invoices - Array of invoice objects
 * @returns {Array} - Categories with counts and amounts
 */
export function getCategoryBreakdown(invoices) {
  const categoryMap = {};

  invoices.forEach(inv => {
    const category = inv.category || 'Uncategorized';

    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        count: 0,
        totalAmount: 0,
        percentage: 0
      };
    }

    categoryMap[category].count++;
    categoryMap[category].totalAmount += inv.extractedData?.amount || 0;
  });

  // Convert to array and calculate percentages
  const total = invoices.length;
  const categories = Object.values(categoryMap).map(cat => ({
    ...cat,
    percentage: total > 0 ? (cat.count / total) * 100 : 0
  }));

  // Sort by count (descending)
  categories.sort((a, b) => b.count - a.count);

  return categories;
}

/**
 * Get monthly trends (invoices and spending per month)
 * @param {Array} invoices - Array of invoice objects
 * @returns {Array} - Monthly data
 */
export function getMonthlyTrends(invoices) {
  const monthMap = {};

  invoices.forEach(inv => {
    const uploadDate = inv.uploadedAt ? new Date(inv.uploadedAt) : null;
    if (!uploadDate) return;

    const monthKey = `${uploadDate.getFullYear()}-${String(uploadDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = uploadDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: monthLabel,
        monthKey: monthKey,
        count: 0,
        totalAmount: 0
      };
    }

    monthMap[monthKey].count++;
    monthMap[monthKey].totalAmount += inv.extractedData?.amount || 0;
  });

  // Convert to sorted array (chronological)
  const months = Object.values(monthMap);
  months.sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  return months;
}

/**
 * Calculate verification rate (percentage of valid GSTINs)
 * @param {Array} invoices - Array of invoice objects
 * @returns {object} - Verification statistics
 */
export function getVerificationRate(invoices) {
  const stats = {
    total: invoices.length,
    valid: 0,
    invalid: 0,
    noGSTIN: 0,
    validPercentage: 0,
    invalidPercentage: 0,
    noGSTINPercentage: 0
  };

  invoices.forEach(inv => {
    if (!inv.extractedData?.gstin) {
      stats.noGSTIN++;
    } else if (inv.validationResult?.isValid) {
      stats.valid++;
    } else {
      stats.invalid++;
    }
  });

  if (stats.total > 0) {
    stats.validPercentage = (stats.valid / stats.total) * 100;
    stats.invalidPercentage = (stats.invalid / stats.total) * 100;
    stats.noGSTINPercentage = (stats.noGSTIN / stats.total) * 100;
  }

  return stats;
}

/**
 * Get comprehensive statistics for dashboard
 * @param {Array} invoices - Array of invoice objects
 * @returns {object} - All statistics combined
 */
export function getComprehensiveStats(invoices) {
  const totalAmount = calculateTotalSpending(invoices);
  const averageTrustScore = getAverageTrustScore(invoices);
  const riskDistribution = getRiskDistribution(invoices);
  const verificationRate = getVerificationRate(invoices);

  // Count specific metrics
  const verifiedCount = invoices.filter(inv => inv.validationResult?.isValid).length;
  const highRiskCount = riskDistribution.HIGH.count + riskDistribution.CRITICAL.count;
  const giAlertCount = invoices.filter(inv => inv.giCheck?.hasGIProducts).length;

  return {
    totalInvoices: invoices.length,
    totalAmount: totalAmount,
    averageAmount: invoices.length > 0 ? totalAmount / invoices.length : 0,
    averageTrustScore: averageTrustScore,
    verifiedCount: verifiedCount,
    highRiskCount: highRiskCount,
    giAlertCount: giAlertCount,
    riskDistribution: riskDistribution,
    verificationRate: verificationRate,
    topVendors: getTopVendors(invoices, 5),
    categories: getCategoryBreakdown(invoices),
    monthlyTrends: getMonthlyTrends(invoices)
  };
}

/**
 * Get invoices by date range
 * @param {Array} invoices - Array of invoice objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered invoices
 */
export function getInvoicesByDateRange(invoices, startDate, endDate) {
  return invoices.filter(inv => {
    const uploadDate = inv.uploadedAt ? new Date(inv.uploadedAt) : null;
    if (!uploadDate) return false;

    return uploadDate >= startDate && uploadDate <= endDate;
  });
}

/**
 * Get high-risk invoices
 * @param {Array} invoices - Array of invoice objects
 * @returns {Array} - High-risk and critical invoices
 */
export function getHighRiskInvoices(invoices) {
  return invoices.filter(inv => {
    const level = inv.risk?.level;
    return level === 'HIGH' || level === 'CRITICAL';
  });
}

/**
 * Helper: Get most common element in array
 */
function getMostCommon(arr) {
  if (arr.length === 0) return null;

  const counts = {};
  let maxCount = 0;
  let mostCommon = null;

  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      mostCommon = item;
    }
  });

  return mostCommon;
}

/**
 * Format currency for display
 * @param {number} amount - Amount in rupees
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with K/L/Cr suffixes
 * @param {number} num - Number to format
 * @returns {string} - Formatted string
 */
export function formatCompactNumber(num) {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`; // Crores
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`; // Lakhs
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`; // Thousands
  return `₹${num.toFixed(0)}`;
}

export default {
  calculateTotalSpending,
  getAverageTrustScore,
  getRiskDistribution,
  getTopVendors,
  getCategoryBreakdown,
  getMonthlyTrends,
  getVerificationRate,
  getComprehensiveStats,
  getInvoicesByDateRange,
  getHighRiskInvoices,
  formatCurrency,
  formatCompactNumber
};
