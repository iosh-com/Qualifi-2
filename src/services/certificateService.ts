import QRCode from 'qrcode';
import { getSupabase, isSupabaseReady } from '../lib/supabaseClient';
import { Certificate, VerificationResult } from '../types';

const STORAGE_KEY = 'qualifi_certificates_v2';
const ADMIN_AUTH_KEY = 'qualifi_admin_auth_v1';

export interface AdminAuthConfig {
  adminId: string;
  adminPasswordHash: string;
  lastUpdated: string;
}

const DEFAULT_ADMIN_AUTH: AdminAuthConfig = {
  adminId: 'QHSTC5305',
  adminPasswordHash: 'QUALIFI03.',
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

  return trimmedId === current.adminId.trim().toLowerCase() && trimmedPass === current.adminPasswordHash.trim();
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

// Helper to sanitize dates for PostgreSQL
function sanitizeDate(dateStr: string | undefined | null): string | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === '') return null;
  // If valid format (e.g. YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.split('T')[0];
  }
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // ignore
  }
  return null;
}

// Helper to normalize database rows from Supabase or Local Storage
function normalizeCertificateRow(row: any): Certificate {
  const certNumber = row.certificate_number || row.Certificate_Number || '';
  const status = (row.status || row.Status || row.certificate_status || 'VALID').toUpperCase();
  const institute = row.institute_name || row.Institute_Name || row.training_provider || 'Qualifi Health & Safety Training Centre';
  const verificationUrl = row.verification_url || row.Verification_URL || generateVerificationUrl(certNumber);

  return {
    id: row.id ? String(row.id) : `cert-${certNumber}`,
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
    remarks: row.remarks || row.Remarks || 'Official registered qualification record.',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString()
  };
}

// Local storage helpers
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
 * Fetch all certificates: queries Supabase if configured and merges with local backup.
 * Automatically synchronizes any local-only records to Supabase Cloud in background.
 */
export async function fetchAllCertificates(): Promise<Certificate[]> {
  const localList = getLocalCertificates();
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        const supabaseCerts = data.map(normalizeCertificateRow);
        
        // Merge: Supabase records are the source of truth
        const certMap = new Map<string, Certificate>();
        
        for (const loc of localList) {
          certMap.set(loc.certificate_number.toUpperCase().trim(), loc);
        }

        for (const sb of supabaseCerts) {
          certMap.set(sb.certificate_number.toUpperCase().trim(), sb);
        }

        const merged = Array.from(certMap.values());
        saveLocalCertificates(merged);

        // Auto-sync any local-only certificates to Supabase in background
        const supabaseCertNums = new Set(supabaseCerts.map(c => c.certificate_number.toUpperCase().trim()));
        const missingInSupabase = localList.filter(l => !supabaseCertNums.has(l.certificate_number.toUpperCase().trim()));
        
        if (missingInSupabase.length > 0) {
          console.log(`Auto-syncing ${missingInSupabase.length} offline/local certificate(s) to Supabase Cloud...`);
          syncAllToSupabase().catch(err => console.warn('Background auto-sync error:', err));
        }

        return merged;
      }
      if (error) {
        console.warn('Supabase fetch returned error, using local registry:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch exception, using local registry:', err);
    }
  }

  return localList;
}

/**
 * Public Verification Function: Queries Supabase in real-time with resilient multi-strategy search.
 */
export async function verifyCertificate(
  certificateNumber: string,
  optionalStudentName?: string
): Promise<VerificationResult> {
  let sanitizedNumber = certificateNumber.trim();
  try {
    sanitizedNumber = decodeURIComponent(sanitizedNumber).trim();
  } catch {
    // ignore decode error
  }

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

  // Brief delay for smooth verification UX
  await new Promise((resolve) => setTimeout(resolve, 200));

  const client = getSupabase();
  const normalizedSearchCode = sanitizedNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // 1. If Supabase is connected, query live cloud database with multiple fallback strategies
  if (client) {
    try {
      // Strategy 1: Exact / Case-insensitive match on certificate_number
      let { data, error } = await client
        .from('certificates')
        .select('*')
        .ilike('certificate_number', sanitizedNumber);

      // Strategy 2: If not found, try stripped without hyphens/spaces or with wildcard
      if ((!data || data.length === 0) && normalizedSearchCode) {
        const fallbackRes = await client
          .from('certificates')
          .select('*')
          .or(`certificate_number.ilike.%${sanitizedNumber}%,certificate_number.ilike.%${normalizedSearchCode}%`);
        
        if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
          data = fallbackRes.data;
          error = null;
        }
      }

      // Strategy 3: Search by full table scan normalized in memory
      if (!data || data.length === 0) {
        const allRes = await client.from('certificates').select('*').limit(200);
        if (!allRes.error && allRes.data && allRes.data.length > 0) {
          const matched = allRes.data.find((row: any) => {
            const rowNum = (row.certificate_number || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const targetNum = normalizedSearchCode;
            return rowNum === targetNum || (targetNum.length >= 4 && rowNum.includes(targetNum)) || (rowNum.length >= 4 && targetNum.includes(rowNum));
          });
          if (matched) {
            data = [matched];
            error = null;
          }
        }
      }

      if (!error && data && data.length > 0) {
        const matched = normalizeCertificateRow(data[0]);

        if (sanitizedName && !matched.student_name.toLowerCase().includes(sanitizedName)) {
          return {
            state: 'not_found',
            data: null,
            errorMessage: `Certificate number "${sanitizedNumber}" exists, but candidate name does not match official records.`,
            searchedQuery: sanitizedNumber,
            dataSource: 'supabase'
          };
        }

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
      }
    } catch (err: any) {
      console.warn('Supabase live query exception:', err);
    }
  }

  // 2. Query local registry store as resilient backup
  const localList = getLocalCertificates();
  
  const found = localList.find((c) => {
    const certNumNorm = c.certificate_number.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return certNumNorm === normalizedSearchCode || c.certificate_number.toUpperCase().trim() === sanitizedNumber.toUpperCase();
  });

  if (!found) {
    return {
      state: 'not_found',
      data: null,
      errorMessage: `We could not find a certificate matching "${sanitizedNumber}". Please verify the certificate number or ensure the record was saved to the central registry.`,
      searchedQuery: sanitizedNumber,
      dataSource: isSupabaseReady() ? 'supabase' : 'local_store'
    };
  }

  if (sanitizedName && !found.student_name.toLowerCase().includes(sanitizedName)) {
    return {
      state: 'not_found',
      data: null,
      errorMessage: `Certificate "${sanitizedNumber}" found, but the student name does not match records.`,
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

export interface AddCertificateResult {
  success: boolean;
  savedToSupabase: boolean;
  data: Certificate;
  error?: string;
  warning?: string;
  missingColumns?: string[];
}

// Resilient write helper that automatically handles missing columns in Supabase schema cache
async function resilientSupabaseUpsert(
  client: any,
  initialRow: Record<string, any>,
  conflictField: string = 'certificate_number'
): Promise<{ success: boolean; data?: any; error?: string; missingColumns?: string[] }> {
  let currentRow = { ...initialRow };
  const missingCols: string[] = [];

  for (let attempt = 0; attempt < 8; attempt++) {
    // 1. Try Upsert
    const { data: upsertData, error: upsertError } = await client
      .from('certificates')
      .upsert([currentRow], { onConflict: conflictField })
      .select('*');

    if (!upsertError && upsertData && upsertData.length > 0) {
      return { success: true, data: upsertData[0], missingColumns: missingCols };
    }

    const errCode = upsertError?.code;
    const errMsg = upsertError?.message || '';

    // Check if error is missing column in PostgREST schema cache (PGRST204 or message)
    if (errCode === 'PGRST204' || errMsg.includes('column of \'certificates\' in the schema cache') || errMsg.toLowerCase().includes('could not find the')) {
      const match = errMsg.match(/'([^']+)' column/) || errMsg.match(/column\s+"?([a-zA-Z0-9_]+)"?/i);
      const missingCol = match ? match[1] : null;

      if (missingCol && missingCol in currentRow) {
        missingCols.push(missingCol);
        
        // If institute_name was missing, try alias training_provider if available
        if (missingCol === 'institute_name' && !('training_provider' in currentRow) && !missingCols.includes('training_provider')) {
          currentRow.training_provider = currentRow.institute_name;
        }

        delete currentRow[missingCol];
        console.warn(`Supabase missing column '${missingCol}'. Automatically adapting payload (attempt ${attempt + 1})...`);
        continue;
      }
    }

    // 2. If Upsert failed (e.g. no unique constraint on conflictField), try manual lookup and update/insert
    const certNum = currentRow.certificate_number || initialRow.certificate_number;
    if (certNum) {
      const { data: existing } = await client
        .from('certificates')
        .select('id')
        .ilike('certificate_number', certNum);

      if (existing && existing.length > 0) {
        const { data: updateData, error: updateError } = await client
          .from('certificates')
          .update(currentRow)
          .eq('id', existing[0].id)
          .select('*');

        if (!updateError && updateData && updateData.length > 0) {
          return { success: true, data: updateData[0], missingColumns: missingCols };
        }

        if (updateError) {
          const m = updateError.message.match(/'([^']+)' column/) || updateError.message.match(/column\s+"?([a-zA-Z0-9_]+)"?/i);
          if (m && m[1] in currentRow) {
            missingCols.push(m[1]);
            delete currentRow[m[1]];
            continue;
          }
        }
      } else {
        const { data: insertData, error: insertError } = await client
          .from('certificates')
          .insert([currentRow])
          .select('*');

        if (!insertError && insertData && insertData.length > 0) {
          return { success: true, data: insertData[0], missingColumns: missingCols };
        }

        if (insertError) {
          const m = insertError.message.match(/'([^']+)' column/) || insertError.message.match(/column\s+"?([a-zA-Z0-9_]+)"?/i);
          if (m && m[1] in currentRow) {
            missingCols.push(m[1]);
            delete currentRow[m[1]];
            continue;
          }
          return { success: false, error: `${insertError.message} (Code: ${insertError.code})` };
        }
      }
    }

    if (upsertError) {
      return { success: false, error: `${upsertError.message} (Code: ${upsertError.code})` };
    }
  }

  return { success: false, error: 'Could not adapt record payload to Supabase schema.' };
}

// Resilient update helper
async function resilientSupabaseUpdate(
  client: any,
  queryTarget: { id?: string; certNumber?: string },
  initialUpdates: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string; missingColumns?: string[] }> {
  let currentUpdates = { ...initialUpdates };
  const missingCols: string[] = [];

  for (let attempt = 0; attempt < 8; attempt++) {
    let query = client.from('certificates').update(currentUpdates);
    if (queryTarget.id && !queryTarget.id.startsWith('cert-')) {
      query = query.eq('id', queryTarget.id);
    } else if (queryTarget.certNumber) {
      query = query.ilike('certificate_number', queryTarget.certNumber);
    } else if (queryTarget.id) {
      query = query.eq('id', queryTarget.id);
    }

    const { data, error } = await query.select('*');

    if (!error && data && data.length > 0) {
      return { success: true, data: data[0], missingColumns: missingCols };
    }

    if (error) {
      const errMsg = error.message || '';
      if (error.code === 'PGRST204' || errMsg.includes('column of \'certificates\' in the schema cache') || errMsg.toLowerCase().includes('could not find the')) {
        const match = errMsg.match(/'([^']+)' column/) || errMsg.match(/column\s+"?([a-zA-Z0-9_]+)"?/i);
        const missingCol = match ? match[1] : null;

        if (missingCol && missingCol in currentUpdates) {
          missingCols.push(missingCol);
          delete currentUpdates[missingCol];
          console.warn(`Supabase update missing column '${missingCol}'. Adapting update (attempt ${attempt + 1})...`);
          continue;
        }
      }
      return { success: false, error: `${error.message} (Code: ${error.code})` };
    }

    return { success: false, error: 'No matching record found in Supabase to update.' };
  }

  return { success: false, error: 'Could not complete update in Supabase.' };
}

/**
 * Add a new certificate: stores locally and automatically persists to Supabase cloud.
 */
export async function addCertificate(
  payload: NewCertificatePayload
): Promise<{
  success: boolean;
  savedToSupabase: boolean;
  data: Certificate;
  error?: string;
  warning?: string;
  missingColumns?: string[];
}> {
  const certNumber = payload.certificate_number.trim().toUpperCase();
  const verificationUrl = generateVerificationUrl(certNumber);
  const qrCodeUrl = await generateCertificateQRCode(verificationUrl);

  const newRecord: Certificate = {
    id: `cert-${certNumber}`,
    certificate_number: certNumber,
    student_name: payload.student_name.trim(),
    father_name: payload.father_name?.trim() || '',
    course_name: payload.course_name.trim(),
    course_level: payload.course_level || 'Level 3',
    issue_date: sanitizeDate(payload.issue_date) || new Date().toISOString().split('T')[0],
    date_of_birth: sanitizeDate(payload.date_of_birth) || '',
    completion_date: sanitizeDate(payload.completion_date) || sanitizeDate(payload.issue_date) || new Date().toISOString().split('T')[0],
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

  // Always store in local cache first so admin never loses the record
  const currentList = getLocalCertificates().filter(
    c => c.certificate_number.toUpperCase().trim() !== certNumber.toUpperCase()
  );
  saveLocalCertificates([newRecord, ...currentList]);

  const client = getSupabase();
  if (!client) {
    return {
      success: true,
      savedToSupabase: false,
      data: newRecord,
      warning: 'Saved to local browser storage. To store permanently in your Supabase cloud database, configure your Supabase Project URL & Anon Key in the "Supabase Sync & Schema" tab.'
    };
  }

  // Prepare database row
  const dbRow = {
    certificate_number: newRecord.certificate_number,
    student_name: newRecord.student_name,
    father_name: newRecord.father_name || null,
    course_name: newRecord.course_name,
    course_level: newRecord.course_level,
    issue_date: sanitizeDate(newRecord.issue_date),
    date_of_birth: sanitizeDate(newRecord.date_of_birth),
    completion_date: sanitizeDate(newRecord.completion_date),
    instructor_name: newRecord.instructor_name,
    institute_name: newRecord.institute_name,
    status: newRecord.status,
    verification_url: newRecord.verification_url,
    qr_code_url: newRecord.qr_code_url,
    remarks: newRecord.remarks
  };

  try {
    const res = await resilientSupabaseUpsert(client, dbRow, 'certificate_number');
    if (res.success && res.data) {
      const saved = normalizeCertificateRow(res.data);
      const updatedList = getLocalCertificates().filter(
        c => c.certificate_number.toUpperCase().trim() !== certNumber.toUpperCase()
      );
      saveLocalCertificates([saved, ...updatedList]);
      return {
        success: true,
        savedToSupabase: true,
        data: saved,
        missingColumns: res.missingColumns
      };
    } else {
      return {
        success: true,
        savedToSupabase: false,
        data: newRecord,
        error: res.error || 'Failed to save record to Supabase.'
      };
    }
  } catch (err: any) {
    console.error('Supabase write exception:', err);
    return {
      success: true,
      savedToSupabase: false,
      data: newRecord,
      error: `Supabase Network Exception: ${err?.message || 'Failed to connect to Supabase.'}`
    };
  }
}

/**
 * Update certificate in Supabase and local store.
 */
export async function updateCertificate(
  id: string, 
  updates: Partial<Certificate>
): Promise<{ success: boolean; data: Certificate | null; error?: string; missingColumns?: string[] }> {
  let certNumber = updates.certificate_number?.trim();
  let verificationUrl = updates.verification_url;
  let qrCodeUrl = updates.qr_code_url;

  if (certNumber) {
    verificationUrl = generateVerificationUrl(certNumber);
    qrCodeUrl = await generateCertificateQRCode(verificationUrl);
  }

  const enrichedUpdates: Partial<Certificate> = {
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
      if (enrichedUpdates.father_name !== undefined) dbUpdates.father_name = enrichedUpdates.father_name || null;
      if (enrichedUpdates.course_name) dbUpdates.course_name = enrichedUpdates.course_name;
      if (enrichedUpdates.course_level) dbUpdates.course_level = enrichedUpdates.course_level;
      if (enrichedUpdates.issue_date) dbUpdates.issue_date = sanitizeDate(enrichedUpdates.issue_date);
      if (enrichedUpdates.date_of_birth !== undefined) dbUpdates.date_of_birth = sanitizeDate(enrichedUpdates.date_of_birth);
      if (enrichedUpdates.completion_date !== undefined) dbUpdates.completion_date = sanitizeDate(enrichedUpdates.completion_date);
      if (enrichedUpdates.instructor_name) dbUpdates.instructor_name = enrichedUpdates.instructor_name;
      if (enrichedUpdates.institute_name) dbUpdates.institute_name = enrichedUpdates.institute_name;
      if (enrichedUpdates.status) dbUpdates.status = enrichedUpdates.status;
      if (enrichedUpdates.verification_url) dbUpdates.verification_url = enrichedUpdates.verification_url;
      if (enrichedUpdates.qr_code_url) dbUpdates.qr_code_url = enrichedUpdates.qr_code_url;
      if (enrichedUpdates.remarks !== undefined) dbUpdates.remarks = enrichedUpdates.remarks;

      const res = await resilientSupabaseUpdate(client, { id, certNumber }, dbUpdates);

      if (res.success && res.data) {
        const saved = normalizeCertificateRow(res.data);
        const current = getLocalCertificates();
        const idx = current.findIndex(c => c.id === id || c.certificate_number === saved.certificate_number);
        if (idx !== -1) {
          current[idx] = saved;
        } else {
          current.unshift(saved);
        }
        saveLocalCertificates(current);
        return { success: true, data: saved, missingColumns: res.missingColumns };
      }
    } catch (e: any) {
      console.warn('Supabase update failed:', e);
    }
  }

  const current = getLocalCertificates();
  const idx = current.findIndex(c => c.id === id || (certNumber && c.certificate_number.toUpperCase() === certNumber.toUpperCase()));
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
      if (id && !id.startsWith('cert-')) {
        await client.from('certificates').delete().eq('id', id);
      } else if (certificateNumber) {
        await client.from('certificates').delete().ilike('certificate_number', certificateNumber.trim());
      }
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const current = getLocalCertificates();
  const filtered = current.filter(c => c.id !== id && c.certificate_number !== certificateNumber);
  saveLocalCertificates(filtered);
  return true;
}

/**
 * Batch synchronize all local records to Supabase.
 */
export async function syncAllToSupabase(): Promise<{
  success: boolean;
  syncedCount: number;
  totalCount: number;
  errors: string[];
}> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      syncedCount: 0,
      totalCount: 0,
      errors: ['Supabase is not configured. Please enter your Project URL and Anon API key.']
    };
  }

  const localCerts = getLocalCertificates();
  if (localCerts.length === 0) {
    return { success: true, syncedCount: 0, totalCount: 0, errors: [] };
  }

  let syncedCount = 0;
  const errors: string[] = [];

  for (const cert of localCerts) {
    try {
      const dbRow = {
        certificate_number: cert.certificate_number.trim(),
        student_name: cert.student_name.trim(),
        father_name: cert.father_name || null,
        course_name: cert.course_name.trim(),
        course_level: cert.course_level || 'Level 3',
        issue_date: sanitizeDate(cert.issue_date) || new Date().toISOString().split('T')[0],
        date_of_birth: sanitizeDate(cert.date_of_birth),
        completion_date: sanitizeDate(cert.completion_date),
        instructor_name: cert.instructor_name || 'Training Department',
        institute_name: cert.institute_name || 'Qualifi Health & Safety Training Centre',
        status: cert.status || 'VALID',
        verification_url: cert.verification_url || generateVerificationUrl(cert.certificate_number),
        qr_code_url: cert.qr_code_url || '',
        remarks: cert.remarks || 'Official registered qualification record.'
      };

      const res = await resilientSupabaseUpsert(client, dbRow, 'certificate_number');

      if (res.success) {
        syncedCount++;
      } else {
        errors.push(`${cert.certificate_number}: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      errors.push(`${cert.certificate_number}: ${err?.message || 'Sync error'}`);
    }
  }

  return {
    success: errors.length === 0,
    syncedCount,
    totalCount: localCerts.length,
    errors
  };
}

