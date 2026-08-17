import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Lock, Sparkles } from 'lucide-react';

interface VerifiedSealProps {
  certificateNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedSeal: React.FC<VerifiedSealProps> = ({
  certificateNumber,
  size = 'md',
  className = ''
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* High-Definition Official Verified SVG Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse pointer-events-none" />

        {/* Master Scalable SVG Seal */}
        <svg 
          viewBox="0 0 240 240" 
          className={`${isLarge ? 'w-48 h-48' : isSmall ? 'w-24 h-24' : 'w-36 h-36'} drop-shadow-lg`}
          aria-label="Officially Verified Security Seal"
        >
          <defs>
            {/* Outer Gold Gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="30%" stopColor="#D6A84F" />
              <stop offset="70%" stopColor="#9A7424" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            {/* Emerald Center Gradient */}
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Navy Outer Ring Gradient */}
            <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1F3A" />
              <stop offset="100%" stopColor="#1456A0" />
            </linearGradient>

            {/* Circular Path for Text */}
            <path
              id="textCircleTop"
              d="M 30,120 A 90,90 0 1,1 210,120"
              fill="none"
            />
            <path
              id="textCircleBottom"
              d="M 210,120 A 90,90 0 0,1 30,120"
              fill="none"
            />
          </defs>

          {/* Outer Sunburst / Rosette Star Border (24 points) */}
          <circle cx="120" cy="120" r="114" fill="url(#goldGradient)" />
          
          {/* Scalloped Edge Trim */}
          <circle cx="120" cy="120" r="110" fill="#0B1F3A" stroke="url(#goldGradient)" strokeWidth="3" />
          
          {/* Micro Security Bead Ring */}
          <circle cx="120" cy="120" r="102" fill="none" stroke="#D6A84F" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Outer Circular Curved Text: QUALIFI TRAINING CENTRE */}
          <text fill="#FFFFFF" fontSize="10.5" fontWeight="800" letterSpacing="2.5" textAnchor="middle">
            <textPath href="#textCircleTop" startOffset="50%">
              QUALIFI HEALTH & SAFETY
            </textPath>
          </text>

          {/* Bottom Circular Curved Text: UNITED KINGDOM */}
          <text fill="#D6A84F" fontSize="9.5" fontWeight="800" letterSpacing="3" textAnchor="middle">
            <textPath href="#textCircleBottom" startOffset="50%">
              ★ OFFICIAL REGISTRY ★
            </textPath>
          </text>

          {/* Inner Gold Ring */}
          <circle cx="120" cy="120" r="76" fill="url(#goldGradient)" stroke="#0B1F3A" strokeWidth="2" />
          
          {/* Core Emerald Shield Circle */}
          <circle cx="120" cy="120" r="70" fill="url(#emeraldGradient)" />

          {/* Guilloche Fine Security Lines inside core */}
          <circle cx="120" cy="120" r="62" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="120" cy="120" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 2" />

          {/* Central Heraldic Shield Icon */}
          <path
            d="M120 72 L148 84 V120 C148 140 136 156 120 164 C104 156 92 140 92 120 V84 Z"
            fill="#064E3B"
            stroke="url(#goldGradient)"
            strokeWidth="3"
          />

          {/* Bold White Heavy Checkmark */}
          <path
            d="M106 118 L116 128 L136 104"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Little Stars inside Shield */}
          <circle cx="120" cy="88" r="2.5" fill="#D6A84F" />

          {/* Ribbon / Banner Across Bottom */}
          <g transform="translate(0, 16)">
            {/* Banner Tails */}
            <path d="M 28 178 L 48 164 L 48 190 Z" fill="#9A7424" />
            <path d="M 212 178 L 192 164 L 192 190 Z" fill="#9A7424" />
            
            {/* Main Banner Rect */}
            <rect x="42" y="162" width="156" height="26" rx="4" fill="url(#navyGradient)" stroke="url(#goldGradient)" strokeWidth="2" />
            
            {/* Banner Text */}
            <text x="120" y="179" fill="#FFFFFF" fontSize="11" fontWeight="900" letterSpacing="1.8" textAnchor="middle">
              VERIFIED
            </text>
          </g>
        </svg>
      </div>

      {/* Official Status Labels under Seal */}
      <div className="mt-2 space-y-0.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold tracking-wide uppercase">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>OFFICIALLY VERIFIED & AUTHENTIC</span>
        </div>
        <p className="text-[11px] font-medium text-slate-600 block">
          Qualifi Central Registry • United Kingdom
        </p>
      </div>
    </div>
  );
};
