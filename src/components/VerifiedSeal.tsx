import React from 'react';

interface VerifiedSealProps {
  certificateNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedSeal: React.FC<VerifiedSealProps> = ({
  size = 'md',
  className = ''
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  // Generate 42 scalloped teeth points for the authentic circular stamp edge
  const numTeeth = 42;
  const cx = 120;
  const cy = 120;
  const outerR = 114;
  const innerR = 107;
  
  let pathD = '';
  for (let i = 0; i < numTeeth; i++) {
    const angle1 = (i * 2 * Math.PI) / numTeeth;
    const angle2 = ((i + 0.5) * 2 * Math.PI) / numTeeth;
    const angle3 = ((i + 1) * 2 * Math.PI) / numTeeth;

    const x1 = cx + innerR * Math.cos(angle1);
    const y1 = cy + innerR * Math.sin(angle1);
    const xPeak = cx + outerR * Math.cos(angle2);
    const yPeak = cy + outerR * Math.sin(angle2);
    const x2 = cx + innerR * Math.cos(angle3);
    const y2 = cy + innerR * Math.sin(angle3);

    if (i === 0) {
      pathD += `M ${x1} ${y1} Q ${xPeak} ${yPeak} ${x2} ${y2}`;
    } else {
      pathD += ` Q ${xPeak} ${yPeak} ${x2} ${y2}`;
    }
  }
  pathD += ' Z';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Official Verified Blue & White Stamp Seal */}
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 240 240" 
          className={`${isLarge ? 'w-44 h-44' : isSmall ? 'w-20 h-20' : 'w-32 h-32'} drop-shadow-md`}
          aria-label="Official Verified Security Stamp"
        >
          <defs>
            {/* Top Text Curve */}
            <path
              id="stampArcTop"
              d="M 38,120 A 82,82 0 1,1 202,120"
              fill="none"
            />
            {/* Bottom Text Curve */}
            <path
              id="stampArcBottom"
              d="M 202,120 A 82,82 0 0,1 38,120"
              fill="none"
            />
          </defs>

          {/* 1. Scalloped Serrated Outer Star Rim in Rich Deep Blue */}
          <path d={pathD} fill="#0A4D7E" />

          {/* 2. Concentric White Gap Ring */}
          <circle cx="120" cy="120" r="103" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* 3. Deep Blue Solid Disc */}
          <circle cx="120" cy="120" r="99" fill="#0A4D7E" />

          {/* 4. Fine White Stitched Dashed Ring */}
          <circle cx="120" cy="120" r="91" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3.5 2.5" />

          {/* 5. Inner Thin White Border */}
          <circle cx="120" cy="120" r="69" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* 6. Top Arc Text: ★ ★ ★ VERIFIED ★ ★ ★ */}
          <text fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="2.5" textAnchor="middle">
            <textPath href="#stampArcTop" startOffset="50%">
              ★ ★ ★  VERIFIED  ★ ★ ★
            </textPath>
          </text>

          {/* 7. Bottom Arc Text: ★ ★ ★ VERIFIED ★ ★ ★ */}
          <text fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="2.5" textAnchor="middle">
            <textPath href="#stampArcBottom" startOffset="50%">
              ★ ★ ★  VERIFIED  ★ ★ ★
            </textPath>
          </text>

          {/* 8. Upper Center Star */}
          <path
            d="M 120,70 L 122.5,76 L 129,76.5 L 124,80.5 L 125.5,87 L 120,83 L 114.5,87 L 116,80.5 L 111,76.5 L 117.5,76 Z"
            fill="#FFFFFF"
          />

          {/* 9. Lower Center Star */}
          <path
            d="M 120,153 L 122.5,159 L 129,159.5 L 124,163.5 L 125.5,170 L 120,166 L 114.5,170 L 116,163.5 L 111,159.5 L 117.5,159 Z"
            fill="#FFFFFF"
          />

          {/* 10. Horizontal Middle Banner Bar (Deep Blue with White Double Border) */}
          {/* Banner Drop Shadow / Outline */}
          <rect 
            x="36" 
            y="102" 
            width="168" 
            height="36" 
            rx="6" 
            fill="#0A4D7E" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
          />
          {/* Inner Banner Line */}
          <rect 
            x="39" 
            y="105" 
            width="162" 
            height="30" 
            rx="4" 
            fill="#0A4D7E" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="1" 
          />

          {/* 11. Large Bold White "VERIFIED" Banner Text */}
          <text 
            x="120" 
            y="126" 
            fill="#FFFFFF" 
            fontSize="21" 
            fontWeight="900" 
            fontFamily="Arial, Helvetica, sans-serif" 
            letterSpacing="3" 
            textAnchor="middle"
          >
            VERIFIED
          </text>
        </svg>
      </div>

      {/* Official Status Under Badge */}
      <div className="mt-2 space-y-0.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A4D7E]/10 text-[#0A4D7E] border border-[#0A4D7E]/30 text-xs font-extrabold tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-[#0A4D7E]" />
          <span>OFFICIALLY VERIFIED & AUTHENTIC</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-700 block">
          Qualifi Central Registry • United Kingdom
        </p>
      </div>
    </div>
  );
};

