import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  QrCode, 
  PhoneCall, 
  Mail, 
  FileCheck,
  Send
} from 'lucide-react';
import { ALL_SERVICES } from '../data/servicesData';
import { DynamicIcon } from '../components/DynamicIcon';
import { ActivePage } from '../types';

interface ServicesPageProps {
  onNavigate: (page: ActivePage) => void;
  onEnquireService: (serviceTitle: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onEnquireService }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-bold uppercase tracking-wider border border-white/15">
            <ShieldCheck className="w-4 h-4" />
            Comprehensive HSE Solutions
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Health & Safety Services
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Professional training programs, corporate safety solutions, and digital credential verification services designed to enhance workplace safety performance.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SERVICES.map((service) => {
            const isVerification = service.id === 'certificate-verification-service';

            return (
              <div
                key={service.id}
                className={`rounded-2xl border p-8 transition-all flex flex-col justify-between ${
                  isVerification
                    ? 'bg-gradient-to-b from-blue-50/80 to-white border-[#1456A0] shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 shadow-xs hover:shadow-lg'
                }`}
              >
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1456A0] flex items-center justify-center border border-blue-100">
                    <DynamicIcon name={service.iconName} className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0B1F3A]">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.fullDesc}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Key Highlights:
                    </span>
                    {service.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  {isVerification ? (
                    <button
                      onClick={() => onNavigate('verify')}
                      className="w-full py-3 bg-[#1456A0] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-[#D6A84F]" />
                      <span>Access Verification Portal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onEnquireService(service.title)}
                      className="w-full py-3 bg-slate-100 hover:bg-[#1456A0] text-slate-800 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire About Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Corporate Safety Partnership Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0B1F3A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6A84F] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Corporate HSE Solutions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Partner With Qualifi For Enterprise Safety Training
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We work alongside HSE directors and compliance managers to deliver customized group training, conduct on-site hazard workshops, and issue verifiable digital credentials for entire workforces.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-[#D6A84F] hover:bg-[#c99a42] text-[#0B1F3A] font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Schedule Corporate Consultation
              </button>
              <a
                href="mailto:hiqual.com.uk@gmail.com"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition"
              >
                Email: hiqual.com.uk@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
