-- Fix foreign key constraints to reference auth.users directly
-- This solves the issue where users exist in auth.users but not in public.users

-- Drop existing foreign key constraints and recreate them to reference auth.users
ALTER TABLE public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;
ALTER TABLE public.resumes ADD CONSTRAINT resumes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_user_id_fkey;
ALTER TABLE public.applications ADD CONSTRAINT applications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_user_id_fkey;
ALTER TABLE public.saved_jobs ADD CONSTRAINT saved_jobs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.interview_sessions DROP CONSTRAINT IF EXISTS interview_sessions_user_id_fkey;
ALTER TABLE public.interview_sessions ADD CONSTRAINT interview_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure the public.users trigger still works for any additional metadata
-- but it won't block operations if a user isn't in public.users yet
