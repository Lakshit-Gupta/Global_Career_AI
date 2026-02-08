-- Add fields for AI Resume Optimizer
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS ats_feedback TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS generation_attempts INTEGER DEFAULT 1;
