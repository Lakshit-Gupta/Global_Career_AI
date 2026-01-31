import { NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

// Send a message in the interview
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get session info
    let sessionData = {
      job_title: "Senior Developer",
      company: "TechCorp",
      interview_type: "mixed",
      user_language: "en",
      interviewer_language: "en",
    };

    let previousMessages: Array<{ role: string; content: string }> = [];

    if (user) {
      const { data: session } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (session) {
        sessionData = session;
      }

      // Get previous messages
      const { data: messages } = await supabase
        .from("interview_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (messages) {
        previousMessages = messages;
      }
    }

    // Translate user message if needed
    let translatedMessage = message;
    if (sessionData.user_language !== sessionData.interviewer_language) {
      translatedMessage = await translateText(
        message,
        sessionData.user_language,
        sessionData.interviewer_language
      );
    }

    // Build conversation history for Claude
    const conversationHistory = previousMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    conversationHistory.push({
      role: "user",
      content: translatedMessage,
    });

    // Generate interviewer response
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: buildInterviewerPrompt(sessionData),
      messages: conversationHistory,
    });

    const responseContent = response.content[0];
    if (responseContent.type !== "text") {
      throw new Error("Unexpected response type");
    }

    let interviewerResponse = responseContent.text;
    let originalResponse = responseContent.text;

    // Translate response to user's language if different
    if (sessionData.user_language !== sessionData.interviewer_language) {
      interviewerResponse = await translateText(
        responseContent.text,
        sessionData.interviewer_language,
        sessionData.user_language
      );
    }

    // Save messages to database
    if (user) {
      // Save user message
      await supabase.from("interview_messages").insert({
        session_id: sessionId,
        role: "user",
        content: message,
        original_content: message,
      });

      // Save assistant message
      await supabase.from("interview_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: interviewerResponse,
        original_content: originalResponse,
      });
    }

    return NextResponse.json({
      id: Date.now().toString(),
      content: interviewerResponse,
      originalContent:
        interviewerResponse !== originalResponse ? originalResponse : undefined,
      translated: interviewerResponse !== originalResponse,
      session: {
        jobTitle: sessionData.job_title,
        company: sessionData.company,
        interviewType: sessionData.interview_type,
        userLanguage: sessionData.user_language,
        interviewerLanguage: sessionData.interviewer_language,
        questionsAsked: previousMessages.filter((m) => m.role === "assistant")
          .length + 1,
      },
    });
  } catch (error) {
    console.error("Interview message error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  if (from === to) return text;

  if (!process.env.LINGO_API_KEY) {
    return text;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/translate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to }),
      }
    );
    const data = await response.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
}

function buildInterviewerPrompt(session: {
  job_title: string;
  company?: string;
  interview_type: string;
  interviewer_language: string;
}) {
  const languageInstruction =
    session.interviewer_language !== "en"
      ? `Respond in ${getLanguageName(session.interviewer_language)}.`
      : "";

  return `You are a professional interviewer for ${session.company || "a tech company"} interviewing a candidate for the ${session.job_title} position.

${languageInstruction}

Interview Type: ${session.interview_type}

Guidelines:
1. Be professional but friendly
2. Ask one question at a time
3. Acknowledge the candidate's response before asking follow-up questions
4. Ask relevant follow-up questions based on their answers
5. Mix technical and behavioral questions if type is "mixed"
6. After 5-7 questions, start wrapping up the interview
7. Stay in character as the interviewer`;
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
