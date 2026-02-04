import GSTINValidator from './GSTINValidator';
import ReceiptScanner from './ReceiptScanner';
import { Info, MapPin, Search, FileCheck, Shield, TrendingUp, CheckCircle, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEST_GSTINS, FRAUD_STATISTICS } from '../utils/appData';

export default function Home() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="relative z-10">



          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Tax Compliance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Reimagined.</span>
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            The advanced platform for GSTIN verification, fraud detection, and automated audit trails.
            Protect your business from fake invoices and ITC fraud.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Database
            </Link>
            <Link to="/audit-shield" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Try Audit Shield
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/search" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Search</h3>
          <p className="text-slate-600 text-sm">Find businesses by name, keyword, or GSTIN instantly.</p>
        </Link>

        <Link to="/gi-verification" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-orange-300 transition-all">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">GI Verification</h3>
          <p className="text-slate-600 text-sm">Verify Geographical Indication products to detect counterfeit goods.</p>
        </Link>

        <Link to="/audit-shield" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Audit Shield</h3>
          <p className="text-slate-600 text-sm">AI-powered invoice auditing and PDF report generation.</p>
        </Link>

        <div className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Scan className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">OCR Scanning</h3>
          <p className="text-slate-600 text-sm">Extract data from receipts automatically (embedded below).</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-slate-900 mb-1">{FRAUD_STATISTICS.totalFraud}</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Nationwide GST Fraud</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900 mb-1">{FRAUD_STATISTICS.fakeFirmsDetected}</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Fake Firms (Official Data)</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900 mb-1">100%</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Secure (Client-Side)</p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <div className="space-y-12">
        {/* GSTIN Validator */}
        <div className="scroll-mt-24" id="validator">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">Instant GSTIN Validator</h2>
          </div>
          <GSTINValidator />
        </div>

        {/* Receipt Scanner */}
        <div className="scroll-mt-24" id="scanner">
          <div className="flex items-center gap-3 mb-6">
            <Scan className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Quick Receipt OCR</h2>
          </div>
          <ReceiptScanner />
        </div>
      </div>

      {/* Sample GSTINs */}
      <section className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          🧪 Test Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEST_GSTINS.slice(0, 4).map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"> // Reduced slice to 4 for cleaner look
              <p className="text-xs font-mono text-slate-500 mb-1">{item.gstin}</p>
              <p className="font-semibold text-slate-900">{item.company}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
