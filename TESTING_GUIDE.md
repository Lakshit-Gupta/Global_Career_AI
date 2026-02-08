# Quick Test Guide - Resume Optimizer

## 🚀 Quick Start

### 1. Start the Dev Server
```bash
bun run dev
```

The server should be running at `http://localhost:3000`

### 2. Navigate to the Resume Optimizer
Open your browser and go to:
```
http://localhost:3000/resume/optimize
```

## 📝 Test Data

### Sample Resume (Sarah Chen - Anthropic Case)

```text
Sarah Chen
Software Engineer
san-francisco@email.com | (555) 123-4567 | San Francisco, CA
LinkedIn: linkedin.com/in/sarahchen | GitHub: github.com/sarahchen

Experience:

Software Engineer at TechStartup (June 2021 - Present)
- Built and maintained web applications using React, Node.js, and PostgreSQL
- Implemented real-time features using WebSockets and Redis
- Improved page load time by 40% through code optimization and lazy loading
- Led migration from JavaScript to TypeScript, reducing bugs by 35%
- Collaborated with product team to ship 15+ features in agile environment

Junior Developer at WebCorp (Jan 2019 - May 2021)
- Developed RESTful APIs using Express.js and MongoDB
- Created responsive front-end components with React and Tailwind CSS
- Wrote unit and integration tests achieving 85% code coverage
- Participated in code reviews and pair programming sessions

Education:

Bachelor of Science in Computer Science
Massachusetts Institute of Technology (MIT)
Graduated: 2019
GPA: 3.7/4.0

Skills:
JavaScript, TypeScript, React, Node.js, Express, Python, PostgreSQL, MongoDB, Redis, Docker, Git, REST APIs, GraphQL
```

### Test Configuration

**Company Name**: `Anthropic`  
**Target Role**: `Software Engineer`  
**Additional Details**: Leave empty (let AI research)

### Expected Results

1. **Company Research** (what AI should find):
   - Company: Anthropic
   - Industry: Artificial Intelligence / AI Safety
   - Tech Stack: Python, TypeScript, React, JAX, PyTorch
   - Culture: AI safety, responsible AI development, research-driven
   - Requirements: Strong engineering, interest in AI/ML, collaborative

2. **Initial Score**: 70-75
   - Keyword match will be moderate (missing AI/ML keywords)
   - Experience relevant but not AI-focused
   - Skills need more ML/AI tools

3. **After Rewrite** (Attempt 2-3): 80-88
   - Added AI/ML relevant keywords
   - Reframed achievements with AI context
   - Added interest in AI safety
   - Skills updated to include ML libraries

## 🧪 Alternative Test Cases

### Test Case 2: Google - Senior Engineer

```text
John Doe
Senior Software Engineer
john@email.com | (555) 987-6543 | Mountain View, CA

Experience:
- Senior Engineer at StartupCo (2020-Present)
  Led team of 5 engineers building microservices
  Architected cloud infrastructure on AWS
  Reduced costs by 50% through optimization
  
- Software Engineer at TechCorp (2017-2020)
  Built scalable APIs handling 1M+ requests/day
  Implemented CI/CD pipelines

Skills: Java, Kotlin, Go, Kubernetes, Docker, AWS, PostgreSQL

Education:
BS Computer Science, Stanford University (2017)
```

**Company**: Google  
**Role**: Senior Software Engineer  
**Expected Focus**: Scale, distributed systems, Google Cloud

### Test Case 3: Startup - Full Stack

```text
Jane Smith
Full Stack Developer
jane@email.com | (555) 456-7890 | Remote

Experience:
- Full Stack Developer at AgencyCo (2021-Present)
  Built 10+ client websites with MERN stack
  Integrated payment systems (Stripe, PayPal)
  Managed deployments and server maintenance

Skills: JavaScript, React, Node.js, MongoDB, HTML, CSS

Education:
Bootcamp Graduate - General Assembly (2020)
```

**Company**: Vercel  
**Role**: Full Stack Engineer  
**Expected Focus**: Next.js, React, serverless, developer experience

## 🔍 What to Check

### ✅ Successful Run Indicators

1. **Progress Messages**:
   - "🔍 Researching company online..."
   - API should complete in 30-75 seconds

2. **Score Display**:
   - Large score number (0-100)
   - Color-coded (green for 80+, yellow for 60-79, red for <60)

3. **Score Breakdown**:
   - 5 category scores displayed
   - Keyword Match, Experience, Skills, Formatting, Completeness

4. **Optimization History**:
   - Shows attempts (1-3)
   - Score progression visible

5. **Company Research Card**:
   - Company name
   - Industry
   - Tech stack badges
   - Job requirements

6. **Resume Preview**:
   - All sections formatted nicely
   - Contact info
   - Summary
   - Experience with achievements
   - Skills categorized
   - Education

### ⚠️ What Could Go Wrong

1. **Authentication Error**:
   - Need to be logged in
   - Redirects to `/auth/login`

2. **Missing Fields Error**:
   - "Please fill in resume, company name, and role"
   - Fill all required fields

3. **GCP Credentials Error**:
   - "Failed to generate content with Claude"
   - Check `GOOGLE_CLOUD_PROJECT` and credentials in .env.local

4. **Google Search Warning** (non-critical):
   - "⚠️ Google Search API not configured. Skipping web search."
   - Feature still works, just skips web research

## 🐛 Debugging

### Check Environment Variables

```powershell
# In PowerShell
$env:GOOGLE_CLOUD_PROJECT
$env:GOOGLE_CLOUD_REGION
```

Should show your GCP project ID and region.

### Check Browser Console

Open DevTools (F12) and look for:
- Network tab: Check `/api/resume/optimize` request
- Console tab: Look for errors
- Request took 30-75 seconds = normal
- Response has `success: true` = working

### Check Terminal Logs

Look for in terminal:
```
🔍 Step 1: Researching company...
📝 Step 2: Generating ATS-optimized resume...
📊 Step 3: Scoring resume with ATS...
🔄 Step 4.1: Score 75 < 80. Rewriting...
   New score: 82
✅ Complete! Final score: 82 after 2 attempt(s)
```

## 📊 Manual API Test (via curl)

If you want to test the API directly:

```bash
# Get your auth token first by logging in, then:
curl -X POST http://localhost:3000/api/resume/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Sarah Chen\\nSoftware Engineer\\n\\nExperience:\\n- Software Engineer at TechStartup (2021-2024)\\n  Built web applications using React, Node.js, and PostgreSQL\\n  Improved page load time by 40%\\n\\nEducation:\\n- BS Computer Science, MIT (2019)\\n\\nSkills: JavaScript, React, Node.js, Python, SQL",
    "companyName": "Anthropic",
    "role": "Software Engineer"
  }'
```

## ✅ Success Criteria

- [ ] Page loads without errors
- [ ] Form accepts resume text
- [ ] "Optimize Resume" button triggers loading state
- [ ] Sees progress message
- [ ] API completes in <90 seconds
- [ ] Score displays (0-100)
- [ ] Score breakdown shows all 5 categories
- [ ] Company research appears
- [ ] Resume preview is formatted
- [ ] Can start over with "Optimize Another Resume"
- [ ] No console errors

## 🎯 Production Testing Checklist

- [ ] Test with 5+ different resume styles
- [ ] Test with 10+ different companies
- [ ] Test error handling (invalid input)
- [ ] Test with unauthenticated user
- [ ] Test mobile responsiveness
- [ ] Test with long resumes (>5000 chars)
- [ ] Load test API endpoint
- [ ] Test database saves correctly
- [ ] Test score history display
- [ ] Verify GCP billing/usage

---

**Happy Testing! 🚀**

If you encounter issues, check:
1. GCP credentials are set
2. Supabase is configured
3. You're logged in
4. Dev server is running

For best results:
- Use real resume content
- Pick well-known companies
- Be specific with role titles
