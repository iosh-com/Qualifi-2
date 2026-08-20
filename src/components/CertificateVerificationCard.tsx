import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Sparkles, 
  Lock, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldAlert 
} from 'lucide-react';
import { verifyCertificate } from '../services/certificateService';
import { Certificate, VerificationResult } from '../types';
import { isSupabaseReady } from '../lib/supabaseClient';
import { VerifiedSeal } from './VerifiedSeal';

interface CertificateVerificationCardProps {
  initialCertNumber?: string;
  onViewFullCertificate?: (cert: Certificate) => void;
  className?: string;
  compact?: boolean;
}

export const CertificateVerificationCard: React.FC<CertificateVerificationCardProps> = ({
  initialCertNumber = '',
  onViewFullCertificate,
  className = '',
  compact = false
}) => {
  const [certNumber, setCertNumber] = useState(initialCertNumber);
  const [studentName, setStudentName] = useState('');
  const [showSecondarySearch, setShowSecondarySearch] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync initial certificate number if URL parameter updates
  useEffect(() => {
    if (initialCertNumber && initialCertNumber.trim()) {
      setCertNumber(initialCertNumber);
      handleVerification(initialCertNumber);
    }
  }, [initialCertNumber]);

  const handleVerification = async (targetNumber?: string) => {
    const numberToQuery = (targetNumber || certNumber).trim();
    if (!numberToQuery) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const res = await verifyCertificate(
        numberToQuery, 
        showSecondarySearch ? studentName : undefined
      );
      setResult(res);

      if (res.state === 'verified') {
        try {
          confetti({
            particleCount: 35,
            spread: 55,
            origin: { y: 0.7 },
            colors: ['#0A4D7E', '#1456A0', '#0B1F3A', '#FFFFFF']
          });
        } catch {
          // ignore confetti if blocked in iframe
        }
      }
    } catch {
      setResult({
        state: 'error',
        data: null,
        errorMessage: 'An unexpected system error occurred during verification. Please try again.',
        searchedQuery: numberToQuery,
        dataSource: isSupabaseReady() ? 'supabase' : 'local_store'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div 
      id="certificate-verification-section"
      className={`w-full bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden ${className}`}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1F3A] via-[#1456A0] to-[#0B1F3A] p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Subtle Decorative HSE Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6A84F]" />
            Official Verification Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Verify Your Certificate
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-1 max-w-2xl">
            Verify the authenticity and status of certificates issued by Qualifi Health & Safety Training Centre.
          </p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="p-6 sm:p-8 space-y-6">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleVerification();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="certificate-search-input"
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="Enter Certificate Number (e.g. QHSTC-2026-00001)"
                className="w-full pl-11 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#1456A0] focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 placeholder:text-slate-400 font-mono font-semibold tracking-wide text-base transition-all bg-slate-50/50 hover:bg-white"
                required
              />
            </div>

            <button
              id="verify-certificate-submit-button"
              type="submit"
              disabled={isVerifying || !certNumber.trim()}
              className="px-8 py-4 bg-[#0A4D7E] hover:bg-[#0B1F3A] text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#D6A84F]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
                  <span>VERIFY CERTIFICATE</span>
                </>
              )}
            </button>
          </div>

          {/* Optional Secondary Search Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
            <button
              type="button"
              onClick={() => setShowSecondarySearch(!showSecondarySearch)}
              className="text-[#0A4D7E] hover:underline font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {showSecondarySearch ? '− Hide Candidate Name Filter' : '+ Optional: Filter by Candidate Name'}
            </button>
          </div>

          {/* Secondary Student Name Input if toggled */}
          {showSecondarySearch && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <label htmlFor="student-name-filter" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Candidate Full Name (Optional Cross-Check)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-name-filter"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Muhammad Ahmed"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#0A4D7E] outline-none text-sm text-slate-800"
                />
              </div>
            </div>
          )}
        </form>

        {/* Verification Result Display */}
        {result && (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
            {result.state === 'verified' && result.data && (
              <div 
                id="verified-certificate-result-card"
                className="bg-white rounded-2xl border-2 border-[#0A4D7E]/30 p-6 sm:p-8 relative overflow-hidden shadow-xl space-y-6"
              >
                {/* Official Blue & White Verification Header Banner with Stamp */}
                <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 p-6 rounded-2xl border border-blue-100/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: Blue & White Authentic Stamp Seal */}
                  <VerifiedSeal 
                    certificateNumber={result.data.certificate_number} 
                    size="md"
                    className="shrink-0"
                  />

                  {/* Right: Official Verification Summary & Status */}
                  <div className="space-y-2.5 text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A4D7E] bg-blue-100/90 px-3 py-1 rounded-md border border-blue-200">
                        ✓ OFFICIALLY VERIFIED RECORD
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                        (result.data.status || result.data.certificate_status) === 'VALID'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}>
                        Status: {result.data.status || result.data.certificate_status || 'VALID'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      Certificate Authenticity Confirmed
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      This qualification was officially issued by <strong>Qualifi Health & Safety Training Centre</strong> and is registered in the permanent UK training database.
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-600 font-mono">
                      <span className="bg-white px-3 py-1 rounded-md border border-slate-200 text-slate-800 shadow-2xs">
                        Registry Ref: <strong className="text-[#0B1F3A] font-bold">{result.data.certificate_number}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Structured Verification Data Grid (Decent Blue, White & Black/Slate Palette) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {/* 1. Certificate_Number */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Certificate Number
                    </span>
                    <span className="font-mono font-bold text-base text-[#0B1F3A]">
                      {result.data.certificate_number}
                    </span>
                  </div>

                  {/* 2. Student_Name */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Candidate Name
                    </span>
                    <span className="font-bold text-base text-slate-950">
                      {result.data.student_name}
                    </span>
                  </div>

                  {/* 3. Father_Name */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Father / Guardian Name
                    </span>
                    <span className="font-semibold text-slate-900">
                      {result.data.father_name || '—'}
                    </span>
                  </div>

                  {/* 4. Course_Name */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Course Name
                    </span>
                    <span className="font-bold text-base text-[#0A4D7E]">
                      {result.data.course_name}
                    </span>
                    {result.data.course_level && (
                      <span className="text-xs font-medium text-slate-600 block mt-0.5">
                        Level: {result.data.course_level}
                      </span>
                    )}
                  </div>

                  {/* 5. Issue_Date */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue Date
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {result.data.issue_date}
                    </span>
                  </div>

                  {/* 6. Date_of_Birth */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Date of Birth
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {result.data.date_of_birth || '—'}
                    </span>
                  </div>

                  {/* 7. Institute_Name */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Institute Name
                    </span>
                    <span className="font-semibold text-slate-900">
                      {result.data.institute_name || result.data.training_provider || 'Qualifi Health & Safety Training Centre'}
                    </span>
                  </div>

                  {/* 8. Status */}
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Verification Status
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${
                      (result.data.status || result.data.certificate_status) === 'VALID'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {result.data.status || result.data.certificate_status || 'VALID'}
                    </span>
                  </div>
                </div>

                {/* QR Code & Verification Link Box */}
                <div className="bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                  {result.data.qr_code_url && (
                    <div className="p-2 bg-white border border-slate-300 rounded-lg shadow-2xs shrink-0">
                      <img 
                        src={result.data.qr_code_url} 
                        alt="Verification QR Code" 
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 text-center sm:text-left text-xs">
                    <span className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                      <QrCode className="w-4 h-4 text-[#0A4D7E]" />
                      Official Scannable Verification QR Code
                    </span>
                    <p className="text-slate-600">
                      This QR code contains the direct verification link for this candidate qualification.
                    </p>
                    {result.data.verification_url && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-mono text-[11px] text-[#0A4D7E] truncate max-w-sm font-semibold">
                          {result.data.verification_url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(result.data!.verification_url!)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded text-[10px] inline-flex items-center gap-1 cursor-pointer border border-slate-300 shadow-2xs"
                        >
                          {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#0A4D7E]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                {result.data.remarks && (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">Verification Remarks:</span>
                    {result.data.remarks}
                  </div>
                )}


              </div>
            )}

            {/* Certificate Not Found State */}
            {result.state === 'not_found' && (
              <div 
                id="certificate-not-found-card"
                className="bg-rose-50 rounded-2xl border-2 border-rose-300 p-6 sm:p-8 text-rose-900 relative"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-rose-950">
                      Certificate Not Found
                    </h3>
                    <p className="text-sm text-rose-800 leading-relaxed">
                      We could not find a certificate matching the certificate number 
                      <span className="font-mono font-bold px-2 py-0.5 mx-1 bg-white rounded border border-rose-200 text-slate-900">
                        {result.searchedQuery}
                      </span> 
                      in the official Supabase database.
                    </p>
                    <div className="pt-3 text-xs text-rose-700 space-y-1">
                      <p><strong>Troubleshooting tips:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                        <li>Ensure all letters and hyphens are typed correctly (e.g. <code>QHSTC-2026-00001</code>).</li>
                        <li>If the certificate was added recently, please ensure it was saved to the central registry.</li>
                        <li>For manual verification assistance, contact our registry at <a href="mailto:hiqual.com.uk@gmail.com" className="underline font-semibold">hiqual.com.uk@gmail.com</a>.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {result.state === 'error' && (
              <div className="bg-amber-50 rounded-2xl border border-amber-300 p-5 text-amber-900 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-sm font-medium">{result.errorMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* 3-Step Verification Guide */}
        {!compact && (
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              How Certificate Verification Works
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0A4D7E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Enter Number</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Type the certificate number or scan the QR code from the document.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0B1F3A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Click Verify</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Our database instantly verifies record validity and candidate credentials.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0A4D7E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">View Certificate</h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Access verified student records, official transcript details, or print validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
