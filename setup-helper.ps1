# Database Migration Helper for Supabase Dashboard
# Copy and paste these SQL commands into your Supabase SQL Editor

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUPABASE DATABASE MIGRATION INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Open your Supabase Dashboard" -ForegroundColor Yellow
Write-Host "2. Go to SQL Editor (left sidebar)" -ForegroundColor Yellow
Write-Host "3. Click 'New Query'" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Run the first migration" -ForegroundColor Green
Write-Host "Copy the contents of this file and paste into SQL Editor:" -ForegroundColor White
Write-Host "  -> supabase\migrations\001_initial_schema.sql" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 2: Run the second migration" -ForegroundColor Green
Write-Host "Copy the contents of this file and paste into SQL Editor:" -ForegroundColor White
Write-Host "  -> supabase\migrations\002_profile_enhancements.sql" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OR use this quick copy command:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create a single combined migration file
$migration1 = Get-Content "supabase\migrations\001_initial_schema.sql" -Raw
$migration2 = Get-Content "supabase\migrations\002_profile_enhancements.sql" -Raw

$combined = @"
-- ================================================
-- COMBINED MIGRATION - Run this in Supabase Dashboard
-- ================================================

-- MIGRATION 1: Initial Schema
$migration1

-- MIGRATION 2: Profile Enhancements  
$migration2

-- ================================================
-- Migration Complete!
-- ================================================
"@

$outputPath = "supabase\migrations\COMBINED_MIGRATION.sql"
$combined | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "✅ Created combined migration file:" -ForegroundColor Green
Write-Host "  -> $outputPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this file's contents and paste into Supabase SQL Editor, then click RUN" -ForegroundColor Yellow
Write-Host ""

# Also display instructions for GCP setup
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "NEXT: GCP VERTEX AI SETUP" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

if (Test-Path "vertex-key.json") {
    Write-Host "✅ Found vertex-key.json" -ForegroundColor Green
    Write-Host ""
    Write-Host "Converting to single-line format for .env.local..." -ForegroundColor Yellow
    
    $json = Get-Content "vertex-key.json" -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
    
    Write-Host ""
    Write-Host "Copy this line to your .env.local file:" -ForegroundColor Green
    Write-Host "----------------------------------------" -ForegroundColor Cyan
    Write-Output "GOOGLE_APPLICATION_CREDENTIALS='$json'"
    Write-Host "----------------------------------------" -ForegroundColor Cyan
    Write-Host ""
    
    # Extract project ID
    $jsonObj = Get-Content "vertex-key.json" -Raw | ConvertFrom-Json
    Write-Host "Also add these to .env.local:" -ForegroundColor Green
    Write-Host "GCP_PROJECT_ID=$($jsonObj.project_id)" -ForegroundColor Cyan
    Write-Host "GCP_LOCATION=us-central1" -ForegroundColor Cyan
    Write-Host "GCP_MODEL=claude" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  No vertex-key.json found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow these steps:" -ForegroundColor White
    Write-Host "1. Open GCP Console" -ForegroundColor White
    Write-Host "2. Create service account with Vertex AI access" -ForegroundColor White
    Write-Host "3. Download JSON key as 'vertex-key.json'" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "See GCP_SETUP.md for detailed instructions" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "READY TO START!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "After completing the above:" -ForegroundColor White
Write-Host "1. Apply database migration in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Configure .env.local with GCP credentials" -ForegroundColor White
Write-Host "3. Run: bun dev" -ForegroundColor White
Write-Host "4. Test at: http://localhost:3000/profile/setup" -ForegroundColor White
Write-Host ""
