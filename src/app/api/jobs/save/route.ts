import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Save a job to the database and/or user's saved jobs

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const jobData = await request.json();

    // First, upsert the job into jobs table
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .upsert(
        {
          id: jobData.id,
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          original_language: jobData.original_language,
          source_url: jobData.source_url,
          salary_range: jobData.salary_range,
          job_type: jobData.job_type,
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (jobError) {
      console.error("Error saving job:", jobError);
      return NextResponse.json(
        { error: "Failed to save job" },
        { status: 500 }
      );
    }

    // Save to user's saved jobs
    const { error: savedError } = await supabase.from("saved_jobs").upsert(
      {
        user_id: user.id,
        job_id: job.id,
      },
      {
        onConflict: "user_id,job_id",
      }
    );

    if (savedError) {
      console.error("Error saving to saved_jobs:", savedError);
      return NextResponse.json(
        { error: "Failed to save job to favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove a job from user's saved jobs
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

    const { jobId } = await request.json();

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user.id)
      .eq("job_id", jobId);

    if (error) {
      console.error("Error removing saved job:", error);
      return NextResponse.json(
        { error: "Failed to remove saved job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete saved job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's saved jobs
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

    const { data: savedJobs, error } = await supabase
      .from("saved_jobs")
      .select(
        `
        id,
        created_at,
        jobs (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved jobs:", error);
      return NextResponse.json(
        { error: "Failed to fetch saved jobs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
