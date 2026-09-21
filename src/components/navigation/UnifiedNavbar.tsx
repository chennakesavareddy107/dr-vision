import React, { useState } from 'react';
import { BrandLogo } from '../BrandLogo';
import { SitePage } from '../../types';
import { Search, ArrowRight, X, User, Flame } from 'lucide-react';
import { useFirebase } from '../../context/FirebaseContext';

interface UnifiedNavbarProps {
  currentPage: SitePage;
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
  onOpenAuth?: () => void;
}

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({
  currentPage,
  onNavigatePage,
  onLaunchDemo,
  onOpenAuth,
}) => {
  const { clinicianUser } = useFirebase();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const navLinks: { label: string; page: SitePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Prediction', page: 'prediction' },
    { label: 'Grad-CAM', page: 'grad-cam' },
    { label: 'Performance', page: 'performance' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs" id="unified-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <BrandLogo size="md" onClick={() => onNavigatePage('home')} />
        </div>

        {/* Center Nav Links with active blue styling & underline indicator */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigatePage(item.page)}
                id={`nav-link-${item.page}`}
                className={`py-1 relative transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'text-[#1D4ED8] font-semibold'
                    : 'text-slate-600 hover:text-[#0B1B3B]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#1D4ED8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Search & Try Demo -> */}
        <div className="flex items-center gap-3.5">
          {/* Quick Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-300 w-52 sm:w-60 shadow-inner">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search diseases, retina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 focus:outline-none w-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigatePage('prediction');
                      setSearchOpen(false);
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                id="navbar-search-btn"
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
                title="Search DR Vision"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Clinician Portal / Login Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              title="Clinician Firebase Login"
            >
              {clinicianUser ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[120px]">{clinicianUser.name?.split(' ')[0] || 'Clinician'}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clinician Sign In</span>
                </>
              )}
            </button>
          )}

          {/* Open Workspace Action */}
          <button
            onClick={onLaunchDemo}
            id="nav-open-workspace-cta"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer group active:scale-98"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>

      {/* Mobile navigation strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50/90 text-xs font-medium text-slate-600 overflow-x-auto px-2">
        {navLinks.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigatePage(item.page)}
            className={`px-2 py-1 whitespace-nowrap rounded ${
              currentPage === item.page
                ? 'text-[#1D4ED8] font-bold bg-blue-50'
                : 'hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
