# GlobalHire AI

🌍 **AI-powered multilingual job application platform**

Apply to jobs anywhere in the world with AI assistance that handles translations, resume optimization, and interview preparation.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-purple)
![Lingo.dev](https://img.shields.io/badge/Lingo.dev-i18n-orange)

## 🎯 Features

### 🔍 Job Discovery
- Search jobs from any country
- Automatic translation to your preferred language
- Save jobs for later
- Filter by location, job type, and more

### 📄 AI Resume Builder
- Generate tailored resumes for specific jobs
- AI-powered content optimization (Llama 3.3 70B via OpenRouter)
- ATS (Applicant Tracking System) scoring
- Automatic rewrite if score is below 70%
- Export to PDF in any language

### 🎤 AI Interview Prep
- Practice interviews with AI interviewer
- Support for multiple languages (speak in yours, they respond in theirs)
- Technical, behavioral, or mixed interviews
- Real-time feedback and scoring
- Detailed improvement suggestions

### 📊 Application Tracker
- Track all your job applications
- Status updates (Applied → Interviewing → Offer)
- Notes and timeline for each application
- Quick access to related resumes

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime)
- **AI**: [OpenRouter](https://openrouter.ai/) (meta-llama/llama-3.3-70b-instruct)
- **Translation**: [Lingo.dev](https://lingo.dev/) (Compiler, SDK, CLI, GitHub Actions)
- **Jobs API**: [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- Supabase account
- OpenRouter API key
- Lingo.dev API key
- RapidAPI key (for JSearch)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/globalhire-ai.git
   cd globalhire-ai
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys in `.env.local`

4. **Set up the database**
   ```bash
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── applications/      # Application tracker pages
│   ├── auth/              # Authentication pages
│   ├── interview/         # Interview prep pages
│   ├── jobs/              # Job discovery pages
│   └── resume/            # Resume builder pages
├── components/            
│   ├── layout/            # Header, footer, language switcher
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── middleware.ts          # Auth middleware
```

## 🌐 Supported Languages

- 🇺🇸 English (en)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)
- 🇯🇵 Japanese (ja)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the global developer community