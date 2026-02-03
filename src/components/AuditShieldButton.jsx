import { Link } from 'react-router-dom';
import { FileCheck } from 'lucide-react';

export default function AuditShieldButton({ invoices }) {
  // In a real app, this might pass state to the Audit Shield page via Context or URL
  // For now, it's a navigation button promoting the feature

  if (!invoices || invoices.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-emerald-900">🛡️ Protect with Audit Shield</h3>
        <p className="text-sm text-emerald-700">Get a detailed risk report for these {invoices.length} invoices.</p>
      </div>
      <Link
        to="/audit-shield"
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
      >
        <FileCheck className="w-4 h-4" />
        Generate Report
      </Link>
    </div>
  );
}
