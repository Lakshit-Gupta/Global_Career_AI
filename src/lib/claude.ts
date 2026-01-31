import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export { anthropic };

// System prompts for different use cases
export const SYSTEM_PROMPTS = {
  resumeGenerator: `You are an expert resume writer and career coach. Your task is to generate professional, ATS-optimized resumes tailored to specific job descriptions.

Guidelines:
- Create compelling professional summaries that highlight key strengths
- Use action verbs and quantifiable achievements
- Match keywords from the job description naturally
- Keep formatting clean and scannable
- Focus on relevant experience and skills
- Be concise but impactful

Always return valid JSON in the exact format requested.`,

  atsScorer: `You are an ATS (Applicant Tracking System) expert. Your task is to analyze resumes against job descriptions and provide:
1. A score from 0-100 based on keyword matching, relevance, and format
2. Specific feedback on strengths and areas for improvement
3. Suggestions for optimization

Be objective and constructive in your feedback. Always return valid JSON.`,

  interviewer: `You are an experienced technical interviewer conducting a job interview. Your role is to:
- Ask relevant questions based on the job description and candidate's background
- Start with an introduction and warm-up questions
- Progress to technical and behavioral questions
- Be professional, encouraging, and fair
- Provide follow-up questions based on responses
- Keep questions focused and clear

Maintain a natural conversation flow while assessing the candidate's fit for the role.`,

  interviewFeedback: `You are a career coach providing feedback on interview performance. Your task is to:
- Analyze the interview transcript
- Identify strengths in communication and responses
- Point out areas for improvement
- Provide specific, actionable suggestions
- Give an overall score (0-100) with justification

Be constructive and encouraging while being honest about areas needing work.`,

  companyResearcher: `You are a business analyst researching companies. Your task is to provide:
- Company overview and culture insights
- Recent news and developments
- Industry position and competitors
- Potential interview topics based on company values
- Tips for tailoring applications to this company

Be factual and helpful. Acknowledge when information might be outdated.`,
};

// Helper function to generate resume content
export async function generateResumeContent(
  userData: Record<string, unknown>,
  jobDescription: string
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Generate a professional resume tailored for this job:

Job Description: ${jobDescription}

User Data:
${JSON.stringify(userData, null, 2)}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "bullets": ["Achievement 1 with metrics", "Achievement 2 with metrics"]
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "Graduation Year"
    }
  ]
}`,
      },
    ],
    system: SYSTEM_PROMPTS.resumeGenerator,
  });

  const textContent = message.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return JSON.parse(textContent.text);
}

// Helper function to score resume against job description
export async function scoreResume(
  resumeContent: Record<string, unknown>,
  jobDescription: string
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Score this resume against the job description (0-100):

Resume: ${JSON.stringify(resumeContent)}

Job Description: ${jobDescription}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "score": 85,
  "feedback": {
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "missingKeywords": ["keyword1", "keyword2"]
  },
  "suggestions": ["specific suggestion 1", "specific suggestion 2"]
}`,
      },
    ],
    system: SYSTEM_PROMPTS.atsScorer,
  });

  const textContent = message.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return JSON.parse(textContent.text);
}

// Helper function to generate interview response
export async function generateInterviewResponse(
  jobInfo: { title: string; company: string; description: string },
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
) {
  const systemPrompt = `${SYSTEM_PROMPTS.interviewer}

You are interviewing for the following position:
Job Title: ${jobInfo.title}
Company: ${jobInfo.company}
Job Description: ${jobInfo.description}

Conduct a natural, professional interview. If this is the first message, introduce yourself and start with an icebreaker question.`;

  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return textContent.text;
}

// Helper function to generate interview feedback
export async function generateInterviewFeedback(
  jobInfo: { title: string; company: string; description: string },
  transcript: Array<{ role: string; content: string }>
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Analyze this interview transcript and provide feedback:

Position: ${jobInfo.title} at ${jobInfo.company}
Job Description: ${jobInfo.description}

Transcript:
${transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "score": 75,
  "overallAssessment": "2-3 sentence summary of performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2"],
  "specificFeedback": [
    {
      "question": "The interview question",
      "response": "What the candidate said",
      "feedback": "Specific feedback on this response"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`,
      },
    ],
    system: SYSTEM_PROMPTS.interviewFeedback,
  });

  const textContent = message.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return JSON.parse(textContent.text);
}
