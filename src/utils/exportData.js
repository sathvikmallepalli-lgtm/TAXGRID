/**
 * 📤 TAXGRID EXPORT UTILITY
 *
 * Multi-format export functionality
 * Supports: CSV, JSON
 */

/**
 * Export invoices to CSV format
 * @param {Array} invoices - Array of invoice objects
 * @param {string} filename - Output filename (without extension)
 */
export function exportToCSV(invoices, filename = 'taxgrid-invoices') {
  if (!invoices || invoices.length === 0) {
    alert('No invoices to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Invoice ID',
    'Upload Date',
    'Invoice Date',
    'Vendor Name',
    'GSTIN',
    'State',
    'Amount (₹)',
    'Risk Level',
    'Trust Score',
    'Validation Status',
    'Filing Status',
    'Category',
    'Can Claim ITC',
    'Recommendation'
  ];

  // Convert invoices to CSV rows
  const rows = invoices.map(inv => [
    inv.id || '',
    inv.uploadedAt ? new Date(inv.uploadedAt).toLocaleDateString('en-IN') : '',
    inv.extractedData?.date || '',
    inv.extractedData?.vendor || '',
    inv.extractedData?.gstin || '',
    inv.validationResult?.stateName || '',
    inv.extractedData?.amount?.toFixed(2) || '0.00',
    inv.risk?.level || '',
    inv.risk?.trustScore || '',
    inv.validationResult?.isValid ? 'Valid' : 'Invalid',
    inv.portalData?.filingStatus || '',
    inv.category || '',
    inv.recommendation?.canClaimITC ? 'Yes' : 'No',
    inv.recommendation?.message || ''
  ]);

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export invoices to JSON format
 * @param {Array} invoices - Array of invoice objects
 * @param {string} filename - Output filename (without extension)
 * @param {boolean} pretty - Pretty print JSON (default: true)
 */
export function exportToJSON(invoices, filename = 'taxgrid-invoices', pretty = true) {
  if (!invoices || invoices.length === 0) {
    alert('No invoices to export');
    return;
  }

  // Create export object with metadata
  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: 'TaxGrid v1.0',
    totalInvoices: invoices.length,
    invoices: invoices.map(inv => ({
      id: inv.id,
      uploadedAt: inv.uploadedAt,
      invoiceName: inv.name,
      extractedData: {
        vendor: inv.extractedData?.vendor,
        gstin: inv.extractedData?.gstin,
        amount: inv.extractedData?.amount,
        date: inv.extractedData?.date
      },
      validation: {
        isValid: inv.validationResult?.isValid,
        gstin: inv.validationResult?.gstin,
        stateCode: inv.validationResult?.stateCode,
        stateName: inv.validationResult?.stateName,
        pan: inv.validationResult?.pan
      },
      portalData: inv.portalData ? {
        legalName: inv.portalData.legalName,
        tradeName: inv.portalData.tradeName,
        status: inv.portalData.status,
        filingStatus: inv.portalData.filingStatus,
        businessType: inv.portalData.businessType,
        registrationDate: inv.portalData.registrationDate
      } : null,
      risk: inv.risk ? {
        level: inv.risk.level,
        trustScore: inv.risk.trustScore,
        reasons: inv.risk.reasons
      } : null,
      recommendation: inv.recommendation ? {
        canClaimITC: inv.recommendation.canClaimITC,
        message: inv.recommendation.message,
        action: inv.recommendation.action
      } : null,
      giCheck: inv.giCheck ? {
        hasGIProducts: inv.giCheck.hasGIProducts,
        alertCount: inv.giCheck.count
      } : null,
      category: inv.category,
      ocrText: inv.ocrText?.substring(0, 500) // Truncate long OCR text
    }))
  };

  // Convert to JSON
  const jsonContent = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);

  // Create blob and trigger download
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, `${filename}.json`);
}

/**
 * Export summary statistics to CSV
 * @param {object} stats - Statistics object from analytics
 * @param {string} filename - Output filename
 */
export function exportStatsToCSV(stats, filename = 'taxgrid-stats') {
  const headers = ['Metric', 'Value'];

  const rows = [
    ['Total Invoices', stats.totalInvoices || 0],
    ['Total Amount (₹)', stats.totalAmount?.toFixed(2) || '0.00'],
    ['Average Trust Score', stats.averageTrustScore?.toFixed(1) || '0.0'],
    ['Verified Safe', stats.verifiedCount || 0],
    ['High Risk', stats.highRiskCount || 0],
    ['GI Alerts', stats.giAlertCount || 0],
    ['Average Amount (₹)', stats.averageAmount?.toFixed(2) || '0.00']
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Helper function to trigger file download
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename with extension
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Format data for clipboard (TSV format - paste into Excel/Sheets)
 * @param {Array} invoices - Array of invoice objects
 * @returns {string} - TSV formatted string
 */
export function formatForClipboard(invoices) {
  const headers = ['Date', 'Vendor', 'GSTIN', 'Amount', 'Risk', 'Status'];

  const rows = invoices.map(inv => [
    inv.extractedData?.date || '',
    inv.extractedData?.vendor || '',
    inv.extractedData?.gstin || '',
    inv.extractedData?.amount || '',
    inv.risk?.level || '',
    inv.validationResult?.isValid ? 'Valid' : 'Invalid'
  ]);

  return [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');
}

/**
 * Copy data to clipboard
 * @param {Array} invoices - Array of invoice objects
 */
export async function copyToClipboard(invoices) {
  const tsvData = formatForClipboard(invoices);

  try {
    await navigator.clipboard.writeText(tsvData);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

export default {
  exportToCSV,
  exportToJSON,
  exportStatsToCSV,
  copyToClipboard,
  formatForClipboard
};
