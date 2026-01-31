import { NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

// Rewrite resume based on ATS feedback

export async function POST(request: Request) {
  try {
    const { resume, jobDescription, targetLanguage, feedback } =
      await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    // Rewrite with Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: `You are an expert resume writer. Your job is to improve resumes to score higher on ATS systems. Return ONLY valid JSON.`,
      messages: [
        {
          role: "user",
          content: `Improve this resume to score higher on ATS:

Current Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

ATS Feedback:
${JSON.stringify(feedback, null, 2)}

Instructions:
1. Add missing keywords naturally
2. Strengthen weak bullet points with metrics
3. Better align summary with job requirements
4. Keep the same JSON structure

Return the improved resume as JSON with this structure:
{
  "summary": "...",
  "experience": [...],
  "skills": [...],
  "education": [...]
}`,
        },
      ],
    });

    const textContent = message.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type");
    }

    let improvedResume;
    try {
      improvedResume = JSON.parse(textContent.text);
    } catch {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        improvedResume = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse improved resume");
      }
    }

    // Translate if needed
    if (targetLanguage && targetLanguage !== "en") {
      improvedResume = await translateResume(improvedResume, targetLanguage);
    }

    // Score the improved resume
    const scoreResult = await scoreResume(improvedResume, jobDescription);

    return NextResponse.json({
      resume: improvedResume,
      ats: scoreResult,
    });
  } catch (error) {
    console.error("Resume rewrite error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite resume" },
      { status: 500 }
    );
  }
}

async function translateResume(
  resume: Record<string, unknown>,
  targetLanguage: string
) {
  const translate = async (text: string) => {
    if (!process.env.LINGO_API_KEY) {
      return `[${targetLanguage.toUpperCase()}] ${text}`;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/translate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, from: "en", to: targetLanguage }),
        }
      );
      const data = await response.json();
      return data.translatedText || text;
    } catch {
      return text;
    }
  };

  return {
    summary: await translate(resume.summary as string),
    experience: await Promise.all(
      (resume.experience as Array<Record<string, unknown>>).map(async (exp) => ({
        ...exp,
        title: await translate(exp.title as string),
        bullets: await Promise.all(
          (exp.bullets as string[]).map((b) => translate(b))
        ),
      }))
    ),
    skills: await Promise.all(
      (resume.skills as string[]).map((s) => translate(s))
    ),
    education: await Promise.all(
      (resume.education as Array<Record<string, unknown>>).map(async (edu) => ({
        ...edu,
        degree: await translate(edu.degree as string),
      }))
    ),
  };
}

async function scoreResume(
  resume: Record<string, unknown>,
  jobDescription: string
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system:
      "You are an ATS expert. Score resumes. Return ONLY valid JSON with score 0-100.",
    messages: [
      {
        role: "user",
        content: `Score this resume:

Resume: ${JSON.stringify(resume)}
Job: ${jobDescription}

Return JSON:
{
  "score": 75,
  "feedback": {
    "strengths": ["strength"],
    "improvements": ["improvement"],
    "missingKeywords": ["keyword"]
  },
  "suggestions": ["suggestion"]
}`,
      },
    ],
  });

  const textContent = message.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type");
  }

  try {
    return JSON.parse(textContent.text);
  } catch {
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      score: 70,
      feedback: { strengths: [], improvements: [], missingKeywords: [] },
      suggestions: [],
    };
  }
}
