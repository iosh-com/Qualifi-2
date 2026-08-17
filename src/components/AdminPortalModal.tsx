import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Database, 
  PlusCircle, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Download, 
  Check, 
  AlertCircle, 
  Search, 
  ShieldCheck,
  FileCode2,
  FileSpreadsheet,
  QrCode,
  ExternalLink,
  Copy,
  Settings,
  UserCheck,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Certificate } from '../types';
import { 
  fetchAllCertificates, 
  addCertificate, 
  updateCertificate, 
  deleteCertificate,
  generateVerificationUrl,
  generateCertificateQRCode,
  validateAdminLogin,
  getAdminAuthConfig,
  saveAdminAuthConfig,
  NewCertificatePayload
} from '../services/certificateService';
import { 
  isSupabaseReady, 
  getSupabaseCredentials, 
  saveCustomSupabaseCredentials, 
  clearCustomSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA 
} from '../lib/supabaseClient';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCertificateUpdated?: () => void;
  onViewCertificate?: (cert: Certificate) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onCertificateUpdated,
  onViewCertificate
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'records' | 'add' | 'supabase_sql' | 'security'>('records');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form State for Adding / Editing Student Record (matching uploaded image columns)
  const [formData, setFormData] = useState<NewCertificatePayload>({
    certificate_number: '',
    student_name: '',
    father_name: '',
    course_name: 'Health & Safety Officer',
    course_level: 'Level 3',
    issue_date: new Date().toISOString().split('T')[0],
    date_of_birth: '1995-05-14',
    completion_date: new Date().toISOString().split('T')[0],
    instructor_name: 'Training Department',
    institute_name: 'Qualifi Health & Safety Training Centre',
    status: 'VALID',
    remarks: 'Official verified qualification record.'
  });

  const [liveVerifyUrl, setLiveVerifyUrl] = useState('');
  const [liveQrCode, setLiveQrCode] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Supabase Settings State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [testResult, setTestResult] = useState<{ testing: boolean; message: string | null; success: boolean | null }>({
    testing: false,
    message: null,
    success: null
  });

  // Admin Security Change Form
  const [newAdminId, setNewAdminId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState('');

  // Load records on modal open
  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setSupabaseUrlInput(creds.url);
      setSupabaseKeyInput(creds.anonKey);
      
      const adminConfig = getAdminAuthConfig();
      setNewAdminId(adminConfig.adminId);

      if (isAuthenticated) {
        loadRecords();
      }
    }
  }, [isOpen, isAuthenticated]);

  // Update Live Verification URL and QR Code whenever Certificate Number changes
  useEffect(() => {
    if (formData.certificate_number.trim()) {
      const url = generateVerificationUrl(formData.certificate_number);
      setLiveVerifyUrl(url);
      setIsGeneratingQr(true);
      generateCertificateQRCode(url).then((qr) => {
        setLiveQrCode(qr);
        setIsGeneratingQr(false);
      });
    } else {
      setLiveVerifyUrl('');
      setLiveQrCode('');
    }
  }, [formData.certificate_number]);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCertificates();
      setCertificates(data);
    } catch (e) {
      console.warn('Failed to load certificates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAdminLogin(adminIdInput, adminPasswordInput)) {
      setIsAuthenticated(true);
      setAuthError(false);
      loadRecords();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPasswordInput('');
    setActiveTab('records');
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.certificate_number.trim() || !formData.student_name.trim() || !formData.course_name.trim()) {
      setSaveStatus({ type: 'error', message: 'Please fill in Certificate Number, Student Name, and Course Name.' });
      return;
    }

    setSaveStatus({ type: 'idle', message: 'Saving certificate to Supabase...' });

    try {
      if (editingId) {
        const res = await updateCertificate(editingId, {
          certificate_number: formData.certificate_number.trim(),
          student_name: formData.student_name.trim(),
          father_name: formData.father_name.trim(),
          course_name: formData.course_name.trim(),
          course_level: formData.course_level,
          issue_date: formData.issue_date,
          date_of_birth: formData.date_of_birth,
          completion_date: formData.completion_date,
          instructor_name: formData.instructor_name,
          institute_name: formData.institute_name,
          training_provider: formData.institute_name,
          status: formData.status,
          certificate_status: formData.status,
          remarks: formData.remarks
        });
        if (res.success) {
          setSaveStatus({ type: 'success', message: 'Record successfully updated in Supabase!' });
          setEditingId(null);
        } else {
          setSaveStatus({ type: 'error', message: res.error || 'Failed to update record.' });
        }
      } else {
        const res = await addCertificate(formData);
        if (res.success) {
          setSaveStatus({ 
            type: 'success', 
            message: `Certificate ${formData.certificate_number} successfully registered in Supabase with verified QR code!` 
          });
        } else {
          setSaveStatus({ type: 'error', message: res.error || 'Failed to add certificate.' });
        }
      }

      await loadRecords();
      onCertificateUpdated?.();

      // Reset form after short delay
      setTimeout(() => {
        if (!editingId) {
          setFormData({
            certificate_number: '',
            student_name: '',
            father_name: '',
            course_name: 'Health & Safety Officer',
            course_level: 'Level 3',
            issue_date: new Date().toISOString().split('T')[0],
            date_of_birth: '1995-05-14',
            completion_date: new Date().toISOString().split('T')[0],
            instructor_name: 'Training Department',
            institute_name: 'Qualifi Health & Safety Training Centre',
            status: 'VALID',
            remarks: 'Official verified qualification record.'
          });
          setActiveTab('records');
        }
        setSaveStatus({ type: 'idle', message: '' });
      }, 1500);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err?.message || 'Error saving record.' });
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      certificate_number: cert.certificate_number,
      student_name: cert.student_name,
      father_name: cert.father_name || '',
      course_name: cert.course_name,
      course_level: cert.course_level || 'Level 3',
      issue_date: cert.issue_date,
      date_of_birth: cert.date_of_birth || '',
      completion_date: cert.completion_date || cert.issue_date,
      instructor_name: cert.instructor_name || 'Training Department',
      institute_name: cert.institute_name || cert.training_provider || 'Qualifi Health & Safety Training Centre',
      status: cert.status || cert.certificate_status || 'VALID',
      remarks: cert.remarks || ''
    });
    setActiveTab('add');
    setSaveStatus({ type: 'idle', message: '' });
  };

  const handleDelete = async (cert: Certificate) => {
    if (confirm(`Are you sure you want to permanently delete certificate "${cert.certificate_number}" from Supabase?`)) {
      await deleteCertificate(cert.id, cert.certificate_number);
      await loadRecords();
      onCertificateUpdated?.();
    }
  };

  const handleStatusToggle = async (cert: Certificate) => {
    const currentStatus = cert.status || cert.certificate_status || 'VALID';
    const nextStatus = currentStatus === 'VALID' ? 'SUSPENDED' : 'VALID';
    await updateCertificate(cert.id, { 
      status: nextStatus, 
      certificate_status: nextStatus 
    });
    await loadRecords();
    onCertificateUpdated?.();
  };

  const handleTestConnection = async () => {
    setTestResult({ testing: true, message: 'Testing Supabase connection...', success: null });
    if (supabaseUrlInput.trim() && supabaseKeyInput.trim()) {
      saveCustomSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
    }
    const result = await testSupabaseConnection();
    setTestResult({
      testing: false,
      message: result.message,
      success: result.success
    });
    if (result.success) {
      loadRecords();
      onCertificateUpdated?.();
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess(false);

    if (!newAdminId.trim()) {
      setSecurityError('Admin ID cannot be empty.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError('Passwords do not match.');
      return;
    }

    const currentConfig = getAdminAuthConfig();
    const finalPassword = newPassword.trim() ? newPassword.trim() : currentConfig.adminPasswordHash;
    saveAdminAuthConfig(newAdminId.trim(), finalPassword);

    setSecuritySuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  const exportCSV = () => {
    const headers = [
      'Certificate_Number',
      'Student_Name',
      'Father_Name',
      'Course_Name',
      'Course_Level',
      'Issue_Date',
      'Date_of_Birth',
      'Institute_Name',
      'Status',
      'Verification_URL'
    ];
    const rows = certificates.map(c => [
      c.certificate_number,
      c.student_name,
      c.father_name || '',
      c.course_name,
      c.course_level || 'Level 3',
      c.issue_date,
      c.date_of_birth || '',
      c.institute_name || c.training_provider || 'Qualifi Health & Safety Training Centre',
      c.status || c.certificate_status || 'VALID',
      c.verification_url || generateVerificationUrl(c.certificate_number)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(item => `"${item}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qualifi_supabase_certificates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyVerificationUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const downloadQrCodeImage = (qrDataUrl: string, certNum: string) => {
    const link = document.createElement('a');
    link.download = `QR_${certNum || 'Certificate'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  const filteredCerts = certificates.filter(c => 
    c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.father_name && c.father_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1456A0] text-[#D6A84F] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
                Qualifi Registry & Supabase Administration
                {isAuthenticated && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Authenticated
                  </span>
                )}
              </h3>
              <p className="text-xs text-blue-200">
                Private Certificate Issuance, Live QR Generation & Cloud Synchronization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1456A0] mx-auto flex items-center justify-center border border-blue-100 shadow-xs">
              <KeyRound className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">Admin Authentication</h4>
              <p className="text-xs text-slate-500">
                Enter your authorized Admin ID and Password to access the registry management system.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin ID
                </label>
                <input
                  type="text"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="Enter Admin ID"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium font-mono"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter Admin Password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Access Denied: Invalid Admin ID or Password.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#D6A84F]" />
                <span>Sign In to Admin Portal</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Admin Tabs */}
            <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { setActiveTab('records'); setEditingId(null); }}
                  className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'records'
                      ? 'bg-white text-[#1456A0] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>All Records ({certificates.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('add');
                    setEditingId(null);
                    setSaveStatus({ type: 'idle', message: '' });
                  }}
                  className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'add'
                      ? 'bg-white text-[#1456A0] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingId ? 'Edit Student Record' : 'Add Student Record & QR'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('supabase_sql')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'supabase_sql'
                      ? 'bg-white text-[#1456A0] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>Supabase Sync & Schema</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'security'
                      ? 'bg-white text-[#1456A0] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Security</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1 cursor-pointer text-xs"
                  title="Export records to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={loadRecords}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1 cursor-pointer text-xs"
                  title="Refresh records from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1456A0]' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* TAB 1: ALL RECORDS */}
            {activeTab === 'records' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search certificate number, student name, father name, course..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Showing {filteredCerts.length} of {certificates.length} records
                    </span>
                    <button
                      onClick={() => { setActiveTab('add'); setEditingId(null); }}
                      className="px-3 py-1.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>

                {certificates.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] mx-auto flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm">No Certificate Records Found</h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Click the "Add Student Record & QR" button above to add your first student record into Supabase with automated QR code verification!
                    </p>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="px-4 py-2 bg-[#1456A0] text-white text-xs font-bold rounded-lg hover:bg-[#0B1F3A] transition cursor-pointer"
                    >
                      + Add New Student Record
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Certificate Number</th>
                            <th className="py-3 px-4">Student & Father Name</th>
                            <th className="py-3 px-4">Course Name</th>
                            <th className="py-3 px-4">Issue Date</th>
                            <th className="py-3 px-4">Date of Birth</th>
                            <th className="py-3 px-4">Institute</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredCerts.map((cert) => (
                            <tr key={cert.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">
                                <div className="flex items-center gap-1.5">
                                  <span>{cert.certificate_number}</span>
                                  {cert.qr_code_url && (
                                    <button
                                      onClick={() => downloadQrCodeImage(cert.qr_code_url!, cert.certificate_number)}
                                      className="text-slate-400 hover:text-[#1456A0] cursor-pointer"
                                      title="Download QR Code"
                                    >
                                      <QrCode className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-900 block">{cert.student_name}</span>
                                <span className="text-[11px] text-slate-500">S/o {cert.father_name || '—'}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-slate-800 block">{cert.course_name}</span>
                                <span className="text-[11px] text-blue-600 font-medium">{cert.course_level || 'Level 3'}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-mono">
                                {cert.issue_date}
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-mono">
                                {cert.date_of_birth || '—'}
                              </td>
                              <td className="py-3 px-4 text-slate-700 max-w-[150px] truncate" title={cert.institute_name}>
                                {cert.institute_name || cert.training_provider || 'Qualifi Health & Safety Training Centre'}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleStatusToggle(cert)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                                    (cert.status || cert.certificate_status) === 'VALID'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  }`}
                                  title="Click to toggle status"
                                >
                                  {cert.status || cert.certificate_status || 'VALID'}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                                {onViewCertificate && (
                                  <button
                                    onClick={() => onViewCertificate(cert)}
                                    className="p-1.5 hover:bg-blue-50 text-[#1456A0] rounded cursor-pointer"
                                    title="View Certificate Document"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEdit(cert)}
                                  className="p-1.5 hover:bg-blue-50 text-blue-600 rounded cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(cert)}
                                  className="p-1.5 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADD / EDIT STUDENT RECORD WITH LIVE QR GENERATION */}
            {activeTab === 'add' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
                
                {saveStatus.type === 'success' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{saveStatus.message}</span>
                  </div>
                )}

                {saveStatus.type === 'error' && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{saveStatus.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Form Fields matching uploaded image */}
                  <form onSubmit={handleSaveCertificate} className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm mb-3">
                        Student Qualification Information
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Certificate_Number */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Certificate Number *
                          </label>
                          <input
                            type="text"
                            value={formData.certificate_number}
                            onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value.toUpperCase() })}
                            placeholder="e.g. QHSTC-2026-00001"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono font-bold text-slate-900"
                            required
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Verification URL and QR code update automatically.</p>
                        </div>

                        {/* Student_Name */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Student Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.student_name}
                            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                            placeholder="e.g. Muhammad Ahmed"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-medium"
                            required
                          />
                        </div>

                        {/* Father_Name */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Father / Guardian Name
                          </label>
                          <input
                            type="text"
                            value={formData.father_name}
                            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                            placeholder="e.g. Ahmed Khan"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none"
                          />
                        </div>

                        {/* Course_Name */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Course Name *
                          </label>
                          <input
                            type="text"
                            value={formData.course_name}
                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                            placeholder="e.g. Health & Safety Officer"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-semibold"
                            required
                          />
                        </div>

                        {/* Issue_Date */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Issue Date *
                          </label>
                          <input
                            type="date"
                            value={formData.issue_date}
                            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono"
                            required
                          />
                        </div>

                        {/* Date_of_Birth */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono"
                          />
                        </div>

                        {/* Institute_Name */}
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Institute Name
                          </label>
                          <input
                            type="text"
                            value={formData.institute_name}
                            onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                            placeholder="Qualifi Health & Safety Training Centre"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none"
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Status *
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-bold"
                          >
                            <option value="VALID">VALID (Active & Verified)</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                            <option value="REVOKED">REVOKED</option>
                            <option value="EXPIRED">EXPIRED</option>
                          </select>
                        </div>

                        {/* Course Level */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Course Level
                          </label>
                          <input
                            type="text"
                            value={formData.course_level}
                            onChange={(e) => setFormData({ ...formData, course_level: e.target.value })}
                            placeholder="Level 3"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Remarks / Verification Notes
                        </label>
                        <input
                          type="text"
                          value={formData.remarks}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                          placeholder="Official verified qualification record."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('records'); setEditingId(null); }}
                        className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-2"
                      >
                        <Database className="w-4 h-4 text-[#D6A84F]" />
                        <span>{editingId ? 'Update in Supabase' : 'Save Record to Supabase'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Right Col: Live Generated QR Code & Verification URL Card */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-between text-center space-y-4">
                    <div className="w-full">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1456A0] font-bold text-[11px] uppercase mb-2">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Live Generated QR Code</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Automated QR & Verification Link</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Encodes direct link to public <code>/verify?certificate={formData.certificate_number || '...'}</code>
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[190px] w-full max-w-[200px]">
                      {isGeneratingQr ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400 py-8">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#1456A0]" />
                          <span className="text-[10px]">Generating QR...</span>
                        </div>
                      ) : liveQrCode ? (
                        <img 
                          src={liveQrCode} 
                          alt="Live Verification QR" 
                          className="w-40 h-40 object-contain"
                        />
                      ) : (
                        <div className="text-slate-400 text-center py-6">
                          <QrCode className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                          <span className="text-[11px] block">Enter a certificate number to generate QR</span>
                        </div>
                      )}
                    </div>

                    {liveVerifyUrl && (
                      <div className="w-full space-y-2">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 text-left">
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Verification URL:</span>
                          <span className="font-mono text-[11px] text-[#1456A0] break-all block">
                            {liveVerifyUrl}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyVerificationUrl(liveVerifyUrl)}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 transition text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                          </button>

                          {liveQrCode && (
                            <button
                              type="button"
                              onClick={() => downloadQrCodeImage(liveQrCode, formData.certificate_number)}
                              className="flex-1 py-1.5 bg-[#0B1F3A] hover:bg-[#1456A0] text-white font-semibold rounded-lg transition text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-[#D6A84F]" />
                              <span>Download QR</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SUPABASE SYNC & SCHEMA */}
            {activeTab === 'supabase_sql' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
                {/* Supabase Connection Setup Panel */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Supabase Project Connection</h4>
                      <p className="text-slate-500 text-xs">
                        Enter your Supabase Project URL and Public Anon API Key to store and query certificates live.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 shadow-2xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSupabaseReady() ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span>{isSupabaseReady() ? 'Supabase Client Active' : 'Not Connected'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={supabaseUrlInput}
                        onChange={(e) => setSupabaseUrlInput(e.target.value)}
                        placeholder="https://xyzprojectid.supabase.co"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Supabase Anon Public API Key
                      </label>
                      <input
                        type="password"
                        value={supabaseKeyInput}
                        onChange={(e) => setSupabaseKeyInput(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={testResult.testing || !supabaseUrlInput || !supabaseKeyInput}
                      className="px-4 py-2 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${testResult.testing ? 'animate-spin' : ''}`} />
                      <span>{testResult.testing ? 'Testing...' : 'Save & Test Supabase Connection'}</span>
                    </button>

                    <button
                      onClick={() => {
                        clearCustomSupabaseCredentials();
                        setSupabaseUrlInput('');
                        setSupabaseKeyInput('');
                        setTestResult({ testing: false, message: 'Custom credentials cleared.', success: null });
                      }}
                      className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                    >
                      Clear Saved Credentials
                    </button>
                  </div>

                  {testResult.message && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>

                {/* SQL Schema Script Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">PostgreSQL SQL Schema for Supabase</h4>
                      <p className="text-slate-500 text-xs">
                        Create the <code>certificates</code> table matching: Certificate_Number, Student_Name, Father_Name, Course_Name, Issue_Date, Date_of_Birth, Institute_Name, Status.
                      </p>
                    </div>
                    <button
                      onClick={copySqlToClipboard}
                      className="px-4 py-2 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-[300px]">
                    <pre>{SUPABASE_SQL_SCHEMA}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ADMIN SECURITY & PASSWORD SETTINGS */}
            {activeTab === 'security' && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs max-w-xl">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">Private Admin Credentials</h4>
                  <p className="text-slate-500 text-xs">
                    Customize your Admin ID and Password. Keep your credentials private so only authorized registry directors can add certificates and generate QR codes.
                  </p>
                </div>

                {securitySuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Admin credentials successfully updated!</span>
                  </div>
                )}

                {securityError && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>{securityError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSecurity} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Admin ID / Username *
                    </label>
                    <input
                      type="text"
                      value={newAdminId}
                      onChange={(e) => setNewAdminId(e.target.value)}
                      placeholder="e.g. admin or director@qualifi.co.uk"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-medium text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-[#1456A0] outline-none font-mono text-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#D6A84F]" />
                      <span>Update Admin Credentials</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
