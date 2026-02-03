# 🎯 TaxGrid Unified Engine - Usage Guide

Complete guide for using the unified TaxGrid verification engine.

---

## 📦 What's New

### Files Created:

1. **`src/utils/taxGridEngine.js`** - Unified engine combining all verification logic
2. **`src/data/testInvoicesEnhanced.js`** - 10 comprehensive test invoices with expected results

### Architecture:

```
taxGridEngine.js (Unified Facade)
├── Imports from existing files:
│   ├── stateCodes.js
│   ├── validateGSTIN.js
│   ├── mockGSTPortal.js
│   └── giProducts.js
│
└── New Functions:
    ├── calculateTax() - CGST/SGST/IGST calculation
    ├── assessRisk() - Overall risk assessment
    ├── getRecommendation() - Business recommendations
    └── verifyInvoice() - MASTER FUNCTION (runs all checks)
```

---

## 🚀 Quick Start

### Import the Engine

```javascript
// Option 1: Import specific functions
import { verifyInvoice, searchDatabase } from './utils/taxGridEngine';

// Option 2: Import everything
import TaxGridEngine from './utils/taxGridEngine';

// Option 3: Import all named exports
import * as TaxGrid from './utils/taxGridEngine';
```

---

## 🎯 MASTER FUNCTION: verifyInvoice()

### One Function to Rule Them All

```javascript
import { verifyInvoice } from './utils/taxGridEngine';

// Example: Verify invoice from Bangalore seller claiming Kashmir Saffron
const result = await verifyInvoice(
  '29AABCF5678F1Z4',  // Seller GSTIN (Bangalore)
  'Invoice for Kashmiri Saffron Premium Quality Kesar 100 grams',  // OCR text
  48000,  // Base amount
  '27',   // Buyer state code (Maharashtra)
  18      // GST rate (default: 18%)
);

console.log(result);
```

### What It Does:

1. ✅ **Validates GSTIN** format + checksum
2. ✅ **Fetches portal data** (filing status, business details)
3. ✅ **Checks GI origin** (detects fraud)
4. ✅ **Calculates tax** (CGST/SGST or IGST)
5. ✅ **Assesses risk** (LOW/MEDIUM/HIGH/CRITICAL)
6. ✅ **Provides recommendation** (Can claim ITC? Safe to transact?)

### Example Result:

```javascript
{
  success: true,
  timestamp: "2026-02-03T22:45:00.000Z",

  validation: {
    isValid: true,
    gstin: "29AABCF5678F1Z4",
    stateCode: "29",
    stateName: "Karnataka",
    pan: "AABCF5678F",
    errors: []
  },

  portalData: {
    found: true,
    legalName: "BANGALORE SPICE MART PRIVATE LIMITED",
    tradeName: "Bangalore Spice Mart",
    status: "Active",
    filingStatus: "YELLOW",
    filingStatusColor: "#eab308",
    lastFiledReturn: "GSTR-3B for December 2025",
    lastFiledDate: "2026-01-16"
  },

  giCheck: {
    hasGIProducts: true,
    count: 1,
    alerts: [
      {
        product: "Kashmiri Saffron",
        expectedRegion: "Jammu & Kashmir",
        expectedStates: ["01"],
        actualState: "29",
        severity: "HIGH",
        message: "⚠️ ORIGIN MISMATCH..."
      }
    ]
  },

  tax: {
    baseAmount: 48000,
    cgst: 0,
    sgst: 0,
    igst: 8640,     // 18% (inter-state)
    totalTax: 8640,
    totalAmount: 56640,
    isInterState: true,
    gstRate: 18,
    sellerState: "Karnataka",
    buyerState: "Maharashtra"
  },

  risk: {
    level: "HIGH",
    color: "#f97316",
    score: 70,
    reasons: [
      "Business has delayed GST filings",
      "GI Fraud: Kashmiri Saffron should be from Jammu & Kashmir"
    ]
  },

  recommendation: {
    canClaimITC: false,
    message: "HIGH RISK - Not recommended for ITC claims",
    action: "Avoid transaction or verify extensively before proceeding"
  }
}
```

---

## 📊 Test All 10 Scenarios

### Using Enhanced Test Invoices

```javascript
import { verifyInvoice } from './utils/taxGridEngine';
import { TEST_INVOICES_ENHANCED } from './data/testInvoicesEnhanced';

// Test all invoices
for (const testInvoice of TEST_INVOICES_ENHANCED) {
  const { invoiceData } = testInvoice;

  const result = await verifyInvoice(
    invoiceData.seller.gstin,
    invoiceData.ocrText,
    invoiceData.taxableAmount,
    invoiceData.buyer.stateCode,
    18
  );

  console.log(`\n${testInvoice.id}: ${testInvoice.testCase}`);
  console.log(`Expected: ${testInvoice.expectedResult}`);
  console.log(`Risk Level: ${result.risk.level} (Expected: ${testInvoice.expectedRisk})`);
  console.log(`Can Claim ITC: ${result.recommendation.canClaimITC} (Expected: ${testInvoice.expectedITC})`);
  console.log(`✅ ${result.risk.level === testInvoice.expectedRisk ? 'PASS' : 'FAIL'}`);
}
```

---

## 🔍 Individual Functions

### 1. Search Database

```javascript
import { searchByKeyword, searchDatabaseEnhanced } from './utils/taxGridEngine';

// Basic search
const results = searchByKeyword('kashmir');
// Returns: [Kashmir Saffron House, Bangalore Spice Mart (claims Kashmir)]

// Enhanced search (includes styling info)
const enhancedResults = searchDatabaseEnhanced('kashmir');
// Adds: filingStatusColor, statusBadge
```

### 2. Calculate Tax

```javascript
import { calculateTax } from './utils/taxGridEngine';

// Intra-state (same state)
const tax1 = calculateTax(10000, '27', '27', 18);
// Result: { cgst: 900, sgst: 900, igst: 0, isInterState: false }

// Inter-state (different states)
const tax2 = calculateTax(10000, '27', '29', 18);
// Result: { cgst: 0, sgst: 0, igst: 1800, isInterState: true }
```

### 3. Check GI Origin

```javascript
import { checkGIOrigin } from './utils/taxGridEngine';

const alerts = checkGIOrigin(
  'Kashmiri Saffron Premium Kesar',  // OCR text
  '29'  // Seller state (Karnataka)
);

// Returns:
// [
//   {
//     product: "Kashmiri Saffron",
//     expectedRegion: "Jammu & Kashmir",
//     actualState: "29",
//     severity: "HIGH"
//   }
// ]
```

### 4. Assess Risk

```javascript
import { assessRisk, validateGSTIN, fetchGSTPortalData, checkGIOrigin } from './utils/taxGridEngine';

// Manual risk assessment
const validation = validateGSTIN('27AABCC1234D1Z9');
const portalData = await fetchGSTPortalData('27AABCC1234D1Z9');
const giCheck = checkGIOrigin('', '27');

const risk = assessRisk(validation, portalData, giCheck);
// Result: { level: "CRITICAL", color: "#ef4444", reasons: ["GSTIN has been cancelled"] }
```

---

## 📋 Test Scenarios Summary

| # | Test Case | GSTIN | Filing Status | GI Check | Risk | ITC |
|---|-----------|-------|---------------|----------|------|-----|
| 1 | VALID_GREEN_CEMENT | 27AABCU9603R1ZM | 🟢 GREEN | N/A | LOW | ✅ |
| 2 | VALID_GREEN_IT | 29AABCT1332L1ZL | 🟢 GREEN | N/A | LOW | ✅ |
| 3 | VALID_GREEN_RETAIL | 07AAACR5055K1Z0 | 🟢 GREEN | N/A | LOW | ✅ |
| 4 | VALID_YELLOW_DELAYED | 09AABCS1429B1ZE | 🟡 YELLOW | N/A | MEDIUM | ✅ |
| 5 | VALID_RED_RISKY | 19AABCR5678D1Z2 | 🔴 RED | N/A | HIGH | ❌ |
| 6 | CANCELLED_GSTIN | 27AABCC1234D1Z9 | ❌ CANCELLED | N/A | CRITICAL | ❌ |
| 7 | SUSPENDED_GSTIN | 36AABCS9876E1Z3 | ⛔ SUSPENDED | N/A | CRITICAL | ❌ |
| 8 | GI_LEGITIMATE | 01AABPK5678S1Z1 | 🟢 GREEN | ✅ Verified | LOW | ✅ |
| 9 | GI_FRAUD_SAFFRON | 29AABCF5678F1Z4 | 🟡 YELLOW | 🚨 Fraud | HIGH | ❌ |
| 10 | GI_FRAUD_TEA | 27AABCT9999T1Z5 | 🟡 YELLOW | 🚨 Fraud | HIGH | ❌ |

---

## 🎨 React Component Integration

### Example: Verification Component

```jsx
import { useState } from 'react';
import { verifyInvoice } from './utils/taxGridEngine';

export default function InvoiceVerifier() {
  const [gstin, setGstin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const verificationResult = await verifyInvoice(
      gstin,
      '', // No OCR text for manual entry
      0,  // No amount
      null // Buyer state not specified
    );
    setResult(verificationResult);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <input
        value={gstin}
        onChange={(e) => setGstin(e.target.value)}
        placeholder="Enter GSTIN"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {result && result.success && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold text-lg">
            Validation: {result.validation.isValid ? '✅ Valid' : '❌ Invalid'}
          </h3>

          {result.portalData.found && (
            <div className="mt-2">
              <p><strong>Business:</strong> {result.portalData.legalName}</p>
              <p><strong>Filing Status:</strong>
                <span style={{ color: result.portalData.filingStatusColor }}>
                  {result.portalData.filingStatus}
                </span>
              </p>
            </div>
          )}

          <div className="mt-4 p-3 rounded"
               style={{ backgroundColor: `${result.risk.color}20` }}>
            <p className="font-bold" style={{ color: result.risk.color }}>
              Risk: {result.risk.level}
            </p>
            <p className="text-sm">{result.recommendation.message}</p>
          </div>

          {result.giCheck.hasGIProducts && (
            <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded">
              <p className="font-bold text-red-800">🚨 GI Fraud Detected</p>
              {result.giCheck.alerts.map((alert, idx) => (
                <p key={idx} className="text-sm text-red-700">
                  {alert.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Workflow

### Step 1: Test Valid GREEN Invoice

```javascript
const result = await verifyInvoice('27AABCU9603R1ZM', '', 15000, '27');
// Expected: risk.level = "LOW", recommendation.canClaimITC = true
```

### Step 2: Test YELLOW (Delayed) Invoice

```javascript
const result = await verifyInvoice('09AABCS1429B1ZE', '', 8000, '07');
// Expected: risk.level = "MEDIUM", filingStatus = "YELLOW"
```

### Step 3: Test RED (Non-Filer) Invoice

```javascript
const result = await verifyInvoice('19AABCR5678D1Z2', '', 45000, '27');
// Expected: risk.level = "HIGH", recommendation.canClaimITC = false
```

### Step 4: Test CANCELLED Invoice

```javascript
const result = await verifyInvoice('27AABCC1234D1Z9', '', 32000, '29');
// Expected: risk.level = "CRITICAL", status = "Cancelled"
```

### Step 5: Test GI Fraud

```javascript
const result = await verifyInvoice(
  '29AABCF5678F1Z4',
  'Kashmiri Saffron Kesar Premium',
  48000,
  '27'
);
// Expected: giCheck.hasGIProducts = true, risk.level = "HIGH"
```

---

## 📊 Risk Assessment Logic

### Risk Scoring:

- **Invalid GSTIN**: +100 (CRITICAL)
- **Cancelled/Suspended**: +100 (CRITICAL)
- **RED filing status**: +60 (HIGH)
- **YELLOW filing status**: +30 (MEDIUM)
- **GI fraud per product**: +40 (HIGH)

### Risk Levels:

- **0-29**: LOW (Safe to transact)
- **30-59**: MEDIUM (Proceed with caution)
- **60-89**: HIGH (Not recommended)
- **90-100**: CRITICAL (Do not transact)

---

## 🔧 Utility Functions

### Format Currency

```javascript
import { formatINR } from './utils/taxGridEngine';

formatINR(17700);  // "₹17,700.00"
```

### Get Risk Badge Style

```javascript
import { getRiskBadgeStyle } from './utils/taxGridEngine';

const style = getRiskBadgeStyle('HIGH');
// Returns: { bg: 'bg-orange-100', text: 'text-orange-800', ... }
```

---

## ✅ Benefits of Unified Engine

1. **Single Import** - Everything from one place
2. **Master Function** - `verifyInvoice()` does it all
3. **Consistent API** - All functions return similar structures
4. **Easy Testing** - Use enhanced test invoices
5. **Backward Compatible** - Existing code still works

---

## 🚀 Next Steps

1. **Create Test Page**: Build `/test-engine` route to demo all 10 scenarios
2. **Update Components**: Gradually migrate to use `verifyInvoice()`
3. **Add to Receipt Scanner**: Integrate master function in OCR flow
4. **PDF Reports**: Use risk assessment in Audit Shield PDF

---

**Engine is ready to use!** 🎉
