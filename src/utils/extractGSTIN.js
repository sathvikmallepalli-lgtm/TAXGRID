/**
 * Extract GSTIN from text using regex pattern
 * @param {string} text - Text to search for GSTIN
 * @returns {string|null} - Extracted GSTIN or null if not found
 */
export function extractGSTIN(text) {
  if (!text) return null;

  const cleanText = text.toUpperCase();

  // Pattern 1: Strict GSTIN Pattern
  const strictPattern = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
  const strictMatches = cleanText.match(strictPattern);
  if (strictMatches) return strictMatches[0];

  // Pattern 2: Fuzzy GSTIN Pattern (Handles common OCR errors)
  // [0-9O] for digits
  // [A-Z0-9] for parts that get mixed up
  // e.g. 0O7TAAACRS5055K1Z9 -> 07AAACR5055K1Z9
  // We look for a 15-char sequence that looks ROUGHLY like a GSTIN

  // This is a 15-char block starting with 2 digits/O, 5 letters, 4 digits/O, 1 letter, ...
  const fuzzyPattern = /([0-9O]{2})([A-Z]{5})([0-9O]{4})([A-Z]{1})([1-9A-Z]{1})(Z)([0-9A-Z]{1})/g;

  // Or even looser: just 15 alphanumeric that matches the structure broadly
  // First 2: digits or O/I/L/B
  // Next 5: letters
  // Next 4: digits or O/I/L/B

  // Let's try searching for the specific one mentioned: 0O7...
  // The user gave: "0O7TAAACRS5055K1Z9" -> This is 17 chars long?
  // 0O 7 TAAACR S 5055 K 1 Z 9
  // 07AAACR5055K1Z9 is the target.
  // 0O -> 0? 7 -> 7? 
  // Let's just return the best candidate. 

  // We try to find something that matches the PAN structure inside?
  // PAN is [A-Z]{5}[0-9]{4}[A-Z]{1}
  // Try to find a PAN-like sequence and expand outwards

  const panPattern = /[A-Z]{5}[0-9O]{4}[A-Z]{1}/g;
  const panMatches = cleanText.match(panPattern);

  if (panMatches) {
    for (const pan of panMatches) {
      // Look at surroundings of the PAN
      const index = cleanText.indexOf(pan);
      // We expect 2 chars before (State) and 3 chars after (Entity+Z+Check)
      if (index >= 2 && index + pan.length + 3 <= cleanText.length) {
        const raw = cleanText.substring(index - 2, index + pan.length + 3);
        // Basic cleanup on the candidate
        const cleaned = raw.replace(/O/g, '0').replace(/I/g, '1');
        return cleaned;
      }
    }
  }

  return null;
}

/**
 * Extract total amount from receipt text
 * @param {string} text - Receipt text
 * @returns {number|null} - Extracted amount or null if not found
 */
export function extractAmount(text) {
  if (!text) return null;

  // Look for various total amount patterns
  const patterns = [
    // "Total: Rs. 1,234.56" or "Total: ₹1,234.56"
    /(?:total|grand total|amount|net amount)[:\s]*(?:rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
    // "Rs. 1,234.56 Total" or "₹1,234.56 total"
    /(?:rs\.?|₹)\s*([0-9,]+(?:\.[0-9]{2})?)\s*(?:total|only)/i,
    // Just "Total 1234.56"
    /total[:\s]+([0-9,]+(?:\.[0-9]{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Remove commas and parse as float
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount)) {
        return amount;
      }
    }
  }

  return null;
}

/**
 * Extract date from receipt text
 * @param {string} text - Receipt text
 * @returns {string|null} - Extracted date or null if not found
 */
export function extractDate(text) {
  if (!text) return null;

  // Common date patterns
  const patterns = [
    // DD/MM/YYYY or DD-MM-YYYY
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
    // DD Month YYYY (e.g., 03 Feb 2026)
    /\b(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})\b/i,
    // Month DD, YYYY
    /\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract vendor/business name from receipt
 * @param {string} text - Receipt text
 * @returns {string|null} - Extracted vendor name or null
 */
export function extractVendor(text) {
  if (!text) return null;

  // Try to find lines before GSTIN or at the top
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Usually vendor name is in the first few lines
  if (lines.length > 0) {
    // Return first non-empty line that's not too long (likely a heading)
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 3 && line.length < 50 && !line.match(/^\d+$/)) {
        return line;
      }
    }
  }

  return null;
}
