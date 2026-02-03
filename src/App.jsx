import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import ToolsPage from './pages/ToolsPage';
import About from './components/About';
import SearchPage from './pages/SearchPage';
import GIVerificationPage from './pages/GIVerificationPage';
import AuditShieldPage from './pages/AuditShieldPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/gi-verification" element={<GIVerificationPage />} />
          <Route path="/audit-shield" element={<AuditShieldPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
