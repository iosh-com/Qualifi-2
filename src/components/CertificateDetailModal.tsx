import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, QrCode, Lock, Share2, Award } from 'lucide-react';
import { Certificate } from '../types';
import { Logo } from './Logo';

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({
  certificate,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const status = certificate.status || certificate.certificate_status || 'VALID';
  const institute = certificate.institute_name || certificate.training_provider || 'Qualifi Health & Safety Training Centre';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
            <span className="font-bold text-sm sm:text-base">Official Digital Certificate Document</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              status === 'VALID' ? 'bg-emerald-600/90 text-white' : 'bg-rose-600 text-white'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div ref={printRef} className="p-6 sm:p-10 bg-slate-50 overflow-x-auto">
          <div className="certificate-print-container min-w-[700px] max-w-[850px] mx-auto bg-white p-8 sm:p-12 rounded-xl border-8 border-double border-[#0B1F3A] shadow-md relative security-guilloche-bg">
            
            {/* Outer Gold Accent Corner Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D6A84F]" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D6A84F]" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D6A84F]" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D6A84F]" />

            {/* Header: Logo & Institute Name */}
            <div className="text-center space-y-3 pb-6 border-b-2 border-[#0B1F3A]/20">
              <div className="flex justify-center">
                <Logo variant="certificate" size="lg" />
              </div>
              <div className="text-[11px] font-bold tracking-widest text-[#1456A0] uppercase">
                UNITED KINGDOM • OCCUPATIONAL HEALTH & SAFETY TRAINING EXCELLENCE
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-6 space-y-1">
              <span className="text-xs font-bold tracking-[0.25em] text-[#D6A84F] uppercase">
                CERTIFICATE OF ACHIEVEMENT
              </span>
              <h1 className="font-serif-seal text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-wider uppercase">
                PROFESSIONAL QUALIFICATION
              </h1>
              <p className="text-xs text-slate-500 italic pt-1">
                This is to officially certify that
              </p>
            </div>

            {/* Student Name */}
            <div className="text-center py-3">
              <div className="inline-block border-b-2 border-[#1456A0] px-10 pb-2">
                <span className="text-2xl sm:text-3xl font-serif-seal font-bold text-[#0B1F3A] tracking-wide">
                  {certificate.student_name}
                </span>
              </div>
              {certificate.father_name && (
                <p className="text-xs text-slate-600 mt-1">
                  Son / Daughter of: <strong className="text-slate-800">{certificate.father_name}</strong>
                </p>
              )}
              {certificate.date_of_birth && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Date of Birth: {certificate.date_of_birth}
                </p>
              )}
            </div>

            {/* Course Award Details */}
            <div className="text-center max-w-xl mx-auto py-4 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                has successfully completed all prescribed training modules, practical hazard evaluations, and examinations for:
              </p>
              <div className="bg-blue-50/70 py-3 px-6 rounded-xl border border-blue-200/80 inline-block w-full">
                <h2 className="text-lg sm:text-xl font-bold text-[#1456A0] tracking-wide">
                  {certificate.course_name}
                </h2>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Qualification Level: {certificate.course_level || 'Level 3'}
                </span>
              </div>
            </div>

            {/* Certificate Metadata & Security Stamp */}
            <div className="grid grid-cols-3 gap-4 items-end pt-8 mt-4 border-t border-slate-200 text-xs">
              {/* Left: Issue Details */}
              <div className="space-y-1 text-slate-700">
                <div className="font-mono text-[11px]">
                  <span className="text-slate-500">Certificate No:</span>
                  <strong className="block text-[#0B1F3A] text-xs font-bold">{certificate.certificate_number}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Issue Date:</span> {certificate.issue_date}
                </div>
                <div>
                  <span className="text-slate-500">Institute:</span> {institute}
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <strong className={status === 'VALID' ? 'text-emerald-700' : 'text-rose-700'}>
                    {status}
                  </strong>
                </div>
              </div>

              {/* Center: Security Hologram & QR Code */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                {certificate.qr_code_url ? (
                  <div className="p-1 bg-white border border-slate-300 rounded shadow-xs">
                    <img
                      src={certificate.qr_code_url}
                      alt="Certificate QR Code"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 border border-slate-300 rounded flex items-center justify-center bg-slate-100">
                    <QrCode className="w-10 h-10 text-slate-400" />
                  </div>
                )}

                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>DIGITALLY VERIFIED</span>
                </div>
              </div>

              {/* Right: Signature & Stamp */}
              <div className="text-right space-y-1">
                <div className="inline-block text-center border-b border-slate-400 pb-1 w-36">
                  <span className="font-serif-seal italic text-base text-[#0B1F3A] font-semibold block">
                    {certificate.instructor_name || 'Training Director'}
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  Authorized Director / Examiner
                </span>
                <span className="block text-[10px] text-slate-400">
                  Qualifi Health & Safety Registry
                </span>
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-8 pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400 flex items-center justify-between">
              <span>Authenticity verifiable at qualifi-hse.uk/verify</span>
              <span>Ref: {certificate.id.substring(0, 16)}</span>
              <span>© {institute}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="no-print bg-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            For credential verification inquiries: <a href="mailto:hiqual.com.uk@gmail.com" className="text-[#1456A0] font-semibold underline">hiqual.com.uk@gmail.com</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0B1F3A] hover:bg-[#1456A0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
