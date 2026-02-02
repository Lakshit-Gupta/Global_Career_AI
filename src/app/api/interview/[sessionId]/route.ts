import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

// Get interview session details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // For demo, return mock session
      return NextResponse.json({
        session: {
          jobTitle: "Senior Developer",
          company: "TechCorp",
          interviewType: "mixed",
          userLanguage: "en",
          interviewerLanguage: "en",
          questionsAsked: 0,
        },
        messages: [],
      });
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("interview_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
    }

    return NextResponse.json({
      session: {
        jobTitle: (session as any).job_title,
        company: (session as any).company,
        interviewType: (session as any).interview_type,
        userLanguage: (session as any).user_language,
        interviewerLanguage: (session as any).interviewer_language,
        questionsAsked:
          messages?.filter((m: any) => m.role === "assistant").length || 0,
      },
      messages:
        messages?.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          originalContent: m.original_content,
          translated: m.original_content !== m.content,
          timestamp: m.created_at,
        })) || [],
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
