# TaxGrid 🛡️

<div align="center">

![TaxGrid Banner](public/assets/taxgrid-banner.png)

[![React](https://img.shields.io/badge/react-19.2-blue.svg?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-7.2-purple.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.4-cyan.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-first-emerald?style=for-the-badge)](https://github.com/sathvikmallepalli-lgtm/TAXGRID)

### Advanced GST Verification & Fraud Detection Platform
**Enterprise-Grade GSTIN Validation • OCR Invoice Scanning • Real-Time Analytics**

[📖 Documentation](#documentation) | [🚀 Quick Start](#-getting-started) | [🏛️ Government Use](#government-deployment) | [📊 Features](#-key-features)

</div>

---

## 📋 Executive Summary

**TaxGrid** is an advanced, privacy-first GST compliance platform designed to combat invoice fraud and streamline tax verification processes in India. Built with cutting-edge web technologies, TaxGrid provides instant GSTIN validation, OCR-powered invoice scanning, and comprehensive fraud detection—all processed locally in the user's browser.

### Key Statistics Addressed
- **₹7.08 Lakh Crore**: Total GST fraud detected in India (2017-2023)
- **40,000+**: Fake firms identified generating fraudulent invoices
- **60-85%**: Market penetration of counterfeit GI products

### Target Use Cases
- Government auditors and tax officials
- Businesses verifying supplier credentials
- Taxpayers ensuring invoice authenticity
- Financial institutions conducting due diligence

> **Mission:** "Empowering transparency in India's GST ecosystem through accessible, secure, and verifiable compliance tools."

---

## ✨ Key Features

### 🛡️ Instant GSTIN Validator
- Validate GSTIN format, checksum (Mod 36), and state code instantly.
- Optional **live** taxpayer details via a **local GST proxy** (see Getting Started); otherwise cross-reference with the demo database.
- Format validation stays in the browser; API keys for live lookup never ship in the frontend bundle when using the proxy.

### 📸 OCR-Powered Receipt Scanning
- Upload or drag-and-drop invoices (Image/PDF).
- Automatically extract **GSTIN**, **Vendor Name**, **Date**, and **Total Amount**.
- Detect mismatch between seller state and claimed GI products (e.g., selling "Kashmiri Saffron" from Karnataka).

### 📍 Geographical Indication (GI) Verification
- Protect yourself from counterfeit goods.
- Verify if a product claims to be from a GI region (e.g., Banarasi Silk from UP) vs. the actual seller's location.

### 💰 Smart Bill Splitting
- Split bills among friends without tax complications.
- Generate **Audit-Ready PDFs** to prove reimbursements are not income.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: TailwindCSS, Lucide Icons
- **OCR Engine**: Tesseract.js
- **PDF Generation**: jsPDF
- **Linting**: ESLint

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sathvikmallepalli-lgtm/TAXGRID.git
   cd TAXGRID
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment (optional — live GSTIN lookup)**  
   - Copy `.env.example` to `.env`.  
   - Set **`GST_API_KEY`** and **`GST_CLIENT_ID`** from your GST data provider (same pattern as [Masters India Search GSTIN](https://docs.mastersindia.co/gst-verification-api/search-gstin)).  
   - Without these, the app still runs using the **local demo database** for lookups.

4. **Start the app (recommended: UI + API proxy together)**  
   ```bash
   npm run dev:full
   ```  
   This runs the **Vite dev server** and the **local GST proxy** (`server/gst-proxy.mjs`) so the browser can call `/api/gst/search` without exposing API keys.  
   - Or run **`npm run gst-proxy`** and **`npm run dev`** in two terminals.

5. **Open in browser**  
   `http://localhost:5173`

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🏛️ Government Deployment

### Production-Ready Features
TaxGrid is designed for potential integration with government systems:

- **✅ API-Ready Architecture**: Modular design allows easy integration with official GST Portal APIs
- **✅ Scalable Infrastructure**: Client-side processing reduces server load
- **✅ Audit Trail**: All validations can be logged for compliance
- **✅ Open Source**: Fully auditable codebase for security verification
- **✅ Privacy Compliant**: Core validation runs locally; optional live GSTIN lookup uses a **server-side proxy** (keys not shipped to the client)
- **✅ Offline Capable**: Works without internet after initial load

### Integration Possibilities
For government deployment, TaxGrid can be enhanced with:

1. **Official GST API Integration**: Replace mock database with real-time GSTIN verification
2. **Centralized Reporting**: Analytics dashboard for fraud pattern detection
3. **Multi-tenancy**: Department-wise access control and reporting
4. **Advanced Analytics**: ML-based fraud prediction and risk scoring
5. **Compliance Export**: Standardized reporting formats for regulatory bodies

### Security & Compliance
- **Data Privacy**: All processing happens in browser (IndexedDB for temporary storage)
- **Zero Server Storage**: No financial documents stored on remote servers
- **Open Audit**: Complete source code available for security audits
- **HTTPS Enforced**: Secure communication in production deployments

---

## 📊 Technical Specifications

### Performance Metrics
- **Validation Speed**: < 100ms for GSTIN format validation
- **OCR Processing**: ~3-5 seconds per invoice (depends on image quality)
- **Storage Capacity**: ~50-100MB per browser (IndexedDB)
- **Offline Mode**: Full functionality after initial load

### Browser Compatibility
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Data Architecture
```
Client Browser
├── IndexedDB (Session Storage)
│   ├── Invoice OCR Results
│   ├── Validation Cache
│   └── Analytics Data
├── Tesseract.js (OCR Engine)
├── jsPDF (Report Generation)
└── React State Management
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

### Important Disclaimers

⚠️ **Demo Database**: Current version uses mock data for demonstration. Production deployment requires integration with official GST Portal APIs.

⚠️ **Official Verification**: Always cross-verify critical information through the official GST Portal at [www.gst.gov.in](https://www.gst.gov.in)

⚠️ **No Liability**: This tool is provided "as-is" for compliance assistance. Users are responsible for verifying all information through official channels.

---

<div align="center">

### Built by TrioMav Tech Private Limited - Innovations Division

**Making GST Compliance Accessible, Transparent, and Secure**

[![GitHub](https://img.shields.io/badge/GitHub-TaxGrid-blue?style=for-the-badge&logo=github)](https://github.com/sathvikmallepalli-lgtm/TAXGRID)
[![Contact](https://img.shields.io/badge/Contact-support@triomavtech.com-green?style=for-the-badge&logo=gmail)](mailto:support@triomavtech.com)

---

*Developed with precision for India's digital tax ecosystem*

</div>
