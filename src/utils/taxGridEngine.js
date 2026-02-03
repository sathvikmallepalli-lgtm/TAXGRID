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
 * Assess overall risk level for a transaction
 * @param {object} validationResult - GSTIN validation result
 * @param {object} portalData - GST portal data
 * @param {object} giCheck - GI origin check result
 * @returns {object} - Risk assessment
 */
export function assessRisk(validationResult, portalData, giCheck) {
  const reasons = [];
  let level = 'LOW';
  let color = '#22c55e'; // green
  let score = 0; // 0-100, higher = more risky

  // Check 1: GSTIN validity
  if (!validationResult.valid) {
    reasons.push('Invalid GSTIN format');
    score += 100;
    level = 'CRITICAL';
    color = '#ef4444'; // red
    return { level, color, score, reasons };
  }

  // Check 2: GSTIN status
  if (portalData && portalData.status === 'Cancelled') {
    reasons.push('GSTIN has been cancelled');
    score += 100;
    level = 'CRITICAL';
    color = '#ef4444';
    return { level, color, score, reasons };
  }

  if (portalData && portalData.status === 'Suspended') {
    reasons.push('GSTIN is currently suspended');
    score += 100;
    level = 'CRITICAL';
    color = '#ef4444';
    return { level, color, score, reasons };
  }

  // Check 3: Filing status
  if (portalData && portalData.filingStatus === 'RED') {
    reasons.push('Business is a non-filer (last return filed 8+ months ago)');
    score += 60;
    level = 'HIGH';
    color = '#f97316'; // orange
  } else if (portalData && portalData.filingStatus === 'YELLOW') {
    reasons.push('Business has delayed GST filings');
    score += 30;
    if (level === 'LOW') {
      level = 'MEDIUM';
      color = '#eab308'; // yellow
    }
  }

  // Check 4: GI fraud
  if (giCheck && giCheck.length > 0) {
    giCheck.forEach(alert => {
      reasons.push(`GI Fraud: ${alert.product} should be from ${alert.expectedRegion}`);
      score += 40;
    });
    if (level === 'LOW' || level === 'MEDIUM') {
      level = 'HIGH';
      color = '#f97316';
    }
  }

  // If no issues found
  if (reasons.length === 0) {
    reasons.push('All checks passed');
  }

  return {
    level,
    color,
    score,
    reasons
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

    // Step 2: Fetch GST Portal data (simulated with delay)
    let portalData = null;
    let portalFound = false;

    if (validation.valid) {
      portalData = await fetchGSTPortalData(gstin);
      portalFound = portalData !== null;
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

    // Step 7: Return comprehensive result
    return {
      success: true,
      timestamp: new Date().toISOString(),

      // Validation
      validation: {
        isValid: validation.valid,
        gstin: validation.gstin || gstin,
        stateCode: validation.stateCode,
        stateName: validation.stateName,
        pan: validation.pan,
        errors: validation.error ? [validation.error] : []
      },

      // Portal Data
      portalData: portalFound ? {
        found: true,
        source: 'TaxGrid Mock Database',
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
