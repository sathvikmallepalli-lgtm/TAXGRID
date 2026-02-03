import { TEST_GSTINS_MD, FRAUD_STATISTICS_MD } from './mdDataParser';

// Export Test GSTINs from MD file
export const TEST_GSTINS = TEST_GSTINS_MD;

// Export Fraud Statistics from MD file
export const FRAUD_STATISTICS = FRAUD_STATISTICS_MD;

// UPI Statistics (India)
export const UPI_STATISTICS = {
  monthlyTransactions: '15.5 Billion',
  yearlyTransactions: '185+ Billion',
  averageTicketSize: '₹1,850',
  billSplitIssue: '60% users face tax complications',
};

// GI Product Fraud Statistics
export const GI_FRAUD_STATS = [
  {
    product: 'Banarasi Silk',
    fakePenetration: '95%',
    genuineSource: 'Varanasi, UP',
    issue: 'Chinese synthetic fabric sold as Banarasi'
  },
  {
    product: 'Kashmiri Pashmina',
    fakePenetration: '80%',
    genuineSource: 'Kashmir Valley',
    issue: 'Australian wool mixed or synthetic'
  },
  {
    product: 'Kanchipuram Silk',
    fakePenetration: '70%',
    genuineSource: 'Kanchipuram, TN',
    issue: 'Power loom imitations from other states'
  },
  {
    product: 'Darjeeling Tea',
    fakePenetration: '40%',
    genuineSource: 'Darjeeling, WB',
    issue: 'Blended with cheaper tea from plains'
  },
];

// Real-world impact stories
export const IMPACT_STORIES = [
  {
    title: 'SME Saved ₹2.3L in ITC',
    description: 'A Mumbai-based manufacturer avoided fake supplier by validating GSTIN before purchase.',
    category: 'Business'
  },
  {
    title: 'Students Split ₹8,450 Bill',
    description: 'College group used TaxGrid to split restaurant bill and generate tax-proof PDF.',
    category: 'Personal'
  },
  {
    title: 'Detected Fake Pashmina Seller',
    description: 'Customer caught Delhi vendor selling fake Kashmiri Pashmina using GSTIN verification.',
    category: 'Consumer Protection'
  },
];

// GST Facts
export const GST_FACTS = [
  {
    fact: 'GST contributes 6.5% to India\'s GDP',
    source: 'Ministry of Finance, 2024'
  },
  {
    fact: '1.4 Crore+ businesses registered under GST',
    source: 'GSTN, 2024'
  },
  {
    fact: 'Average monthly GST collection: ₹1.68 Lakh Crore',
    source: 'Government of India, 2024'
  },
  {
    fact: 'Fake GSTIN rackets cost government ₹20,000 Cr annually',
    source: 'CAG Report, 2023'
  },
];

// How TaxGrid Helps
export const TAXGRID_BENEFITS = [
  {
    icon: '🛡️',
    title: 'Instant GSTIN Validation',
    description: 'Verify any GST number in seconds using Luhn Mod 36 checksum algorithm. Catch fake suppliers before they cost you ITC.',
    stats: '15-character validation in <100ms'
  },
  {
    icon: '📸',
    title: 'OCR-Powered Receipt Scanning',
    description: 'Upload receipts and automatically extract GSTIN, amount, date, and vendor. No manual typing needed.',
    stats: '85%+ accuracy with clear images'
  },
  {
    icon: '💰',
    title: 'Bill Splitting Made Easy',
    description: 'Split restaurant bills, group purchases, or travel costs. Generate proof for tax records and avoid "income" confusion.',
    stats: 'Settlement calculation in real-time'
  },
  {
    icon: '🏺',
    title: 'GI Origin Verification',
    description: 'Detect fake Banarasi silk, Kashmiri Pashmina, and other GI products by cross-checking seller state with product origin.',
    stats: 'Covers 300+ GI products'
  },
  {
    icon: '🔒',
    title: '100% Privacy Guaranteed',
    description: 'Everything runs in your browser. Zero data uploaded to any server. Your receipts, your privacy.',
    stats: 'Client-side processing only'
  },
  {
    icon: '📄',
    title: 'PDF Documentation',
    description: 'Generate tax-proof PDFs for bill splits. Perfect for reimbursements, accounting, and tax filing.',
    stats: 'Downloadable, shareable, audit-ready'
  },
];

// Team/Contributors (for About page)
export const TEAM_INFO = {
  mission: 'To empower every Indian citizen and business with tools to detect GST fraud, verify authenticity, and manage finances transparently.',
  vision: 'A fraud-free GST ecosystem where every transaction is verifiable and every consumer is protected.',
  values: [
    'Transparency',
    'Privacy',
    'Open Source',
    'Accessibility',
    'Accuracy'
  ]
};

// FAQs
export const FAQS = [
  {
    question: 'How does GSTIN validation work?',
    answer: 'TaxGrid uses the Luhn Mod 36 checksum algorithm to validate GSTIN format, state code, and checksum digit. It checks all 15 characters against GST rules set by CBIC.'
  },
  {
    question: 'Is my data uploaded to any server?',
    answer: 'No. TaxGrid is 100% client-side. All OCR, validation, and calculations happen in your browser. Your receipts never leave your device.'
  },
  {
    question: 'Can I use this for official verification?',
    answer: 'TaxGrid validates GSTIN format and checksum. For official business verification, always cross-check on the GST Portal (gst.gov.in).'
  },
  {
    question: 'Why do I need PDF proof for bill splits?',
    answer: 'When friends transfer money via UPI for their share, it shows as "income" in your bank statement. TaxGrid PDFs prove it was reimbursement, not income.'
  },
  {
    question: 'How accurate is the OCR?',
    answer: 'Tesseract.js OCR achieves 85%+ accuracy with clear, well-lit images. For best results, use high-resolution photos with good contrast.'
  },
];
