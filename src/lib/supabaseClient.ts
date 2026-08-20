import { createClient, SupabaseClient } from '@supabase/supabase-js';

const CUSTOM_CONFIG_KEY = 'qualifi_supabase_config_v1';

export interface SupabaseCredentials {
  url: string;
  anonKey: string;
  isCustom: boolean;
  configured: boolean;
}

// Read from env or dynamic local storage
export function getSupabaseCredentials(): SupabaseCredentials {
  try {
    const custom = localStorage.getItem(CUSTOM_CONFIG_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        const url = parsed.url.trim();
        const anonKey = parsed.anonKey.trim();
        const configured = Boolean(url && anonKey && !url.includes('your-project') && !anonKey.includes('your-anon-key'));
        return { url, anonKey, isCustom: true, configured };
      }
    }
  } catch (e) {
    console.warn('Error reading custom Supabase configuration:', e);
  }

  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = (env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  const configured = Boolean(url && anonKey && !url.includes('your-project') && !anonKey.includes('your-anon-key'));

  return { url, anonKey, isCustom: false, configured };
}

let activeClient: SupabaseClient | null = null;
let lastClientConfig = '';

export function getSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.configured) {
    activeClient = null;
    lastClientConfig = '';
    return null;
  }

  const currentConfigKey = `${creds.url}:::${creds.anonKey}`;
  if (activeClient && lastClientConfig === currentConfigKey) {
    return activeClient;
  }

  try {
    activeClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    lastClientConfig = currentConfigKey;
    return activeClient;
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    activeClient = null;
    lastClientConfig = '';
    return null;
  }
}

export function isSupabaseReady(): boolean {
  return getSupabase() !== null;
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): boolean {
  const sanitizedUrl = url.trim();
  const sanitizedKey = anonKey.trim();

  if (!sanitizedUrl || !sanitizedKey) {
    return false;
  }

  try {
    localStorage.setItem(
      CUSTOM_CONFIG_KEY,
      JSON.stringify({ 
        url: sanitizedUrl, 
        anonKey: sanitizedKey, 
        updatedAt: new Date().toISOString() 
      })
    );
    activeClient = null;
    lastClientConfig = '';
    getSupabase();
    return true;
  } catch (err) {
    console.error('Failed to persist Supabase credentials:', err);
    return false;
  }
}

export function clearCustomSupabaseCredentials(): void {
  localStorage.removeItem(CUSTOM_CONFIG_KEY);
  activeClient = null;
  lastClientConfig = '';
}

// Test live Supabase connection & certificates table existence
export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<{
  success: boolean;
  message: string;
  tableExists: boolean;
  recordCount?: number;
}> {
  let client: SupabaseClient | null = null;

  if (overrideUrl && overrideKey) {
    try {
      client = createClient(overrideUrl.trim(), overrideKey.trim(), {
        auth: { persistSession: false, autoRefreshToken: false }
      });
    } catch (e: any) {
      return {
        success: false,
        message: `Invalid URL format or credentials: ${e?.message || 'Check URL'}`,
        tableExists: false
      };
    }
  } else {
    client = getSupabase();
  }

  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials are not configured. Please enter your Supabase Project URL and Anon Public Key.',
      tableExists: false
    };
  }

  try {
    // Attempt reading from certificates table
    const { data, error, count } = await client
      .from('certificates')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
        return {
          success: false,
          message: 'Connected to Supabase project, but the "certificates" table was not found. Please run the SQL schema script in your Supabase SQL Editor.',
          tableExists: false
        };
      }
      if (error.code === '42501' || error.message?.toLowerCase().includes('row-level security')) {
        return {
          success: false,
          message: 'Connected, but Row-Level Security (RLS) is blocking access. Please run the RLS policies in the SQL schema.',
          tableExists: true
        };
      }
      return {
        success: false,
        message: `Supabase Error: ${error.message} (Code: ${error.code})`,
        tableExists: false
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase! The "certificates" table is active with ${count ?? data?.length ?? 0} record(s).`,
      tableExists: true,
      recordCount: count ?? data?.length ?? 0
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err?.message || 'Network error or invalid Supabase URL'}`,
      tableExists: false
    };
  }
}

export const SUPABASE_FIX_COLUMNS_SQL = `-- ==============================================================================
-- 🛠️ 1-CLICK FIX / ADD MISSING COLUMNS (RUN IN SUPABASE SQL EDITOR)
-- Safe to run on existing databases — will not delete or overwrite any data.
-- ==============================================================================
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS institute_name TEXT DEFAULT 'Qualifi Health & Safety Training Centre';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS training_provider TEXT DEFAULT 'Qualifi Health & Safety Training Centre';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS course_level TEXT DEFAULT 'Level 3';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS completion_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS instructor_name TEXT DEFAULT 'Training Department';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS verification_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS remarks TEXT DEFAULT 'Official verified qualification record.';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'VALID';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';`;

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- Qualifi Health & Safety Training Centre - Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor if creating table from scratch
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  father_name TEXT,
  course_name TEXT NOT NULL,
  course_level TEXT NOT NULL DEFAULT 'Level 3',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  date_of_birth DATE,
  completion_date DATE DEFAULT CURRENT_DATE,
  instructor_name TEXT DEFAULT 'Training Department',
  institute_name TEXT NOT NULL DEFAULT 'Qualifi Health & Safety Training Centre',
  status TEXT NOT NULL DEFAULT 'VALID', -- 'VALID', 'SUSPENDED', 'REVOKED', 'EXPIRED'
  verification_url TEXT,
  qr_code_url TEXT,
  remarks TEXT DEFAULT 'Official verified qualification record.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Upgrade columns in case table was created with an older schema
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS institute_name TEXT DEFAULT 'Qualifi Health & Safety Training Centre';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS course_level TEXT DEFAULT 'Level 3';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS completion_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS instructor_name TEXT DEFAULT 'Training Department';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS verification_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS remarks TEXT DEFAULT 'Official verified qualification record.';

-- 4. Create high performance indexes for instant verification
CREATE INDEX IF NOT EXISTS idx_certificates_cert_number 
  ON public.certificates (UPPER(TRIM(certificate_number)));

CREATE INDEX IF NOT EXISTS idx_certificates_student_name 
  ON public.certificates (LOWER(TRIM(student_name)));

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 6. Security Policy: Allow public certificate verification reads
DROP POLICY IF EXISTS "Allow public certificate verification reads" ON public.certificates;
CREATE POLICY "Allow public certificate verification reads" 
ON public.certificates 
FOR SELECT 
TO anon, authenticated, public 
USING (true);

-- 7. Security Policy: Allow admin inserts
DROP POLICY IF EXISTS "Allow admin inserts" ON public.certificates;
CREATE POLICY "Allow admin inserts" 
ON public.certificates 
FOR INSERT 
TO anon, authenticated, public 
WITH CHECK (true);

-- 8. Security Policy: Allow admin updates
DROP POLICY IF EXISTS "Allow admin updates" ON public.certificates;
CREATE POLICY "Allow admin updates" 
ON public.certificates 
FOR UPDATE 
TO anon, authenticated, public 
USING (true);

-- 9. Security Policy: Allow admin deletions
DROP POLICY IF EXISTS "Allow admin deletes" ON public.certificates;
CREATE POLICY "Allow admin deletes" 
ON public.certificates 
FOR DELETE 
TO anon, authenticated, public 
USING (true);

-- 10. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
`;

