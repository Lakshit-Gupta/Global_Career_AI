import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Save a resume to the database

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { title, content, jobId, language, atsScore } = await request.json();

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: title || "Untitled Resume",
        content,
        job_id: jobId || null,
        language: language || "en",
        ats_score: atsScore || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving resume:", error);
      return NextResponse.json(
        { error: "Failed to save resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({ resume: data });
  } catch (error) {
    console.error("Resume save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all resumes for the user
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("resumes")
      .select(
        `
        *,
        jobs (title, company)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resumes:", error);
      return NextResponse.json(
        { error: "Failed to fetch resumes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ resumes: data });
  } catch (error) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a resume
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting resume:", error);
      return NextResponse.json(
        { error: "Failed to delete resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
