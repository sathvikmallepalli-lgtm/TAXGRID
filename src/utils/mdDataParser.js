/**
 * MD Data Parser for TaxGrid
 * Parses the gstinData.md file and provides structured data access
 */

import gstinDataRawOriginal from '../data/gstinData.md?raw';

// Normalize Windows \r\n line endings to \n for consistent regex matching
const gstinDataRaw = gstinDataRawOriginal.replace(/\r\n/g, '\n');

/**
 * Parse GSTIN entries from markdown
 */
export function parseGSTINDatabase() {
  const gstinMap = {};

  // Regex to match GSTIN blocks (#### GSTIN: format)
  const gstinPattern = /#### GSTIN: (\w{15})\n- \*\*Legal Name\*\*: (.+)\n- \*\*Trade Name\*\*: (.+)\n- \*\*Category\*\*: (.+)\n- \*\*State\*\*: (.+)\n- \*\*State Code\*\*: (\d{2})/g;

  let match;
  while ((match = gstinPattern.exec(gstinDataRaw)) !== null) {
    const [, gstin, legalName, tradeName, category, state, stateCode] = match;
    gstinMap[gstin] = {
      legalName: legalName.trim(),
      tradeName: tradeName.trim(),
      category: category.trim(),
      state: state.trim(),
      stateCode: stateCode.trim()
    };
  }

  // Also match state-wise coverage format (- **GSTIN**: format)
  const stateWisePattern = /- \*\*GSTIN\*\*: (\w{15})\n- \*\*Legal Name\*\*: (.+)\n- \*\*Trade Name\*\*: (.+)\n- \*\*Category\*\*: (.+)\n- \*\*State\*\*: (.+)/g;

  while ((match = stateWisePattern.exec(gstinDataRaw)) !== null) {
    const [, gstin, legalName, tradeName, category, state] = match;
    const stateCode = gstin.substring(0, 2);
    gstinMap[gstin] = {
      legalName: legalName.trim(),
      tradeName: tradeName.trim(),
      category: category.trim(),
      state: state.trim(),
      stateCode: stateCode
    };
  }

  return gstinMap;
}

/**
 * Parse fraud statistics from markdown
 */
export function parseFraudStatistics() {
  const stats = {};

  // Extract total fraud
  const totalFraudMatch = gstinDataRaw.match(/\*\*Total Fraud Detected\*\*: (.+)/);
  if (totalFraudMatch) stats.totalFraud = totalFraudMatch[1].trim();

  // Extract period
  const periodMatch = gstinDataRaw.match(/\*\*Period\*\*: (.+)/);
  if (periodMatch) stats.period = periodMatch[1].trim();

  // Extract fake firms
  const fakeFirmsMatch = gstinDataRaw.match(/\*\*Fake Firms Detected\*\*: (.+)/);
  if (fakeFirmsMatch) stats.fakeFirmsDetected = fakeFirmsMatch[1].trim();

  // Extract fake invoices
  const fakeInvoicesMatch = gstinDataRaw.match(/\*\*Fake Invoices Circulated\*\*: (.+)/);
  if (fakeInvoicesMatch) stats.fakeInvoices = fakeInvoicesMatch[1].trim();

  // Extract average fraud
  const avgFraudMatch = gstinDataRaw.match(/\*\*Average Fraud Per Case\*\*: (.+)/);
  if (avgFraudMatch) stats.averageFraudPerCase = avgFraudMatch[1].trim();

  // Extract ITC fraud
  const itcFraudMatch = gstinDataRaw.match(/\*\*ITC Fraud Impact\*\*: (.+)/);
  if (itcFraudMatch) stats.itcFraud = itcFraudMatch[1].trim();

  return stats;
}

/**
 * Parse GI products from markdown
 */
export function parseGIProducts() {
  const giProducts = [];

  // Regex to match GI product blocks
  const giPattern = /### (.+)\n- \*\*State\*\*: (.+)\n- \*\*GI Code\*\*: (.+)\n- \*\*Category\*\*: (.+)\n- \*\*Alert\*\*: (.+)/g;

  let match;
  while ((match = giPattern.exec(gstinDataRaw)) !== null) {
    const [, product, state, giCode, category, alert] = match;
    giProducts.push({
      product: product.trim(),
      state: state.trim(),
      giCode: giCode.trim(),
      category: category.trim(),
      alert: alert.trim()
    });
  }

  return giProducts;
}

/**
 * Parse state-wise fraud data
 */
export function parseStateWiseFraud() {
  const stateWiseFraud = [];

  // Extract state-wise top offenders section
  const section = gstinDataRaw.match(/### State-wise Top Offenders\n([\s\S]+?)### Industry-wise Fraud/);
  if (!section) return stateWiseFraud;

  const statePattern = /\d+\.\s+\*\*(.+)\*\*:\s+(.+)\s+fraud/g;
  let match;

  while ((match = statePattern.exec(section[1])) !== null) {
    stateWiseFraud.push({
      state: match[1].trim(),
      amount: match[2].trim()
    });
  }

  return stateWiseFraud;
}

/**
 * Parse industry-wise fraud data
 */
export function parseIndustryWiseFraud() {
  const industryFraud = {};

  // Extract industry-wise section
  const section = gstinDataRaw.match(/### Industry-wise Fraud\n([\s\S]+?)---/);
  if (!section) return industryFraud;

  const industryPattern = /- \*\*(.+)\*\*:\s+(\d+)%/g;
  let match;

  while ((match = industryPattern.exec(section[1])) !== null) {
    industryFraud[match[1].trim()] = parseInt(match[2]);
  }

  return industryFraud;
}

/**
 * Get all test GSTINs for quick access
 */
export function getTestGSTINs() {
  const database = parseGSTINDatabase();
  return Object.entries(database).map(([gstin, data]) => ({
    gstin,
    state: data.state,
    company: data.tradeName
  }));
}

/**
 * Search GSTIN database
 */
export function searchGSTIN(query) {
  const database = parseGSTINDatabase();
  const lowerQuery = query.toLowerCase();

  return Object.entries(database)
    .filter(([gstin, data]) =>
      gstin.toLowerCase().includes(lowerQuery) ||
      data.legalName.toLowerCase().includes(lowerQuery) ||
      data.tradeName.toLowerCase().includes(lowerQuery) ||
      data.category.toLowerCase().includes(lowerQuery) ||
      data.state.toLowerCase().includes(lowerQuery)
    )
    .map(([gstin, data]) => ({ gstin, ...data }));
}

/**
 * Get GSTINs by category
 */
export function getGSTINsByCategory(category) {
  const database = parseGSTINDatabase();
  return Object.entries(database)
    .filter(([, data]) => data.category.toLowerCase() === category.toLowerCase())
    .map(([gstin, data]) => ({ gstin, ...data }));
}

/**
 * Get GSTINs by state
 */
export function getGSTINsByState(state) {
  const database = parseGSTINDatabase();
  return Object.entries(database)
    .filter(([, data]) => data.state.toLowerCase() === state.toLowerCase())
    .map(([gstin, data]) => ({ gstin, ...data }));
}

// Export parsed data for immediate use
export const GSTIN_DATABASE_MD = parseGSTINDatabase();
export const FRAUD_STATISTICS_MD = parseFraudStatistics();
export const GI_PRODUCTS_MD = parseGIProducts();
export const STATE_WISE_FRAUD_MD = parseStateWiseFraud();
export const INDUSTRY_WISE_FRAUD_MD = parseIndustryWiseFraud();
export const TEST_GSTINS_MD = getTestGSTINs();
