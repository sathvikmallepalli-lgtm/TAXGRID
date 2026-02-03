/**
 * Test Invoice Data
 * 10 pre-configured invoices for testing TaxGrid features
 * Covers all scenarios: Valid/Invalid GSTIN, Filing Status, GI Fraud
 */

export const TEST_INVOICES = [
  // 1. VALID_GREEN_CEMENT
  {
    id: 'INV_001',
    invoiceNo: 'UC/2026/001',
    date: '2026-02-01',
    sellerName: 'ULTRATECH CEMENT LIMITED',
    sellerGstin: '27AABCU9603R1ZN',
    sellerAddress: 'B-Wing, Ahura Centre, Mahakali Caves Road, Andheri East, Mumbai - 400093',
    sellerState: 'Maharashtra',
    buyerName: 'ABC Construction Pvt Ltd',
    buyerGstin: '29AABCA1234B1Z5',
    buyerAddress: 'Plot 45, Industrial Area, Bangalore - 560001',
    items: [
      {
        name: 'Portland Cement (PPC) - 50kg bags',
        hsn: '2523',
        qty: 50,
        rate: 300.00,
        amount: 15000.00
      }
    ],
    cgst: 1350.00,
    sgst: 1350.00,
    igst: 0,
    totalAmount: 17700.00,
    expectedResult: 'VALID + GREEN',
    description: 'Regular cement supplier with good filing status'
  },

  // 2. VALID_GREEN_IT
  {
    id: 'INV_002',
    invoiceNo: 'TCS/2026/0042',
    date: '2026-02-02',
    sellerName: 'TATA CONSULTANCY SERVICES LIMITED',
    sellerGstin: '29AABCT1332L1ZA',
    sellerAddress: 'Maker Chambers IV, 222 Nariman Point, Mumbai - 400021',
    sellerState: 'Karnataka',
    buyerName: 'XYZ Technologies Ltd',
    buyerGstin: '07AABCX9876A1Z9',
    buyerAddress: 'Tower A, Cyber City, Gurgaon - 122002',
    items: [
      {
        name: 'Software Development Services - Q4 2025',
        hsn: '998314',
        qty: 1,
        rate: 250000.00,
        amount: 250000.00
      }
    ],
    cgst: 22500.00,
    sgst: 22500.00,
    igst: 0,
    totalAmount: 295000.00,
    expectedResult: 'VALID + GREEN',
    description: 'IT services from regular filer'
  },

  // 3. VALID_GREEN_RETAIL
  {
    id: 'INV_003',
    invoiceNo: 'RF/2026/1523',
    date: '2026-02-03',
    sellerName: 'RELIANCE RETAIL LIMITED',
    sellerGstin: '07AAACR5055K1Z9',
    sellerAddress: '3rd Floor, Court House, Lokmanya Tilak Marg, Dhobi Talao, Mumbai - 400002',
    sellerState: 'Delhi',
    buyerName: 'Cash Sale',
    buyerGstin: 'N/A',
    buyerAddress: 'N/A',
    items: [
      {
        name: 'Grocery Items & FMCG Products',
        hsn: '1701',
        qty: 1,
        rate: 5500.00,
        amount: 5500.00
      }
    ],
    cgst: 495.00,
    sgst: 495.00,
    igst: 0,
    totalAmount: 6490.00,
    expectedResult: 'VALID + GREEN',
    description: 'Retail purchase with valid GSTIN'
  },

  // 4. VALID_YELLOW_DELAYED
  {
    id: 'INV_004',
    invoiceNo: 'ST/2026/089',
    date: '2026-02-01',
    sellerName: 'SMALL TRADERS PRIVATE LIMITED',
    sellerGstin: '09AABCS1429B1ZS',
    sellerAddress: '45/2, MG Road, Lucknow - 226001',
    sellerState: 'Uttar Pradesh',
    buyerName: 'Office Solutions Co.',
    buyerGstin: '07AABCO5678C1Z3',
    buyerAddress: 'Nehru Place, New Delhi - 110019',
    items: [
      {
        name: 'Office Supplies - Stationery Bundle',
        hsn: '4820',
        qty: 100,
        rate: 80.00,
        amount: 8000.00
      }
    ],
    cgst: 720.00,
    sgst: 720.00,
    igst: 0,
    totalAmount: 9440.00,
    expectedResult: 'VALID + YELLOW',
    description: 'Delayed filer - proceed with caution'
  },

  // 5. VALID_RED_RISKY
  {
    id: 'INV_005',
    invoiceNo: 'RE/2026/012',
    date: '2026-02-02',
    sellerName: 'RISKY ENTERPRISE',
    sellerGstin: '19AABCR5678D1Z5',
    sellerAddress: '12, Park Street, Kolkata - 700016',
    sellerState: 'West Bengal',
    buyerName: 'Tech Components Ltd',
    buyerGstin: '27AABCT1234T1Z7',
    buyerAddress: 'Andheri West, Mumbai - 400058',
    items: [
      {
        name: 'Electronic Components - ICs & Resistors',
        hsn: '8542',
        qty: 500,
        rate: 90.00,
        amount: 45000.00
      }
    ],
    cgst: 4050.00,
    sgst: 4050.00,
    igst: 0,
    totalAmount: 53100.00,
    expectedResult: 'VALID + RED',
    description: 'Non-filer - HIGH RISK for ITC'
  },

  // 6. CANCELLED_GSTIN
  {
    id: 'INV_006',
    invoiceNo: 'OBC/2026/456',
    date: '2026-02-01',
    sellerName: 'OLD BUSINESS CORPORATION',
    sellerGstin: '27AABCC1234D1ZB',
    sellerAddress: '78, Station Road, Pune - 411001',
    sellerState: 'Maharashtra',
    buyerName: 'Furniture Buyers Co.',
    buyerGstin: '29AABCF9999B1Z2',
    buyerAddress: 'MG Road, Bangalore - 560001',
    items: [
      {
        name: 'Office Furniture - Desks & Chairs',
        hsn: '9403',
        qty: 10,
        rate: 3200.00,
        amount: 32000.00
      }
    ],
    cgst: 2880.00,
    sgst: 2880.00,
    igst: 0,
    totalAmount: 37760.00,
    expectedResult: 'CANCELLED',
    description: 'GSTIN cancelled - DO NOT TRANSACT'
  },

  // 7. SUSPENDED_GSTIN
  {
    id: 'INV_007',
    invoiceNo: 'SUS/2026/234',
    date: '2026-02-03',
    sellerName: 'SUSPENDED TRADERS',
    sellerGstin: '36AABCS9876E1ZY',
    sellerAddress: '23, Banjara Hills, Hyderabad - 500034',
    sellerState: 'Telangana',
    buyerName: 'Textile Mills Pvt Ltd',
    buyerGstin: '27AABCT5555M1Z8',
    buyerAddress: 'Bhiwandi, Maharashtra - 421302',
    items: [
      {
        name: 'Textile Raw Materials - Cotton Yarn',
        hsn: '5205',
        qty: 200,
        rate: 90.00,
        amount: 18000.00
      }
    ],
    cgst: 1620.00,
    sgst: 1620.00,
    igst: 0,
    totalAmount: 21240.00,
    expectedResult: 'SUSPENDED',
    description: 'GSTIN suspended - DO NOT TRANSACT'
  },

  // 8. GI_LEGITIMATE_SAFFRON
  {
    id: 'INV_008',
    invoiceNo: 'KSH/2026/078',
    date: '2026-02-01',
    sellerName: 'KASHMIR SAFFRON HOUSE PRIVATE LIMITED',
    sellerGstin: '01AABPK5678S1Z7',
    sellerAddress: 'Pampore, Srinagar - 192121',
    sellerState: 'Jammu and Kashmir',
    buyerName: 'Premium Spices Export Co.',
    buyerGstin: '07AABPS8888E1Z4',
    buyerAddress: 'Connaught Place, New Delhi - 110001',
    items: [
      {
        name: 'Kashmiri Saffron (Kesar) - Premium Grade A',
        hsn: '0910',
        qty: 50,
        rate: 500.00,
        amount: 25000.00
      }
    ],
    cgst: 2250.00,
    sgst: 2250.00,
    igst: 0,
    totalAmount: 29500.00,
    expectedResult: 'VALID + GI VERIFIED',
    description: 'Legitimate Kashmiri Saffron from J&K'
  },

  // 9. GI_FRAUD_FAKE_SAFFRON
  {
    id: 'INV_009',
    invoiceNo: 'BSM/2026/199',
    date: '2026-02-02',
    sellerName: 'BANGALORE SPICE MART PRIVATE LIMITED',
    sellerGstin: '29AABCF5678F1ZC',
    sellerAddress: '56, Commercial Street, Bangalore - 560001',
    sellerState: 'Karnataka',
    buyerName: 'Retail Spice Co.',
    buyerGstin: '27AABCR7777S1Z6',
    buyerAddress: 'Crawford Market, Mumbai - 400001',
    items: [
      {
        name: 'Kashmiri Saffron (Kesar) - Premium Quality',
        hsn: '0910',
        qty: 100,
        rate: 480.00,
        amount: 48000.00
      }
    ],
    cgst: 4320.00,
    sgst: 4320.00,
    igst: 0,
    totalAmount: 56640.00,
    expectedResult: 'GI FRAUD ALERT',
    description: 'Fake Kashmiri Saffron from Karnataka!'
  },

  // 10. GI_FRAUD_FAKE_TEA
  {
    id: 'INV_010',
    invoiceNo: 'MTT/2026/345',
    date: '2026-02-03',
    sellerName: 'MUMBAI TEA TRADERS PRIVATE LIMITED',
    sellerGstin: '27AABCT9999T1ZT',
    sellerAddress: '89, Crawford Market, Mumbai - 400001',
    sellerState: 'Maharashtra',
    buyerName: 'Tea House Distributors',
    buyerGstin: '07AABCT4444D1Z1',
    buyerAddress: 'Karol Bagh, New Delhi - 110005',
    items: [
      {
        name: 'Darjeeling First Flush Tea - Premium Leaf',
        hsn: '0902',
        qty: 20,
        rate: 600.00,
        amount: 12000.00
      }
    ],
    cgst: 1080.00,
    sgst: 1080.00,
    igst: 0,
    totalAmount: 14160.00,
    expectedResult: 'GI FRAUD ALERT',
    description: 'Fake Darjeeling Tea from Maharashtra!'
  }
];

/**
 * Get invoice by ID
 */
export function getInvoiceById(id) {
  return TEST_INVOICES.find(inv => inv.id === id);
}

/**
 * Get invoices by expected result
 */
export function getInvoicesByResult(result) {
  return TEST_INVOICES.filter(inv => inv.expectedResult === result);
}

/**
 * Get all GI fraud invoices
 */
export function getGIFraudInvoices() {
  return TEST_INVOICES.filter(inv => inv.expectedResult === 'GI FRAUD ALERT');
}

/**
 * Get all valid invoices
 */
export function getValidInvoices() {
  return TEST_INVOICES.filter(inv => inv.expectedResult.includes('VALID'));
}

export default TEST_INVOICES;
