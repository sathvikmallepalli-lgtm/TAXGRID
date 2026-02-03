/**
 * 🧪 ENHANCED TEST INVOICES
 *
 * 10 comprehensive test scenarios covering:
 * - Valid GSTIN (GREEN filing status)
 * - Delayed filer (YELLOW filing status)
 * - Non-filer (RED filing status)
 * - Cancelled GSTIN
 * - Suspended GSTIN
 * - Legitimate GI products
 * - GI fraud cases
 *
 * Each invoice includes complete details for testing the unified TaxGrid engine.
 */

export const TEST_INVOICES_ENHANCED = [
  // ============================================================================
  // TEST 1: VALID + GREEN - UltraTech Cement
  // ============================================================================
  {
    id: 'INV001',
    testCase: 'VALID_GREEN_CEMENT',
    expectedResult: '✅ Valid GSTIN, GREEN filing status, Safe to transact',
    expectedRisk: 'LOW',
    expectedITC: true,

    invoiceData: {
      invoiceNo: 'UCL/2025-26/001234',
      invoiceDate: '28/01/2026',

      seller: {
        name: 'ULTRATECH CEMENT LIMITED',
        gstin: '27AABCU9603R1ZN',
        address: 'B-Wing, Ahura Centre, Mahakali Caves Road, Andheri East, Mumbai - 400093',
        state: 'Maharashtra',
        stateCode: '27'
      },

      buyer: {
        name: 'ABC Constructions Pvt Ltd',
        gstin: '27AABCA1234B1ZX',
        address: '123 Builder Lane, Pune - 411001',
        state: 'Maharashtra',
        stateCode: '27'
      },

      items: [
        {
          sno: 1,
          description: 'Portland Cement (OPC 53 Grade)',
          hsn: '2523',
          qty: 50,
          unit: 'Bags',
          rate: 300.00,
          amount: 15000.00
        }
      ],

      taxableAmount: 15000.00,
      cgst: 1350.00,  // 9% (intra-state)
      sgst: 1350.00,  // 9% (intra-state)
      igst: 0,
      totalAmount: 17700.00,

      ocrText: 'ULTRATECH CEMENT LIMITED Invoice No UCL/2025-26/001234 Date 28/01/2026 Portland Cement OPC 53 Grade 50 Bags Rs 15000 CGST 1350 SGST 1350 Total 17700'
    }
  },

  // ============================================================================
  // TEST 2: VALID + GREEN - TCS (IT Services)
  // ============================================================================
  {
    id: 'INV002',
    testCase: 'VALID_GREEN_IT',
    expectedResult: '✅ Valid GSTIN, GREEN filing status, Safe to transact',
    expectedRisk: 'LOW',
    expectedITC: true,

    invoiceData: {
      invoiceNo: 'TCS/2025-26/042856',
      invoiceDate: '15/01/2026',

      seller: {
        name: 'TATA CONSULTANCY SERVICES LIMITED',
        gstin: '29AABCT1332L1ZA',
        address: 'Maker Chambers IV, 222 Nariman Point, Mumbai - 400021',
        state: 'Karnataka',
        stateCode: '29'
      },

      buyer: {
        name: 'XYZ Technologies Ltd',
        gstin: '07AABCX9876A1Z9',
        address: 'Tower A, Cyber City, Gurgaon - 122002',
        state: 'Delhi',
        stateCode: '07'
      },

      items: [
        {
          sno: 1,
          description: 'Software Development Services - Q4 FY2025',
          hsn: '998314',
          qty: 1,
          unit: 'Service',
          rate: 250000.00,
          amount: 250000.00
        }
      ],

      taxableAmount: 250000.00,
      cgst: 0,
      sgst: 0,
      igst: 45000.00,  // 18% (inter-state)
      totalAmount: 295000.00,

      ocrText: 'TATA CONSULTANCY SERVICES LIMITED Invoice TCS/2025-26/042856 Software Development Services Q4 FY2025 Amount Rs 250000 IGST 45000 Total 295000'
    }
  },

  // ============================================================================
  // TEST 3: VALID + GREEN - Reliance Retail
  // ============================================================================
  {
    id: 'INV003',
    testCase: 'VALID_GREEN_RETAIL',
    expectedResult: '✅ Valid GSTIN, GREEN filing status, Safe to transact',
    expectedRisk: 'LOW',
    expectedITC: true,

    invoiceData: {
      invoiceNo: 'RF/2026/001523',
      invoiceDate: '03/02/2026',

      seller: {
        name: 'RELIANCE RETAIL LIMITED',
        gstin: '07AAACR5055K1Z9',
        address: '3rd Floor, Court House, Lokmanya Tilak Marg, Dhobi Talao, Mumbai - 400002',
        state: 'Delhi',
        stateCode: '07'
      },

      buyer: {
        name: 'Cash Sale',
        gstin: 'N/A',
        address: 'Walk-in Customer',
        state: 'Delhi',
        stateCode: '07'
      },

      items: [
        {
          sno: 1,
          description: 'Grocery Items & FMCG Products',
          hsn: '1701',
          qty: 1,
          unit: 'Lot',
          rate: 5500.00,
          amount: 5500.00
        }
      ],

      taxableAmount: 5500.00,
      cgst: 495.00,
      sgst: 495.00,
      igst: 0,
      totalAmount: 6490.00,

      ocrText: 'RELIANCE RETAIL LIMITED Invoice RF/2026/001523 Grocery Items FMCG Products Amount 5500 CGST 495 SGST 495 Total 6490'
    }
  },

  // ============================================================================
  // TEST 4: VALID + YELLOW - Small Traders (Delayed Filer)
  // ============================================================================
  {
    id: 'INV004',
    testCase: 'VALID_YELLOW_DELAYED',
    expectedResult: '⚠️ Valid GSTIN, YELLOW filing status (delayed), Proceed with caution',
    expectedRisk: 'MEDIUM',
    expectedITC: true,

    invoiceData: {
      invoiceNo: 'ST/2026/089',
      invoiceDate: '01/02/2026',

      seller: {
        name: 'SMALL TRADERS PRIVATE LIMITED',
        gstin: '09AABCS1429B1ZS',
        address: '45/2, MG Road, Lucknow - 226001',
        state: 'Uttar Pradesh',
        stateCode: '09'
      },

      buyer: {
        name: 'Office Solutions Co.',
        gstin: '07AABCO5678C1Z3',
        address: 'Nehru Place, New Delhi - 110019',
        state: 'Delhi',
        stateCode: '07'
      },

      items: [
        {
          sno: 1,
          description: 'Office Supplies - Stationery Bundle',
          hsn: '4820',
          qty: 100,
          unit: 'Sets',
          rate: 80.00,
          amount: 8000.00
        }
      ],

      taxableAmount: 8000.00,
      cgst: 0,
      sgst: 0,
      igst: 1440.00,  // 18% (inter-state)
      totalAmount: 9440.00,

      ocrText: 'SMALL TRADERS PRIVATE LIMITED Invoice ST/2026/089 Office Supplies Stationery Bundle 100 Sets Rs 8000 IGST 1440 Total 9440'
    }
  },

  // ============================================================================
  // TEST 5: VALID + RED - Risky Enterprise (Non-Filer)
  // ============================================================================
  {
    id: 'INV005',
    testCase: 'VALID_RED_RISKY',
    expectedResult: '🚨 Valid GSTIN, RED filing status (non-filer), HIGH RISK for ITC',
    expectedRisk: 'HIGH',
    expectedITC: false,

    invoiceData: {
      invoiceNo: 'RE/2026/012',
      invoiceDate: '02/02/2026',

      seller: {
        name: 'RISKY ENTERPRISE',
        gstin: '19AABCR5678D1Z5',
        address: '12, Park Street, Kolkata - 700016',
        state: 'West Bengal',
        stateCode: '19'
      },

      buyer: {
        name: 'Tech Components Ltd',
        gstin: '27AABCT1234T1Z7',
        address: 'Andheri West, Mumbai - 400058',
        state: 'Maharashtra',
        stateCode: '27'
      },

      items: [
        {
          sno: 1,
          description: 'Electronic Components - ICs & Resistors',
          hsn: '8542',
          qty: 500,
          unit: 'Pieces',
          rate: 90.00,
          amount: 45000.00
        }
      ],

      taxableAmount: 45000.00,
      cgst: 0,
      sgst: 0,
      igst: 8100.00,  // 18% (inter-state)
      totalAmount: 53100.00,

      ocrText: 'RISKY ENTERPRISE Invoice RE/2026/012 Electronic Components ICs Resistors 500 Pieces Amount 45000 IGST 8100 Total 53100'
    }
  },

  // ============================================================================
  // TEST 6: CANCELLED GSTIN
  // ============================================================================
  {
    id: 'INV006',
    testCase: 'CANCELLED_GSTIN',
    expectedResult: '❌ CANCELLED GSTIN - DO NOT TRANSACT',
    expectedRisk: 'CRITICAL',
    expectedITC: false,

    invoiceData: {
      invoiceNo: 'OBC/2026/456',
      invoiceDate: '01/02/2026',

      seller: {
        name: 'OLD BUSINESS CORPORATION',
        gstin: '27AABCC1234D1ZB',
        address: '78, Station Road, Pune - 411001',
        state: 'Maharashtra',
        stateCode: '27'
      },

      buyer: {
        name: 'Furniture Buyers Co.',
        gstin: '29AABCF9999B1Z2',
        address: 'MG Road, Bangalore - 560001',
        state: 'Karnataka',
        stateCode: '29'
      },

      items: [
        {
          sno: 1,
          description: 'Office Furniture - Desks & Chairs',
          hsn: '9403',
          qty: 10,
          unit: 'Sets',
          rate: 3200.00,
          amount: 32000.00
        }
      ],

      taxableAmount: 32000.00,
      cgst: 0,
      sgst: 0,
      igst: 5760.00,
      totalAmount: 37760.00,

      ocrText: 'OLD BUSINESS CORPORATION Invoice OBC/2026/456 Office Furniture Desks Chairs 10 Sets Amount 32000 IGST 5760 Total 37760'
    }
  },

  // ============================================================================
  // TEST 7: SUSPENDED GSTIN
  // ============================================================================
  {
    id: 'INV007',
    testCase: 'SUSPENDED_GSTIN',
    expectedResult: '❌ SUSPENDED GSTIN - DO NOT TRANSACT',
    expectedRisk: 'CRITICAL',
    expectedITC: false,

    invoiceData: {
      invoiceNo: 'SUS/2026/234',
      invoiceDate: '03/02/2026',

      seller: {
        name: 'SUSPENDED TRADERS',
        gstin: '36AABCS9876E1ZY',
        address: '23, Banjara Hills, Hyderabad - 500034',
        state: 'Telangana',
        stateCode: '36'
      },

      buyer: {
        name: 'Textile Mills Pvt Ltd',
        gstin: '27AABCT5555M1Z8',
        address: 'Bhiwandi, Maharashtra - 421302',
        state: 'Maharashtra',
        stateCode: '27'
      },

      items: [
        {
          sno: 1,
          description: 'Textile Raw Materials - Cotton Yarn',
          hsn: '5205',
          qty: 200,
          unit: 'Kg',
          rate: 90.00,
          amount: 18000.00
        }
      ],

      taxableAmount: 18000.00,
      cgst: 0,
      sgst: 0,
      igst: 3240.00,
      totalAmount: 21240.00,

      ocrText: 'SUSPENDED TRADERS Invoice SUS/2026/234 Textile Raw Materials Cotton Yarn 200 Kg Amount 18000 IGST 3240 Total 21240'
    }
  },

  // ============================================================================
  // TEST 8: GI LEGITIMATE - Kashmir Saffron House
  // ============================================================================
  {
    id: 'INV008',
    testCase: 'GI_LEGITIMATE_SAFFRON',
    expectedResult: '✅ Valid GSTIN + GI Origin VERIFIED (Kashmiri Saffron from J&K)',
    expectedRisk: 'LOW',
    expectedITC: true,

    invoiceData: {
      invoiceNo: 'KSH/2026/078',
      invoiceDate: '01/02/2026',

      seller: {
        name: 'KASHMIR SAFFRON HOUSE PRIVATE LIMITED',
        gstin: '01AABPK5678S1Z7',
        address: 'Pampore, Srinagar - 192121',
        state: 'Jammu and Kashmir',
        stateCode: '01'
      },

      buyer: {
        name: 'Premium Spices Export Co.',
        gstin: '07AABPS8888E1Z4',
        address: 'Connaught Place, New Delhi - 110001',
        state: 'Delhi',
        stateCode: '07'
      },

      items: [
        {
          sno: 1,
          description: 'Kashmiri Saffron (Kesar) - Premium Grade A',
          hsn: '0910',
          qty: 50,
          unit: 'Grams',
          rate: 500.00,
          amount: 25000.00
        }
      ],

      taxableAmount: 25000.00,
      cgst: 0,
      sgst: 0,
      igst: 4500.00,
      totalAmount: 29500.00,

      ocrText: 'KASHMIR SAFFRON HOUSE Invoice KSH/2026/078 Kashmiri Saffron Kesar Premium Grade A 50 Grams Amount 25000 IGST 4500 Total 29500 Authentic Kashmir Saffron Zafran'
    }
  },

  // ============================================================================
  // TEST 9: GI FRAUD - Fake Kashmiri Saffron from Bangalore
  // ============================================================================
  {
    id: 'INV009',
    testCase: 'GI_FRAUD_FAKE_SAFFRON',
    expectedResult: '🚨 GI FRAUD ALERT! Kashmiri Saffron sold from Karnataka (should be J&K)',
    expectedRisk: 'HIGH',
    expectedITC: false,

    invoiceData: {
      invoiceNo: 'BSM/2026/199',
      invoiceDate: '02/02/2026',

      seller: {
        name: 'BANGALORE SPICE MART PRIVATE LIMITED',
        gstin: '29AABCF5678F1ZC',
        address: '56, Commercial Street, Bangalore - 560001',
        state: 'Karnataka',
        stateCode: '29'
      },

      buyer: {
        name: 'Retail Spice Co.',
        gstin: '27AABCR7777S1Z6',
        address: 'Crawford Market, Mumbai - 400001',
        state: 'Maharashtra',
        stateCode: '27'
      },

      items: [
        {
          sno: 1,
          description: '"Kashmiri Saffron" (Kesar) - Premium Quality',
          hsn: '0910',
          qty: 100,
          unit: 'Grams',
          rate: 480.00,
          amount: 48000.00
        }
      ],

      taxableAmount: 48000.00,
      cgst: 0,
      sgst: 0,
      igst: 8640.00,
      totalAmount: 56640.00,

      ocrText: 'BANGALORE SPICE MART Invoice BSM/2026/199 Kashmiri Saffron Kesar Premium Quality 100 Grams Kashmir Saffron Amount 48000 IGST 8640 Total 56640'
    }
  },

  // ============================================================================
  // TEST 10: GI FRAUD - Fake Darjeeling Tea from Mumbai
  // ============================================================================
  {
    id: 'INV010',
    testCase: 'GI_FRAUD_FAKE_TEA',
    expectedResult: '🚨 GI FRAUD ALERT! Darjeeling Tea sold from Maharashtra (should be West Bengal)',
    expectedRisk: 'HIGH',
    expectedITC: false,

    invoiceData: {
      invoiceNo: 'MTT/2026/345',
      invoiceDate: '03/02/2026',

      seller: {
        name: 'MUMBAI TEA TRADERS PRIVATE LIMITED',
        gstin: '27AABCT9999T1ZT',
        address: '89, Crawford Market, Mumbai - 400001',
        state: 'Maharashtra',
        stateCode: '27'
      },

      buyer: {
        name: 'Tea House Distributors',
        gstin: '07AABCT4444D1Z1',
        address: 'Karol Bagh, New Delhi - 110005',
        state: 'Delhi',
        stateCode: '07'
      },

      items: [
        {
          sno: 1,
          description: '"Darjeeling First Flush Tea" - Premium Leaf',
          hsn: '0902',
          qty: 20,
          unit: 'Kg',
          rate: 600.00,
          amount: 12000.00
        }
      ],

      taxableAmount: 12000.00,
      cgst: 0,
      sgst: 0,
      igst: 2160.00,
      totalAmount: 14160.00,

      ocrText: 'MUMBAI TEA TRADERS Invoice MTT/2026/345 Darjeeling First Flush Tea Premium Leaf 20 Kg Darjeeling Tea Amount 12000 IGST 2160 Total 14160'
    }
  }
];

/**
 * Helper functions for test invoices
 */

export function getInvoiceById(id) {
  return TEST_INVOICES_ENHANCED.find(inv => inv.id === id);
}

export function getInvoicesByTestCase(testCase) {
  return TEST_INVOICES_ENHANCED.filter(inv => inv.testCase.includes(testCase));
}

export function getInvoicesByRisk(riskLevel) {
  return TEST_INVOICES_ENHANCED.filter(inv => inv.expectedRisk === riskLevel);
}

export function getGIFraudInvoices() {
  return TEST_INVOICES_ENHANCED.filter(inv => inv.testCase.includes('GI_FRAUD'));
}

export function getValidInvoices() {
  return TEST_INVOICES_ENHANCED.filter(inv => inv.testCase.includes('VALID'));
}

export function getInvalidInvoices() {
  return TEST_INVOICES_ENHANCED.filter(inv =>
    inv.testCase.includes('CANCELLED') || inv.testCase.includes('SUSPENDED')
  );
}

export default TEST_INVOICES_ENHANCED;
