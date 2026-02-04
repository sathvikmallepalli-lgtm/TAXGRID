import { STATE_CODES } from './stateCodes';
import { GSTIN_DATABASE_MD } from './mdDataParser';
import { MOCK_GST_DATABASE } from './mockGSTPortal';

/**
 * Calculate checksum using Luhn Mod 36 algorithm
 * @param {string} gstin14 - First 14 characters of GSTIN
 * @returns {string} - Checksum character
 */
function calculateChecksum(gstin14) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const char = gstin14[i];
    let value = chars.indexOf(char);

    // Double every second digit from right (odd positions from left, 0-indexed)
    if (i % 2 !== 0) {
      value *= 2;
      if (value >= 36) {
        value = Math.floor(value / 36) + (value % 36);
      }
    }
    sum += value;
  }

  const remainder = sum % 36;
  const checksum = (36 - remainder) % 36;
  return chars[checksum];
}

/**
 * Clean common OCR errors from GSTIN
 * @param {string} gstin - Raw GSTIN string
 * @returns {string} - Cleaned GSTIN
 */
function cleanGSTIN(gstin) {
  if (!gstin) return gstin;

  let cleaned = gstin.replace(/[\s-]/g, '').toUpperCase();

  // OCR Correction: If length is 15, try to correct common typos
  // 27AAPFUO939F1ZV -> 27AAPFU0939F1ZV (O -> 0 in digits)
  if (cleaned.length === 15 || cleaned.length === 16) {
    // If 16 chars ending in 1, it might be an artifact (or user typed extra 1)
    // But let's focus on character substitution first

    // Split into parts based on standard GSTIN: 2(d) 5(a) 4(d) 1(a) 1(an) 1(Z) 1(an)
    // We can't strictly split if it's messy, but we can try replacing O with 0 in likely numeric places

    // Convert to array for manipulation
    let chars = cleaned.split('');

    // Fix first 2 chars (State Code) - should be digits
    if (chars[0] === 'O') chars[0] = '0';
    if (chars[1] === 'O') chars[1] = '0';

    // Fix chars 7-10 (PAN numbers) - should be digits
    // 012345678901234
    // 27AAPFU0939F1ZV
    //        ^^^^
    for (let i = 7; i <= 10; i++) {
      if (chars[i] === 'O') chars[i] = '0';
    }

    cleaned = chars.join('');
  }

  return cleaned;
}

/**
 * Validate GSTIN number
 * @param {string} gstin - GSTIN to validate
 * @returns {object} - Validation result with status and details
 */
export function validateGSTIN(gstin) {
  // Remove spaces, convert to uppercase, and fix common OCR typos
  gstin = cleanGSTIN(gstin);

  // Check length
  if (gstin.length !== 15) {
    return {
      valid: false,
      error: "GSTIN must be exactly 15 characters",
      gstin: gstin
    };
  }

  // Check format using regex
  // Format: 2-digit state + 5 letters (PAN first 5) + 4 digits (PAN next 4) +
  //         1 letter (PAN last) + 1 alphanumeric (entity) + Z + 1 alphanumeric (checksum)
  const formatRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!formatRegex.test(gstin)) {
    return {
      valid: false,
      error: "Invalid GSTIN format",
      gstin: gstin
    };
  }

  // Check state code
  const stateCode = gstin.substring(0, 2);
  if (!STATE_CODES[stateCode]) {
    return {
      valid: false,
      error: `Invalid state code: ${stateCode}`,
      gstin: gstin,
      stateCode: stateCode
    };
  }

  // Check position 14 (must be 'Z')
  if (gstin[13] !== 'Z') {
    return {
      valid: false,
      error: "Position 14 must be 'Z'",
      gstin: gstin
    };
  }

  // Validate checksum
  const expectedChecksum = calculateChecksum(gstin.substring(0, 14));
  if (gstin[14] !== expectedChecksum) {
    return {
      valid: false,
      error: `Invalid checksum. Expected: ${expectedChecksum}, Got: ${gstin[14]}`,
      gstin: gstin
    };
  }

  // All validations passed - check mock portal first for enhanced testing
  const mockPortalData = MOCK_GST_DATABASE[gstin];

  if (mockPortalData) {
    // Return enhanced data from mock portal (includes filing status)
    return {
      valid: true,
      gstin: gstin,
      stateCode: stateCode,
      stateName: mockPortalData.stateName,
      pan: gstin.substring(2, 12),
      legalName: mockPortalData.legalName,
      tradeName: mockPortalData.tradeName,
      category: mockPortalData.businessType,
      // Enhanced fields from mock portal
      status: mockPortalData.status,
      filingStatus: mockPortalData.filingStatus,
      lastFiledReturn: mockPortalData.lastFiledReturn,
      lastFiledDate: mockPortalData.lastFiledDate,
      registrationDate: mockPortalData.registrationDate,
      address: mockPortalData.address
    };
  }

  // Check if we have business details in regular database
  const businessInfo = GSTIN_DATABASE_MD[gstin];

  if (businessInfo) {
    // Return enriched data from database
    return {
      valid: true,
      gstin: gstin,
      stateCode: stateCode,
      stateName: businessInfo.state,
      pan: gstin.substring(2, 12),
      legalName: businessInfo.legalName,
      tradeName: businessInfo.tradeName,
      category: businessInfo.category
    };
  }

  // Valid format but not in our database
  return {
    valid: true,
    gstin: gstin,
    stateCode: stateCode,
    stateName: STATE_CODES[stateCode],
    pan: gstin.substring(2, 12),
    legalName: 'Not found in database',
    tradeName: 'Unknown',
    category: 'Unknown'
  };
}

/**
 * Format GSTIN for display (adds spaces for readability)
 * @param {string} gstin - GSTIN to format
 * @returns {string} - Formatted GSTIN
 */
export function formatGSTIN(gstin) {
  gstin = gstin.replace(/\s/g, '').toUpperCase();
  if (gstin.length !== 15) return gstin;

  // Format: 27 AAPFU 0939 F 1 Z V
  return `${gstin.substring(0, 2)} ${gstin.substring(2, 7)} ${gstin.substring(7, 11)} ${gstin.substring(11, 12)} ${gstin.substring(12, 13)} ${gstin.substring(13, 14)} ${gstin.substring(14, 15)}`;
}
