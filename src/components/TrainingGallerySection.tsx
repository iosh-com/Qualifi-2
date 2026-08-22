import React, { useState } from 'react';
import { 
  HardHat, 
  Maximize2, 
  Flame, 
  HeartPulse, 
  Wrench, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Filter
} from 'lucide-react';
import { TRAINING_GALLERY_DATA } from '../data/trainingGalleryData';
import { TrainingPhotoItem } from '../types';
import { TrainingGalleryModal } from './TrainingGalleryModal';

interface TrainingGallerySectionProps {
  onNavigateToContact?: (subjectTitle: string) => void;
  title?: string;
  subtitle?: string;
  initialFilter?: string;
}

export const TrainingGallerySection: React.FC<TrainingGallerySectionProps> = ({
  onNavigateToContact,
  title = "PRACTICAL HSE TRAINING & FIELD WORKSHOPS",
  subtitle = "Real-World Safety Drills, Live Practical Demonstrations & Compliance Orientations",
  initialFilter = "all"
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [selectedItem, setSelectedItem] = useState<TrainingPhotoItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Workshops', count: TRAINING_GALLERY_DATA.length, icon: Filter },
    { id: 'field', label: 'Field & Construction Safety', count: TRAINING_GALLERY_DATA.filter(i => i.category === 'field').length, icon: HardHat },
    { id: 'emergency', label: 'Emergency & First Aid', count: TRAINING_GALLERY_DATA.filter(i => i.category === 'emergency').length, icon: Flame },
    { id: 'industrial', label: 'Industrial & Electrical', count: TRAINING_GALLERY_DATA.filter(i => i.category === 'industrial').length, icon: Wrench },
    { id: 'classroom', label: 'Classroom & Governance', count: TRAINING_GALLERY_DATA.filter(i => i.category === 'classroom').length, icon: GraduationCap }
  ];

  const filteredItems = selectedFilter === 'all' 
    ? TRAINING_GALLERY_DATA 
    : TRAINING_GALLERY_DATA.filter(item => item.category === selectedFilter);

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = TRAINING_GALLERY_DATA.findIndex(i => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % TRAINING_GALLERY_DATA.length;
    setSelectedItem(TRAINING_GALLERY_DATA[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = TRAINING_GALLERY_DATA.findIndex(i => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + TRAINING_GALLERY_DATA.length) % TRAINING_GALLERY_DATA.length;
    setSelectedItem(TRAINING_GALLERY_DATA[prevIndex]);
  };

  return (
    <section id="training-workshops-gallery" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      
      {/* Background Subtle Accent Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3 max-w-3xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B1F3A] text-[#D6A84F] text-xs font-black tracking-widest uppercase shadow-xs">
              <HardHat className="w-3.5 h-3.5" />
              <span>LIVE PRACTICAL LEARNING SESSIONS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] uppercase tracking-tight">
              {title}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}. Each workshop incorporates certified instructional simulations, PPE mastery, and interactive competency evaluations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6A84F]" />
              <span>Click any image for Full Interactive Inspection & Outcomes</span>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="py-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white shadow-md shadow-blue-950/20 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6A84F]' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-[#D6A84F] text-[#0B1F3A]' : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
            >
              {/* Image Frame with Hover Zoom & Action Overlay */}
              <div className="relative aspect-4/3 bg-slate-950 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge & Duration Pill */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ${item.badgeColor}`}>
                    {item.categoryLabel}
                  </span>

                  <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                    <Clock className="w-3 h-3 text-[#D6A84F]" />
                    {item.duration.split('/')[0]}
                  </span>
                </div>

                {/* Hover Center Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="px-4 py-2 rounded-xl bg-[#D6A84F] text-[#061324] font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4" />
                    <span>View Workshop Protocols</span>
                  </div>
                </div>

                {/* Bottom Tagline Overlay on Image */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <span className="text-[11px] font-semibold text-amber-300 truncate block drop-shadow-sm">
                    {item.tagline}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#1456A0] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Standards preview & Action Footer */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {item.standards.slice(0, 2).map((std, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold"
                      >
                        {std}
                      </span>
                    ))}
                    {item.standards.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                        +{item.standards.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#1456A0] font-extrabold group-hover:text-[#0B1F3A] transition-colors">
                    <span className="flex items-center gap-1">
                      <HardHat className="w-3.5 h-3.5 text-[#D6A84F]" />
                      <span>Explore Practical Outcomes</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Modal Component */}
      {selectedItem && (
        <TrainingGalleryModal
          item={selectedItem}
          allItems={TRAINING_GALLERY_DATA}
          onClose={() => setSelectedItem(null)}
          onSelectNext={handleNext}
          onSelectPrev={handlePrev}
          onNavigateToContact={onNavigateToContact}
        />
      )}

    </section>
  );
};
