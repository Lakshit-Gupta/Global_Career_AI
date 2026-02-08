# Quick Start Guide - Polyglot Hire

## 🚀 GET STARTED IN 5 MINUTES

This guide will help you set up Profile Setup and AI Resume Generation features.

---

## STEP 1: Apply Database Migrations

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run**
6. Repeat for `supabase/migrations/002_profile_enhancements.sql`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
bun add -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

---

## STEP 2: Configure AWS Bedrock

### Create AWS Account (if needed)
1. Go to https://aws.amazon.com
2. Create account or sign in
3. Enable AWS Bedrock in your region

### Get AWS Credentials
1. Go to AWS Console → IAM
2. Create new user with **Programmatic access**
3. Attach policy: `AmazonBedrockFullAccess`
4. Save Access Key ID and Secret Access Key

### Enable Bedrock Models
1. Go to AWS Bedrock Console
2. Navigate to **Model Access**
3. Request access to:
   - **Meta Llama 3.3 70B Instruct** (free tier eligible)
   - **Amazon Nova Pro** (optional)

---

## STEP 3: Set Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in these **REQUIRED** variables:

```env
# AWS Bedrock (REQUIRED for AI features)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here

# Supabase (REQUIRED for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Lingo.dev (REQUIRED for translations)
LINGO_API_KEY=your_lingo_api_key_here

# Optional
RAPID_API_KEY=your_rapidapi_key_for_jobs
```

---

## STEP 4: Install Dependencies

```bash
bun install
```

---

## STEP 5: Generate Database Types (Optional but Recommended)

This fixes TypeScript errors:

```bash
# Using Supabase CLI
bun run db:generate

# Or manually
bunx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
```

---

## STEP 6: Run the App

```bash
bun dev
```

Navigate to: http://localhost:3000

---

## 🧪 TEST THE FEATURES

### 1. Test Profile Setup
1. Sign up or log in
2. Navigate to: http://localhost:3000/profile/setup
3. Fill out the form:
   - Professional summary
   - Add 3+ skills
   - Add at least 1 work experience
   - Add at least 1 education
4. Click **Save Profile**
5. You should be redirected to `/jobs`

### 2. Test Resume Generation
1. Navigate to: http://localhost:3000/jobs
2. Click on any job listing
3. Click **Generate Resume** (or similar button)
4. Select target language
5. Click **Generate Resume with AI**
6. Wait 30-60 seconds for AI generation
7. You should see:
   - ATS Score (0-100)
   - Resume preview
   - Action buttons

---

## 🐛 TROUBLESHOOTING

### Problem: TypeScript errors about database tables
**Solution:** Run `bun run db:generate` to regenerate types

### Problem: "Unauthorized" error in resume generation
**Solution:** 
1. Make sure you're logged in
2. Check Supabase environment variables
3. Verify RLS policies are enabled

### Problem: "Failed to generate resume"
**Solution:**
1. Check AWS credentials in `.env.local`
2. Verify AWS Bedrock access is enabled
3. Check browser console for detailed errors
4. Try `us-east-1` region (best support)

### Problem: Translations not working
**Solution:**
1. Verify `LINGO_API_KEY` in `.env.local`
2. Make sure you have Lingo.dev account
3. Check Lingo API quota

### Problem: Resume generation is slow
**Normal!** AI generation can take 30-90 seconds:
- Initial generation: ~20-30 seconds
- ATS scoring: ~10 seconds
- Rewrite attempts (if score < 70): +20-30 seconds each

---

## 📁 KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `src/app/profile/setup/page.tsx` | Profile setup form |
| `src/app/resume/generate/page.tsx` | Resume generation UI |
| `src/app/api/resume/generate/route.ts` | AI resume generation API |
| `src/lib/ai/bedrock.ts` | AWS Bedrock integration |
| `src/components/providers/auth-provider.tsx` | Authentication context |
| `supabase/migrations/002_profile_enhancements.sql` | Database schema |

---

## 🔗 NAVIGATION STRUCTURE

```
/                        → Home page
/auth/login              → Login
/auth/signup             → Sign up
/profile/setup           → Complete profile (NEW)
/jobs                    → Browse jobs
/resume/generate?jobId=xxx → Generate resume (NEW)
/resume/history          → View past resumes
/applications            → Track applications (TODO)
/interview/setup         → Start interview (TODO)
```

---

## 🎯 NEXT: ADD TO JOBS PAGE

To enable "Generate Resume" button on job listings:

**Option 1:** Direct Link
```tsx
<Link href={`/resume/generate?jobId=${job.id}`}>
  <Button>Generate Resume</Button>
</Link>
```

**Option 2:** Check Profile First
```tsx
async function handleGenerateResume(jobId: string) {
  // Check if user has completed profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    router.push('/profile/setup?returnTo=/resume/generate?jobId=' + jobId);
  } else {
    router.push('/resume/generate?jobId=' + jobId);
  }
}
```

---

## 💡 TIPS

1. **Test with sample data first** - Add a few experiences and skills
2. **AWS Bedrock free tier** - Llama 3.3 is very generous
3. **Language support** - Works best with English, Spanish, French, German
4. **ATS score** - Higher = better match with job requirements
5. **Rewrite logic** - Automatically improves resumes scoring < 70

---

## 🔥 READY TO GO!

You now have:
- ✅ Complete profile management
- ✅ AI-powered resume generation
- ✅ Multi-language support
- ✅ ATS scoring
- ✅ Auto-improvement

Next steps: Build Interview System or Application Tracker!

---

## 📞 NEED HELP?

Check `IMPLEMENTATION_STATUS.md` for:
- Detailed architecture
- Database schema
- API documentation
- Implementation notes
