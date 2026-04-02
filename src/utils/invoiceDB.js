/**
 * 🗄️ TAXGRID INVOICE DATABASE
 *
 * IndexedDB wrapper for persistent invoice storage
 * Features:
 * - Store invoices locally in browser
 * - Full-text search across all fields
 * - Advanced filtering and sorting
 * - Bulk operations
 * - Export functionality
 * - Analytics calculations
 */

const DB_NAME = 'TaxGridDB';
const DB_VERSION = 1;
const INVOICE_STORE = 'invoices';

/**
 * Initialize IndexedDB
 * Creates database and object stores if they don't exist
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create invoice store if it doesn't exist
      if (!db.objectStoreNames.contains(INVOICE_STORE)) {
        const store = db.createObjectStore(INVOICE_STORE, { keyPath: 'id' });

        // Create indexes for efficient searching
        store.createIndex('gstin', 'extractedData.gstin', { unique: false });
        store.createIndex('vendor', 'extractedData.vendor', { unique: false });
        store.createIndex('date', 'extractedData.date', { unique: false });
        store.createIndex('amount', 'extractedData.amount', { unique: false });
        store.createIndex('riskLevel', 'risk.level', { unique: false });
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });

        console.log('✅ TaxGrid Database initialized with indexes');
      }
    };
  });
}

/**
 * Save or update an invoice
 * @param {object} invoice - Invoice object to save
 * @returns {Promise<number>} - Invoice ID
 */
export async function saveInvoice(invoice) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readwrite');
    const store = transaction.objectStore(INVOICE_STORE);

    // Add timestamp and category if not present
    const invoiceToSave = {
      ...invoice,
      uploadedAt: invoice.uploadedAt || new Date().toISOString(),
      category: invoice.category || categorizeInvoice(invoice)
    };

    const request = store.put(invoiceToSave);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get a single invoice by ID
 * @param {number} id - Invoice ID
 * @returns {Promise<object>} - Invoice object
 */
export async function getInvoice(id) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readonly');
    const store = transaction.objectStore(INVOICE_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get all invoices
 * @returns {Promise<Array>} - Array of all invoices
 */
export async function getAllInvoices() {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readonly');
    const store = transaction.objectStore(INVOICE_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete an invoice
 * @param {number} id - Invoice ID
 * @returns {Promise<void>}
 */
export async function deleteInvoice(id) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readwrite');
    const store = transaction.objectStore(INVOICE_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete multiple invoices
 * @param {Array<number>} ids - Array of invoice IDs
 * @returns {Promise<void>}
 */
export async function bulkDeleteInvoices(ids) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readwrite');
    const store = transaction.objectStore(INVOICE_STORE);

    let deleteCount = 0;
    const errors = [];

    ids.forEach(id => {
      const request = store.delete(id);
      request.onsuccess = () => deleteCount++;
      request.onerror = () => errors.push({ id, error: request.error });
    });

    transaction.oncomplete = () => {
      db.close();
      if (errors.length > 0) {
        reject({ message: `Failed to delete ${errors.length} invoices`, errors });
      } else {
        resolve({ deleted: deleteCount });
      }
    };

    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Search invoices with full-text search
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Matching invoices
 */
export async function searchInvoices(query) {
  const allInvoices = await getAllInvoices();

  if (!query || query.trim() === '') {
    return allInvoices;
  }

  const searchLower = query.toLowerCase().trim();

  return allInvoices.filter(invoice => {
    // Search in vendor name
    const vendor = invoice.extractedData?.vendor?.toLowerCase() || '';
    if (vendor.includes(searchLower)) return true;

    // Search in GSTIN
    const gstin = invoice.extractedData?.gstin?.toLowerCase() || '';
    if (gstin.includes(searchLower)) return true;

    // Search in OCR text
    const ocrText = invoice.ocrText?.toLowerCase() || '';
    if (ocrText.includes(searchLower)) return true;

    // Search in legal name from portal data
    const legalName = invoice.portalData?.legalName?.toLowerCase() || '';
    if (legalName.includes(searchLower)) return true;

    // Search in amount (as string)
    const amount = invoice.extractedData?.amount?.toString() || '';
    if (amount.includes(searchLower)) return true;

    // Search in category
    const category = invoice.category?.toLowerCase() || '';
    if (category.includes(searchLower)) return true;

    return false;
  });
}

/**
 * Filter invoices by criteria
 * @param {object} criteria - Filter criteria
 * @returns {Promise<Array>} - Filtered invoices
 */
export async function filterInvoices(criteria) {
  const allInvoices = await getAllInvoices();

  return allInvoices.filter(invoice => {
    // Filter by risk level
    if (criteria.riskLevels && criteria.riskLevels.length > 0) {
      const riskLevel = invoice.risk?.level;
      if (!criteria.riskLevels.includes(riskLevel)) return false;
    }

    // Filter by verification status
    if (criteria.verificationStatus !== undefined) {
      const isValid = invoice.validationResult?.isValid;
      if (criteria.verificationStatus === 'valid' && !isValid) return false;
      if (criteria.verificationStatus === 'invalid' && isValid) return false;
      if (criteria.verificationStatus === 'no_gstin' && invoice.extractedData?.gstin) return false;
    }

    // Filter by amount range
    if (criteria.minAmount !== undefined || criteria.maxAmount !== undefined) {
      const amount = invoice.extractedData?.amount || 0;
      if (criteria.minAmount !== undefined && amount < criteria.minAmount) return false;
      if (criteria.maxAmount !== undefined && amount > criteria.maxAmount) return false;
    }

    // Filter by date range
    if (criteria.startDate || criteria.endDate) {
      const invoiceDate = invoice.extractedData?.date;
      if (!invoiceDate) return false;

      // Parse date (assuming DD/MM/YYYY or similar format)
      const dateParts = invoiceDate.split(/[\/\-]/);
      if (dateParts.length === 3) {
        const invoiceTimestamp = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).getTime();

        if (criteria.startDate) {
          const startTimestamp = new Date(criteria.startDate).getTime();
          if (invoiceTimestamp < startTimestamp) return false;
        }

        if (criteria.endDate) {
          const endTimestamp = new Date(criteria.endDate).getTime();
          if (invoiceTimestamp > endTimestamp) return false;
        }
      }
    }

    // Filter by category
    if (criteria.categories && criteria.categories.length > 0) {
      if (!criteria.categories.includes(invoice.category)) return false;
    }

    // Filter by vendor
    if (criteria.vendors && criteria.vendors.length > 0) {
      const vendor = invoice.extractedData?.vendor;
      if (!criteria.vendors.includes(vendor)) return false;
    }

    return true;
  });
}

/**
 * Sort invoices
 * @param {Array} invoices - Invoices to sort
 * @param {string} sortBy - Field to sort by (date, amount, risk)
 * @param {string} order - Sort order (asc or desc)
 * @returns {Array} - Sorted invoices
 */
export function sortInvoices(invoices, sortBy = 'uploadedAt', order = 'desc') {
  const sorted = [...invoices].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = a.extractedData?.date || '';
        bValue = b.extractedData?.date || '';
        // Convert DD/MM/YYYY to comparable format
        const aDate = aValue.split(/[\/\-]/).reverse().join('');
        const bDate = bValue.split(/[\/\-]/).reverse().join('');
        return order === 'asc' ? aDate.localeCompare(bDate) : bDate.localeCompare(aDate);

      case 'amount':
        aValue = a.extractedData?.amount || 0;
        bValue = b.extractedData?.amount || 0;
        return order === 'asc' ? aValue - bValue : bValue - aValue;

      case 'risk':
        const riskOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        aValue = riskOrder[a.risk?.level] || 0;
        bValue = riskOrder[b.risk?.level] || 0;
        return order === 'asc' ? aValue - bValue : bValue - aValue;

      case 'vendor':
        aValue = a.extractedData?.vendor || '';
        bValue = b.extractedData?.vendor || '';
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

      case 'uploadedAt':
      default:
        aValue = a.uploadedAt || '';
        bValue = b.uploadedAt || '';
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });

  return sorted;
}

/**
 * Auto-categorize invoice based on business type and amount
 * @param {object} invoice - Invoice object
 * @returns {string} - Category name
 */
function categorizeInvoice(invoice) {
  const businessType = invoice.portalData?.businessType;
  const amount = invoice.extractedData?.amount || 0;
  const vendor = invoice.extractedData?.vendor?.toLowerCase() || '';

  // Category by business type
  if (businessType) {
    if (businessType.includes('IT')) return 'IT Services';
    if (businessType.includes('E-Commerce') || businessType.includes('Ecommerce')) return 'E-Commerce';
    if (businessType.includes('Food') || businessType.includes('Beverage')) return 'Food & Beverages';
    if (businessType.includes('Textile') || businessType.includes('Fabric')) return 'Textiles';
    if (businessType.includes('Electronic')) return 'Electronics';
    if (businessType.includes('Retail')) return 'Retail';
    if (businessType.includes('Wholesale')) return 'Wholesale';
  }

  // Category by vendor name keywords
  if (vendor.includes('restaurant') || vendor.includes('cafe') || vendor.includes('food')) return 'Food & Beverages';
  if (vendor.includes('software') || vendor.includes('tech') || vendor.includes('it')) return 'IT Services';
  if (vendor.includes('electronics') || vendor.includes('mobile')) return 'Electronics';
  if (vendor.includes('shop') || vendor.includes('store') || vendor.includes('mart')) return 'Retail';

  // Category by amount (fallback)
  if (amount < 10000) return 'Small Purchase';
  if (amount < 100000) return 'Medium Purchase';
  return 'Large Purchase';
}

/**
 * Get all unique categories
 * @returns {Promise<Array>} - Array of category names
 */
export async function getAllCategories() {
  const invoices = await getAllInvoices();
  const categories = new Set();

  invoices.forEach(inv => {
    if (inv.category) categories.add(inv.category);
  });

  return Array.from(categories).sort();
}

/**
 * Get all unique vendors
 * @returns {Promise<Array>} - Array of vendor names
 */
export async function getAllVendors() {
  const invoices = await getAllInvoices();
  const vendors = new Set();

  invoices.forEach(inv => {
    const vendor = inv.extractedData?.vendor;
    if (vendor) vendors.add(vendor);
  });

  return Array.from(vendors).sort();
}

/**
 * Clear all invoices (use with caution!)
 * @returns {Promise<void>}
 */
export async function clearAllInvoices() {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([INVOICE_STORE], 'readwrite');
    const store = transaction.objectStore(INVOICE_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get database statistics
 * @returns {Promise<object>} - Database stats
 */
export async function getDBStats() {
  const invoices = await getAllInvoices();

  return {
    totalInvoices: invoices.length,
    totalSize: JSON.stringify(invoices).length, // Approximate size in bytes
    oldestInvoice: invoices.length > 0 ? Math.min(...invoices.map(i => new Date(i.uploadedAt).getTime())) : null,
    newestInvoice: invoices.length > 0 ? Math.max(...invoices.map(i => new Date(i.uploadedAt).getTime())) : null
  };
}

export default {
  initDB,
  saveInvoice,
  getInvoice,
  getAllInvoices,
  deleteInvoice,
  bulkDeleteInvoices,
  searchInvoices,
  filterInvoices,
  sortInvoices,
  getAllCategories,
  getAllVendors,
  clearAllInvoices,
  getDBStats
};
