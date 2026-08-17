import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  QrCode, 
  Users, 
  Building2, 
  Shield, 
  CheckCircle, 
  BookOpen,
  Sparkles,
  Lock,
  ChevronRight,
  Zap,
  Globe,
  FileCheck
} from 'lucide-react';
import { CertificateVerificationCard } from '../components/CertificateVerificationCard';
import { ALL_COURSES } from '../data/coursesData';
import { ALL_SERVICES } from '../data/servicesData';
import { ActivePage, Certificate, Course } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';

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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B1F3A] text-white pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle HSE Security Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Subtle ambient corporate blue glow */}
        <div className="absolute -top-40 right-0 w-96 h-96 bg-[#1456A0]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#D6A84F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-bold tracking-wide uppercase border border-white/15 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                UK Occupational Health & Safety Training
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Professional Health & Safety Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-[#D6A84F]">You Can Trust</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Quality training, professional development and secure online certificate verification for individuals, engineers, and corporate organizations.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-verify-cta"
                  onClick={() => {
                    const el = document.getElementById('certificate-verification-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1456A0] via-[#1976D2] to-[#1456A0] hover:from-[#1976D2] hover:to-[#1456A0] text-white font-bold text-base shadow-lg hover:shadow-xl hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2.5 cursor-pointer border border-blue-400/30"
                >
                  <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
                  <span>Verify Certificate</span>
                </button>

                <button
                  id="hero-explore-courses-cta"
                  onClick={() => onNavigate('courses')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
                >
                  <BookOpen className="w-5 h-5 text-blue-200" />
                  <span>Explore Courses</span>
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-slate-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Digital Registry</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#D6A84F] shrink-0" />
                  <span>Scannable QR Codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>Anti-Forgery Shield</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-[#D6A84F]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Instant Credential Check</h4>
                      <p className="text-[11px] text-blue-200">Qualifi Central Database</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                    Live System
                  </span>
                </div>

                {/* Sample Verification Preview Pill */}
                <div className="bg-[#0B1F3A]/80 p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Sample Test Credential:</span>
                    <span className="font-mono text-white font-bold">QHSTC-2026-00001</span>
                  </div>
                  <div className="text-slate-200">
                    <strong className="text-white">Muhammad Ahmed</strong> • Health & Safety Officer (Level 3)
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Status: VALID / VERIFIED</span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      const el = document.getElementById('certificate-verification-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-[#D6A84F] hover:bg-[#c49740] text-[#0B1F3A] font-bold text-xs rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Check A Certificate Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY VERIFICATION SECTION (DOMINANT FEATURE) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <CertificateVerificationCard
          onViewFullCertificate={onViewFullCertificate}
        />
      </section>

      {/* 3. CORE INSTITUTE VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-[#1456A0] text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Award className="w-3.5 h-3.5 text-[#D6A84F]" />
            Safety Leadership
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Setting the Standard in Health & Safety Education
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Delivering rigorous, practical safety training aligned with industry benchmarks and fortified by our online certificate verification registry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Professional Training</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curricula designed to build practical workplace competence, risk assessment proficiency, and statutory compliance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Industry Relevant Courses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Covering high-risk construction, petrochemical H2S, confined spaces, electrical isolations, and fire safety systems.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D6A84F] flex items-center justify-center border border-amber-100">
              <QrCode className="w-6 h-6 text-[#D6A84F]" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Certificate Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant 24/7 digital certificate validation giving employers, auditors, and clients complete confidence in student awards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Safety-Focused Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive pedagogy focused on real-world scenarios, accident prevention, and cultivating a proactive safety mindset.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#1456A0] uppercase tracking-wider">
              Explore Our Qualifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
              Featured Health & Safety Courses
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Comprehensive qualifications spanning foundational safety leadership to specialized technical certifications.
            </p>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1456A0] hover:text-[#0B1F3A] transition cursor-pointer"
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
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center group-hover:bg-[#1456A0] group-hover:text-white transition-colors">
                    <DynamicIcon name={course.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {course.level}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-[#0B1F3A] group-hover:text-[#1456A0] transition-colors leading-snug">
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
                  className="px-4 py-2 bg-slate-100 hover:bg-[#1456A0] text-slate-800 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Course</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFICATION SECURITY STANDARDS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#1456A0] to-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D6A84F] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Lock className="w-3.5 h-3.5" />
                Enterprise Security & Traceability
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Authenticity Guaranteed on Every Certificate
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-2xl">
                Every physical and digital certificate issued by Qualifi Health & Safety Training Centre contains a unique cryptographic serial number and direct-link QR code, verifiable worldwide 24 hours a day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unique Anti-Tamper Security Serial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>High-Resolution Scannable QR Codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Registry Verification</span>
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
                className="w-full py-3 bg-[#D6A84F] hover:bg-[#c99a42] text-[#0B1F3A] font-bold text-xs rounded-xl transition shadow cursor-pointer"
              >
                Go to Verification Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
          Ready to Elevate Workplace Health & Safety?
        </h3>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Contact our training team for course schedules, corporate group bookings, or verification support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold text-sm rounded-xl transition shadow cursor-pointer"
          >
            Contact Our Training Team
          </button>
          <a
            href="mailto:hiqual.com.uk@gmail.com"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 transition shadow-xs"
          >
            Email: hiqual.com.uk@gmail.com
          </a>
        </div>
      </section>

    </div>
  );
};
