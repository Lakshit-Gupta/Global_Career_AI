export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          preferred_language: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          preferred_language?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          preferred_language?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          education: Json | null;
          experience: Json | null;
          skills: string[] | null;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          education?: Json | null;
          experience?: Json | null;
          skills?: string[] | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          education?: Json | null;
          experience?: Json | null;
          skills?: string[] | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string | null;
          description: string | null;
          original_language: string | null;
          source_url: string | null;
          salary_range: string | null;
          job_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location?: string | null;
          description?: string | null;
          original_language?: string | null;
          source_url?: string | null;
          salary_range?: string | null;
          job_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string | null;
          description?: string | null;
          original_language?: string | null;
          source_url?: string | null;
          salary_range?: string | null;
          job_type?: string | null;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          job_id: string | null;
          content: Json;
          target_language: string;
          ats_score: number | null;
          version: number;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id?: string | null;
          content: Json;
          target_language?: string;
          ats_score?: number | null;
          version?: number;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string | null;
          content?: Json;
          target_language?: string;
          ats_score?: number | null;
          version?: number;
          pdf_url?: string | null;
          created_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          resume_id: string | null;
          status: string;
          applied_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          resume_id?: string | null;
          status?: string;
          applied_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          resume_id?: string | null;
          status?: string;
          applied_at?: string;
          notes?: string | null;
        };
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          job_id: string | null;
          language: string;
          transcript: Json | null;
          feedback: string | null;
          score: number | null;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id?: string | null;
          language?: string;
          transcript?: Json | null;
          feedback?: string | null;
          score?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string | null;
          language?: string;
          transcript?: Json | null;
          feedback?: string | null;
          score?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
      };
      interview_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          original_language: string | null;
          translated_content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          original_language?: string | null;
          translated_content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          original_language?: string | null;
          translated_content?: string | null;
          created_at?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Resume = Database["public"]["Tables"]["resumes"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type InterviewSession =
  Database["public"]["Tables"]["interview_sessions"]["Row"];
export type InterviewMessage =
  Database["public"]["Tables"]["interview_messages"]["Row"];
export type SavedJob = Database["public"]["Tables"]["saved_jobs"]["Row"];

// Extended types for API responses
export interface JobWithTranslation extends Job {
  translatedDescription?: string;
  translatedTitle?: string;
  isSaved?: boolean;
}

export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications?: string[];
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
}

export interface InterviewMessageWithTranslation extends InterviewMessage {
  displayContent: string;
}

export type ApplicationStatus =
  | "pending"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected";
