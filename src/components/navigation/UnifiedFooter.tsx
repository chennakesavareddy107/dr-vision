import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { SitePage } from '../../types';
import { ArrowRight, Linkedin, Github, Twitter, Youtube } from 'lucide-react';

interface UnifiedFooterProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const UnifiedFooter: React.FC<UnifiedFooterProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  const navLinks: { label: string; page: SitePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Prediction', page: 'prediction' },
    { label: 'Grad-CAM', page: 'grad-cam' },
    { label: 'Performance', page: 'performance' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 py-10" id="unified-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/80">
          
          {/* Logo on Left */}
          <div className="flex items-center">
            <BrandLogo size="md" onClick={() => onNavigatePage('home')} />
          </div>

          {/* Navigation Links in Center */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigatePage(item.page)}
                className="hover:text-[#0B1B3B] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Social Icons + Try Demo Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-slate-700">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onLaunchDemo}
              id="footer-open-workspace-cta"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer group"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DR Vision. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-300">|</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-800 transition-colors">
              Terms of Use
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">Research Use Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
