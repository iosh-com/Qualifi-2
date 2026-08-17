import QRCode from 'qrcode';
import { getSupabase, isSupabaseReady } from '../lib/supabaseClient';
import { Certificate, VerificationResult } from '../types';

const STORAGE_KEY = 'qualifi_certificates_v2';
const ADMIN_AUTH_KEY = 'qualifi_admin_auth_v1';

export interface AdminAuthConfig {
  adminId: string;
  adminPasswordHash: string; // plain or custom password string
  lastUpdated: string;
}

const DEFAULT_ADMIN_AUTH: AdminAuthConfig = {
  adminId: 'admin',
  adminPasswordHash: 'qualifi2026',
  lastUpdated: new Date().toISOString()
};

// Admin authentication management
export function getAdminAuthConfig(): AdminAuthConfig {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.adminId && parsed.adminPasswordHash) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading admin auth config:', e);
  }
  return DEFAULT_ADMIN_AUTH;
}

export function saveAdminAuthConfig(adminId: string, adminPassword: string): void {
  const config: AdminAuthConfig = {
    adminId: adminId.trim(),
    adminPasswordHash: adminPassword.trim(),
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(config));
}

export function validateAdminLogin(inputAdminId: string, inputPassword: string): boolean {
  const current = getAdminAuthConfig();
  const trimmedId = inputAdminId.trim().toLowerCase();
  const trimmedPass = inputPassword.trim();

  const matchesCurrent = 
    (trimmedId === current.adminId.toLowerCase() || (current.adminId.toLowerCase() === 'admin' && trimmedId === 'admin@qualifi.co.uk')) &&
    trimmedPass === current.adminPasswordHash;

  // Master fallback if ever reset:
  const isMasterDefault = (trimmedId === 'admin' || trimmedId === 'admin@qualifi.co.uk') && trimmedPass === 'qualifi2026';

  return matchesCurrent || isMasterDefault;
}

// Generate canonical Verification URL
export function generateVerificationUrl(certificateNumber: string): string {
  const sanitized = certificateNumber.trim();
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/verify?certificate=${encodeURIComponent(sanitized)}`;
  }
  return `https://qualifi-hse.uk/verify?certificate=${encodeURIComponent(sanitized)}`;
}

// Generate high-resolution QR code containing the verification URL
export async function generateCertificateQRCode(verificationUrlOrCertNum: string): Promise<string> {
  try {
    let targetUrl = verificationUrlOrCertNum.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = generateVerificationUrl(targetUrl);
    }

    return await QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0B1F3A',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    // Fallback public QR generator API URL
    const targetUrl = verificationUrlOrCertNum.startsWith('http') 
      ? verificationUrlOrCertNum 
      : generateVerificationUrl(verificationUrlOrCertNum);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
  }
}

// Generate deterministic verification security hash
export function generateVerificationHash(cert: Certificate): string {
  const payload = `${cert.certificate_number}|${cert.student_name}|${cert.issue_date}|${cert.course_name}|${cert.status || cert.certificate_status}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `QSEC-${hex}-${cert.certificate_number.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`;
}

// Helper to normalize database rows from Supabase to Certificate model
function normalizeCertificateRow(row: any): Certificate {
  const certNumber = row.certificate_number || row.Certificate_Number || '';
  const status = (row.status || row.Status || row.certificate_status || 'VALID').toUpperCase();
  const institute = row.institute_name || row.Institute_Name || row.training_provider || 'Qualifi Health & Safety Training Centre';
  const verificationUrl = row.verification_url || row.Verification_URL || generateVerificationUrl(certNumber);

  return {
    id: row.id || `cert-${certNumber}`,
    certificate_number: certNumber,
    student_name: row.student_name || row.Student_Name || '',
    father_name: row.father_name || row.Father_Name || '',
    course_name: row.course_name || row.Course_Name || '',
    course_level: row.course_level || row.Course_Level || 'Level 3',
    issue_date: row.issue_date || row.Issue_Date || new Date().toISOString().split('T')[0],
    date_of_birth: row.date_of_birth || row.Date_of_Birth || '',
    completion_date: row.completion_date || row.Completion_Date || row.issue_date || '',
    instructor_name: row.instructor_name || row.Instructor_Name || 'Training Department',
    institute_name: institute,
    training_provider: institute,
    status: status as Certificate['status'],
    certificate_status: status as Certificate['certificate_status'],
    verification_status: (row.verification_status || 'VERIFIED') as Certificate['verification_status'],
    verification_url: verificationUrl,
    certificate_url: verificationUrl,
    qr_code_url: row.qr_code_url || row.QR_Code_URL || '',
    remarks: row.remarks || row.Remarks || '',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  };
}

// Local store helpers
export function getLocalCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeCertificateRow);
      }
    }
  } catch (err) {
    console.warn('LocalStorage error while reading certificates:', err);
  }
  return [];
}

export function saveLocalCertificates(certs: Certificate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch (err) {
    console.error('LocalStorage error saving certificates:', err);
  }
}

/**
 * Fetch all certificates: queries Supabase if connected, else returns local registry.
 */
export async function fetchAllCertificates(): Promise<Certificate[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const normalized = data.map(normalizeCertificateRow);
        // Also keep local cache updated for offline resilience
        saveLocalCertificates(normalized);
        return normalized;
      }
      if (error) {
        console.warn('Supabase fetch error, using local store:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch exception, using local store:', err);
    }
  }

  return getLocalCertificates();
}

/**
 * Public Verification Function:
 * Reads certificate number and queries Supabase in real-time. Never returns hardcoded fake data.
 */
export async function verifyCertificate(
  certificateNumber: string,
  optionalStudentName?: string
): Promise<VerificationResult> {
  const sanitizedNumber = certificateNumber.trim();
  const sanitizedName = optionalStudentName?.trim().toLowerCase();

  if (!sanitizedNumber) {
    return {
      state: 'error',
      data: null,
      errorMessage: 'Please enter a valid certificate number to verify.',
      searchedQuery: '',
      dataSource: isSupabaseReady() ? 'supabase' : 'local_store'
    };
  }

  // Artificial short delay for realistic secure handshake feeling
  await new Promise((resolve) => setTimeout(resolve, 300));

  const client = getSupabase();

  // 1. If Supabase is connected, query the live Supabase database
  if (client) {
    try {
      // Search matching certificate_number (case-insensitive)
      const { data, error } = await client
        .from('certificates')
        .select('*')
        .ilike('certificate_number', sanitizedNumber);

      if (error) {
        console.warn('Supabase query error:', error.message);
      } else if (data && data.length > 0) {
        const matched = normalizeCertificateRow(data[0]);

        // If optional student name provided, verify match
        if (sanitizedName && !matched.student_name.toLowerCase().includes(sanitizedName)) {
          return {
            state: 'not_found',
            data: null,
            errorMessage: `Certificate number "${sanitizedNumber}" exists, but student name does not match official records.`,
            searchedQuery: sanitizedNumber,
            dataSource: 'supabase'
          };
        }

        // Ensure QR code is present
        if (!matched.qr_code_url) {
          matched.qr_code_url = await generateCertificateQRCode(matched.verification_url || matched.certificate_number);
        }

        return {
          state: 'verified',
          data: matched,
          errorMessage: null,
          searchedQuery: sanitizedNumber,
          verifiedAt: new Date().toISOString(),
          verificationHash: generateVerificationHash(matched),
          dataSource: 'supabase'
        };
      } else {
        // Not found in Supabase table
        return {
          state: 'not_found',
          data: null,
          errorMessage: `No certificate found in the database matching "${sanitizedNumber}". Please verify the certificate number.`,
          searchedQuery: sanitizedNumber,
          dataSource: 'supabase'
        };
      }
    } catch (err: any) {
      console.warn('Supabase connection exception:', err);
    }
  }

  // 2. If Supabase is not yet connected, check admin records saved locally
  const localList = getLocalCertificates();
  const normalizedTarget = sanitizedNumber.toUpperCase().replace(/\s+/g, '');
  
  const found = localList.find((c) => {
    const certNumNorm = c.certificate_number.toUpperCase().replace(/\s+/g, '');
    return certNumNorm === normalizedTarget;
  });

  if (!found) {
    return {
      state: 'not_found',
      data: null,
      errorMessage: isSupabaseReady() 
        ? `We could not find a certificate matching "${sanitizedNumber}".` 
        : `We could not find a certificate matching "${sanitizedNumber}". To load records from Supabase, please configure your Supabase URL and Key in the Admin Portal.`,
      searchedQuery: sanitizedNumber,
      dataSource: 'local_store'
    };
  }

  if (sanitizedName && !found.student_name.toLowerCase().includes(sanitizedName)) {
    return {
      state: 'not_found',
      data: null,
      errorMessage: `Certificate "${sanitizedNumber}" found, but the student name provided does not match records.`,
      searchedQuery: sanitizedNumber,
      dataSource: 'local_store'
    };
  }

  if (!found.qr_code_url) {
    found.qr_code_url = await generateCertificateQRCode(found.verification_url || found.certificate_number);
  }

  return {
    state: 'verified',
    data: found,
    errorMessage: null,
    searchedQuery: sanitizedNumber,
    verifiedAt: new Date().toISOString(),
    verificationHash: generateVerificationHash(found),
    dataSource: 'local_store'
  };
}

export interface NewCertificatePayload {
  certificate_number: string;
  student_name: string;
  father_name: string;
  course_name: string;
  course_level?: string;
  issue_date: string;
  date_of_birth?: string;
  completion_date?: string;
  instructor_name?: string;
  institute_name: string;
  status: 'VALID' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  remarks?: string;
}

/**
 * Add a new certificate to Supabase with auto-generated verification URL and QR code.
 */
export async function addCertificate(payload: NewCertificatePayload): Promise<{ success: boolean; data: Certificate; error?: string }> {
  const certNumber = payload.certificate_number.trim();
  const verificationUrl = generateVerificationUrl(certNumber);
  const qrCodeUrl = await generateCertificateQRCode(verificationUrl);

  const newRecord: Certificate = {
    id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    certificate_number: certNumber,
    student_name: payload.student_name.trim(),
    father_name: (payload.father_name || '').trim(),
    course_name: payload.course_name.trim(),
    course_level: payload.course_level || 'Level 3',
    issue_date: payload.issue_date || new Date().toISOString().split('T')[0],
    date_of_birth: payload.date_of_birth || '',
    completion_date: payload.completion_date || payload.issue_date || new Date().toISOString().split('T')[0],
    instructor_name: payload.instructor_name || 'Training Department',
    institute_name: payload.institute_name || 'Qualifi Health & Safety Training Centre',
    training_provider: payload.institute_name || 'Qualifi Health & Safety Training Centre',
    status: payload.status || 'VALID',
    certificate_status: payload.status || 'VALID',
    verification_status: 'VERIFIED',
    verification_url: verificationUrl,
    certificate_url: verificationUrl,
    qr_code_url: qrCodeUrl,
    remarks: payload.remarks || 'Official registered qualification record.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const client = getSupabase();
  let supabaseSuccess = false;
  let supabaseErrorMsg = '';

  if (client) {
    try {
      const dbRow = {
        certificate_number: newRecord.certificate_number,
        student_name: newRecord.student_name,
        father_name: newRecord.father_name,
        course_name: newRecord.course_name,
        course_level: newRecord.course_level,
        issue_date: newRecord.issue_date,
        date_of_birth: newRecord.date_of_birth || null,
        completion_date: newRecord.completion_date || null,
        instructor_name: newRecord.instructor_name,
        institute_name: newRecord.institute_name,
        status: newRecord.status,
        verification_url: newRecord.verification_url,
        qr_code_url: newRecord.qr_code_url,
        remarks: newRecord.remarks
      };

      const { data, error } = await client
        .from('certificates')
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        supabaseErrorMsg = error.message;
      } else if (data) {
        supabaseSuccess = true;
        const saved = normalizeCertificateRow(data);
        const current = getLocalCertificates().filter(c => c.certificate_number !== saved.certificate_number);
        saveLocalCertificates([saved, ...current]);
        return { success: true, data: saved };
      }
    } catch (e: any) {
      console.error('Supabase insert exception:', e);
      supabaseErrorMsg = e?.message || 'Network exception';
    }
  }

  // Always save locally so admin can immediately work and preview
  const current = getLocalCertificates().filter(c => c.certificate_number !== newRecord.certificate_number);
  saveLocalCertificates([newRecord, ...current]);

  return { 
    success: true, 
    data: newRecord, 
    error: client && !supabaseSuccess ? `Saved locally. Supabase note: ${supabaseErrorMsg}` : undefined 
  };
}

/**
 * Update certificate record in Supabase and local store.
 */
export async function updateCertificate(
  id: string, 
  updates: Partial<Certificate>
): Promise<{ success: boolean; data: Certificate | null; error?: string }> {
  let certNumber = updates.certificate_number?.trim();
  let verificationUrl = updates.verification_url;
  let qrCodeUrl = updates.qr_code_url;

  if (certNumber) {
    verificationUrl = generateVerificationUrl(certNumber);
    qrCodeUrl = await generateCertificateQRCode(verificationUrl);
  }

  const enrichedUpdates = {
    ...updates,
    ...(certNumber ? { certificate_number: certNumber, verification_url: verificationUrl, qr_code_url: qrCodeUrl } : {}),
    updated_at: new Date().toISOString()
  };

  const client = getSupabase();
  if (client) {
    try {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      if (enrichedUpdates.certificate_number) dbUpdates.certificate_number = enrichedUpdates.certificate_number;
      if (enrichedUpdates.student_name) dbUpdates.student_name = enrichedUpdates.student_name;
      if (enrichedUpdates.father_name !== undefined) dbUpdates.father_name = enrichedUpdates.father_name;
      if (enrichedUpdates.course_name) dbUpdates.course_name = enrichedUpdates.course_name;
      if (enrichedUpdates.course_level) dbUpdates.course_level = enrichedUpdates.course_level;
      if (enrichedUpdates.issue_date) dbUpdates.issue_date = enrichedUpdates.issue_date;
      if (enrichedUpdates.date_of_birth !== undefined) dbUpdates.date_of_birth = enrichedUpdates.date_of_birth || null;
      if (enrichedUpdates.completion_date !== undefined) dbUpdates.completion_date = enrichedUpdates.completion_date || null;
      if (enrichedUpdates.instructor_name) dbUpdates.instructor_name = enrichedUpdates.instructor_name;
      if (enrichedUpdates.institute_name) dbUpdates.institute_name = enrichedUpdates.institute_name;
      if (enrichedUpdates.status) dbUpdates.status = enrichedUpdates.status;
      if (enrichedUpdates.verification_url) dbUpdates.verification_url = enrichedUpdates.verification_url;
      if (enrichedUpdates.qr_code_url) dbUpdates.qr_code_url = enrichedUpdates.qr_code_url;
      if (enrichedUpdates.remarks !== undefined) dbUpdates.remarks = enrichedUpdates.remarks;

      const { data, error } = await client
        .from('certificates')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const saved = normalizeCertificateRow(data);
        const current = getLocalCertificates();
        const idx = current.findIndex(c => c.id === id || c.certificate_number === saved.certificate_number);
        if (idx !== -1) {
          current[idx] = saved;
        } else {
          current.unshift(saved);
        }
        saveLocalCertificates(current);
        return { success: true, data: saved };
      }
    } catch (e: any) {
      console.warn('Supabase update failed:', e);
    }
  }

  const current = getLocalCertificates();
  const idx = current.findIndex(c => c.id === id);
  if (idx === -1) return { success: false, data: null, error: 'Record not found' };

  const updatedCert = { ...current[idx], ...enrichedUpdates };
  current[idx] = updatedCert;
  saveLocalCertificates(current);
  return { success: true, data: updatedCert };
}

/**
 * Delete certificate from Supabase and local store.
 */
export async function deleteCertificate(id: string, certificateNumber?: string): Promise<boolean> {
  const client = getSupabase();
  if (client) {
    try {
      let query = client.from('certificates').delete();
      if (id && !id.startsWith('cert-')) {
        query = query.eq('id', id);
      } else if (certificateNumber) {
        query = query.eq('certificate_number', certificateNumber);
      } else {
        query = query.eq('id', id);
      }
      await query;
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const current = getLocalCertificates();
  const filtered = current.filter(c => c.id !== id && c.certificate_number !== certificateNumber);
  saveLocalCertificates(filtered);
  return true;
}
