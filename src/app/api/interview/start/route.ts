import { NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// Start a new interview session

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      jobTitle,
      company,
      jobDescription,
      interviewType,
      userLanguage,
      interviewerLanguage,
      difficulty,
    } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();

    // Generate initial context for the interview
    const systemPrompt = buildInterviewerPrompt({
      jobTitle,
      company,
      jobDescription,
      interviewType,
      interviewerLanguage,
      difficulty,
    });

    // Generate initial greeting
    const greetingText = await callLLM({
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content:
            "Start the interview with a professional greeting and your first question.",
        },
      ],
      maxTokens: 500,
    });

    // Save session to database if user is authenticated
    if (user) {
      const { error } = await (supabase.from("interview_sessions") as any).insert({
        id: sessionId,
        user_id: user.id,
        job_title: jobTitle,
        company: company || null,
        interview_type: interviewType,
        user_language: userLanguage,
        interviewer_language: interviewerLanguage,
        status: "in_progress",
      });

      if (error) {
        console.error("Error saving session:", error);
      }

      // Save initial message
      await (supabase.from("interview_messages") as any).insert({
        session_id: sessionId,
        role: "assistant",
        content: greetingText,
        original_content: greetingText,
      });
    }

    return NextResponse.json({
      sessionId,
      greeting: greetingText,
      session: {
        jobTitle,
        company,
        interviewType,
        userLanguage,
        interviewerLanguage,
        questionsAsked: 1,
      },
    });
  } catch (error) {
    console.error("Interview start error:", error);
    return NextResponse.json(
      { error: "Failed to start interview" },
      { status: 500 }
    );
  }
}

function buildInterviewerPrompt({
  jobTitle,
  company,
  jobDescription,
  interviewType,
  interviewerLanguage,
  difficulty,
}: {
  jobTitle: string;
  company?: string;
  jobDescription?: string;
  interviewType: string;
  interviewerLanguage: string;
  difficulty: string;
}) {
  const languageInstruction =
    interviewerLanguage !== "en"
      ? `Conduct this interview entirely in ${getLanguageName(interviewerLanguage)}.`
      : "";

  const difficultyGuide = {
    easy: "Ask entry-level questions suitable for junior candidates. Be encouraging and supportive.",
    medium:
      "Ask mid-level questions that test practical experience. Balance technical depth with accessibility.",
    hard: "Ask senior-level questions that test deep expertise, system design thinking, and leadership.",
  };

  const typeGuide = {
    technical:
      "Focus on technical skills, coding concepts, system design, and problem-solving.",
    behavioral:
      "Focus on past experiences, teamwork, leadership, conflict resolution, and cultural fit.",
    mixed:
      "Balance technical questions with behavioral questions. Alternate between the two types.",
  };

  return `You are a professional interviewer for ${company || "a tech company"} interviewing a candidate for the ${jobTitle} position.

${languageInstruction}

Interview Type: ${interviewType}
${typeGuide[interviewType as keyof typeof typeGuide]}

Difficulty: ${difficulty}
${difficultyGuide[difficulty as keyof typeof difficultyGuide]}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ""}

Guidelines:
1. Be professional but friendly
2. Ask one question at a time
3. Listen to the candidate's response and ask relevant follow-up questions
4. After 5-7 questions, naturally wrap up the interview
5. Provide brief acknowledgment of good answers
6. If an answer is unclear, ask for clarification
7. Stay in character as the interviewer throughout`;
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    de: "German",
    fr: "French",
    es: "Spanish",
    ja: "Japanese",
  };
  return languages[code] || "English";
}
