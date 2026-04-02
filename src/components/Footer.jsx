import { Shield, Github, ExternalLink, Lock, FileText, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">TaxGrid</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md leading-relaxed">
              Advanced GST verification and invoice fraud detection platform.
              Built for transparency, powered by cutting-edge OCR technology,
              and designed with privacy-first architecture.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">100% Client-Side Processing</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">Zero Server Storage Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">Open Source & Auditable</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/validator" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  → GSTIN Validator
                </Link>
              </li>
              <li>
                <Link to="/audit-shield" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  → Audit Shield
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  → Business Search
                </Link>
              </li>
              <li>
                <Link to="/gi-verification" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  → GI Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About TaxGrid
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/sathvikmallepalli-lgtm/TAXGRID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.gst.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Official GST Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="mailto:support@triomavtech.com" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance & Security */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Security & Compliance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="text-white font-semibold text-sm mb-1">Data Privacy</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  No user data transmitted to external servers. All processing happens locally in your browser.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="text-white font-semibold text-sm mb-1">Secure Architecture</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Client-side processing ensures your financial documents never leave your device.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="text-white font-semibold text-sm mb-1">Open Source</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Fully transparent codebase available for audit and verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/40 rounded-lg p-5">
            <h5 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Important Disclaimer & Legal Notice
            </h5>
            <div className="text-xs text-gray-300 leading-relaxed space-y-2">
              <p>
                <strong className="text-white">TaxGrid</strong> is a verification and compliance assistance tool
                designed to help businesses and individuals identify potential GST fraud and verify GSTIN authenticity.
              </p>
              <p>
                <strong className="text-yellow-300">Demo Database Notice:</strong> This platform uses a <strong>mock
                database</strong> for demonstration purposes. The business details, filing statuses, and risk scores
                shown are for <strong>illustrative purposes only</strong> and should not be relied upon for actual
                business decisions.
              </p>
              <p>
                <strong className="text-yellow-300">Official Verification Required:</strong> For legally binding
                verification of GSTIN status, business registration details, and filing compliance, always cross-reference
                through the official{' '}
                <a
                  href="https://www.gst.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  GST Portal (www.gst.gov.in)
                </a>.
              </p>
              <p>
                <strong className="text-yellow-300">No Liability:</strong> TrioMav Tech Private Limited and the TaxGrid
                development team assume no responsibility for business decisions made based on this tool's output.
                Users are solely responsible for verifying information through official channels.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="border-t border-gray-800 pt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400 mb-1">
              © {currentYear} <strong className="text-white">TaxGrid</strong> - All Rights Reserved
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Developed by{' '}
              <strong className="text-emerald-400">TrioMav Tech Private Limited</strong>
              {' '}- Innovations Division
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
            <span className="px-3 py-1 bg-gray-800 rounded-full">React 19</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full">Vite 7</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full">Tesseract.js OCR</span>
            <span className="px-3 py-1 bg-gray-800 rounded-full">IndexedDB</span>
            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-full border border-emerald-700">
              Privacy-First Design
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
