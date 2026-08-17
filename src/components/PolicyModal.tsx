import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'verification' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    verification: {
      title: 'Certificate Verification Policy & Authenticity Standard',
      icon: ShieldCheck,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Qualifi Health & Safety Training Centre operates a centralized digital certificate verification portal to safeguard employers, regulatory bodies, and candidates against unauthorized or forged credentials.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Purpose of Online Verification</h4>
          <p>
            Every qualification awarded by Qualifi is registered with a unique cryptographic certificate identifier (e.g. <code>QHSTC-YYYY-XXXXX</code>) and indexed within our secure database.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Public Verification Scope</h4>
          <p>
            In compliance with UK data privacy principles, public verification discloses only information required to substantiate competency: Certificate Number, Student Full Name, Course Awarded, Qualification Level, Issue Date, Completion Date, and Current Status (VALID, SUSPENDED, REVOKED, EXPIRED). Private identification details remain strictly protected.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Fraud Prevention & Discrepancies</h4>
          <p>
            Any physical certificate bearing altered text, missing verifiable QR codes, or mismatched certificate numbers is considered null and void. Suspected fraudulent submissions should be reported immediately to <strong>hiqual.com.uk@gmail.com</strong>.
          </p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy & Candidate Data Protection Policy',
      icon: Lock,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Qualifi Health & Safety Training Centre is committed to handling candidate data ethically and transparently in accordance with UK Data Protection Regulations.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Data Collected</h4>
          <p>
            We collect candidate full names, contact emails, enrollment records, examination marks, and attendance details strictly for educational administration, credential issuance, and certificate verification.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Data Security & Storage</h4>
          <p>
            Student data is secured with enterprise-grade encryption and access controls. We never sell or transfer student contact details to third-party marketing companies.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Right to Access & Correction</h4>
          <p>
            Candidates have the right to inspect their records and request corrections by contacting our data officer at <strong>hiqual.com.uk@gmail.com</strong>.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms & Conditions of Training & Certification',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            By enrolling in courses or utilizing the online verification portal of Qualifi Health & Safety Training Centre, you agree to these operational terms.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Course Participation & Assessment</h4>
          <p>
            Certificates are issued only upon satisfactory completion of all theoretical modules, continuous assessments, and mandatory examinations.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Credential Authenticity</h4>
          <p>
            Qualifi reserves the right to suspend or revoke certificates obtained through fraudulent conduct, impersonation, or academic misconduct.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Support & Inquiries</h4>
          <p>
            Official inquiries regarding training schedules or verification queries may be directed to <strong>hiqual.com.uk@gmail.com</strong>.
          </p>
        </div>
      )
    }
  };

  const current = contentMap[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        <div className="bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5 text-[#D6A84F]" />
            <h3 className="font-bold text-base text-white">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {current.body}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
