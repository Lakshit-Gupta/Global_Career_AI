# GCP Vertex AI Setup Guide

## ✅ YOU'RE NOW USING: Google Cloud Platform (Claude/Gemini)

I've switched from AWS Bedrock to **GCP Vertex AI** which supports:
- 🤖 **Claude 3.5 Sonnet** (Anthropic on GCP) - Recommended
- 🌟 **Gemini 1.5 Pro** (Google's native model)

---

## 🚀 STEP 1: Setup GCP Project

### 1.1. Create/Select GCP Project
```bash
# Option A: Use existing project
gcloud config list project

# Option B: Create new project
gcloud projects create polyglot-hire-ai --name="Polyglot Hire"
gcloud config set project polyglot-hire-ai
```

### 1.2. Enable Required APIs
```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable if using Claude (Anthropic on GCP)
gcloud services enable anthropic.googleapis.com
```

### 1.3. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create vertex-ai-user \
  --display-name="Vertex AI Service Account"

# Grant Vertex AI User role
gcloud projects add-iam-policy-binding polyglot-hire-ai \
  --member="serviceAccount:vertex-ai-user@polyglot-hire-ai.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create vertex-key.json \
  --iam-account=vertex-ai-user@polyglot-hire-ai.iam.gserviceaccount.com
```

This creates `vertex-key.json` in your current directory.

---

## 🔑 STEP 2: Configure Environment Variables

### 2.1. Add to `.env.local`:

```env
# GCP Vertex AI Configuration
GCP_PROJECT_ID=polyglot-hire-ai
GCP_LOCATION=us-central1
GCP_MODEL=claude
GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","project_id":"polyglot-hire-ai","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"vertex-ai-user@polyglot-hire-ai.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Supabase (keep existing)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Lingo.dev (keep existing)
LINGO_API_KEY=your_lingo_api_key
```

### 2.2. Convert JSON to Single Line:

**IMPORTANT:** The `GOOGLE_APPLICATION_CREDENTIALS` must be the entire JSON on ONE LINE.

**Option A - Manual:**
1. Open `vertex-key.json`
2. Copy entire content
3. Remove all newlines and extra spaces
4. Paste into `.env.local`

**Option B - PowerShell Command:**
```powershell
# Run this to get the single-line JSON
$json = Get-Content vertex-key.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
Write-Output "GOOGLE_APPLICATION_CREDENTIALS='$json'"
```

Copy the output into your `.env.local` file.

---

## 🎯 STEP 3: Choose Your Model

Edit `.env.local`:

### Use Claude 3.5 Sonnet (Recommended - Best Quality)
```env
GCP_MODEL=claude
```

### Use Gemini 1.5 Pro (Faster, Google Native)
```env
GCP_MODEL=gemini
```

---

## 📊 STEP 4: Test the Integration

Run this to verify it works:
```powershell
bun dev
```

Then navigate to `/profile/setup`, fill it out, and test resume generation.

---

## 💰 Pricing Comparison

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Quality |
|-------|---------------------|----------------------|---------|
| **Claude 3.5 Sonnet** | $3.00 | $15.00 | ⭐⭐⭐⭐⭐ Best |
| **Gemini 1.5 Pro** | $1.25 | $5.00 | ⭐⭐⭐⭐ Great |
| ~~Llama 3.3 (AWS)~~ | $0.00 (free tier) | $0.00 | ⭐⭐⭐ Good |

**Typical Resume Generation Cost:**
- ~5,000 tokens input + ~2,000 tokens output = **$0.045 with Claude**
- With retries: ~3 generations = **$0.13 per resume**

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Fix:** Check that `GOOGLE_APPLICATION_CREDENTIALS` is valid JSON on a single line

### Error: "Permission denied"
**Fix:** Ensure service account has `roles/aiplatform.user` role:
```bash
gcloud projects get-iam-policy polyglot-hire-ai \
  --flatten="bindings[].members" \
  --filter="bindings.members:vertex-ai-user@*"
```

### Error: "Model not found"
**Fix:** Enable the API:
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable anthropic.googleapis.com
```

### Error: "Quota exceeded"
**Fix:** 
1. Go to GCP Console → Vertex AI → Quotas
2. Request quota increase
3. Or wait for quota reset (daily/hourly limits)

---

## 📍 Available Regions

Best regions for Claude/Gemini:
- `us-central1` (Iowa) - Recommended
- `us-east4` (Virginia)
- `europe-west1` (Belgium)
- `asia-southeast1` (Singapore)

Change in `.env.local`:
```env
GCP_LOCATION=us-central1
```

---

## 🎉 YOU'RE READY!

Files updated:
- ✅ `src/lib/ai/vertex.ts` - GCP integration
- ✅ `src/app/api/resume/generate/route.ts` - Uses GCP now
- ✅ `package.json` - Added `google-auth-library`

Next: Apply database migrations (see QUICK_START.md)
