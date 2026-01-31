import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// API route to save/get user profile

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

    const profileData = await request.json();

    // Upsert profile
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: user.id,
          education: profileData.education,
          experience: profileData.experience,
          skills: profileData.skills,
          summary: profileData.summary,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving profile:", error);
      return NextResponse.json(
        { error: "Failed to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data || null });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
