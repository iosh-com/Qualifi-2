import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  CheckCircle2, 
  Users, 
  Award, 
  BookOpen, 
  FileCheck,
  QrCode,
  GraduationCap,
  Building2,
  Lock
} from 'lucide-react';
import { ActivePage } from '../types';

interface AboutPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-bold uppercase tracking-wider border border-white/15">
            <ShieldCheck className="w-4 h-4" />
            Institutional Overview
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            About Qualifi Health & Safety Training Centre
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Dedicated to advancing occupational health and safety education, workplace hazard awareness, professional development, and verifiable competencies.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1456A0] bg-blue-50 px-3 py-1 rounded-md">
              Who We Are
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Championing Practical Workplace Safety & Professional Growth
            </h2>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Qualifi Health & Safety Training Centre</strong> is a UK-based training institute established to deliver comprehensive occupational health, safety, and environmental education.
              </p>
              <p>
                We focus on empowering candidates with practical, actionable workplace competencies—from risk assessment methodology and hazard identification to high-risk industrial safety protocols including confined space entry, fire safety, work at height, and emergency first aid.
              </p>
              <p>
                To protect employers and candidates worldwide, every qualification issued by Qualifi is registered within our central <strong>Online Certificate Verification Portal</strong>, providing instant cryptographic validation and complete peace of mind.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('verify')}
                className="px-6 py-3 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold text-xs rounded-xl transition shadow cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                <span>Verify A Certificate</span>
              </button>

              <button
                onClick={() => onNavigate('courses')}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Browse Training Courses
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1456A0] p-8 rounded-3xl text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-wider">
                  Our Core Pillars
                </span>
                <h3 className="text-xl font-bold text-white">Institutional Standards</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <BookOpen className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Professional Training</strong>
                    <span className="text-slate-300">Structured syllabi covering practical risk control & compliance.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <FileCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Industry Relevant Courses</strong>
                    <span className="text-slate-300">Targeted modules for civil, manufacturing, and industrial sectors.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <QrCode className="w-5 h-5 text-[#D6A84F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Certificate Verification</strong>
                    <span className="text-slate-300">24/7 digital verification portal for global employers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <Users className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Safety-Focused Learning</strong>
                    <span className="text-slate-300">Cultivating human-centric safety culture and proactive mindset.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3A]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To provide accessible, high-caliber health and safety training that equips workers and managers with the practical skills required to eliminate hazards, safeguard human life, and foster zero-harm workplaces.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D6A84F] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#D6A84F]" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3A]">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be a trusted international benchmark in occupational safety education and digital credential integrity, recognized for rigorous training standards and transparent certificate authentication.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="text-xs font-bold text-[#1456A0] uppercase tracking-wider">
            Key Advantages
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            Why Choose Qualifi Training Centre?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Practical & Hands-On Focus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our courses emphasize real-world site scenarios, risk matrix formulation, and hazard mitigation techniques.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Online Certificate Registry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every graduate receives credentials that can be verified immediately anywhere in the world 24/7.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Flexible Learning Formats</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Available via classroom instruction, blended digital modules, or on-site corporate training workshops.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Multi-Disciplinary Scope</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              From general occupational safety to high-hazard technical courses like H2S, confined spaces, and scaffolding.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Dedicated Registry Support</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast, responsive verification assistance for hiring teams, recruitment agencies, and main contractors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold text-xs">
              06
            </div>
            <h4 className="font-bold text-sm text-[#0B1F3A]">Continuous HSE Development</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear progression paths from entry-level safety officer competencies to senior management lead auditor roles.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
