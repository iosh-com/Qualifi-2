import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  QrCode, 
  Users, 
  HardHat, 
  AlertTriangle, 
  Leaf, 
  Activity, 
  ClipboardCheck, 
  GraduationCap, 
  Globe, 
  BookOpen, 
  ChevronRight, 
  Lock, 
  Target, 
  FileCheck, 
  Sparkles,
  Presentation,
  Check,
  Shield,
  Heart,
  Eye,
  Flame,
  HeartPulse
} from 'lucide-react';
import { CertificateVerificationCard } from '../components/CertificateVerificationCard';
import { TrainingGallerySection } from '../components/TrainingGallerySection';
import { TrainingGalleryModal } from '../components/TrainingGalleryModal';
import { TRAINING_GALLERY_DATA } from '../data/trainingGalleryData';
import { ALL_COURSES } from '../data/coursesData';
import { ActivePage, Certificate, Course, TrainingPhotoItem } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';

// Generated imagery matching user references
import heroSphereImg from '../assets/images/hero_qualifi_sphere_1787299768063.jpg';
import classroomSessionImg from '../assets/images/classroom_hse_session_1787299784988.jpg';
import hsePrinciplesImg from '../assets/images/hse_principles_meeting_1787299809908.jpg';
import fireSafetyImg from '../assets/images/fire_safety_training_1787408392662.jpg';
import firstAidImg from '../assets/images/first_aid_training_1787408415166.jpg';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
  onViewFullCertificate: (cert: Certificate) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onViewFullCertificate,
  onSelectCourse
}) => {
  const featuredCourses = ALL_COURSES.slice(0, 6);
  const [activeHeroPhoto, setActiveHeroPhoto] = useState<0 | 1>(0);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<TrainingPhotoItem | null>(null);

  const heroPhotos = [
    {
      title: "Live Fire Suppression Drill",
      tagline: "P.A.S.S. Live Fire Extinguisher Technique",
      image: fireSafetyImg,
      badge: "LIVE PRACTICAL DRILL",
      badgeColor: "bg-rose-600",
      galleryId: "fire-extinguisher-pass"
    },
    {
      title: "First Aid & CPR Life Support",
      tagline: "Mannequin Chest Compression & AED Response",
      image: firstAidImg,
      badge: "EMERGENCY LIFE SUPPORT",
      badgeColor: "bg-emerald-600",
      galleryId: "first-aid-cpr-emergency"
    }
  ];

  const currentHeroPhoto = heroPhotos[activeHeroPhoto];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-slate-50/50">
      
      {/* ========================================================================= */}
      {/* 1. FRONT HERO SECTION (WITH DYNAMIC TRAINING SHOWCASE)                     */}
      {/* ========================================================================= */}
      <section className="relative bg-[#061324] text-white min-h-[580px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden">
        
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroSphereImg} 
            alt="Qualifi Safety Sphere and London Skyline" 
            className="w-full h-full object-cover object-center opacity-45 lg:opacity-60 scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient vignette to guarantee high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061324] via-[#061324]/80 to-transparent lg:via-[#061324]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061324] via-transparent to-[#061324]/60" />
        </div>

        {/* Hero Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left Headline Area */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Brand Emblem Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 border border-white/15 backdrop-blur-md text-[11px] font-bold tracking-widest text-[#F5B301] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#F5B301] animate-pulse" />
                QUALIFI • SAFETY | HEALTH | ENVIRONMENT
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
                BUILDING SAFER <br />
                <span className="text-[#FFFFFF]">HEALTHIER FUTURES</span>
              </h1>

              {/* Sub-Headline */}
              <p className="text-slate-200 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed">
                Expert HSE Solutions. Practical Training. <br className="hidden sm:inline" />
                Stronger Performance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-our-services-btn"
                  onClick={() => onNavigate('services')}
                  className="px-8 py-4 rounded-xl bg-[#F5B301] hover:bg-[#dba000] text-[#061324] font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>OUR SERVICES</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="hero-verify-btn"
                  onClick={() => {
                    const el = document.getElementById('certificate-verification-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base tracking-wide border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-[#F5B301]" />
                  <span>VERIFY CERTIFICATE</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('training-workshops-gallery');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm tracking-wide border border-amber-400/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <HardHat className="w-4 h-4 text-amber-400" />
                  <span>VIEW 10+ WORKSHOPS</span>
                </button>
              </div>

              {/* Bottom Left 3 Value Badges: SAFETY, HEALTH, ENVIRONMENT */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/15 max-w-2xl">
                {/* 1. SAFETY */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[#F5B301]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-wider text-white">SAFETY</span>
                    <span className="text-[11px] text-slate-300">Work Safe</span>
                  </div>
                </div>

                {/* 2. HEALTH */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-wider text-white">HEALTH</span>
                    <span className="text-[11px] text-slate-300">Live Well</span>
                  </div>
                </div>

                {/* 3. ENVIRONMENT */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-wider text-white">ENVIRONMENT</span>
                    <span className="text-[11px] text-slate-300">Protect Tomorrow</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Front Interactive Showcase Card: REAL FIELD WORKSHOPS */}
            <div className="lg:col-span-5 flex justify-end">
              <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-5 shadow-2xl space-y-4 relative group">
                
                {/* Header bar of showcase card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-xs font-black tracking-widest text-[#F5B301] uppercase">
                      PRACTICAL FIELD SESSIONS
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    CLICK TO ENLARGE
                  </span>
                </div>

                {/* Interactive Featured Photo Box */}
                <div 
                  onClick={() => {
                    const found = TRAINING_GALLERY_DATA.find(i => i.id === currentHeroPhoto.galleryId);
                    if (found) setSelectedGalleryItem(found);
                  }}
                  className="relative aspect-16/10 rounded-xl overflow-hidden cursor-pointer border border-white/20 shadow-lg group/img"
                >
                  <img 
                    src={currentHeroPhoto.image} 
                    alt={currentHeroPhoto.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-md ${currentHeroPhoto.badgeColor}`}>
                      {currentHeroPhoto.badge}
                    </span>
                  </div>

                  {/* Quick Expand Icon */}
                  <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-10">
                    <Eye className="w-4 h-4 text-amber-300" />
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10 space-y-0.5">
                    <h4 className="text-sm font-black text-white group-hover/img:text-amber-300 transition-colors truncate">
                      {currentHeroPhoto.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 truncate">
                      {currentHeroPhoto.tagline}
                    </p>
                  </div>
                </div>

                {/* Switcher Tabs for 2 Hero Photos */}
                <div className="grid grid-cols-2 gap-2">
                  {heroPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveHeroPhoto(idx as 0 | 1)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        activeHeroPhoto === idx
                          ? 'bg-white/15 border-amber-400/60 shadow-xs'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <span className="block text-[11px] font-bold text-white truncate">
                          {photo.title.split(' ')[0]} {photo.title.split(' ')[1]}
                        </span>
                        <span className="block text-[9px] text-slate-400 truncate">
                          Photo {idx + 1}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 3 Core Commitment Badges at Bottom */}
                <div className="pt-2 grid grid-cols-3 gap-2 border-t border-white/10 text-center">
                  <div className="p-1.5 rounded-lg bg-white/5 text-[10px] font-semibold text-slate-200">
                    <span className="block text-amber-300 font-bold">✓ Work</span> Safely
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5 text-[10px] font-semibold text-slate-200">
                    <span className="block text-cyan-300 font-bold">✓ Stay</span> Alert
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5 text-[10px] font-semibold text-slate-200">
                    <span className="block text-emerald-300 font-bold">✓ Protect</span> Earth
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO BOTTOM STATS BANNER (1000+ Clients, 200+ Consultants, etc.)          */}
        {/* ========================================================================= */}
        <div className="w-full bg-[#040C17]/90 border-t border-white/10 backdrop-blur-md py-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3 pt-3 md:pt-0">
                <div className="w-11 h-11 rounded-xl bg-[#F5B301]/15 text-[#F5B301] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl sm:text-3xl font-black text-white">1000+</span>
                  <span className="text-xs text-slate-300 font-medium">Clients Worldwide</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3 pt-3 md:pt-0">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl sm:text-3xl font-black text-white">200+</span>
                  <span className="text-xs text-slate-300 font-medium">Expert Consultants</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-center gap-3 pt-3 md:pt-0">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl sm:text-3xl font-black text-white">5000+</span>
                  <span className="text-xs text-slate-300 font-medium">Trained Professionals</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center justify-center gap-3 pt-3 md:pt-0">
                <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl sm:text-3xl font-black text-white">15+</span>
                  <span className="text-xs text-slate-300 font-medium">Countries Reached</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. PRIMARY DIGITAL CERTIFICATE VERIFICATION PORTAL SECTION                */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <CertificateVerificationCard
          onViewFullCertificate={onViewFullCertificate}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. PRACTICAL FIELD & WORKSHOP PHOTO GALLERY (ALL 10 MODULES)              */}
      {/* ========================================================================= */}
      <TrainingGallerySection
        onNavigateToContact={(subject) => onNavigate('contact')}
      />

      {/* ========================================================================= */}
      {/* 4. CLASSROOM & EXECUTIVE HSE TRAINING SESSIONS                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0A4D7E] text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Presentation className="w-3.5 h-3.5 text-[#F5B301]" />
            Practical Classroom & Executive Training
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Health, Safety & Environment In Action
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Delivering high-impact corporate seminars, practical risk workshops, and certified occupational safety instruction led by industry practitioners.
          </p>
        </div>

        {/* 3 Interactive Presentation & Meeting Slide Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Slide 1: Main Classroom Presentation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src={classroomSessionImg} 
                alt="Health Safety and Environment Classroom Training" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B301] bg-black/60 px-2 py-0.5 rounded">
                  Classroom Training Session
                </span>
                <h3 className="text-white font-bold text-base mt-1">
                  Health, Safety & Environment
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs space-y-1">
                  <p className="font-bold text-[#0B1F3A]">Our Commitment, Your Safety, Our Future.</p>
                  <p className="text-slate-600">Empowering workforces with actionable emergency preparedness and hazard controls.</p>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Work Safely:</strong> Rigorous field procedure adherence</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Stay Alert:</strong> Real-time situational hazard awareness</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span><strong>Protect Environment:</strong> Waste reduction & eco stewardship</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Zero Harm. Every Day.
                </span>
                <button
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-bold text-[#0A4D7E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Modules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 2: HSE Principles Boardroom Session */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img 
                src={hsePrinciplesImg} 
                alt="Our HSE Principles Executive Meeting" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B301] bg-black/60 px-2 py-0.5 rounded">
                  Core Framework
                </span>
                <h3 className="text-white font-bold text-base mt-1">
                  Our HSE Principles
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#0A4D7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <div><strong className="text-slate-900">Leadership:</strong> Set the standard from the top down.</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#0A4D7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <div><strong className="text-slate-900">Risk Management:</strong> Identify. Assess. Control.</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#0A4D7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <div><strong className="text-slate-900">Training:</strong> Practical knowledge saves lives.</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#0A4D7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">4</div>
                  <div><strong className="text-slate-900">Communication:</strong> Speak up. Listen. Act.</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#0A4D7E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">5</div>
                  <div><strong className="text-slate-900">Continuous Improvement:</strong> Always do better.</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Standardized UK Curricula</span>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-xs font-bold text-[#0A4D7E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Our Methodology</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide 3: Safety is Everyone's Responsibility */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-all space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A4D7E] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Shared Responsibility Matrix
              </span>
              <h3 className="text-xl font-black text-[#0B1F3A] tracking-tight">
                Safety is Everyone's Responsibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Together, we create a safe, resilient, and sustainable workplace culture where every team member is empowered to act.
              </p>
            </div>

            {/* 4 Color Pillars: We Care, We Act, We Comply, We Protect */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Pillar 1: We Care */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-900">We Care</span>
                <span className="text-[10px] text-emerald-700">Health & Wellbeing</span>
              </div>

              {/* Pillar 2: We Act */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-amber-900">We Act</span>
                <span className="text-[10px] text-amber-700">Stop Unsafe Work</span>
              </div>

              {/* Pillar 3: We Comply */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-[#0A4D7E] text-white flex items-center justify-center shadow-xs">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-blue-900">We Comply</span>
                <span className="text-[10px] text-blue-700">Strict Regulations</span>
              </div>

              {/* Pillar 4: We Protect */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-rose-900">We Protect</span>
                <span className="text-[10px] text-rose-700">Our Teammates</span>
              </div>

            </div>

            {/* Slogan Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 to-[#0B1F3A] text-white rounded-xl text-center shadow-xs">
              <p className="text-xs font-bold text-[#F5B301] tracking-wide">
                Think Safe. Work Safe. Go Home Safe.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED QUALIFICATIONS & COURSES                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#0A4D7E] uppercase tracking-wider">
              Accredited Training Programmes
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Featured Health & Safety Courses
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Industry-recognized certifications spanning foundational site induction to advanced HSE management.
            </p>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0A4D7E] hover:text-[#0B1F3A] transition cursor-pointer"
          >
            <span>View All 17 Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4D7E] flex items-center justify-center group-hover:bg-[#0A4D7E] group-hover:text-white transition-colors">
                    <DynamicIcon name={course.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    {course.level}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-[#0B1F3A] group-hover:text-[#0A4D7E] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {course.duration}
                </span>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-4 py-2 bg-slate-100 hover:bg-[#0A4D7E] text-slate-800 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Course</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VERIFICATION SECURITY STANDARDS BANNER                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#0A4D7E] to-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F5B301] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Lock className="w-3.5 h-3.5" />
                Official UK Registry Security & Authenticity
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Authenticity Guaranteed on Every Certificate
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-2xl">
                Every physical and digital certificate issued by Qualifi Health & Safety Training Centre contains a unique sequential registry identifier and direct-link QR code, verifiable worldwide 24 hours a day on any mobile phone or computer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unique Anti-Tamper Registry Serial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>High-Resolution Scannable QR Codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Permanent Central Database Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Validation for Global Employers</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white text-[#0B1F3A] flex items-center justify-center shadow-lg">
                <QrCode className="w-9 h-9" />
              </div>
              <div className="text-sm font-bold text-white">
                Have a Certificate to Verify?
              </div>
              <p className="text-xs text-blue-200">
                Query our registry right now with zero registration needed.
              </p>
              <button
                onClick={() => onNavigate('verify')}
                className="w-full py-3 bg-[#F5B301] hover:bg-[#dba000] text-[#0B1F3A] font-bold text-xs rounded-xl transition shadow cursor-pointer uppercase tracking-wider"
              >
                Go to Verification Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION SECTION (WITH UPDATED QUALIFI EMAIL)                     */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
          Ready to Elevate Workplace Health & Safety?
        </h3>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Contact our training team for course schedules, corporate group bookings, or verification support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 bg-[#0A4D7E] hover:bg-[#0B1F3A] text-white font-bold text-sm rounded-xl transition shadow cursor-pointer"
          >
            Contact Our Training Team
          </button>
          <a
            href="mailto:qualifiuk@gmail.com"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 transition shadow-xs"
          >
            Email: qualifiuk@gmail.com
          </a>
        </div>
      </section>

      {/* Hero-Triggered Gallery Lightbox Modal */}
      {selectedGalleryItem && (
        <TrainingGalleryModal
          item={selectedGalleryItem}
          allItems={TRAINING_GALLERY_DATA}
          onClose={() => setSelectedGalleryItem(null)}
          onSelectNext={() => {
            const currentIndex = TRAINING_GALLERY_DATA.findIndex(i => i.id === selectedGalleryItem.id);
            const nextIndex = (currentIndex + 1) % TRAINING_GALLERY_DATA.length;
            setSelectedGalleryItem(TRAINING_GALLERY_DATA[nextIndex]);
          }}
          onSelectPrev={() => {
            const currentIndex = TRAINING_GALLERY_DATA.findIndex(i => i.id === selectedGalleryItem.id);
            const prevIndex = (currentIndex - 1 + TRAINING_GALLERY_DATA.length) % TRAINING_GALLERY_DATA.length;
            setSelectedGalleryItem(TRAINING_GALLERY_DATA[prevIndex]);
          }}
          onNavigateToContact={(subject) => onNavigate('contact')}
        />
      )}

    </div>
  );
};
