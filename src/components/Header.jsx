import { Shield, Home, Info, Wrench, Search, CheckSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ currentPage, onNavigate }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">TaxGrid</h1>
              <p className="text-sm text-blue-100">
                Validate GST. Scan Receipts. Stay Protected.
              </p>
            </div>
          </Link>

          <nav className="flex gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden lg:inline">Home</span>
            </Link>
            <Link
              to="/validator"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/validator') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="hidden lg:inline">Validator</span>
            </Link>
            <Link
              to="/tools"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/tools') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="hidden lg:inline">Tools</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/search') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline">Search</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/about') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="hidden lg:inline">About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
