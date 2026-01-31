import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Create a new application
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

    const {
      jobTitle,
      company,
      location,
      jobUrl,
      status,
      appliedAt,
      notes,
      resumeUsed,
      jobId,
    } = await request.json();

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        job_id: jobId || null,
        job_title: jobTitle,
        company,
        location,
        job_url: jobUrl,
        status: status || "applied",
        applied_at: appliedAt || new Date().toISOString(),
        notes,
        resume_used: resumeUsed,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating application:", error);
      return NextResponse.json(
        { error: "Failed to create application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ application: data });
  } catch (error) {
    console.error("Application create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all applications for the user
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
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
