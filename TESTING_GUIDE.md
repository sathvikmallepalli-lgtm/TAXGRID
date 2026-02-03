# 🧪 TaxGrid Testing Guide

Complete guide for testing all features with mock GST data, keyword search, and test invoices.

---

## 📋 Table of Contents

1. [Mock GST Portal Database](#mock-gst-portal-database)
2. [Test Invoice Scenarios](#test-invoice-scenarios)
3. [Keyword Search Testing](#keyword-search-testing)
4. [Filing Status Badges](#filing-status-badges)
5. [GI Origin Verification](#gi-origin-verification)
6. [PDF Audit Shield](#pdf-audit-shield)

---

## 🗄️ Mock GST Portal Database

Located: `src/utils/mockGSTPortal.js`

### 10 Test Scenarios

| GSTIN | Business | State | Filing Status | Expected Result |
|-------|----------|-------|---------------|-----------------|
| `27AABCU9603R1ZM` | UltraTech Cement | Maharashtra | 🟢 GREEN | ✅ Valid + Regular Filer |
| `29AABCT1332L1ZL` | TCS | Karnataka | 🟢 GREEN | ✅ Valid + Regular Filer |
| `07AAACR5055K1Z0` | Reliance Retail | Delhi | 🟢 GREEN | ✅ Valid + Regular Filer |
| `09AABCS1429B1ZE` | Small Traders | UP | 🟡 YELLOW | ⚠️ Valid + Delayed Filer |
| `19AABCR5678D1Z2` | Risky Enterprise | West Bengal | 🔴 RED | 🚨 Valid + Non-Filer (HIGH RISK) |
| `27AABCC1234D1Z9` | Old Business Corp | Maharashtra | ❌ CANCELLED | ❌ GSTIN Cancelled |
| `36AABCS9876E1Z3` | Suspended Traders | Telangana | ⛔ SUSPENDED | ❌ GSTIN Suspended |
| `01AABPK5678S1Z1` | Kashmir Saffron House | J&K | 🟢 GREEN | ✅ GI Origin Verified |
| `29AABCF5678F1Z4` | Bangalore Spice Mart | Karnataka | 🟢 GREEN | 🚨 GI FRAUD (Fake Saffron) |
| `27AABCT9999T1Z5` | Mumbai Tea Traders | Maharashtra | 🟢 GREEN | 🚨 GI FRAUD (Fake Darjeeling Tea) |

---

## 📄 Test Invoice Scenarios

Located: `src/utils/testInvoices.js`

### How to Use Test Invoices

**Option 1: Manual GSTIN Entry**
1. Navigate to Home page
2. Scroll to "GSTIN Validator"
3. Enter one of the test GSTINs above
4. Click "Validate"
5. Observe filing status badges

**Option 2: Generate Test Invoice Images**
1. Create a test page at `/test-invoices`
2. Import `InvoiceTemplate` and `TEST_INVOICES`
3. Render each invoice
4. Screenshot or print to PDF
5. Upload to Receipt Scanner

**Example Test Page:**
```jsx
import InvoiceTemplate from './components/InvoiceTemplate';
import { TEST_INVOICES } from './utils/testInvoices';

export default function TestInvoicesPage() {
  return (
    <div>
      {TEST_INVOICES.map(invoice => (
        <div key={invoice.id} style={{ pageBreakAfter: 'always' }}>
          <InvoiceTemplate {...invoice} />
        </div>
      ))}
    </div>
  );
}
```

### 10 Invoice Test Cases

#### 1. **INV_001 - VALID_GREEN_CEMENT**
- **GSTIN**: 27AABCU9603R1ZM
- **Seller**: UltraTech Cement
- **Product**: Portland Cement
- **Amount**: ₹17,700
- **Expected**: ✅ Valid + Green filing status badge

#### 2. **INV_002 - VALID_GREEN_IT**
- **GSTIN**: 29AABCT1332L1ZL
- **Seller**: TCS
- **Product**: Software Services
- **Amount**: ₹2,95,000
- **Expected**: ✅ Valid + Green filing status badge

#### 3. **INV_003 - VALID_GREEN_RETAIL**
- **GSTIN**: 07AAACR5055K1Z0
- **Seller**: Reliance Retail
- **Product**: Groceries
- **Amount**: ₹6,490
- **Expected**: ✅ Valid + Green filing status badge

#### 4. **INV_004 - VALID_YELLOW_DELAYED**
- **GSTIN**: 09AABCS1429B1ZE
- **Seller**: Small Traders
- **Product**: Office Supplies
- **Amount**: ₹9,440
- **Expected**: ⚠️ Valid + Yellow warning (delayed filer)

#### 5. **INV_005 - VALID_RED_RISKY**
- **GSTIN**: 19AABCR5678D1Z2
- **Seller**: Risky Enterprise
- **Product**: Electronic Components
- **Amount**: ₹53,100
- **Expected**: 🚨 Valid + Red alert (non-filer, HIGH RISK for ITC)

#### 6. **INV_006 - CANCELLED_GSTIN**
- **GSTIN**: 27AABCC1234D1Z9
- **Seller**: Old Business Corp
- **Product**: Furniture
- **Amount**: ₹37,760
- **Expected**: ❌ CANCELLED GSTIN - Do not transact!

#### 7. **INV_007 - SUSPENDED_GSTIN**
- **GSTIN**: 36AABCS9876E1Z3
- **Seller**: Suspended Traders
- **Product**: Textile Materials
- **Amount**: ₹21,240
- **Expected**: ⛔ SUSPENDED GSTIN - Do not transact!

#### 8. **INV_008 - GI_LEGITIMATE_SAFFRON**
- **GSTIN**: 01AABPK5678S1Z1
- **Seller**: Kashmir Saffron House (J&K)
- **Product**: Kashmiri Saffron
- **Amount**: ₹29,500
- **Expected**: ✅ Valid + GI Origin VERIFIED (J&K is correct for Kashmiri Saffron)

#### 9. **INV_009 - GI_FRAUD_FAKE_SAFFRON**
- **GSTIN**: 29AABCF5678F1Z4
- **Seller**: Bangalore Spice Mart (Karnataka)
- **Product**: "Kashmiri Saffron" ⚠️
- **Amount**: ₹56,640
- **Expected**: 🚨 GI FRAUD ALERT! Kashmiri Saffron sold from Karnataka (should be J&K)

#### 10. **INV_010 - GI_FRAUD_FAKE_TEA**
- **GSTIN**: 27AABCT9999T1Z5
- **Seller**: Mumbai Tea Traders (Maharashtra)
- **Product**: "Darjeeling Tea" ⚠️
- **Amount**: ₹14,160
- **Expected**: 🚨 GI FRAUD ALERT! Darjeeling Tea sold from Maharashtra (should be West Bengal)

---

## 🔍 Keyword Search Testing

Navigate to: **http://localhost:5173/search**

### Search Functions Available

#### 1. **Search by GSTIN**
```
Search: "27AABCU"
Result: UltraTech Cement Limited
```

#### 2. **Search by Business Name**
```
Search: "kashmir"
Results:
- Kashmir Saffron House (Legitimate)
- Bangalore Spice Mart (sells "Kashmiri" saffron - FRAUD!)
```

#### 3. **Search by Keywords**
```
Search: "saffron"
Results:
- Kashmir Saffron House ✅
- Bangalore Spice Mart 🚨

Search: "tea"
Results:
- Mumbai Tea Traders 🚨

Search: "cement"
Result: UltraTech Cement ✅
```

#### 4. **Search by State**
```
Search: "karnataka"
Results: TCS, Bangalore Spice Mart

Search: "jammu"
Result: Kashmir Saffron House
```

### Test Search Scenarios

| Search Term | Expected Results | Notes |
|-------------|------------------|-------|
| `kashmir` | 2 results | 1 legitimate, 1 fraud |
| `27AABCU` | 1 result | UltraTech Cement |
| `bangalore` | 1 result | Bangalore Spice Mart |
| `tea` | 1 result | Mumbai Tea Traders |
| `cement` | 1 result | UltraTech |
| `tcs` | 1 result | TCS |
| `suspended` | 1 result | Suspended Traders |
| `risky` | 1 result | Risky Enterprise (RED status) |

---

## 📊 Filing Status Badges

Filing status badges appear in:
1. **GSTIN Validator** (Home page)
2. **Receipt Scanner** (when GSTIN validated)
3. **Search Results** (keyword search)
4. **PDF Reports** (Audit Shield)

### Badge Colors & Meanings

#### 🟢 GREEN - Regular Filer
- **Message**: "This business files GST returns regularly. Safe for ITC claims."
- **Action**: ✅ Safe to transact
- **Example GSTINs**: 27AABCU9603R1ZM, 29AABCT1332L1ZL

#### 🟡 YELLOW - Delayed Filer
- **Message**: "This business has delayed GST filings. Proceed with caution for ITC claims."
- **Action**: ⚠️ Proceed with caution
- **Example GSTIN**: 09AABCS1429B1ZE

#### 🔴 RED - Non-Filer
- **Message**: "This business has not filed GST returns for several months. HIGH RISK for ITC claims!"
- **Action**: 🚨 High risk, avoid ITC claims
- **Example GSTIN**: 19AABCR5678D1Z2

#### ❌ CANCELLED
- **Message**: "This GSTIN has been cancelled. DO NOT transact with this business!"
- **Action**: ❌ Do not transact
- **Example GSTIN**: 27AABCC1234D1Z9

#### ⛔ SUSPENDED
- **Message**: "This GSTIN has been suspended. DO NOT transact with this business!"
- **Action**: ⛔ Do not transact
- **Example GSTIN**: 36AABCS9876E1Z3

---

## 🏺 GI Origin Verification

### Test Cases

#### ✅ **Legitimate GI Products**
```
GSTIN: 01AABPK5678S1Z1
Product: "Kashmiri Saffron"
Seller State: Jammu & Kashmir (01)
Result: ✅ GI Origin VERIFIED (green badge)
```

#### 🚨 **GI Fraud Cases**

**Case 1: Fake Kashmiri Saffron**
```
GSTIN: 29AABCF5678F1Z4
Product: "Kashmiri Saffron"
Seller State: Karnataka (29)
Expected Origin: Jammu & Kashmir (01)
Result: 🚨 GI FRAUD ALERT (red badge)
Message: "This product may not be authentic. Genuine Kashmiri Saffron comes only from Jammu & Kashmir."
```

**Case 2: Fake Darjeeling Tea**
```
GSTIN: 27AABCT9999T1Z5
Product: "Darjeeling Tea"
Seller State: Maharashtra (27)
Expected Origin: West Bengal (19)
Result: 🚨 GI FRAUD ALERT (red badge)
Message: "This product may not be authentic. Genuine Darjeeling Tea comes only from West Bengal."
```

### How GI Verification Works
1. OCR extracts text from receipt
2. System scans for GI product keywords (kashmiri, saffron, darjeeling, banarasi, etc.)
3. Validates seller's state code matches expected GI origin
4. Shows green badge if match, red alert if mismatch

### GI Products Tracked (40+)
- Kashmiri Saffron (J&K)
- Banarasi Silk (UP)
- Darjeeling Tea (West Bengal)
- Kanchipuram Silk (Tamil Nadu)
- Alphonso Mango (Maharashtra)
- Mysore Silk (Karnataka)
- And 34+ more regional products

---

## 📄 PDF Audit Shield

### How to Generate
1. Upload multiple invoices in Receipt Scanner
2. Wait for OCR processing to complete
3. Scroll down to see "Audit Shield" button
4. Click "Download Audit Shield PDF"

### PDF Contents

1. **Header**
   - Document ID (e.g., TG-20260203-A1B2C3)
   - Generated timestamp
   - TaxGrid branding

2. **Summary Section**
   - Total invoices processed
   - Total amount
   - Verified invoices count
   - Verified amount
   - Flagged invoices (invalid GSTIN)
   - GI alert count

3. **Invoice Table**
   - S.No, GSTIN, Vendor, State, Amount, Status
   - Color-coded status (Green=Valid, Red=Invalid, Yellow=GI Alert)

4. **GI Alerts Section** (if any)
   - Lists all GI origin mismatches
   - Product name, expected origin, actual seller state

5. **Disclaimer**
   - GSTIN format validation disclaimer
   - Link to official GST portal

6. **Footer**
   - Page numbers
   - "Generated by TaxGrid" watermark

---

## 🧪 Complete Testing Workflow

### Scenario 1: Regular Business Transaction
1. Navigate to GSTIN Validator
2. Enter: `27AABCU9603R1ZM` (UltraTech Cement)
3. ✅ Verify: Green badge "Regular Filer"
4. ✅ Check: Last filed return info displayed

### Scenario 2: Risky Business Transaction
1. Navigate to GSTIN Validator
2. Enter: `19AABCR5678D1Z2` (Risky Enterprise)
3. 🚨 Verify: Red badge "Non-Filer"
4. 🚨 Check: Warning about ITC claim risk

### Scenario 3: GI Fraud Detection
1. Use Search page
2. Search: "kashmiri saffron"
3. Find 2 results
4. Click on "Bangalore Spice Mart" (Karnataka)
5. 🚨 Verify: GI FRAUD ALERT displayed
6. ✅ Compare with legitimate "Kashmir Saffron House" (J&K)

### Scenario 4: PDF Report Generation
1. Upload 5 test invoices (mix of valid, invalid, GI fraud)
2. Wait for processing
3. Generate Audit Shield PDF
4. ✅ Verify PDF contains all sections
5. ✅ Check GI alerts are highlighted

---

## 📱 User Interface Locations

### Feature Access Matrix

| Feature | Location | URL Path |
|---------|----------|----------|
| GSTIN Validator | Home Page | `/` |
| Receipt Scanner | Home Page | `/` |
| Keyword Search | Search Page | `/search` |
| Test Invoices | (To be created) | `/test-invoices` |
| Audit Shield PDF | Receipt Scanner (after processing) | N/A |
| Filing Status Badges | Validation Result (anywhere) | N/A |
| GI Alerts | Receipt Scanner (per invoice) | N/A |

---

## 🎯 Quick Test Commands

### Test GSTIN Entry
```javascript
// In browser console on home page
const testGstins = [
  '27AABCU9603R1ZM', // GREEN
  '09AABCS1429B1ZE', // YELLOW
  '19AABCR5678D1Z2', // RED
  '27AABCC1234D1Z9', // CANCELLED
  '01AABPK5678S1Z1', // GI LEGITIMATE
  '29AABCF5678F1Z4', // GI FRAUD
];
```

### Test Keyword Search
```javascript
// Navigate to /search and try:
const searchTerms = [
  'kashmir',    // 2 results (1 legit, 1 fraud)
  'tea',        // 1 result (fraud)
  'cement',     // 1 result (valid)
  'suspended',  // 1 result (suspended)
  'bangalore',  // 1 result
];
```

---

## ✅ Testing Checklist

- [ ] All 10 test GSTINs validate correctly
- [ ] Filing status badges display (GREEN/YELLOW/RED/CANCELLED/SUSPENDED)
- [ ] Last filed return info shows correctly
- [ ] Keyword search finds correct results
- [ ] Search results show filing status badges
- [ ] GI alerts display for fraud cases (invoices 9 & 10)
- [ ] GI verification shows green for legitimate (invoice 8)
- [ ] PDF Audit Shield generates successfully
- [ ] PDF contains all sections (header, summary, table, GI alerts, disclaimer)
- [ ] Mobile responsive design works on all pages

---

## 🐛 Known Limitations

1. **Mock Data Only**: Test scenarios use mock database, not real GST portal
2. **Client-Side Processing**: No server validation, all done in browser
3. **Limited GI Database**: Covers 40+ products, not exhaustive
4. **No Real-Time Status**: Filing status is static mock data

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify all files created correctly
- Ensure dev server is running
- Test with different browsers

---

**Happy Testing! 🚀**
