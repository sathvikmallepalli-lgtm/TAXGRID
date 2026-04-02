/**
 * 🎯 UNIFIED TAXGRID ENGINE
 *
 * Complete GST verification system combining:
 * - GSTIN validation (format + checksum)
 * - Mock GST Portal data
 * - GI (Geographical Indication) fraud detection
 * - Tax calculation (CGST/SGST/IGST)
 * - Risk assessment
 * - Business recommendations
 *
 * Single entry point for all TaxGrid verification features.
 */

// ============================================================================
// IMPORTS FROM EXISTING MODULES
// ============================================================================

import { STATE_CODES } from './stateCodes';
import { validateGSTIN } from './validateGSTIN';
import {
  MOCK_GST_DATABASE,
  fetchGSTPortalData,
  searchByKeyword,
  getFilingStatusColor,
  getStatusBadge,
  getFilingStatusDetails
} from './mockGSTPortal';
import {
  GI_PRODUCTS,
  checkGIOrigin,
  getGIStatus
} from './giProducts';
import { verifyGSTINAPI } from './gstAPI';

// ============================================================================
// RE-EXPORTS (Make everything available from one place)
// ============================================================================

export {
  STATE_CODES,
  MOCK_GST_DATABASE,
  GI_PRODUCTS,
  validateGSTIN,
  fetchGSTPortalData,
  searchByKeyword,
  checkGIOrigin,
  getGIStatus,
  getFilingStatusColor,
  getStatusBadge,
  getFilingStatusDetails
};

// ============================================================================
// NEW FUNCTIONS - TAX CALCULATION
// ============================================================================

/**
 * Calculate GST (CGST/SGST or IGST) based on buyer and seller states
 * @param {number} baseAmount - Taxable amount before GST
 * @param {string} sellerStateCode - Seller's state code (e.g., "27")
 * @param {string} buyerStateCode - Buyer's state code (e.g., "29")
 * @param {number} gstRate - GST rate in percentage (default: 18%)
 * @returns {object} - Tax breakdown
 */
export function calculateTax(baseAmount, sellerStateCode, buyerStateCode, gstRate = 18) {
  const isInterState = sellerStateCode !== buyerStateCode;
  const taxAmount = (baseAmount * gstRate) / 100;

  if (isInterState) {
    // Inter-state: IGST only
    return {
      baseAmount: baseAmount,
      cgst: 0,
      sgst: 0,
      igst: taxAmount,
      totalTax: taxAmount,
      totalAmount: baseAmount + taxAmount,
      isInterState: true,
      gstRate: gstRate,
      sellerState: STATE_CODES[sellerStateCode] || 'Unknown',
      buyerState: STATE_CODES[buyerStateCode] || 'Unknown'
    };
  } else {
    // Intra-state: CGST + SGST
    const halfTax = taxAmount / 2;
    return {
      baseAmount: baseAmount,
      cgst: halfTax,
      sgst: halfTax,
      igst: 0,
      totalTax: taxAmount,
      totalAmount: baseAmount + taxAmount,
      isInterState: false,
      gstRate: gstRate,
      sellerState: STATE_CODES[sellerStateCode] || 'Unknown',
      buyerState: STATE_CODES[buyerStateCode] || 'Unknown'
    };
  }
}

// ============================================================================
// NEW FUNCTIONS - RISK ASSESSMENT
// ============================================================================

/**
 * Calculate Business Age in Years
 */
function getBusinessAge(registrationDate) {
  if (!registrationDate) return 0;
  try {
    const reg = new Date(registrationDate);
    const now = new Date();
    const diff = now - reg;
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch {
    return 0;
  }
}

/**
 * 🧠 ADVANCED TRUST SCORE ALGORITHM
 * Calculates a 0-100 score based on multiple weighted factors.
 */
export function calculateTrustScore(validation, portalData, giCheck) {
  let score = 50; // Base Score
  let breakdown = [];

  // 1. BASE VALIDATION (Critical)
  if (!validation.valid) {
    return { score: 0, breakdown: [{ label: 'Invalid GSTIN', points: -100 }] };
  }

  // 2. STATUS CHECK
  if (portalData) {
    if (portalData.status === 'Active') {
      score += 20;
      breakdown.push({ label: 'Active Status', points: +20 });
    } else {
      score -= 50; // Suspended/Cancelled
      breakdown.push({ label: `Status: ${portalData.status}`, points: -50 });
    }

    // 3. FILING COMPLIANCE
    if (portalData.filingStatus === 'GREEN') {
      score += 20;
      breakdown.push({ label: 'Timely Filings', points: +20 });
    } else if (portalData.filingStatus === 'YELLOW') {
      score -= 15;
      breakdown.push({ label: 'Delayed Filings', points: -15 });
    } else if (portalData.filingStatus === 'RED') {
      score -= 40;
      breakdown.push({ label: 'Non-Filer', points: -40 });
    }

    // 4. BUSINESS AGE (Stability Factor)
    const age = getBusinessAge(portalData.registrationDate);
    if (age >= 5) {
      score += 15;
      breakdown.push({ label: `Established Business (${age} yrs)`, points: +15 });
    } else if (age >= 2) {
      score += 10;
      breakdown.push({ label: `Stable Business (${age} yrs)`, points: +10 });
    } else {
      breakdown.push({ label: `New Business (${age} yrs)`, points: 0 });
    }

    // 5. ENTITY TYPE (Trust Factor)
    const trustedEntities = ['Public Limited Company', 'Government Department', 'Public Sector Undertaking'];
    if (trustedEntities.includes(portalData.businessType)) {
      score += 10;
      breakdown.push({ label: 'High Trust Entity', points: +10 });
    }
  } else {
    // No portal data found - Neutral/Low trust
    score -= 10;
    breakdown.push({ label: 'Data Unavailable', points: -10 });
  }

  // 6. NEGATIVE SIGNALS (GI Fraud, etc)
  if (giCheck && giCheck.length > 0) {
    score -= 30;
    breakdown.push({ label: 'GI Fraud Detected', points: -30 });
  }

  // Cap Score 0-100
  score = Math.max(0, Math.min(100, score));

  return { score, breakdown };
}

/**
 * Assess overall risk level for a transaction based on Trust Score
 */
export function assessRisk(validationResult, portalData, giCheck) {
  const { score, breakdown } = calculateTrustScore(validationResult, portalData, giCheck);

  let level, color;

  if (score >= 80) {
    level = 'LOW';
    color = '#22c55e'; // Green
  } else if (score >= 50) {
    level = 'MEDIUM';
    color = '#eab308'; // Yellow
  } else if (score >= 30) {
    level = 'HIGH';
    color = '#f97316'; // Orange
  } else {
    level = 'CRITICAL';
    color = '#ef4444'; // Red
  }

  return {
    level,
    color,
    score: 100 - score, // Legacy risk score is inverted (high risk = high score)
    trustScore: score,  // New Trust Score
    reasons: breakdown.map(b => `${b.label} (${b.points > 0 ? '+' : ''}${b.points})`)
  };
}

/**
 * Get business recommendation based on risk assessment
 * @param {object} risk - Risk assessment result
 * @param {object} portalData - Portal data
 * @returns {object} - Recommendation
 */
export function getRecommendation(risk) {
  let canClaimITC = false;
  let message = '';
  let action = '';

  switch (risk.level) {
    case 'CRITICAL':
      canClaimITC = false;
      message = 'DO NOT TRANSACT with this business';
      action = 'Reject transaction immediately';
      break;

    case 'HIGH':
      canClaimITC = false;
      message = 'HIGH RISK - Not recommended for ITC claims';
      action = 'Avoid transaction or verify extensively before proceeding';
      break;

    case 'MEDIUM':
      canClaimITC = true;
      message = 'Proceed with caution - Additional verification recommended';
      action = 'Request additional documents and verify on GST portal';
      break;

    case 'LOW':
      canClaimITC = true;
      message = 'Safe to transact - Business is in good standing';
      action = 'Proceed with transaction';
      break;

    default:
      canClaimITC = false;
      message = 'Unable to assess risk';
      action = 'Manual verification required';
  }

  return {
    canClaimITC,
    message,
    action,
    riskLevel: risk.level,
    riskScore: risk.score
  };
}

// ============================================================================
// MASTER FUNCTION - VERIFY INVOICE
// ============================================================================

/**
 * 🎯 MASTER VERIFICATION FUNCTION
 *
 * Complete end-to-end invoice verification:
 * 1. Validates GSTIN format and checksum
 * 2. Fetches business data from mock portal
 * 3. Checks for GI (Geographical Indication) fraud
 * 4. Calculates applicable GST (CGST/SGST/IGST)
 * 5. Assesses transaction risk
 * 6. Provides business recommendation
 *
 * @param {string} gstin - Seller's GSTIN
 * @param {string} ocrText - Full OCR text from invoice (for GI check)
 * @param {number} baseAmount - Taxable amount (before GST)
 * @param {string} buyerStateCode - Buyer's state code (optional, defaults to seller state for intra-state)
 * @param {number} gstRate - GST rate percentage (default: 18%)
 * @returns {Promise<object>} - Comprehensive verification result
 */
export async function verifyInvoice(
  gstin,
  ocrText = '',
  baseAmount = 0,
  buyerStateCode = null,
  gstRate = 18
) {
  try {
    // Step 1: Validate GSTIN format
    const validation = validateGSTIN(gstin);

    // Step 2: Fetch GST data (live API when configured, else demo DB)
    let portalData = null;
    let portalFound = false;
    let portalSourceLabel = 'TaxGrid Mock Database';
    let portalNotice;

    if (validation.valid) {
      const apiRes = await verifyGSTINAPI(gstin);
      if (apiRes.success && apiRes.data) {
        portalData = apiRes.data;
        portalFound = true;
        portalSourceLabel =
          apiRes.source === 'MASTERS_INDIA'
            ? 'Masters India GST API'
            : apiRes.source === 'GST_PROXY'
              ? 'GST API (server proxy)'
              : 'TaxGrid Mock Database';
        portalNotice = apiRes.notice;
      }
    }

    // Step 3: Check GI Origin
    const giCheck = validation.valid && portalData && ocrText
      ? checkGIOrigin(ocrText, validation.stateCode)
      : [];

    // Step 4: Calculate Tax
    const sellerState = validation.stateCode || '00';
    const buyerState = buyerStateCode || sellerState; // Default to intra-state if buyer not specified
    const tax = calculateTax(baseAmount, sellerState, buyerState, gstRate);

    // Step 5: Assess Risk
    const risk = assessRisk(validation, portalData, giCheck);

    // Step 6: Get Recommendation
    const recommendation = getRecommendation(risk);

    const v = validation;
    const biz =
      portalFound && portalData
        ? {
            legalName: portalData.legalName,
            tradeName: portalData.tradeName,
            category: portalData.businessType,
            status: portalData.status,
            filingStatus: portalData.filingStatus,
            lastFiledReturn: portalData.lastFiledReturn,
            lastFiledDate: portalData.lastFiledDate,
            registrationDate: portalData.registrationDate,
            address: portalData.address
          }
        : {
            legalName: v.legalName,
            tradeName: v.tradeName,
            category: v.category,
            status: v.status,
            filingStatus: v.filingStatus,
            lastFiledReturn: v.lastFiledReturn,
            lastFiledDate: v.lastFiledDate,
            registrationDate: v.registrationDate,
            address: v.address
          };

    // Step 7: Return comprehensive result
    return {
      success: true,
      timestamp: new Date().toISOString(),

      // Validation (includes business fields from live API or mock)
      validation: {
        isValid: validation.valid,
        valid: validation.valid,
        gstin: validation.gstin || gstin,
        stateCode: validation.stateCode,
        stateName: validation.stateName,
        pan: validation.pan,
        errors: validation.error ? [validation.error] : [],
        error: validation.error,
        ...biz
      },

      // Portal Data
      portalData: portalFound ? {
        found: true,
        source: portalSourceLabel,
        notice: portalNotice,
        legalName: portalData.legalName,
        tradeName: portalData.tradeName,
        status: portalData.status,
        filingStatus: portalData.filingStatus,
        filingStatusColor: getFilingStatusColor(portalData.filingStatus),
        lastFiledReturn: portalData.lastFiledReturn,
        lastFiledDate: portalData.lastFiledDate,
        registrationDate: portalData.registrationDate,
        businessType: portalData.businessType,
        address: portalData.address,
        eInvoiceEnabled: portalData.eInvoiceEnabled
      } : {
        found: false,
        message: 'GSTIN not found in database'
      },

      // GI Check
      giCheck: {
        hasGIProducts: giCheck.length > 0,
        alerts: giCheck,
        count: giCheck.length
      },

      // Tax Calculation
      tax: {
        baseAmount: tax.baseAmount,
        cgst: tax.cgst,
        sgst: tax.sgst,
        igst: tax.igst,
        totalTax: tax.totalTax,
        totalAmount: tax.totalAmount,
        isInterState: tax.isInterState,
        gstRate: tax.gstRate,
        sellerState: tax.sellerState,
        buyerState: tax.buyerState
      },

      // Risk Assessment
      risk: {
        level: risk.level,
        color: risk.color,
        score: risk.score,
        reasons: risk.reasons
      },

      // Recommendation
      recommendation: {
        canClaimITC: recommendation.canClaimITC,
        message: recommendation.message,
        action: recommendation.action
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format amount in Indian currency
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Get risk badge styling for UI
 */
export function getRiskBadgeStyle(riskLevel) {
  const styles = {
    'LOW': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: '✅'
    },
    'MEDIUM': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '⚠️'
    },
    'HIGH': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: '🚨'
    },
    'CRITICAL': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '❌'
    }
  };
  return styles[riskLevel] || styles['MEDIUM'];
}

/**
 * Search database with enhanced results
 */
export function searchDatabaseEnhanced(searchTerm) {
  const results = searchByKeyword(searchTerm);
  return results.map(result => ({
    ...result,
    filingStatusColor: getFilingStatusColor(result.filingStatus),
    statusBadge: getStatusBadge(result.status)
  }));
}

// ============================================================================
// EXPORTS - Everything from one place
// ============================================================================

export default {
  // Constants
  STATE_CODES,
  MOCK_GST_DATABASE,
  GI_PRODUCTS,

  // Validation
  validateGSTIN,

  // Portal Data
  fetchGSTPortalData,
  searchByKeyword,
  searchDatabaseEnhanced,

  // GI Check
  checkGIOrigin,
  getGIStatus,

  // Tax Calculation
  calculateTax,

  // Risk Assessment
  assessRisk,
  getRecommendation,

  // Master Function
  verifyInvoice,

  // Utilities
  formatINR,
  getFilingStatusColor,
  getStatusBadge,
  getFilingStatusDetails,
  getRiskBadgeStyle
};
