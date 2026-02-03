import { Shield, Home, Info, Wrench, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="w-full bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">TaxGrid</h1>
              <p className="text-sm text-blue-100">
                Validate GST. Scan Receipts. Stay Protected.
              </p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-primary-dark text-white hover:bg-white/10 hover:text-white"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              to="/tools"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-primary-dark text-white hover:bg-white/10 hover:text-white"
            >
              <Wrench className="w-5 h-5" />
              Tools
            </Link>
            <Link
              to="/search"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-primary-dark text-white hover:bg-white/10 hover:text-white"
            >
              <Search className="w-5 h-5" />
              Search
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-primary-dark text-white hover:bg-white/10 hover:text-white"
            >
              <Info className="w-5 h-5" />
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
