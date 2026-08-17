import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  Lock, 
  FileCheck, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  Camera,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { CertificateVerificationCard } from '../components/CertificateVerificationCard';
import { Certificate } from '../types';

interface VerifyPageProps {
  onViewFullCertificate: (cert: Certificate) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ onViewFullCertificate }) => {
  const [urlCertNumber, setUrlCertNumber] = useState<string>('');
  const [showQrInfoModal, setShowQrInfoModal] = useState(false);

  // Read URL query parameter "?certificate=XXXX" on mount and when URL changes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const certParam = params.get('certificate') || params.get('cert') || params.get('id');
      if (certParam) {
        setUrlCertNumber(certParam.trim());
      }
    } catch (e) {
      console.warn('Unable to parse URL parameters:', e);
    }
  }, []);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-bold uppercase tracking-wider border border-white/15">
            <ShieldCheck className="w-4 h-4" />
            Official UK Registry Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Certificate Verification Portal
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity of certificates issued by Qualifi Health & Safety Training Centre.
          </p>

          {urlCertNumber && (
            <div className="inline-flex items-center gap-2 bg-blue-900/80 px-4 py-1.5 rounded-lg border border-blue-400/40 text-xs text-blue-200">
              <span>Auto-loaded from QR code:</span>
              <strong className="font-mono text-white">{urlCertNumber}</strong>
            </div>
          )}
        </div>
      </section>

      {/* Main Verification Card Area */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <CertificateVerificationCard
          initialCertNumber={urlCertNumber}
          onViewFullCertificate={onViewFullCertificate}
        />
      </section>

      {/* Security & Verification Authenticity Guidelines */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
            Certificate Security & Validation Guide
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            How our anti-fraud protocols ensure absolute authenticity for employers, auditors, and candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Direct QR Code Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every genuine certificate includes a high-density QR code. Scanning the code with any smartphone camera instantly directs to this portal with pre-filled validation parameters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cryptographic Serial Number</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certificates are assigned a structured sequential identifier (e.g. <code>QHSTC-2026-00001</code>) matched against authorized exam department records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D6A84F] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Global 24/7 Accessibility</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employers, EPC contractors, and hiring directors worldwide can verify candidate qualifications anytime without delay or administrative fees.
            </p>
          </div>
        </div>

        {/* Verification Assistance Box */}
        <div className="bg-blue-50/80 rounded-2xl border border-blue-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-base">Need Verification Support or Batch Verification?</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              For corporate candidate audits, historical archive checks, or manual registry verification, email our official desk.
            </p>
          </div>

          <a
            href="mailto:hiqual.com.uk@gmail.com?subject=Certificate%20Verification%20Inquiry"
            className="px-6 py-3 bg-[#1456A0] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#D6A84F]" />
            <span>hiqual.com.uk@gmail.com</span>
          </a>
        </div>
      </section>

    </div>
  );
};
