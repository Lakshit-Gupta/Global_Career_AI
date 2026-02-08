// Resume data structure for LaTeX template filling
export interface ResumeContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  location: string;
  duration: string;
  achievements: string[];
}

export interface ResumeEducation {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  gpa?: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string;
  link?: string;
  achievements?: string[];
}

export interface ResumeSkills {
  technical: string[];
  tools: string[];
  languages?: string[];
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  experience: ResumeExperience[];
  skills: ResumeSkills;
  education: ResumeEducation[];
  projects: ResumeProject[];
}

export interface ATSResult {
  score: number;
  feedback: string[];
  improvements: string[];
}

export type TemplateType = 'professional' | 'modern';
