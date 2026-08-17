import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Lock, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { ActivePage } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenPolicy: (type: 'privacy' | 'terms' | 'verification') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPolicy,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0B1F3A] text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      {/* Decorative safety accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1456A0] via-[#D6A84F] to-[#1456A0]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Professional Health & Safety Training & Online Certificate Verification. Empowering individuals and organizations with recognized workplace safety competencies.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Official 24/7 Certificate Verification Portal</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('verify')}
                  className="text-[#60A5FA] font-bold hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> Certificate Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> Courses Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> Services & Corporate Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#D6A84F]">›</span> Contact Registry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Safety Tracks */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2">
              Training Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Occupational Health & Safety Management</li>
              <li>• Construction & Industrial Site Safety</li>
              <li>• Workplace Risk Assessment & PTW</li>
              <li>• Emergency First Aid & Fire Warden</li>
              <li>• Confined Space, H2S & Fall Protection</li>
              <li>• ISO 45001 & ISO 14001 Auditing</li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-700 pb-2">
              Contact & Registry
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-slate-400">Official Correspondence:</span>
                  <a href="mailto:hiqual.com.uk@gmail.com" className="text-white hover:underline font-medium">
                    hiqual.com.uk@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-slate-400">UK Training Support:</span>
                  <span className="text-white">+44 (0) 20 7946 0912</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-slate-400">Location:</span>
                  <span className="text-white">London & Nationwide Training Centres, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Qualifi Health & Safety Training Centre. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('verification')}
              className="text-[#60A5FA] hover:text-white font-semibold transition cursor-pointer"
            >
              Certificate Verification Policy
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-300 p-1 rounded hover:bg-white/5 transition cursor-pointer"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
