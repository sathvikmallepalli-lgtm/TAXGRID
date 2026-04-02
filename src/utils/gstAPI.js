/**
 * GST API integration (commercial GST data providers).
 *
 * Providers:
 * - `proxy` (recommended): call `/api/gst/search` — keys live on server (`npm run gst-proxy`).
 * - `mastersindia`: call Masters India directly from the browser (keys in VITE_* — exposed in bundle).
 * - `mock`: demo-only.
 *
 * Live lookups use a full 15-digit GSTIN. Keyword search falls back to the local demo DB.
 */

import { STATE_CODES } from './stateCodes';

// ============================================================================
// CONFIG
// ============================================================================

/** @type {'proxy'|'mastersindia'|'mock'} */
function getProvider() {
  const p = (import.meta.env.VITE_GST_PROVIDER || 'proxy').toLowerCase();
  if (p === 'mock') return 'mock';
  if (p === 'mastersindia') return 'mastersindia';
  return 'proxy';
}

export function isGstApiConfigured() {
  if (getProvider() === 'mock') return false;
  if (getProvider() === 'proxy') return true;
  const token = import.meta.env.VITE_GST_API_KEY?.trim();
  const clientId = import.meta.env.VITE_GST_CLIENT_ID?.trim();
  return Boolean(token && clientId);
}

const MASTERS_INDIA_SEARCH_URL =
  import.meta.env.VITE_GST_SEARCH_URL ||
  'https://commonapi.mastersindia.co/commonapis/searchgstin';

const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_GST_TIMEOUT_MS) || 15000;

// ============================================================================
// HELPERS
// ============================================================================

const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function isFullGstinQuery(q) {
  if (!q || typeof q !== 'string') return false;
  const s = q.trim().toUpperCase().replace(/\s+/g, '');
  return s.length === 15 && GSTIN_PATTERN.test(s);
}

export function normalizeGstinInput(q) {
  return String(q || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

function mapRegistrationStatusToFiling(sts) {
  const u = String(sts || '').toLowerCase();
  if (u.includes('cancel')) return 'CANCELLED';
  if (u.includes('suspend')) return 'SUSPENDED';
  if (u === 'active' || u === '') return 'GREEN';
  return 'YELLOW';
}

function formatMastersIndiaAddress(pradr) {
  if (!pradr?.addr) return '';
  const a = pradr.addr;
  const parts = [
    [a.bno, a.flno].filter(Boolean).join(' '),
    a.bnm,
    a.st,
    a.loc,
    a.dst,
    a.stcd,
    a.pncd ? `PIN ${a.pncd}` : ''
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Normalize Masters India `data` object to the same shape as mockGSTPortal entries.
 * @param {object} data - API `data` field
 */
export function normalizeMastersIndiaRecord(data) {
  if (!data?.gstin) return null;

  const gstin = String(data.gstin).toUpperCase();
  const stateCode = gstin.slice(0, 2);
  const stateName = STATE_CODES[stateCode] || data.pradr?.addr?.stcd || '—';

  return {
    gstin,
    legalName: String(data.lgnm || data.tradeNam || '—').trim(),
    tradeName: String(data.tradeNam || data.lgnm || '—').trim(),
    status: String(data.sts || '—'),
    stateCode,
    stateName,
    address: formatMastersIndiaAddress(data.pradr),
    registrationDate: data.rgdt || '—',
    businessType: String(data.ctb || data.dty || '—'),
    filingStatus: mapRegistrationStatusToFiling(data.sts),
    lastFiledReturn: '—',
    lastFiledDate: '—',
    eInvoiceEnabled: false,
    keywords: Array.isArray(data.nba) ? data.nba.slice(0, 8) : []
  };
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * Fetch Masters India–shaped JSON (via local proxy or direct).
 */
async function mastersIndiaSearchGstin(gstin) {
  const base = (import.meta.env.VITE_GST_PROXY_BASE || '').replace(/\/$/, '');
  let res;

  if (getProvider() === 'proxy') {
    const url = `${base}/api/gst/search?gstin=${encodeURIComponent(gstin)}`;
    res = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
  } else {
    const token = import.meta.env.VITE_GST_API_KEY?.trim();
    const clientId = import.meta.env.VITE_GST_CLIENT_ID?.trim();
    if (!token || !clientId) {
      throw new Error('Missing VITE_GST_API_KEY or VITE_GST_CLIENT_ID');
    }
    const url = `${MASTERS_INDIA_SEARCH_URL}?gstin=${encodeURIComponent(gstin)}`;
    res = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        client_id: clientId
      }
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json.message || json.error_message || `${res.status} ${res.statusText}`;
    throw new Error(msg || 'GST API request failed');
  }

  if (json.error === true || json.error === 'true') {
    throw new Error(json.message || json.msg || 'GST lookup returned an error');
  }

  const row = normalizeMastersIndiaRecord(json.data);
  if (!row) {
    throw new Error('No taxpayer data in response');
  }
  return row;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Verify GSTIN via configured provider, then demo DB if needed.
 * @param {string} gstin
 * @returns {Promise<{ success: boolean, data: object|null, source: string, notice?: string }>}
 */
export async function verifyGSTINAPI(gstin) {
  const cleaned = normalizeGstinInput(gstin);
  if (cleaned.length !== 15) {
    return { success: false, data: null, source: 'NONE' };
  }

  if (isGstApiConfigured()) {
    try {
      const row = await mastersIndiaSearchGstin(cleaned);
      return {
        success: true,
        data: row,
        source: getProvider() === 'proxy' ? 'GST_PROXY' : 'MASTERS_INDIA'
      };
    } catch (e) {
      console.warn('GST live API failed, using demo data if available:', e);
    }
  }

  const { fetchGSTPortalData } = await import('./mockGSTPortal');
  const mockData = await fetchGSTPortalData(cleaned);
  return {
    success: mockData !== null,
    data: mockData,
    source: 'MOCK_DATABASE',
    notice: isGstApiConfigured()
      ? 'Live GST lookup failed; showing demo record if available.'
      : undefined
  };
}

/**
 * Search: full GSTIN → live API when configured; otherwise keyword search on demo DB.
 * @param {string} query
 */
export async function searchBusinessAPI(query) {
  const q = String(query || '').trim();
  if (q.length < 2) {
    return {
      success: true,
      results: [],
      count: 0,
      source: 'NONE',
      notice: undefined
    };
  }

  const { searchByKeyword } = await import('./mockGSTPortal');

  if (isGstApiConfigured() && isFullGstinQuery(q)) {
    const gstin = normalizeGstinInput(q);
    try {
      const row = await mastersIndiaSearchGstin(gstin);
      return {
        success: true,
        results: [row],
        count: 1,
        source: getProvider() === 'proxy' ? 'GST_PROXY' : 'MASTERS_INDIA'
      };
    } catch (e) {
      console.warn('GST search API error:', e);
      const mockResults = searchByKeyword(q);
      return {
        success: true,
        results: mockResults,
        count: mockResults.length,
        source: 'MOCK_DATABASE',
        notice: `Live GST search failed (${e.message || 'error'}). Showing demo matches.`
      };
    }
  }

  const mockResults = searchByKeyword(q);
  return {
    success: true,
    results: mockResults,
    count: mockResults.length,
    source: 'MOCK_DATABASE',
    notice: isGstApiConfigured()
      ? 'Demo keyword search. Enter a full 15-digit GSTIN for live taxpayer data from your GST API.'
      : undefined
  };
}

export async function getReturnsHistoryAPI() {
  return {
    success: false,
    error: 'Not available via this integration',
    data: []
  };
}

export async function checkGSTINStatusAPI(gstin) {
  return verifyGSTINAPI(gstin);
}

export default {
  verifyGSTINAPI,
  searchBusinessAPI,
  getReturnsHistoryAPI,
  checkGSTINStatusAPI,
  isGstApiConfigured,
  normalizeGstinInput
};
