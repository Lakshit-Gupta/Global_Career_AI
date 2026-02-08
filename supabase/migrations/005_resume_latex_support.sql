-- Add LaTeX template support to resumes table
-- Migration: 005_resume_latex_support.sql

-- Add template_used column to store which template was used
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS template_used TEXT DEFAULT 'professional' 
CHECK (template_used IN ('professional', 'modern'));

-- Add latex_source column to store the .tex files as JSON
-- Example: { "main.tex": "content...", "page1sidebar.tex": "content...", "atlacv.cls": "content..." }
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS latex_source JSONB;

-- Add company_name and role_target for context
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS company_name TEXT;

ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS role_target TEXT;

-- Add iteration_count to track how many optimization attempts were made
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS iteration_count INTEGER DEFAULT 1;

-- Add original_filename to store the uploaded PDF filename
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS original_filename TEXT;

-- Add file_url to store the Supabase Storage URL
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Create index on template_used for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_template_used ON resumes(template_used);

-- Create index on company_name for faster searches
CREATE INDEX IF NOT EXISTS idx_resumes_company_name ON resumes(company_name);

-- Add comment to table
COMMENT ON COLUMN resumes.template_used IS 'LaTeX template used: professional (single file) or modern (sidebar)';
COMMENT ON COLUMN resumes.latex_source IS 'JSON object containing all LaTeX source files used to generate the resume';
COMMENT ON COLUMN resumes.iteration_count IS 'Number of optimization iterations performed to reach target ATS score';
