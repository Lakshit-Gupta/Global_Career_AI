// TypeScript types for the GlobalHire AI application

// User & Auth Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  preferred_language: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  degree: string;
  school: string;
  location?: string;
  graduationDate?: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

// Job Types
export interface Job {
  id: string;
  external_id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string[];
  salary_range?: string;
  job_type?: "full-time" | "part-time" | "contract" | "internship";
  remote?: boolean;
  url?: string;
  original_language: string;
  created_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  job: Job;
  created_at: string;
}

// Resume Types
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  job_id?: string;
  language: string;
  ats_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ResumeContent {
  summary: string;
  experience: ResumeExperience[];
  skills: string[];
  education: ResumeEducation[];
}

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  year: string;
}

export interface ATSResult {
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
  };
  suggestions: string[];
}

// Application Types
export interface Application {
  id: string;
  user_id: string;
  job_id?: string;
  job_title: string;
  company: string;
  location?: string;
  job_url?: string;
  status: ApplicationStatus;
  applied_at: string;
  notes?: string;
  resume_used?: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

// Interview Types
export interface InterviewSession {
  id: string;
  user_id: string;
  job_id?: string;
  job_title: string;
  company?: string;
  interview_type: InterviewType;
  user_language: string;
  interviewer_language: string;
  status: "in_progress" | "completed" | "cancelled";
  score?: number;
  feedback?: InterviewFeedback;
  started_at: string;
  ended_at?: string;
}

export type InterviewType = "technical" | "behavioral" | "mixed";

export interface InterviewMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  original_content?: string;
  created_at: string;
}

export interface InterviewFeedback {
  overallScore: number;
  summary: string;
  strengths: { area: string; feedback: string }[];
  improvements: { area: string; feedback: string }[];
  questionAnalysis: {
    question: string;
    responseQuality: "good" | "average" | "needs-improvement";
    feedback: string;
  }[];
  tips: string[];
}

// Translation Types
export interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  from: string;
  to: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Language Types
export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
}
