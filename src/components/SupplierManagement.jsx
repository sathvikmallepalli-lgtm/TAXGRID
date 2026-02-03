import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { validateGSTIN } from '../utils/validateGSTIN';
import { authService } from '../utils/authService';

export default function SupplierManagement({ user, suppliers, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    gstin: '',
    contact: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleVerifyGSTIN = () => {
    if (!newSupplier.gstin) {
      setVerificationResult({ valid: false, error: 'Please enter GSTIN' });
      return;
    }

    const result = validateGSTIN(newSupplier.gstin);
    setVerificationResult(result);
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.gstin) {
      alert('Please fill in all required fields');
      return;
    }

    if (!verificationResult || !verificationResult.valid) {
      alert('Please verify GSTIN first');
      return;
    }

    const supplier = {
      name: newSupplier.name,
      gstin: newSupplier.gstin,
      contact: newSupplier.contact,
      gstinValid: verificationResult.valid,
      legalName: verificationResult.legalName,
      tradeName: verificationResult.tradeName,
      category: verificationResult.category,
      state: verificationResult.stateName,
      stateCode: verificationResult.stateCode
    };

    const result = authService.addSupplier(user.id, supplier);

    if (result.success) {
      // Check if it's a potentially risky supplier
      if (verificationResult.legalName === 'Not found in database') {
        authService.addRiskAlert(user.id, {
          type: 'warning',
          supplierId: result.user.suppliers[result.user.suppliers.length - 1].id,
          supplierName: newSupplier.name,
          message: `Supplier "${newSupplier.name}" GSTIN not found in our database. Verify manually on GST portal.`,
          severity: 'medium'
        });
      }

      // Reset form
      setNewSupplier({ name: '', gstin: '', contact: '' });
      setVerificationResult(null);
      setShowAddForm(false);
    }
  };

  const handleRemoveSupplier = (supplierId, supplierName) => {
    if (confirm(`Remove supplier "${supplierName}"?`)) {
      authService.removeSupplier(user.id, supplierId);
    }
  };

  const handleReVerifySupplier = (supplier) => {
    const result = validateGSTIN(supplier.gstin);

    if (!result.valid) {
      // GSTIN became invalid - create risk alert
      authService.addRiskAlert(user.id, {
        type: 'danger',
        supplierId: supplier.id,
        supplierName: supplier.name,
        message: `ALERT: Supplier "${supplier.name}" GSTIN (${supplier.gstin}) is now INVALID! Check immediately.`,
        severity: 'high'
      });
    }

    alert(result.valid ? 'GSTIN still valid ✓' : 'GSTIN is now INVALID! ⚠️');
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      {/* Add Supplier Form */}
      {showAddForm && (
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Supplier</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name *
              </label>
              <input
                type="text"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                placeholder="ABC Traders Pvt Ltd"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact
              </label>
              <input
                type="text"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                placeholder="contact@supplier.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier GSTIN *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSupplier.gstin}
                onChange={(e) => setNewSupplier({ ...newSupplier, gstin: e.target.value.toUpperCase() })}
                placeholder="27AAPFU0939F1ZV"
                maxLength={15}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono"
              />
              <button
                onClick={handleVerifyGSTIN}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Verify
              </button>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`p-4 rounded-lg mb-4 ${
              verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.valid ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold mb-2 ${verificationResult.valid ? 'text-green-900' : 'text-red-900'}`}>
                    {verificationResult.valid ? '✓ Valid GSTIN' : '✗ Invalid GSTIN'}
                  </p>
                  {verificationResult.valid ? (
                    <div className="text-sm text-green-800 space-y-1">
                      <p><span className="font-medium">Legal Name:</span> {verificationResult.legalName}</p>
                      <p><span className="font-medium">Trade Name:</span> {verificationResult.tradeName}</p>
                      <p><span className="font-medium">Category:</span> {verificationResult.category}</p>
                      <p><span className="font-medium">State:</span> {verificationResult.stateName}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-800">{verificationResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddSupplier}
              disabled={!verificationResult || !verificationResult.valid}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Supplier
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSupplier({ name: '', gstin: '', contact: '' });
                setVerificationResult(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Suppliers List */}
      <div className="space-y-4">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No suppliers added yet</p>
            <p className="text-sm text-gray-500 mt-2">Click "Add Supplier" to get started</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                    {supplier.gstinValid ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Invalid
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">GSTIN</p>
                      <p className="font-mono font-semibold text-gray-900">{supplier.gstin}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Legal Name</p>
                      <p className="font-semibold text-gray-900">{supplier.legalName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900">{supplier.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">State</p>
                      <p className="font-semibold text-gray-900">{supplier.state}</p>
                    </div>
                  </div>

                  {supplier.contact && (
                    <p className="text-sm text-gray-600 mt-2">Contact: {supplier.contact}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(supplier.addedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleReVerifySupplier(supplier)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Re-verify GSTIN"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveSupplier(supplier.id, supplier.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove supplier"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
