/**
 * Mock GST Portal Database
 * Enhanced GSTIN database with filing status, registration dates, and risk indicators
 * Used for comprehensive testing of TaxGrid features
 */

import { STATE_CODES } from './stateCodes';

// Mock GST Portal Database with 10 test scenarios
export const MOCK_GST_DATABASE = {
  // 1. VALID + GREEN - UltraTech Cement (Maharashtra)
  '27AABCU9603R1ZN': {
    gstin: '27AABCU9603R1ZN',
    legalName: 'ULTRATECH CEMENT LIMITED',
    tradeName: 'UltraTech Cement',
    status: 'Active',
    stateCode: '27',
    stateName: 'Maharashtra',
    address: 'B-Wing, Ahura Centre, Mahakali Caves Road, Andheri East, Mumbai - 400093',
    registrationDate: '2017-07-01',
    businessType: 'Public Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-18',
    eInvoiceEnabled: true,
    keywords: ['cement', 'ultratech', 'construction', 'building materials', 'mumbai']
  },

  // 2. VALID + GREEN - TCS (Karnataka)
  '29AABCT1332L1ZA': {
    gstin: '29AABCT1332L1ZA',
    legalName: 'TATA CONSULTANCY SERVICES LIMITED',
    tradeName: 'TCS',
    status: 'Active',
    stateCode: '29',
    stateName: 'Karnataka',
    address: 'Maker Chambers IV, 222 Nariman Point, Mumbai - 400021',
    registrationDate: '2017-07-01',
    businessType: 'Public Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-20',
    eInvoiceEnabled: true,
    keywords: ['tcs', 'it services', 'software', 'consulting', 'bangalore', 'technology']
  },

  // 3. VALID + GREEN - Reliance Retail (Delhi)
  '07AAACR5055K1Z9': {
    gstin: '07AAACR5055K1Z9',
    legalName: 'RELIANCE RETAIL LIMITED',
    tradeName: 'Reliance Fresh',
    status: 'Active',
    stateCode: '07',
    stateName: 'Delhi',
    address: '3rd Floor, Court House, Lokmanya Tilak Marg, Dhobi Talao, Mumbai - 400002',
    registrationDate: '2017-09-15',
    businessType: 'Private Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-19',
    eInvoiceEnabled: true,
    keywords: ['reliance', 'retail', 'groceries', 'fmcg', 'delhi', 'supermarket']
  },

  // 4. VALID + YELLOW - Small Traders (UP) - Delayed filer
  '09AABCS1429B1ZS': {
    gstin: '09AABCS1429B1ZS',
    legalName: 'SMALL TRADERS PRIVATE LIMITED',
    tradeName: 'Small Traders',
    status: 'Active',
    stateCode: '09',
    stateName: 'Uttar Pradesh',
    address: '45/2, MG Road, Lucknow - 226001',
    registrationDate: '2018-03-12',
    businessType: 'Private Limited Company',
    filingStatus: 'YELLOW',
    lastFiledReturn: 'GSTR-3B for October 2025',
    lastFiledDate: '2025-12-05',
    eInvoiceEnabled: false,
    keywords: ['traders', 'wholesale', 'lucknow', 'uttar pradesh', 'office supplies']
  },

  // 5. VALID + RED - Risky Enterprise (West Bengal) - Non-filer
  '19AABCR5678D1Z5': {
    gstin: '19AABCR5678D1Z5',
    legalName: 'RISKY ENTERPRISE',
    tradeName: 'Risky Enterprise',
    status: 'Active',
    stateCode: '19',
    stateName: 'West Bengal',
    address: '12, Park Street, Kolkata - 700016',
    registrationDate: '2019-06-20',
    businessType: 'Proprietorship',
    filingStatus: 'RED',
    lastFiledReturn: 'GSTR-3B for April 2025',
    lastFiledDate: '2025-06-10',
    eInvoiceEnabled: false,
    keywords: ['electronics', 'components', 'kolkata', 'west bengal', 'risky']
  },

  // 6. CANCELLED - Old Company (Maharashtra)
  '27AABCC1234D1ZB': {
    gstin: '27AABCC1234D1ZB',
    legalName: 'OLD BUSINESS CORPORATION',
    tradeName: 'Old Business Corp',
    status: 'Cancelled',
    stateCode: '27',
    stateName: 'Maharashtra',
    address: '78, Station Road, Pune - 411001',
    registrationDate: '2018-01-15',
    businessType: 'Private Limited Company',
    filingStatus: 'CANCELLED',
    lastFiledReturn: 'GSTR-3B for March 2024',
    lastFiledDate: '2024-04-15',
    eInvoiceEnabled: false,
    keywords: ['furniture', 'pune', 'cancelled', 'inactive']
  },

  // 7. SUSPENDED - Suspended Traders (Telangana)
  '36AABCS9876E1ZY': {
    gstin: '36AABCS9876E1ZY',
    legalName: 'SUSPENDED TRADERS',
    tradeName: 'Suspended Traders',
    status: 'Suspended',
    stateCode: '36',
    stateName: 'Telangana',
    address: '23, Banjara Hills, Hyderabad - 500034',
    registrationDate: '2019-08-10',
    businessType: 'Partnership',
    filingStatus: 'SUSPENDED',
    lastFiledReturn: 'GSTR-3B for January 2025',
    lastFiledDate: '2025-03-01',
    eInvoiceEnabled: false,
    keywords: ['textiles', 'hyderabad', 'suspended', 'materials']
  },

  // 8. GI LEGITIMATE - Kashmir Saffron House (J&K)
  '01AABPK5678S1Z7': {
    gstin: '01AABPK5678S1Z7',
    legalName: 'KASHMIR SAFFRON HOUSE PRIVATE LIMITED',
    tradeName: 'Kashmir Saffron House',
    status: 'Active',
    stateCode: '01',
    stateName: 'Jammu and Kashmir',
    address: 'Pampore, Srinagar - 192121',
    registrationDate: '2018-11-05',
    businessType: 'Private Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-17',
    eInvoiceEnabled: true,
    keywords: ['saffron', 'kashmiri saffron', 'kesar', 'kashmir', 'spices', 'authentic', 'pampore']
  },

  // 9. GI FRAUD - Bangalore Spice Mart (Karnataka selling Kashmiri Saffron)
  '29AABCF5678F1ZC': {
    gstin: '29AABCF5678F1ZC',
    legalName: 'BANGALORE SPICE MART PRIVATE LIMITED',
    tradeName: 'Bangalore Spice Mart',
    status: 'Active',
    stateCode: '29',
    stateName: 'Karnataka',
    address: '56, Commercial Street, Bangalore - 560001',
    registrationDate: '2019-04-18',
    businessType: 'Private Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-16',
    eInvoiceEnabled: true,
    keywords: ['spices', 'kashmiri saffron', 'saffron', 'kesar', 'bangalore', 'spice mart']
  },

  // 10. GI FRAUD - Mumbai Tea Traders (Maharashtra selling Darjeeling Tea)
  '27AABCT9999T1ZT': {
    gstin: '27AABCT9999T1ZT',
    legalName: 'MUMBAI TEA TRADERS PRIVATE LIMITED',
    tradeName: 'Mumbai Tea Traders',
    status: 'Active',
    stateCode: '27',
    stateName: 'Maharashtra',
    address: '89, Crawford Market, Mumbai - 400001',
    registrationDate: '2020-02-10',
    businessType: 'Private Limited Company',
    filingStatus: 'GREEN',
    lastFiledReturn: 'GSTR-3B for December 2025',
    lastFiledDate: '2026-01-21',
    eInvoiceEnabled: true,
    keywords: ['tea', 'darjeeling tea', 'darjeeling', 'mumbai', 'beverages']
  }
};

/**
 * Fetch GST Portal Data (simulates API call with delay)
 * @param {string} gstin - GSTIN to lookup
 * @returns {Promise<object|null>} - Business data or null if not found
 */
export async function fetchGSTPortalData(gstin) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const data = MOCK_GST_DATABASE[gstin];
  return data || null;
}

/**
 * Search by keyword across multiple fields
 * @param {string} searchTerm - Search query
 * @returns {array} - Array of matching GSTIN entries
 */
export function searchByKeyword(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();
  const results = [];

  for (const [gstin, data] of Object.entries(MOCK_GST_DATABASE)) {
    // Search across GSTIN, names, keywords, state
    const searchableText = [
      data.gstin,
      data.legalName,
      data.tradeName,
      data.stateName,
      ...(data.keywords || [])
    ].join(' ').toLowerCase();

    if (searchableText.includes(term)) {
      results.push(data);
    }
  }

  return results;
}

/**
 * Get filing status color
 * @param {string} status - Filing status (GREEN/YELLOW/RED/CANCELLED/SUSPENDED)
 * @returns {string} - Hex color code
 */
export function getFilingStatusColor(status) {
  const colors = {
    'GREEN': '#22c55e',
    'YELLOW': '#eab308',
    'RED': '#ef4444',
    'CANCELLED': '#6b7280',
    'SUSPENDED': '#f97316'
  };
  return colors[status] || '#9ca3af';
}

/**
 * Get status badge configuration
 * @param {string} status - GSTIN status (Active/Cancelled/Suspended)
 * @returns {object} - Badge configuration with label, color, bg
 */
export function getStatusBadge(status) {
  const badges = {
    'Active': {
      label: 'Active',
      color: 'text-green-800',
      bg: 'bg-green-100',
      border: 'border-green-300'
    },
    'Cancelled': {
      label: 'Cancelled',
      color: 'text-gray-800',
      bg: 'bg-gray-100',
      border: 'border-gray-300'
    },
    'Suspended': {
      label: 'Suspended',
      color: 'text-orange-800',
      bg: 'bg-orange-100',
      border: 'border-orange-300'
    }
  };
  return badges[status] || badges['Active'];
}

/**
 * Get filing status details for display
 * @param {string} filingStatus - Filing status (GREEN/YELLOW/RED)
 * @returns {object} - Status details with message and severity
 */
export function getFilingStatusDetails(filingStatus) {
  const details = {
    'GREEN': {
      label: 'Regular Filer',
      message: 'This business files GST returns regularly. Safe for ITC claims.',
      severity: 'low',
      icon: '✅'
    },
    'YELLOW': {
      label: 'Delayed Filer',
      message: 'This business has delayed GST filings. Proceed with caution for ITC claims.',
      severity: 'medium',
      icon: '⚠️'
    },
    'RED': {
      label: 'Non-Filer',
      message: 'This business has not filed GST returns for several months. HIGH RISK for ITC claims!',
      severity: 'high',
      icon: '🚨'
    },
    'CANCELLED': {
      label: 'GSTIN Cancelled',
      message: 'This GSTIN has been cancelled. DO NOT transact with this business!',
      severity: 'critical',
      icon: '❌'
    },
    'SUSPENDED': {
      label: 'GSTIN Suspended',
      message: 'This GSTIN has been suspended. DO NOT transact with this business!',
      severity: 'critical',
      icon: '⛔'
    }
  };
  return details[filingStatus] || details['GREEN'];
}

/**
 * Get risk badge styling based on risk level
 * @param {string} level - Risk level (LOW/MEDIUM/HIGH/CRITICAL)
 * @returns {object} - Style config with bg, border, text, icon
 */
export function getRiskBadgeStyle(level) {
  const styles = {
    'LOW': {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: '✅'
    },
    'MEDIUM': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-700',
      icon: '⚠️'
    },
    'HIGH': {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: '🚨'
    },
    'CRITICAL': {
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: '⛔'
    }
  };
  return styles[level] || styles['MEDIUM'];
}

export default {
  MOCK_GST_DATABASE,
  fetchGSTPortalData,
  searchByKeyword,
  getFilingStatusColor,
  getStatusBadge,
  getFilingStatusDetails,
  getRiskBadgeStyle
};
