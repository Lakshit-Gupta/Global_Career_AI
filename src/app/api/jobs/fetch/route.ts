import { NextResponse } from "next/server";

// JSearch API from RapidAPI
const RAPIDAPI_KEY = process.env.RAPID_API_KEY;
const RAPIDAPI_HOST = process.env.RAPID_API_HOST || "jsearch.p.rapidapi.com";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "developer";
  const location = searchParams.get("location") || "";
  const page = searchParams.get("page") || "1";
  const employmentType = searchParams.get("type") || "";

  // Build search query
  let searchQuery = query;
  if (location) {
    searchQuery += ` in ${location}`;
  }

  try {
    // In development/demo mode, return mock data if no API key
    if (!RAPIDAPI_KEY) {
      return NextResponse.json({
        jobs: getMockJobs(),
        totalCount: 50,
        page: parseInt(page),
        message: "Using mock data - configure RAPID_API_KEY for real jobs",
      });
    }

    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1${employmentType ? `&employment_types=${employmentType}` : ""}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our job format
    const jobs = (data.data || []).map((job: JSearchJob) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      companyLogo: job.employer_logo,
      location: [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(", "),
      description: job.job_description,
      job_type: job.job_employment_type,
      salary_range:
        job.job_min_salary && job.job_max_salary
          ? `${job.job_salary_currency || "$"}${job.job_min_salary.toLocaleString()} - ${job.job_salary_currency || "$"}${job.job_max_salary.toLocaleString()}`
          : null,
      source_url: job.job_apply_link,
      posted_at: job.job_posted_at_datetime_utc,
      original_language: detectLanguage(job.job_country),
    }));

    return NextResponse.json({
      jobs,
      totalCount: data.data?.length || 0,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", jobs: getMockJobs() },
      { status: 500 }
    );
  }
}

// Simple language detection based on country
function detectLanguage(country: string): string {
  const countryLangMap: Record<string, string> = {
    Germany: "de",
    Deutschland: "de",
    Austria: "de",
    Switzerland: "de",
    Spain: "es",
    España: "es",
    Mexico: "es",
    Argentina: "es",
    France: "fr",
    Canada: "en",
    Japan: "ja",
    "日本": "ja",
  };
  return countryLangMap[country] || "en";
}

// Mock jobs for development
function getMockJobs() {
  return [
    {
      id: "mock-1",
      title: "Senior Full Stack Developer",
      company: "TechCorp Berlin",
      companyLogo: null,
      location: "Berlin, Germany",
      description:
        "We are looking for a Senior Full Stack Developer to join our international team. You will work on cutting-edge web applications using React, Node.js, and cloud technologies.\n\nRequirements:\n- 5+ years of experience in web development\n- Strong proficiency in React and TypeScript\n- Experience with Node.js and PostgreSQL\n- Fluent in English, German is a plus\n\nBenefits:\n- Competitive salary\n- Remote-friendly\n- International team\n- Learning budget",
      job_type: "FULLTIME",
      salary_range: "€70,000 - €90,000",
      source_url: "https://example.com/apply/1",
      posted_at: new Date().toISOString(),
      original_language: "de",
    },
    {
      id: "mock-2",
      title: "Frontend Engineer",
      company: "StartupX",
      companyLogo: null,
      location: "Paris, France",
      description:
        "Rejoignez notre équipe en tant que Frontend Engineer! Nous cherchons quelqu'un passionné par le développement web moderne.\n\nResponsabilités:\n- Développer des interfaces utilisateur réactives\n- Collaborer avec l'équipe design\n- Optimiser les performances\n\nRequis:\n- 3+ ans d'expérience en React\n- Connaissance de TypeScript\n- Bon niveau d'anglais",
      job_type: "FULLTIME",
      salary_range: "€55,000 - €75,000",
      source_url: "https://example.com/apply/2",
      posted_at: new Date(Date.now() - 86400000).toISOString(),
      original_language: "fr",
    },
    {
      id: "mock-3",
      title: "Backend Developer",
      company: "Global Solutions",
      companyLogo: null,
      location: "Tokyo, Japan",
      description:
        "バックエンドエンジニアを募集しています。最新の技術を使用して、スケーラブルなシステムを構築します。\n\n必要なスキル:\n- Python または Node.js の経験\n- データベース設計の知識\n- REST API の設計経験\n\n待遇:\n- フレックスタイム制\n- リモートワーク可能\n- 年俸制",
      job_type: "FULLTIME",
      salary_range: "¥8,000,000 - ¥12,000,000",
      source_url: "https://example.com/apply/3",
      posted_at: new Date(Date.now() - 172800000).toISOString(),
      original_language: "ja",
    },
    {
      id: "mock-4",
      title: "DevOps Engineer",
      company: "CloudTech España",
      companyLogo: null,
      location: "Madrid, Spain",
      description:
        "Buscamos un DevOps Engineer para unirse a nuestro equipo de infraestructura.\n\nResponsabilidades:\n- Gestión de infraestructura en AWS/GCP\n- Implementación de CI/CD\n- Automatización de procesos\n\nRequisitos:\n- 4+ años de experiencia en DevOps\n- Conocimientos de Kubernetes y Docker\n- Terraform o similar\n- Inglés fluido",
      job_type: "FULLTIME",
      salary_range: "€50,000 - €70,000",
      source_url: "https://example.com/apply/4",
      posted_at: new Date(Date.now() - 259200000).toISOString(),
      original_language: "es",
    },
    {
      id: "mock-5",
      title: "React Native Developer",
      company: "MobileFirst Inc",
      companyLogo: null,
      location: "Remote - USA",
      description:
        "Join our mobile team as a React Native Developer! Work on apps used by millions of users worldwide.\n\nWhat you'll do:\n- Build and maintain React Native applications\n- Collaborate with design and backend teams\n- Write clean, maintainable code\n\nRequirements:\n- 3+ years of React Native experience\n- Published apps on App Store/Play Store\n- Strong JavaScript/TypeScript skills",
      job_type: "FULLTIME",
      salary_range: "$120,000 - $160,000",
      source_url: "https://example.com/apply/5",
      posted_at: new Date(Date.now() - 345600000).toISOString(),
      original_language: "en",
    },
    {
      id: "mock-6",
      title: "Data Engineer",
      company: "Analytics GmbH",
      companyLogo: null,
      location: "Munich, Germany",
      description:
        "Wir suchen einen Data Engineer für unser Analytics-Team in München.\n\nAufgaben:\n- Aufbau von Datenpipelines\n- ETL-Prozesse entwickeln\n- Datenqualität sicherstellen\n\nAnforderungen:\n- Erfahrung mit Python und SQL\n- Kenntnisse in Spark oder ähnlichen Tools\n- Cloud-Erfahrung (AWS/GCP)\n- Deutsch und Englisch fließend",
      job_type: "FULLTIME",
      salary_range: "€65,000 - €85,000",
      source_url: "https://example.com/apply/6",
      posted_at: new Date(Date.now() - 432000000).toISOString(),
      original_language: "de",
    },
  ];
}
