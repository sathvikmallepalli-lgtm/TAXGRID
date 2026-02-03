import { useState, useRef, useEffect } from 'react';
import { Search, Building2, MapPin, FileText, AlertCircle } from 'lucide-react';
import { searchByKeyword, getFilingStatusDetails, getStatusBadge } from '../utils/mockGSTPortal';
import { validateGSTIN } from '../utils/validateGSTIN';
import ValidationResult from '../components/ValidationResult';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGstin, setSelectedGstin] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const validationRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    setSelectedGstin(null);
    setValidationResult(null);

    // Simulate search delay
    setTimeout(() => {
      const results = searchByKeyword(searchTerm);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleSelectGstin = (gstin) => {
    setSelectedGstin(gstin);
    const result = validateGSTIN(gstin.gstin);
    setValidationResult(result);
  };

  // Auto-scroll to validation result when a GSTIN is selected
  useEffect(() => {
    if (selectedGstin && validationRef.current) {
      setTimeout(() => {
        validationRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedGstin]);

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedGstin(null);
    setValidationResult(null);
  };

  const getFilingStatusBadge = (filingStatus) => {
    const colors = {
      'GREEN': 'bg-green-100 text-green-800 border-green-300',
      'YELLOW': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'RED': 'bg-red-100 text-red-800 border-red-300',
      'CANCELLED': 'bg-gray-100 text-gray-800 border-gray-300',
      'SUSPENDED': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[filingStatus] || colors['GREEN'];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GSTIN Search</h1>
        <p className="text-gray-600">
          Search for businesses by GSTIN, name, keywords, or state
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by GSTIN, business name, keywords, or state..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || searchTerm.trim().length < 2}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {searchResults.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Try: "kashmir", "27AABCU", "cement", "bangalore", "tea"
        </p>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && !selectedGstin && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelectGstin(result)}
                className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-primary cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-gray-900">{result.tradeName}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${getFilingStatusBadge(result.filingStatus)}`}>
                    {getFilingStatusDetails(result.filingStatus).icon} {result.filingStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{result.legalName}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-gray-700">{result.gstin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{result.stateName} ({result.stateCode})</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {result.keywords?.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    👆 Click to view full details
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchTerm && !isSearching && !selectedGstin && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500">
            Try searching with different keywords or GSTIN
          </p>
        </div>
      )}

      {/* Validation Result */}
      {selectedGstin && validationResult && (
        <div ref={validationRef} className="space-y-6 scroll-mt-8">
          <button
            onClick={handleClear}
            className="text-primary hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Back to search results
          </button>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Details</h2>

            {/* Full Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Legal Name</p>
                <p className="font-semibold text-gray-900">{selectedGstin.legalName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Trade Name</p>
                <p className="font-semibold text-gray-900">{selectedGstin.tradeName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">GSTIN</p>
                <p className="font-mono font-semibold text-gray-900">{selectedGstin.gstin}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">State</p>
                <p className="font-semibold text-gray-900">
                  {selectedGstin.stateName} ({selectedGstin.stateCode})
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-gray-900">{selectedGstin.status}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Registration Date</p>
                <p className="font-semibold text-gray-900">{selectedGstin.registrationDate}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm text-gray-900">{selectedGstin.address}</p>
            </div>

            {/* ValidationResult Component */}
            <ValidationResult result={validationResult} />
          </div>
        </div>
      )}
    </div>
  );
}
