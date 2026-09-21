import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  onClick,
}) => {
  const isLight = variant === 'light';
  
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-[0.22em]',
    lg: 'text-xs tracking-[0.25em]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      id="brand-logo-container"
    >
      {/* Ophthalmology Eye Icon with circular badge and warm amber-hazel iris */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${iconSizes[size]}`} id="brand-logo-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer circle border badge */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke={isLight ? '#475569' : '#CBD5E1'}
            strokeWidth="1.5"
            fill={isLight ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF'}
          />
          {/* Eye Almond Sclera */}
          <path
            d="M 8 24 C 14 13, 34 13, 40 24 C 34 35, 14 35, 8 24 Z"
            stroke={isLight ? '#FFFFFF' : '#0B1B3B'}
            strokeWidth="2"
            fill={isLight ? '#1E293B' : '#F8FAFC'}
          />
          {/* Iris outer circle */}
          <circle
            cx="24"
            cy="24"
            r="8.5"
            fill="url(#brandIrisGrad)"
            stroke="#78350F"
            strokeWidth="0.8"
          />
          {/* Pupil */}
          <circle
            cx="24"
            cy="24"
            r="3.8"
            fill="#090D16"
          />
          {/* Specular corneal light glint */}
          <circle
            cx="26"
            cy="22"
            r="1.3"
            fill="#FFFFFF"
          />
          <circle
            cx="22.5"
            cy="25.5"
            r="0.7"
            fill="rgba(255,255,255,0.7)"
          />
          {/* Gradients */}
          <defs>
            <radialGradient id="brandIrisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="35%" stopColor="#451A03" />
              <stop offset="65%" stopColor="#B45309" />
              <stop offset="85%" stopColor="#0F766E" />
              <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Title & Tagline */}
      <div className="flex flex-col leading-none" id="brand-logo-text">
        <span
          className={`font-serif font-bold tracking-tight ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#0B1B3B]'
          }`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          DR Vision
        </span>
        <span
          className={`uppercase font-semibold mt-1 font-sans ${taglineSizes[size]} ${
            isLight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Clearer Eyes. Brighter Tomorrows.
        </span>
      </div>
    </div>
  );
};
