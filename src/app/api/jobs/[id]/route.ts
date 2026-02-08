import { NextResponse } from "next/server";

// JSearch API from RapidAPI
const RAPIDAPI_KEY = process.env.RAPID_API_KEY;
const RAPIDAPI_HOST = process.env.RAPID_API_HOST || "jsearch.p.rapidapi.com";

// JSearchJob interface used for type casting API responses
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string;
  job_state: string;
  job_country: string;
  job_description: string;
  job_employment_type: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
}

// Simple language detection based on country
function detectLanguage(country: string): string {
  const countryLangMap: Record<string, string> = {
    US: "en",
    CA: "en",
    GB: "en",
    AU: "en",
    DE: "de",
    FR: "fr",
    ES: "es",
    IT: "it",
    JP: "ja",
    CN: "zh",
    KR: "ko",
  };

  return countryLangMap[country] || "en";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!RAPIDAPI_KEY) {
      // Return mock data if no API key
      return NextResponse.json({
        job: {
          id: "mock-1",
          title: "Senior Full Stack Developer",
          company: "TechCorp Berlin",
          companyLogo: null,
          location: "Berlin, Germany",
          description: `We are looking for a Senior Full Stack Developer to join our international team. You will work on cutting-edge web applications using React, Node.js, and cloud technologies.

## Responsibilities
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews
- Contribute to architectural decisions

## Requirements
- 5+ years of experience in web development
- Strong proficiency in React and TypeScript
- Experience with Node.js and PostgreSQL
- Familiarity with cloud services (AWS/GCP)
- Fluent in English, German is a plus

## Benefits
- Competitive salary (€70,000 - €90,000)
- Remote-friendly work environment
- International and diverse team
- Learning and development budget
- 30 days vacation
- Modern office in Berlin Mitte`,
          job_type: "FULLTIME",
          salary_range: "€70,000 - €90,000",
          source_url: "https://example.com/apply/1",
          posted_at: new Date().toISOString(),
          original_language: "en",
        },
        message: "Using mock data - configure RAPID_API_KEY for real jobs",
      });
    }

    // Fetch job details from JSearch API
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/job-details?job_id=${encodeURIComponent(id)}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const jobData = data.data?.[0];

    if (!jobData) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Transform to our job format
    const job = {
      id: jobData.job_id,
      title: jobData.job_title,
      company: jobData.employer_name,
      companyLogo: jobData.employer_logo,
      location: [jobData.job_city, jobData.job_state, jobData.job_country]
        .filter(Boolean)
        .join(", "),
      description: jobData.job_description,
      job_type: jobData.job_employment_type,
      salary_range:
        jobData.job_min_salary && jobData.job_max_salary
          ? `${jobData.job_salary_currency || "$"}${jobData.job_min_salary.toLocaleString()} - ${jobData.job_salary_currency || "$"}${jobData.job_max_salary.toLocaleString()}`
          : null,
      source_url: jobData.job_apply_link,
      posted_at: jobData.job_posted_at_datetime_utc,
      original_language: detectLanguage(jobData.job_country),
    };

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}
