# AI Resume Optimizer - Implementation Guide

## ✅ Feature Complete

This document describes the AI-powered Resume Optimization feature with automatic rewriting and ATS scoring.

## 🎯 Features Implemented

1. **Web Research**: Automatic company research using Google Search API
2. **Claude 4.5 Integration**: GCP Vertex AI with Claude Sonnet 4.5
3. **ATS Scoring**: 0-100 score with detailed breakdown
4. **Auto-Rewrite Loop**: Automatic resume improvement (max 3 attempts)
5. **Beautiful UI**: Complete form, progress tracking, and results display

## 📁 Files Created

### Core Library Files
- `src/lib/ai/vertex-claude.ts` - Claude 4.5 on GCP Vertex AI integration
- `src/lib/research/company-research.ts` - Web scraping and company research

### API Routes
- `src/app/api/resume/optimize/route.ts` - Main optimization endpoint with auto-rewrite

### Frontend Pages
- `src/app/resume/optimize/page.tsx` - Complete UI for resume optimization

## 📦 Dependencies Installed

```bash
# Core dependencies
bun add @anthropic-ai/vertex-sdk
bun add @google-cloud/vertexai
bun add axios cheerio
bun add @supabase/auth-helpers-nextjs @supabase/supabase-js

# Dev dependencies
bun add -D @types/node @types/cheerio
```

## ⚙️ Configuration

### Environment Variables (.env.local)

```env
# GCP Configuration (Already configured)
GOOGLE_CLOUD_PROJECT=default-project-486518
GOOGLE_CLOUD_REGION=us-east5
GCP_MODEL=claude-sonnet-4-5@20250929

# Google Search API (Optional - for web research)
GOOGLE_API_KEY=your-google-api-key-here
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Getting Google Search API Credentials (Optional)

The web research feature uses Google Custom Search API. If not configured, the feature will still work but skip online research.

1. **Get API Key**:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create credentials → API key
   - Enable "Custom Search API"

2. **Create Search Engine**:
   - Go to https://programmablesearchengine.google.com/
   - Create new search engine
   - Search the entire web
   - Copy the Search Engine ID

## 🏗 Architecture Flow

```
User Input (Resume + Company + Role)
         ↓
    Company Research (Google Search + Web Scraping)
         ↓
    Generate Resume (Claude 4.5)
         ↓
    Score Resume (ATS Scoring 0-100)
         ↓
    Score < 80? → YES → Rewrite (max 3 times) → Loop
         ↓
        NO
         ↓
    Save to Database + Display Results
```

## 🎨 UI Components

### Input Form
- Resume text area (paste or upload .txt)
- Company name input
- Target role input
- Optional company details
- "How It Works" explainer card

### Results Display
- **Score Card**: Large score display with color coding
- **Score Breakdown**: 5 categories (Keyword Match, Experience, Skills, Formatting, Completeness)
- **Score History**: Progress across multiple attempts
- **Improvement Suggestions**: Action items from Claude
- **Company Research**: Displays gathered company info
- **Resume Preview**: Formatted resume with all sections

## 📊 ATS Scoring Criteria

| Category | Max Points | Description |
|----------|-----------|-------------|
| Keyword Match | 30 | Tech stack keywords in context |
| Experience Relevance | 25 | Job relevance and achievements |
| Skills Alignment | 20 | Hard & soft skills match |
| ATS Formatting | 15 | Clean format for ATS parsing |
| Completeness | 10 | All sections, no errors |
| **TOTAL** | **100** | Target: 80+ |

## 🔄 Auto-Rewrite Logic

```typescript
const ATS_THRESHOLD = 80;
const MAX_ATTEMPTS = 3;

while (score < ATS_THRESHOLD && attempts < MAX_ATTEMPTS) {
  // Claude analyzes feedback
  // Rewrites resume addressing weaknesses
  // Rescores
  attempts++;
}
```

## 🚀 Usage

### 1. Navigate to the page
```
http://localhost:3000/resume/optimize
```

### 2. Fill in the form
- Paste your resume text
- Enter company name (e.g., "Anthropic")
- Enter target role (e.g., "Software Engineer")
- Optional: Add company details

### 3. Click "Optimize Resume with AI"
The system will:
- Research the company online (5-10 seconds)
- Generate optimized resume (10-15 seconds)
- Score and potentially rewrite (15-30 seconds per iteration)

### 4. Review Results
- See your ATS score
- Review company research
- View optimized resume
- Download or save

## 🧪 Testing with Sample Data

### Test Input (Sarah Chen Example)

```text
RESUME:
Sarah Chen
Software Engineer

Experience:
- Software Engineer at TechStartup (2021-2024)
  Built web applications using React, Node.js, and PostgreSQL
  Improved page load time by 40%
  
- Junior Developer at WebCorp (2019-2021)
  Developed RESTful APIs
  Worked with React and Express

Education:
- BS Computer Science, MIT (2019)

Skills: JavaScript, React, Node.js, Python, SQL
```

**Company**: Anthropic  
**Role**: Software Engineer  
**Details**: (leave empty)

### Expected Behavior
1. AI researches Anthropic (AI safety, Claude, Python/TypeScript stack)
2. Generates resume emphasizing:
   - AI/ML interest and experience
   - Safety-focused language
   - Python and relevant keywords
3. Initial score: ~70-75
4. Rewrites adding:
   - More AI-relevant keywords
   - Stronger achievement metrics
   - Better cultural fit language
5. Final score: 82-88
6. Resume tailored to Anthropic's mission

## 🔧 Customization

### Change ATS Threshold
Edit `src/app/api/resume/optimize/route.ts`:
```typescript
const ATS_THRESHOLD = 80; // Change to 75, 85, etc.
```

### Change Max Attempts
```typescript
const MAX_ATTEMPTS = 3; // Change to 2, 4, 5, etc.
```

### Adjust Claude Model
Edit `src/lib/ai/vertex-claude.ts`:
```typescript
const MODEL = 'claude-sonnet-4-5@20250929'; // Or other versions
```

### Modify Scoring Weights
Edit the scoring function in `route.ts` to adjust point allocations.

## 🗄 Database Schema

The resume is saved to the `resumes` table:

```typescript
{
  user_id: string;
  title: string; // "Software Engineer at Anthropic"
  content: {
    resume: { /* full structured resume */ },
    companyResearch: { /* research data */ }
  };
  ats_score: number;
  ats_feedback: string;
  generation_attempts: number;
  target_language: string;
}
```

## 🐛 Troubleshooting

### Issue: "Failed to generate content with Claude"
**Solution**: Verify GCP credentials are exported in PowerShell
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS
```

### Issue: "Google Search API not configured"
**Solution**: This is optional. The feature works without it but skips web research.

### Issue: Resume score stuck below 80
**Solution**: This is expected for some resumes. The system tries 3 times then returns the best score achieved.

### Issue: TypeScript errors about imports
**Solution**: Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

## 📈 Performance

- **Company Research**: 5-10 seconds
- **Resume Generation**: 10-15 seconds (Claude 4.5)
- **Scoring**: 5-10 seconds
- **Rewrite**: 10-15 seconds per iteration
- **Total (1-3 attempts)**: 30-75 seconds

## 🔐 Security

- User authentication required (Supabase)
- GCP credentials from environment (never exposed)
- Input validation on resume text, company, role
- API rate limiting recommended for production

## 🚀 Next Steps / Enhancements

1. **PDF Support**: Add PDF parsing for resume uploads
2. **Resume Templates**: Offer multiple formatting styles
3. **Batch Processing**: Optimize for multiple companies at once
4. **Interview Prep**: Generate interview questions based on resume
5. **Cover Letter**: Generate matching cover letter
6. **A/B Testing**: Compare multiple resume versions
7. **Analytics Dashboard**: Track success rates by industry
8. **Export Options**: PDF, Word, LaTeX formats

## 📝 API Endpoint

### POST `/api/resume/optimize`

**Request Body**:
```json
{
  "resumeText": "Your resume as plain text...",
  "companyName": "Anthropic",
  "role": "Software Engineer",
  "companyDetails": "Optional extra info..."
}
```

**Response**:
```json
{
  "success": true,
  "resume": { /* structured resume object */ },
  "score": 85,
  "feedback": "Strong keyword usage and relevant experience...",
  "breakdown": {
    "keywordMatch": 28,
    "experienceRelevance": 22,
    "skillsAlignment": 18,
    "formatting": 14,
    "completeness": 9
  },
  "suggestions": ["Add more metrics...", "Include Python..."],
  "attempts": 2,
  "scoreHistory": [
    { "attempt": 1, "score": 75 },
    { "attempt": 2, "score": 85 }
  ],
  "companyResearch": { /* company data */ },
  "resumeId": "uuid"
}
```

## ✅ Production Checklist

- [ ] Add actual Google Search API credentials
- [ ] Set up rate limiting on API endpoint
- [ ] Add error tracking (Sentry, etc.)
- [ ] Implement resume caching
- [ ] Add usage analytics
- [ ] Create user feedback system
- [ ] Add resume history page with filters
- [ ] Implement PDF export
- [ ] Add email notifications for completion
- [ ] Set up monitoring and alerts

---

**Status**: ✅ **FEATURE COMPLETE AND READY FOR TESTING**

**Tech Stack**: Next.js 15, TypeScript, Claude 4.5 (GCP Vertex AI), Supabase, Tailwind CSS, BUN

**Last Updated**: February 7, 2026
