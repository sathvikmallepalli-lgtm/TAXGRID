# TaxGrid 🛡️

![TaxGrid Banner](public/assets/taxgrid-banner.png)

<div align="center">

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

### Tax Compliance Reimagined.
**The advanced platform for GSTIN verification, fraud detection, and automated audit trails.**

[Live Demo](http://localhost:5173) | [Report Bug](https://github.com/sathvikmallepalli-lgtm/TAXGRID/issues) | [Request Feature](https://github.com/sathvikmallepalli-lgtm/TAXGRID/issues)

</div>

---

## 🚀 Overview

**TaxGrid** is a state-of-the-art privacy-first financial tool designed to protect businesses and individuals from GST fraud. It empowers users to verify GSTINs instantly, detect fake invoices via OCR, and audit geographical indication (GI) products for authenticity—all on the client side.

> "A fraud-free GST ecosystem where every transaction is verifiable and every consumer is protected."

---

## ✨ Key Features

### 🛡️ Instant GSTIN Validator
- Validate GSTIN format, checksum (Mod 36), and state code instantly.
- Cross-reference with our mock database for "Active" or "Suspended" status.
- **Privacy First**: All validation happens locally in your browser.

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

- **Frontend**: React 18, Vite
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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to see the app in action.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ for a safer economy.</p>
</div>
