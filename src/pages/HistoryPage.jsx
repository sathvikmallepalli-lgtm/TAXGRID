import { useState, useEffect } from 'react';
import { getAllInvoices, searchInvoices, filterInvoices, sortInvoices, deleteInvoice, bulkDeleteInvoices } from '../utils/invoiceDB';
import { exportToCSV, exportToJSON } from '../utils/exportData';
import {
  History, Search, Filter, Download, Trash2, CheckSquare, Square,
  SortAsc, SortDesc, Calendar, DollarSign, Shield, Database, X
} from 'lucide-react';

export default function HistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    riskLevels: [],
    verificationStatus: null,
    minAmount: null,
    maxAmount: null
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [invoices, searchQuery, filters, sortBy, sortOrder]);

  const loadInvoices = async () => {
    try {
      const allInvoices = await getAllInvoices();
      setInvoices(allInvoices);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = async () => {
    let results = invoices;

    // Apply search
    if (searchQuery.trim()) {
      results = results.filter(inv => {
        const search = searchQuery.toLowerCase();
        return (
          inv.extractedData?.vendor?.toLowerCase().includes(search) ||
          inv.extractedData?.gstin?.toLowerCase().includes(search) ||
          inv.portalData?.legalName?.toLowerCase().includes(search) ||
          inv.category?.toLowerCase().includes(search)
        );
      });
    }

    // Apply filters
    if (filters.riskLevels.length > 0) {
      results = results.filter(inv => filters.riskLevels.includes(inv.risk?.level));
    }

    if (filters.verificationStatus) {
      results = results.filter(inv => {
        if (filters.verificationStatus === 'valid') return inv.validationResult?.isValid;
        if (filters.verificationStatus === 'invalid') return !inv.validationResult?.isValid && inv.extractedData?.gstin;
        if (filters.verificationStatus === 'no_gstin') return !inv.extractedData?.gstin;
        return true;
      });
    }

    if (filters.minAmount !== null && filters.minAmount !== '') {
      results = results.filter(inv => (inv.extractedData?.amount || 0) >= parseFloat(filters.minAmount));
    }

    if (filters.maxAmount !== null && filters.maxAmount !== '') {
      results = results.filter(inv => (inv.extractedData?.amount || 0) <= parseFloat(filters.maxAmount));
    }

    // Apply sorting
    results = sortInvoices(results, sortBy, sortOrder);

    setFilteredInvoices(results);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(`Delete ${selectedIds.length} invoice(s)?`);
    if (!confirmed) return;

    try {
      await bulkDeleteInvoices(selectedIds);
      await loadInvoices();
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to delete invoices:', error);
      alert('Failed to delete some invoices');
    }
  };

  const handleExportSelected = (format) => {
    const selected = invoices.filter(inv => selectedIds.includes(inv.id));
    if (selected.length === 0) {
      alert('No invoices selected');
      return;
    }

    if (format === 'csv') {
      exportToCSV(selected, `taxgrid-selected-${new Date().toISOString().split('T')[0]}`);
    } else if (format === 'json') {
      exportToJSON(selected, `taxgrid-selected-${new Date().toISOString().split('T')[0]}`);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'riskLevels') {
        const current = prev.riskLevels;
        return {
          ...prev,
          riskLevels: current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      riskLevels: [],
      verificationStatus: null,
      minAmount: null,
      maxAmount: null
    });
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Database className="w-8 h-8 text-primary animate-pulse mr-3" />
          <p className="text-gray-600">Loading invoice history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">Invoice History</h1>
        </div>
        <p className="text-gray-600 text-lg">
          View and manage all scanned invoices
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vendor, GSTIN, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* Clear */}
          {(filters.riskLevels.length > 0 || filters.verificationStatus || searchQuery) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <div className="space-y-2">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.riskLevels.includes(level)}
                      onChange={() => toggleFilter('riskLevels', level)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
              <select
                value={filters.verificationStatus || ''}
                onChange={(e) => toggleFilter('verificationStatus', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">All</option>
                <option value="valid">Valid GSTIN</option>
                <option value="invalid">Invalid GSTIN</option>
                <option value="no_gstin">No GSTIN</option>
              </select>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minAmount || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxAmount || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="font-medium text-blue-900">
            {selectedIds.length} invoice{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportSelected('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExportSelected('json')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredInvoices.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="uploadedAt">Upload Date</option>
            <option value="date">Invoice Date</option>
            <option value="amount">Amount</option>
            <option value="risk">Risk Level</option>
            <option value="vendor">Vendor</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      {filteredInvoices.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <button onClick={handleSelectAll} className="hover:bg-gray-100 p-1 rounded">
                      {selectedIds.length === filteredInvoices.length ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Vendor</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">GSTIN</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-700">Amount</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Risk</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleSelectOne(invoice.id)}
                        className="hover:bg-gray-100 p-1 rounded"
                      >
                        {selectedIds.includes(invoice.id) ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {invoice.extractedData?.date || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {invoice.extractedData?.vendor || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-700">
                      {invoice.extractedData?.gstin || '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-mono text-gray-900">
                      ₹{invoice.extractedData?.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {invoice.risk?.level && (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskClass(invoice.risk.level)}`}>
                          {invoice.risk.level}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {invoice.validationResult?.isValid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Valid
                        </span>
                      ) : invoice.extractedData?.gstin ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          Invalid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                          No GSTIN
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {invoice.category || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {searchQuery || filters.riskLevels.length > 0
              ? 'Try adjusting your search or filters'
              : 'Start scanning invoices to build your history'}
          </p>
        </div>
      )}
    </div>
  );
}

function getRiskClass(risk) {
  const classes = {
    'LOW': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'CRITICAL': 'bg-red-100 text-red-800'
  };
  return classes[risk] || 'bg-gray-100 text-gray-800';
}
