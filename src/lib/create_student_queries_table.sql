-- ==============================================================================
-- 🚀 1-CLICK SQL SCRIPT TO CREATE "student_queries" TABLE IN SUPABASE
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the student_queries table
CREATE TABLE IF NOT EXISTS public.student_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL DEFAULT 'Training Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'RESOLVED', 'ARCHIVED'
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create high performance indexes
CREATE INDEX IF NOT EXISTS idx_student_queries_created_at 
  ON public.student_queries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_queries_status 
  ON public.student_queries (status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.student_queries ENABLE ROW LEVEL SECURITY;

-- 5. Set up Security Policies for anonymous and authenticated users
DROP POLICY IF EXISTS "Allow public query submissions" ON public.student_queries;
CREATE POLICY "Allow public query submissions" 
ON public.student_queries 
FOR INSERT 
TO anon, authenticated, public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin query reads" ON public.student_queries;
CREATE POLICY "Allow admin query reads" 
ON public.student_queries 
FOR SELECT 
TO anon, authenticated, public 
USING (true);

DROP POLICY IF EXISTS "Allow admin query updates" ON public.student_queries;
CREATE POLICY "Allow admin query updates" 
ON public.student_queries 
FOR UPDATE 
TO anon, authenticated, public 
USING (true);

DROP POLICY IF EXISTS "Allow admin query deletes" ON public.student_queries;
CREATE POLICY "Allow admin query deletes" 
ON public.student_queries 
FOR DELETE 
TO anon, authenticated, public 
USING (true);

-- 6. Reload Supabase PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
