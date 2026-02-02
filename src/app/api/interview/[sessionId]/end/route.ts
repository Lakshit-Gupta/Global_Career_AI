import { NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

// End interview and generate feedback
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get session and messages
    let sessionData = {
      job_title: "Senior Developer",
      company: "TechCorp",
      interview_type: "mixed",
    };

    let messages: Array<{ role: string; content: string }> = [];

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

      const { data: msgs } = await supabase
        .from("interview_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (msgs) {
        messages = msgs;
      }

      // Update session status
      await (supabase
        .from("interview_sessions") as any)
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    // Generate feedback with LLM
    const feedbackText = await callLLM({
      system:
        "You are an expert interview coach. Analyze the interview transcript and provide detailed, constructive feedback. Return ONLY valid JSON.",
      messages: [
        {
          role: "user",
          content: `Analyze this interview for a ${sessionData.job_title} position at ${sessionData.company || "a tech company"}.

Interview Transcript:
${messages.map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`).join("\n\n")}

Provide detailed feedback in this JSON format:
{
  "overallScore": 75,
  "summary": "Brief 2-3 sentence summary of performance",
  "strengths": [
    {"area": "Communication", "feedback": "Specific positive feedback"}
  ],
  "improvements": [
    {"area": "Technical Depth", "feedback": "Specific improvement suggestion"}
  ],
  "questionAnalysis": [
    {
      "question": "The question asked",
      "responseQuality": "good|average|needs-improvement",
      "feedback": "Specific feedback for this answer"
    }
  ],
  "tips": [
    "Actionable tip for next interview"
  ]
}`,
        },
      ],
      maxTokens: 1500,
    });

    const feedbackContent = feedbackText;

    let feedback;
    try {
      feedback = JSON.parse(feedbackContent);
    } catch {
      const jsonMatch = feedbackContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        feedback = {
          overallScore: 70,
          summary: "Unable to generate detailed feedback at this time.",
          strengths: [],
          improvements: [],
          questionAnalysis: [],
          tips: [],
        };
      }
    }

    // Save feedback to database
    if (user) {
      await (supabase
        .from("interview_sessions") as any)
        .update({
          feedback,
          score: feedback.overallScore,
        })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      feedback,
      sessionId,
    });
  } catch (error) {
    console.error("Interview end error:", error);
    return NextResponse.json(
      { error: "Failed to end interview" },
      { status: 500 }
    );
  }
}
