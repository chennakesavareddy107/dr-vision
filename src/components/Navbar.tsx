import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Search, ArrowRight, LayoutDashboard, UserCheck, X } from 'lucide-react';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenDashboard?: (initialTab?: string) => void;
  onOpenAuth?: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  onOpenDashboard,
  onOpenAuth,
  activeSection = 'home',
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Prediction', id: 'prediction' },
    { label: 'Grad-CAM', id: 'grad-cam' },
    { label: 'Performance', id: 'performance' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs" id="dr-vision-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo onClick={() => handleNavClick('home')} />

        {/* Navigation links matching Reference Image 1 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`nav-link-${item.id}`}
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#0B1B3B] font-semibold'
                    : 'text-slate-600 hover:text-[#0B1B3B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-300 w-56 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search disease, lesions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 focus:outline-none w-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && onOpenDashboard) {
                      onOpenDashboard('patients');
                      setSearchOpen(false);
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                id="navbar-search-btn"
                className="p-2 text-slate-600 hover:text-[#0B1B3B] hover:bg-slate-100 rounded-full transition-colors"
                title="Search platform"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Doctor Portal / Login button */}
          <button
            onClick={onOpenAuth}
            id="navbar-auth-btn"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0B1B3B] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Doctor Portal</span>
          </button>

          {/* Clinical Workspace Dashboard link */}
          <button
            onClick={() => onOpenDashboard && onOpenDashboard('dashboard')}
            id="navbar-dashboard-btn"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#2563EB] px-3 py-2 rounded-lg hover:bg-blue-50/50 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Clinical Workspace</span>
          </button>

          {/* Primary CTA button matching Reference Image 1 */}
          <button
            onClick={() => onOpenDashboard ? onOpenDashboard('upload') : handleNavClick('prediction')}
            id="navbar-start-diagnosis-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer"
          >
            <span>Start Diagnosis</span>
            <ArrowRight className="w-4 h-4 text-blue-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
