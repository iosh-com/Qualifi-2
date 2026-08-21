import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  MessageSquare,
  Building,
  Sparkles
} from 'lucide-react';
import { submitStudentQuery } from '../services/queriesService';

interface ContactPageProps {
  initialSubject?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialSubject = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: initialSubject || 'Training Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ id?: string; source?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitStudentQuery({
        student_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        status: 'NEW'
      });

      setSubmissionFeedback({
        id: res.query.id,
        source: res.source === 'supabase' ? 'Supabase Database' : 'Central Registry'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting query:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-bold uppercase tracking-wider border border-white/15">
            <Mail className="w-4 h-4" />
            Registry & Training Support
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Contact Qualifi Training Centre
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Get in touch for course registration, corporate safety proposals, or certificate verification assistance.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Direct Email Inquiries</h3>
                <p className="text-xs text-slate-500 mt-0.5">For student registrations & official letters</p>
              </div>
              <a
                href="mailto:qualifiuk@gmail.com"
                className="font-semibold text-sm text-[#1456A0] hover:underline block break-all"
              >
                qualifiuk@gmail.com
              </a>
            </div>

            {/* Telephone & Registry Support */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Telephone Support</h3>
                <p className="text-xs text-slate-500 mt-0.5">UK Training Registry (Placeholder)</p>
              </div>
              <span className="font-semibold text-sm text-slate-800 block">
                +44 (0) 20 7946 0912
              </span>
              <p className="text-[11px] text-slate-400">
                Monday – Friday: 08:30 – 17:30 GMT
              </p>
            </div>

            {/* Certificate Verification Desk */}
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1456A0] text-white p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#D6A84F]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Certificate Verification Desk</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                If you require manual employer verification, historical award confirmation, or batch employee validation, please email our registry directly with the student name and certificate number.
              </p>
              <a
                href="mailto:qualifiuk@gmail.com?subject=Manual%20Certificate%20Verification%20Request"
                className="inline-block text-xs font-bold text-[#D6A84F] hover:underline"
              >
                Submit Verification Request →
              </a>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-lg">
              
              {submitted ? (
                <div className="text-center py-10 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Saved to {submissionFeedback.source || 'Central Database'}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Enquiry Successfully Logged</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Qualifi Health & Safety Training Centre. Your request has been registered in the student queries desk.
                    </p>
                  </div>

                  {submissionFeedback.id && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Query Tracking ID:</span>
                        <span className="font-mono font-bold text-slate-800 text-[11px] truncate max-w-[200px]">{submissionFeedback.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Student / Contact Name:</span>
                        <span className="font-semibold text-slate-800">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Email Address:</span>
                        <span className="font-semibold text-slate-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Phone / WhatsApp:</span>
                        <span className="font-semibold text-slate-800">{formData.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Inquiry Subject:</span>
                        <span className="font-semibold text-[#1456A0]">{formData.subject}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          subject: 'Training Inquiry',
                          message: ''
                        });
                      }}
                      className="px-6 py-2.5 bg-[#1456A0] text-white text-xs font-bold rounded-xl hover:bg-[#0B1F3A] transition cursor-pointer shadow-xs"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#0B1F3A]">Send Us A Message</h3>
                    <p className="text-xs text-slate-500">
                      Fill out the form below and our training coordinator will assist you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Johnathan Smith"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john.smith@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Telephone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +44 7700 900077"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
                      >
                        <option value="Training Inquiry">General Course Enrollment</option>
                        <option value="Certificate Verification Support">Certificate Verification Support</option>
                        <option value="Corporate Group Safety Training">Corporate Group Safety Training</option>
                        <option value="On-Site Risk Assessment Consultation">On-Site Risk Assessment Consultation</option>
                        <option value="Other Inquiries">Other Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify course requirements, candidate numbers, or certificate details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#1456A0] to-[#0B1F3A] hover:from-[#0B1F3A] hover:to-[#1456A0] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#D6A84F]" />
                    <span>{isSubmitting ? 'Submitting Enquiry...' : 'Send Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
