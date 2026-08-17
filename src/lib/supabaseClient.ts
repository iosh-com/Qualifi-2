import { createClient, SupabaseClient } from '@supabase/supabase-js';

const CUSTOM_CONFIG_KEY = 'qualifi_supabase_config_v1';

// Read from env or dynamic storage
export function getSupabaseCredentials(): { url: string; anonKey: string; isCustom: boolean } {
  try {
    const custom = localStorage.getItem(CUSTOM_CONFIG_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), isCustom: true };
      }
    }
  } catch (e) {
    console.warn('Error reading custom Supabase configuration:', e);
  }

  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = (env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();

  return { url, anonKey, isCustom: false };
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): void {
  localStorage.setItem(
    CUSTOM_CONFIG_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim(), updatedAt: new Date().toISOString() })
  );
  initClient();
}

export function clearCustomSupabaseCredentials(): void {
  localStorage.removeItem(CUSTOM_CONFIG_KEY);
  initClient();
}

let activeClient: SupabaseClient | null = null;

function initClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey && !url.includes('your-project') && !anonKey.includes('your-anon-key')) {
    try {
      activeClient = createClient(url, anonKey);
      return activeClient;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      activeClient = null;
      return null;
    }
  }
  activeClient = null;
  return null;
}

initClient();

export function getSupabase(): SupabaseClient | null {
  if (!activeClient) {
    return initClient();
  }
  return activeClient;
}

export const supabase = getSupabase();

export function isSupabaseReady(): boolean {
  const client = getSupabase();
  return client !== null;
}

// Test live Supabase connection
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; recordCount?: number }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials not configured. Please enter your Supabase Project URL and Anon API Key.'
    };
  }

  try {
    const { data, error, count } = await client
      .from('certificates')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Connected to Supabase, but "certificates" table was not found. Please run the SQL schema in your Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Supabase Error: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase "certificates" table!',
      recordCount: count ?? data?.length ?? 0
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection test failed: ${err?.message || 'Network error'}`
    };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- Qualifi Health & Safety Training Centre - Supabase Database Schema
-- Columns: Certificate_Number, Student_Name, Father_Name, Course_Name,
-- Issue_Date, Date_of_Birth, Institute_Name, Status, Verification_URL, QR_Code_URL
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
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create high performance indexes for instant verification searches
CREATE INDEX IF NOT EXISTS idx_certificates_cert_number 
  ON public.certificates (UPPER(TRIM(certificate_number)));

CREATE INDEX IF NOT EXISTS idx_certificates_student_name 
  ON public.certificates (LOWER(TRIM(student_name)));

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 5. Security Policy: Allow public verification reads
DROP POLICY IF EXISTS "Allow public certificate verification reads" ON public.certificates;
CREATE POLICY "Allow public certificate verification reads" 
ON public.certificates 
FOR SELECT 
TO anon, authenticated, public 
USING (true);

-- 6. Security Policy: Allow admin inserts
DROP POLICY IF EXISTS "Allow admin inserts" ON public.certificates;
CREATE POLICY "Allow admin inserts" 
ON public.certificates 
FOR INSERT 
TO anon, authenticated, public 
WITH CHECK (true);

-- 7. Security Policy: Allow admin updates
DROP POLICY IF EXISTS "Allow admin updates" ON public.certificates;
CREATE POLICY "Allow admin updates" 
ON public.certificates 
FOR UPDATE 
TO anon, authenticated, public 
USING (true);

-- 8. Security Policy: Allow admin deletions
DROP POLICY IF EXISTS "Allow admin deletes" ON public.certificates;
CREATE POLICY "Allow admin deletes" 
ON public.certificates 
FOR DELETE 
TO anon, authenticated, public 
USING (true);
`;
