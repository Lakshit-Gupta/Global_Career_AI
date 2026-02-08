import { generateWithOpenRouter } from '@/lib/ai/openrouter';
import { ResumeData, ATSResult } from '@/types/resume';
import { researchCompany as searchCompanyOnline } from '@/lib/research/company-research';

export interface CompanyResearch {
  name: string;
  description: string;
  industry: string;
  techStack: string[];
  values: string[];
  recentNews: string[];
}

/**
 * Research company using SerpAPI to gather context for optimization
 */
/**
 * Research company using SerpAPI to gather context for optimization
 */
export async function researchCompany(
  companyName: string,
  role: string
): Promise<CompanyResearch> {
  try {
    // Use the existing company research function
    const results = await searchCompanyOnline(companyName, role, undefined);

    // Map to our CompanyResearch interface
    return {
      name: results.name || companyName,
      description: results.description || '',
      industry: results.industry || '',
      techStack: results.techStack || [],
      values: [],
      recentNews: results.recentNews || [],
    };
  } catch (error) {
    console.error('Error researching company:', error);
    return {
      name: companyName,
      description: '',
      industry: '',
      techStack: [],
      values: [],
      recentNews: [],
    };
  }
}

/**
 * Optimize resume content using LLM based on company research
 */
export async function optimizeResumeContent(
  extractedText: string,
  companyResearch: CompanyResearch,
  role: string
): Promise<ResumeData> {
  const prompt = `You are an expert resume optimization specialist. Extract and optimize resume content for ATS (Applicant Tracking Systems).

ORIGINAL RESUME TEXT:
${extractedText}

TARGET COMPANY: ${companyResearch.name}
TARGET ROLE: ${role}

COMPANY RESEARCH:
- Description: ${companyResearch.description}
- Tech Stack: ${companyResearch.techStack.join(', ')}
- Industry: ${companyResearch.industry}

CRITICAL INSTRUCTIONS:
1. Extract ALL information from the original resume
2. Optimize content for the target company and role
3. Use keywords from the company's tech stack
4. Quantify achievements with metrics when possible
5. Tailor the professional summary for ${companyResearch.name}
6. Keep all dates, company names, and factual information accurate
7. DO NOT fabricate information
8. DO NOT write LaTeX code - only return structured JSON data

OUTPUT FORMAT:
Return ONLY a valid JSON object with this EXACT structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "555-1234",
    "location": "City, State",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "portfolio": "https://portfolio.com"
  },
  "summary": "A compelling 3-4 sentence professional summary optimized for ${companyResearch.name} and ${role} role. Highlight relevant skills and experience that match the company's tech stack.",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "duration": "Jan 2020 - Present",
      "achievements": [
        "Quantified achievement with metrics (e.g., 'Improved performance by 40%')",
        "Achievement using company-relevant keywords from: ${companyResearch.techStack.slice(0, 5).join(', ')}",
        "Another impactful achievement"
      ]
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2", "Skill 3"],
    "tools": ["Tool 1", "Tool 2", "Tool 3"],
    "languages": ["Language 1", "Language 2"]
  },
  "education": [
    {
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "institution": "University Name",
      "location": "City, State",
      "year": "2020",
      "gpa": "3.8"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description optimized with company-relevant technologies",
      "technologies": "React, Node.js, AWS",
      "link": "https://github.com/...",
      "achievements": [
        "Specific achievement or impact",
        "Technical detail relevant to ${role}"
      ]
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no explanations.`;

  try {
    const response = await generateWithOpenRouter(prompt, undefined, 3000);

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in LLM response');
    }

    const resumeData: ResumeData = JSON.parse(jsonMatch[0]);
    return resumeData;
  } catch (error: any) {
    console.error('Error optimizing resume content:', error);
    throw new Error(`Failed to optimize resume: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Score resume using ATS criteria
 */
export async function scoreResume(
  resumeText: string,
  companyResearch: CompanyResearch,
  role: string
): Promise<ATSResult> {
  const prompt = `You are an ATS (Applicant Tracking System) scoring expert. Score this resume for the given role and company.

RESUME TEXT:
${resumeText}

TARGET COMPANY: ${companyResearch.name}
TARGET ROLE: ${role}
COMPANY TECH STACK: ${companyResearch.techStack.join(', ')}

SCORING CRITERIA (0-100):
1. Keyword Matching (30 points): How well does the resume match the company's tech stack?
2. Quantified Achievements (25 points): Are achievements backed by metrics and numbers?
3. Relevance (20 points): Is experience relevant to the target role?
4. Formatting (15 points): Is the resume well-structured and ATS-friendly?
5. Impact (10 points): Does the resume demonstrate clear impact and value?

OUTPUT FORMAT:
Return ONLY a valid JSON object:
{
  "score": 85,
  "feedback": [
    "Specific feedback point 1",
    "Specific feedback point 2",
    "Specific feedback point 3"
  ],
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2",
    "Specific improvement suggestion 3"
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations.`;

  try {
    const response = await generateWithOpenRouter(prompt, undefined, 1000);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in scoring response');
    }

    const result: ATSResult = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error: any) {
    console.error('Error scoring resume:', error);
    throw new Error(`Failed to score resume: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Improve resume data based on ATS feedback
 */
export async function improveResumeData(
  currentData: ResumeData,
  atsResult: ATSResult,
  companyResearch: CompanyResearch,
  role: string
): Promise<ResumeData> {
  const prompt = `You are a resume optimization expert. Improve this resume based on ATS feedback.

CURRENT RESUME DATA:
${JSON.stringify(currentData, null, 2)}

CURRENT ATS SCORE: ${atsResult.score}/100

ATS FEEDBACK:
${atsResult.feedback.join('\n')}

IMPROVEMENTS NEEDED:
${atsResult.improvements.join('\n')}

TARGET COMPANY: ${companyResearch.name}
TARGET ROLE: ${role}
COMPANY TECH STACK: ${companyResearch.techStack.join(', ')}

INSTRUCTIONS:
1. Address ALL feedback points
2. Implement ALL improvement suggestions
3. Add more relevant keywords from the company's tech stack
4. Strengthen quantified achievements
5. Improve relevance to the target role
6. Maintain factual accuracy - DO NOT fabricate information
7. Return the complete improved resume data structure

OUTPUT FORMAT:
Return ONLY a valid JSON object with the SAME structure as the input, but with improvements applied:
{
  "contact": { ... },
  "summary": "Improved summary...",
  "experience": [ ... ],
  "skills": { ... },
  "education": [ ... ],
  "projects": [ ... ]
}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations.`;

  try {
    const response = await generateWithOpenRouter(prompt, undefined, 3000);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in improvement response');
    }

    const improvedData: ResumeData = JSON.parse(jsonMatch[0]);
    return improvedData;
  } catch (error: any) {
    console.error('Error improving resume data:', error);
    throw new Error(`Failed to improve resume: ${error?.message || 'Unknown error'}`);
  }
}
