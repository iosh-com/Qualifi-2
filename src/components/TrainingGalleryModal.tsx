import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Check, 
  MessageSquare, 
  HardHat,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TrainingPhotoItem, ActivePage } from '../types';

interface TrainingGalleryModalProps {
  item: TrainingPhotoItem | null;
  allItems: TrainingPhotoItem[];
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
  onNavigateToContact?: (subjectTitle: string) => void;
}

export const TrainingGalleryModal: React.FC<TrainingGalleryModalProps> = ({
  item,
  allItems,
  onClose,
  onSelectNext,
  onSelectPrev,
  onNavigateToContact
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!item) return;
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight') {
      onSelectNext();
      setIsZoomed(false);
    } else if (e.key === 'ArrowLeft') {
      onSelectPrev();
      setIsZoomed(false);
    }
  }, [item, onClose, onSelectNext, onSelectPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  const currentIndex = allItems.findIndex(i => i.id === item.id);
  const totalCount = allItems.length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#training-${item.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div 
        id="training-gallery-lightbox-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#040C18]/90 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Animated Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#091A30] border border-white/15 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#061324] border-b border-white/10 text-white z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D6A84F]/20 text-[#D6A84F] flex items-center justify-center font-bold text-xs border border-[#D6A84F]/40">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#D6A84F] uppercase block">
                  QUALIFI WORKSHOP SHOWCASE • {currentIndex + 1} OF {totalCount}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Zoom toggle button */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                title={isZoomed ? "Reset Zoom" : "Zoom In"}
              >
                {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Share/Copy link button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs"
                title="Share training module"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: High-Res Interactive Image Frame */}
            <div className="lg:col-span-7 bg-black/70 relative flex items-center justify-center min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] overflow-hidden p-2 sm:p-4 select-none">
              
              <div 
                className={`relative w-full h-full flex items-center justify-center transition-all duration-300 cursor-zoom-in ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-[480px] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlay Tagline Floating Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <div className="bg-[#061324]/85 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl text-white text-xs inline-flex items-center gap-2 shadow-xl max-w-full">
                  <span className="w-2 h-2 rounded-full bg-[#D6A84F] shrink-0" />
                  <span className="font-semibold text-slate-200 truncate">{item.tagline}</span>
                </div>
              </div>

              {/* Previous Image Floating Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPrev();
                  setIsZoomed(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D6A84F] text-white hover:text-[#061324] border border-white/20 flex items-center justify-center transition-all shadow-xl hover:scale-110 cursor-pointer z-20"
                title="Previous workshop (Left arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Image Floating Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNext();
                  setIsZoomed(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D6A84F] text-white hover:text-[#061324] border border-white/20 flex items-center justify-center transition-all shadow-xl hover:scale-110 cursor-pointer z-20"
                title="Next workshop (Right arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Column: In-Depth Training Specs & Curriculum */}
            <div className="lg:col-span-5 p-5 sm:p-6 text-white space-y-5 bg-[#091A30] flex flex-col justify-between">
              
              <div className="space-y-4">
                
                {/* Category & Duration Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white shadow-xs ${item.badgeColor}`}>
                    {item.categoryLabel}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Key Learning Outcomes */}
                <div className="space-y-2 bg-[#061324]/60 p-3.5 rounded-xl border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D6A84F] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D6A84F]" />
                    <span>Core Learning Outcomes:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {item.keyOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="text-[#D6A84F] font-black mt-0.5">›</span>
                        <span className="leading-tight">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Accreditations & Standards */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Accredited Compliance Standards:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.standards.map((std, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-[#D6A84F]" />
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Required PPE & Training Rig */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Mandatory PPE & Equipment:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.equipmentPPE.map((ppe, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/25 text-amber-300 text-[11px] font-medium"
                      >
                        ✓ {ppe}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Training Location venue */}
                <div className="flex items-start gap-2 text-xs text-slate-300 pt-1 border-t border-white/10">
                  <MapPin className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300">{item.locationType}</span>
                </div>
              </div>

              {/* Call-to-action Action Buttons at Bottom */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateToContact) {
                      onNavigateToContact(item.title);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#D6A84F] hover:bg-[#c4963e] text-[#061324] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire / Book This Training Session</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Use ← → keys to navigate</span>
                  <button 
                    onClick={handleCopyLink}
                    className="hover:text-amber-300 transition underline cursor-pointer"
                  >
                    {copied ? 'Copied Link!' : 'Copy Direct Link'}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Thumbnails Strip for Quick Switching */}
          <div className="px-4 py-2.5 bg-[#061324] border-t border-white/10 overflow-x-auto flex items-center gap-2 scrollbar-none z-20">
            {allItems.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  const targetIdx = allItems.findIndex(p => p.id === photo.id);
                  if (targetIdx !== -1) {
                    if (targetIdx > currentIndex) {
                      onSelectNext();
                    } else if (targetIdx < currentIndex) {
                      onSelectPrev();
                    }
                  }
                }}
                className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  photo.id === item.id 
                    ? 'border-[#D6A84F] scale-105 shadow-md shadow-amber-500/20' 
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
                title={photo.shortTitle}
              >
                <img 
                  src={photo.image} 
                  alt={photo.shortTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
