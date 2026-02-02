import { NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";

// Generate resume with LLM and translate with Lingo.dev

export async function POST(request: Request) {
  try {
    const { jobDescription, targetLanguage } = await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user profile if authenticated
    let userData = null;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        userData = profile;
      }
    }

    // Generate resume with LLM
    const responseText = await callLLM({
      system: `You are an expert resume writer. Generate a professional, ATS-optimized resume tailored for the job description. Return ONLY valid JSON, no markdown.`,
      messages: [
        {
          role: "user",
          content: `Generate a professional resume for this job:

Job Description:
${jobDescription}

${userData ? `User's existing data:\n${JSON.stringify(userData, null, 2)}` : "Create a compelling profile based on the job requirements."}

Return ONLY a JSON object with this exact structure:
{
  "summary": "2-3 sentence professional summary matching the job",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2020 - Present",
      "bullets": ["Achievement with metrics", "Another achievement"]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "education": [
    {
      "degree": "Degree Name",
      "school": "University Name",
      "year": "2020"
    }
  ]
}`,
        },
      ],
      maxTokens: 2000,
    });

    let resume;
    try {
      resume = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resume = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse resume JSON");
      }
    }

    // Translate if not English
    if (targetLanguage !== "en") {
      resume = await translateResume(resume, targetLanguage);
    }

    // Score the resume
    const atsResult = await scoreResume(resume, jobDescription);

    // Auto-rewrite if score < 70 (up to 3 attempts)
    let attempts = 1;
    let currentResume = resume;
    let currentScore = atsResult.score;

    while (currentScore < 70 && attempts < 3) {
      const rewriteResult = await rewriteResume(
        currentResume,
        jobDescription,
        atsResult.feedback,
        targetLanguage
      );
      currentResume = rewriteResult.resume;
      currentScore = rewriteResult.score;
      attempts++;
    }

    return NextResponse.json({
      resume: currentResume,
      ats: {
        ...atsResult,
        score: currentScore,
      },
      attempts,
      targetLanguage,
    });
  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

async function translateResume(
  resume: Record<string, unknown>,
  targetLanguage: string
) {
  // In production, use Lingo.dev SDK for translation
  // For now, return with language indicator
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
  const responseText = await callLLM({
    system:
      "You are an ATS expert. Score resumes against job descriptions. Return ONLY valid JSON.",
    messages: [
      {
        role: "user",
        content: `Score this resume (0-100):

Resume: ${JSON.stringify(resume)}

Job: ${jobDescription}

Return ONLY JSON:
{
  "score": 75,
  "feedback": {
    "strengths": ["strength 1"],
    "improvements": ["improvement 1"],
    "missingKeywords": ["keyword 1"]
  },
  "suggestions": ["suggestion 1"]
}`,
      },
    ],
    maxTokens: 1000,
  });

  try {
    return JSON.parse(responseText);
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
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

async function rewriteResume(
  resume: Record<string, unknown>,
  jobDescription: string,
  feedback: Record<string, unknown>,
  targetLanguage: string
) {
  const responseText = await callLLM({
    system:
      "You are an expert resume writer. Improve the resume based on feedback. Return ONLY valid JSON.",
    messages: [
      {
        role: "user",
        content: `Improve this resume based on feedback:

Current Resume: ${JSON.stringify(resume)}
Job: ${jobDescription}
Feedback: ${JSON.stringify(feedback)}

Improve the resume to score higher. Return the same JSON structure.`,
      },
    ],
    maxTokens: 2000,
  });

  let improvedResume;
  try {
    improvedResume = JSON.parse(responseText);
  } catch {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      improvedResume = JSON.parse(jsonMatch[0]);
    } else {
      improvedResume = resume;
    }
  }

  // Translate if needed
  if (targetLanguage !== "en") {
    improvedResume = await translateResume(improvedResume, targetLanguage);
  }

  // Score the improved resume
  const newScore = await scoreResume(improvedResume, jobDescription);

  return {
    resume: improvedResume,
    score: newScore.score,
    feedback: newScore.feedback,
  };
}
