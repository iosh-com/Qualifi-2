import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'footer' | 'certificate';
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showSubtitle = true,
  size = 'md'
}) => {
  const isLight = variant === 'light';
  const isCert = variant === 'certificate';

  const globeSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="institute-logo">
      {/* 3D-styled Multi-Layered Security Globe Emblem */}
      <div className={`relative ${globeSize} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Outer Glow / Ring */}
          <circle cx="50" cy="50" r="46" stroke={isLight ? '#60A5FA' : '#1456A0'} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Primary Top Arc - Safety Emerald Green */}
          <path d="M 50,8 A 42,42 0 0,1 86,30" stroke="#7CB342" strokeWidth="7" strokeLinecap="round" />
          
          {/* Upper Middle Arc - Deep Cyan */}
          <path d="M 18,30 A 42,42 0 0,1 78,16" stroke="#00838F" strokeWidth="6.5" strokeLinecap="round" />
          
          {/* Central Orbit - Safety Royal Blue */}
          <path d="M 10,48 A 42,42 0 0,1 68,26" stroke="#1456A0" strokeWidth="7" strokeLinecap="round" />
          
          {/* Lower Arc - Safety Amber / Gold */}
          <path d="M 12,64 A 42,42 0 0,1 55,42" stroke="#E5A93C" strokeWidth="6" strokeLinecap="round" />
          
          {/* Lower Arc - Safety Orange/Red */}
          <path d="M 18,78 A 42,42 0 0,1 48,58" stroke="#E53935" strokeWidth="6.5" strokeLinecap="round" />
          
          {/* Base Foundation Arc - Spring Green */}
          <path d="M 28,90 A 42,42 0 0,1 38,72" stroke="#8BC34A" strokeWidth="6" strokeLinecap="round" />

          {/* Core Sphere / Shield Overlay */}
          <circle cx="58" cy="48" r="28" fill={isLight ? '#0B1F3A' : '#FFFFFF'} stroke={isLight ? '#D6A84F' : '#1456A0'} strokeWidth="1.5" />
          
          {/* Central HSE Cross / Star Check */}
          <path 
            d="M58 35 V61 M45 48 H71" 
            stroke={isLight ? '#60A5FA' : '#1456A0'} 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <circle cx="58" cy="48" r="4" fill="#D6A84F" />
        </svg>
      </div>

      {/* Brand Text Hierarchy */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-wider ${titleSize} ${
              isLight ? 'text-white' : 'text-[#0B1F3A]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.08em' }}
          >
            QUALIFI
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-[#D6A84F]" />
        </div>
        
        {showSubtitle && (
          <span
            className={`font-bold uppercase tracking-wider mt-0.5 ${subSize} ${
              isLight ? 'text-blue-200' : isCert ? 'text-[#0B1F3A]' : 'text-slate-600'
            }`}
            style={{ letterSpacing: '0.08em' }}
          >
            Safety | Health | Environment
          </span>
        )}
      </div>
    </div>
  );
};
