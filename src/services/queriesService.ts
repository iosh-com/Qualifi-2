import { getSupabase, isSupabaseReady } from '../lib/supabaseClient';
import { StudentQuery, NewStudentQueryPayload } from '../types';

const QUERIES_STORAGE_KEY = 'qualifi_student_queries_backup';

// Initial sample inquiries for demonstration & immediate UI readiness
const INITIAL_DEMO_QUERIES: StudentQuery[] = [
  {
    id: 'qry-demo-001',
    student_name: 'Muhammad Tariq Al-Mansoor',
    email: 'm.tariq@gmail.com',
    phone: '+44 7700 900123',
    subject: 'Health & Safety Officer (Level 3)',
    message: 'Hello, I want to inquire about the upcoming weekend cohort for Level 3 H&S Officer training and certification exam dates.',
    status: 'NEW',
    admin_notes: 'Urgent inquiry for weekend batch.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'qry-demo-002',
    student_name: 'Sarah Elizabeth Jenkins',
    email: 'sarah.jenkins@ecobuild.co.uk',
    phone: '+44 7911 123456',
    subject: 'Corporate Group Safety Training',
    message: 'We require customized ISO 45001 & First Aid at Work on-site training for 25 site engineers at our Manchester project site.',
    status: 'CONTACTED',
    admin_notes: 'Spoke with HR manager. Proposal sent via email.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'qry-demo-003',
    student_name: 'David O\'Connor',
    email: 'david.oc@safework.org',
    phone: '+353 87 123 4567',
    subject: 'Certificate Verification Support',
    message: 'Requesting validation of certificate QHSTC-2026-00001 for candidate employment pre-clearance. Thank you.',
    status: 'RESOLVED',
    admin_notes: 'Verified against database, confirmation email sent.',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to get local queries
export function getLocalQueries(): StudentQuery[] {
  try {
    const raw = localStorage.getItem(QUERIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_QUERIES));
      return INITIAL_DEMO_QUERIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_QUERIES;
  } catch (e) {
    console.warn('Failed to load local student queries:', e);
    return INITIAL_DEMO_QUERIES;
  }
}

// Helper to save local queries
export function saveLocalQueries(queries: StudentQuery[]): void {
  try {
    localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
  } catch (e) {
    console.error('Failed to save student queries to localStorage:', e);
  }
}

/**
 * Submit a new student inquiry/request (from Contact form, Course modal, etc.)
 * Automatically saves to Supabase table `student_queries` and synchronizes locally.
 */
export async function submitStudentQuery(payload: NewStudentQueryPayload): Promise<{
  success: boolean;
  query: StudentQuery;
  message: string;
  source: 'supabase' | 'local_backup';
}> {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `qry-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date().toISOString();

  const newQuery: StudentQuery = {
    id: newId,
    student_name: payload.student_name.trim(),
    email: payload.email.trim(),
    phone: (payload.phone || '').trim(),
    subject: payload.subject.trim() || 'General Inquiry',
    message: payload.message.trim(),
    status: payload.status || 'NEW',
    admin_notes: payload.admin_notes || '',
    created_at: now,
    updated_at: now
  };

  // 1. Immediately store in local cache so user never loses data
  const currentLocal = getLocalQueries();
  const updatedLocal = [newQuery, ...currentLocal.filter(q => q.id !== newQuery.id)];
  saveLocalQueries(updatedLocal);

  // 2. Try inserting into Supabase
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('student_queries')
        .insert([{
          id: newQuery.id,
          student_name: newQuery.student_name,
          email: newQuery.email,
          phone: newQuery.phone,
          subject: newQuery.subject,
          message: newQuery.message,
          status: newQuery.status,
          admin_notes: newQuery.admin_notes,
          created_at: newQuery.created_at,
          updated_at: newQuery.updated_at
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.warn('Supabase query insert warning (fallback active):', error.message);
        return {
          success: true,
          query: newQuery,
          message: 'Saved to local registry backup (Supabase table pending or offline).',
          source: 'local_backup'
        };
      }

      return {
        success: true,
        query: (data as StudentQuery) || newQuery,
        message: 'Successfully submitted and synchronized with Supabase database.',
        source: 'supabase'
      };
    } catch (err: any) {
      console.warn('Supabase submission error:', err);
      return {
        success: true,
        query: newQuery,
        message: 'Saved to local registry backup.',
        source: 'local_backup'
      };
    }
  }

  return {
    success: true,
    query: newQuery,
    message: 'Saved to local storage backup.',
    source: 'local_backup'
  };
}

/**
 * Fetch all student queries (from Supabase or local storage backup)
 */
export async function fetchAllStudentQueries(): Promise<{
  queries: StudentQuery[];
  source: 'supabase' | 'local_store';
  error?: string;
}> {
  const client = getSupabase();
  const localList = getLocalQueries();

  if (!client) {
    return {
      queries: localList,
      source: 'local_store'
    };
  }

  try {
    const { data, error } = await client
      .from('student_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch student queries from Supabase:', error.message);
      return {
        queries: localList,
        source: 'local_store',
        error: error.message
      };
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const mergedMap = new Map<string, StudentQuery>();
      // Put Supabase records
      data.forEach((item: any) => {
        mergedMap.set(item.id, {
          id: item.id,
          student_name: item.student_name || 'Anonymous Student',
          email: item.email || '',
          phone: item.phone || '',
          subject: item.subject || 'General Inquiry',
          message: item.message || '',
          status: item.status || 'NEW',
          admin_notes: item.admin_notes || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at
        });
      });
      // Also merge any local-only queries
      localList.forEach(q => {
        if (!mergedMap.has(q.id)) {
          mergedMap.set(q.id, q);
        }
      });

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      saveLocalQueries(mergedList);

      return {
        queries: mergedList,
        source: 'supabase'
      };
    }

    return {
      queries: localList,
      source: 'local_store'
    };
  } catch (err: any) {
    console.error('Fetch student queries error:', err);
    return {
      queries: localList,
      source: 'local_store',
      error: err?.message || 'Network error'
    };
  }
}

/**
 * Update query status or admin notes
 */
export async function updateStudentQueryStatus(
  id: string,
  status: 'NEW' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED',
  admin_notes?: string
): Promise<{ success: boolean; message: string }> {
  const localList = getLocalQueries();
  const index = localList.findIndex(q => q.id === id);
  const now = new Date().toISOString();

  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      status,
      admin_notes: admin_notes !== undefined ? admin_notes : localList[index].admin_notes,
      updated_at: now
    };
    saveLocalQueries(localList);
  }

  const client = getSupabase();
  if (client) {
    try {
      const updatePayload: any = { status, updated_at: now };
      if (admin_notes !== undefined) {
        updatePayload.admin_notes = admin_notes;
      }

      const { error } = await client
        .from('student_queries')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        return { success: true, message: `Updated locally (Supabase update warning: ${error.message})` };
      }
      return { success: true, message: 'Status updated successfully in Supabase & Local Database.' };
    } catch (e: any) {
      return { success: true, message: 'Updated locally.' };
    }
  }

  return { success: true, message: 'Status updated locally.' };
}

/**
 * Delete a student query
 */
export async function deleteStudentQuery(id: string): Promise<{ success: boolean; message: string }> {
  const localList = getLocalQueries();
  const filtered = localList.filter(q => q.id !== id);
  saveLocalQueries(filtered);

  const client = getSupabase();
  if (client) {
    try {
      const { error } = await client
        .from('student_queries')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: true, message: `Deleted from local backup (Supabase delete warning: ${error.message})` };
      }
      return { success: true, message: 'Deleted query from Supabase and Local storage.' };
    } catch (e: any) {
      return { success: true, message: 'Deleted from local backup.' };
    }
  }

  return { success: true, message: 'Deleted from local backup.' };
}

/**
 * Synchronize all local queries to Supabase database
 */
export async function syncAllQueriesToSupabase(): Promise<{
  success: boolean;
  insertedCount: number;
  message: string;
}> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      insertedCount: 0,
      message: 'Supabase credentials are not connected. Please verify Supabase URL & Anon Key in the SQL setup tab.'
    };
  }

  const localList = getLocalQueries();
  if (localList.length === 0) {
    return {
      success: true,
      insertedCount: 0,
      message: 'No student queries to synchronize.'
    };
  }

  try {
    const payload = localList.map(q => ({
      id: q.id,
      student_name: q.student_name,
      email: q.email,
      phone: q.phone || '',
      subject: q.subject,
      message: q.message,
      status: q.status,
      admin_notes: q.admin_notes || '',
      created_at: q.created_at,
      updated_at: q.updated_at || q.created_at
    }));

    const { error } = await client
      .from('student_queries')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return {
        success: false,
        insertedCount: 0,
        message: `Supabase sync error: ${error.message}. Ensure table "student_queries" has been created.`
      };
    }

    return {
      success: true,
      insertedCount: payload.length,
      message: `Successfully synchronized ${payload.length} student queries to Supabase database!`
    };
  } catch (err: any) {
    return {
      success: false,
      insertedCount: 0,
      message: `Sync failed: ${err?.message || 'Network error'}`
    };
  }
}

/**
 * Export queries to CSV
 */
export function exportQueriesToCSV(queries: StudentQuery[]): void {
  if (!queries || queries.length === 0) {
    alert('No queries available to export.');
    return;
  }

  const headers = ['Query ID', 'Student Name', 'Email', 'Phone', 'Subject', 'Status', 'Date Received', 'Message', 'Admin Notes'];
  const rows = queries.map(q => [
    `"${q.id}"`,
    `"${(q.student_name || '').replace(/"/g, '""')}"`,
    `"${(q.email || '').replace(/"/g, '""')}"`,
    `"${(q.phone || '').replace(/"/g, '""')}"`,
    `"${(q.subject || '').replace(/"/g, '""')}"`,
    `"${q.status}"`,
    `"${new Date(q.created_at).toLocaleString()}"`,
    `"${(q.message || '').replace(/"/g, '""')}"`,
    `"${(q.admin_notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Qualifi_Student_Queries_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
