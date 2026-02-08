# Run this script to apply the foreign key fix migration
# This will execute the SQL directly in your Supabase database

Write-Host "Applying foreign key fix migration..." -ForegroundColor Cyan

# Read the migration file
$migrationSql = Get-Content "supabase\migrations\004_fix_foreign_keys.sql" -Raw

Write-Host "`nMigration SQL:" -ForegroundColor Yellow
Write-Host $migrationSql

Write-Host "`n`nTo apply this migration, you have two options:" -ForegroundColor Green
Write-Host "`n1. Via Supabase Dashboard (Recommended):" -ForegroundColor White
Write-Host "   - Go to: https://supabase.com/dashboard/project/ftzypzggvgiincwnlsgg/sql/new" -ForegroundColor Cyan
Write-Host "   - Copy and paste the SQL above"
Write-Host "   - Click 'Run'" -ForegroundColor Cyan

Write-Host "`n2. Via Command Line (if you have psql installed):" -ForegroundColor White
Write-Host "   Run this command (you'll need your database password):" -ForegroundColor Gray
Write-Host "   psql 'postgresql://postgres:[YOUR_PASSWORD]@db.ftzypzggvgiincwnlsgg.supabase.co:5432/postgres' -c `"$($migrationSql -replace '`"','\"')`"" -ForegroundColor Gray

Write-Host "`n`nAfter applying the migration, try creating your resume again!" -ForegroundColor Green
