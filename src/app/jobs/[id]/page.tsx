import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  ArrowLeft,
  Globe,
  Bookmark,
} from "lucide-react";
import { formatDate, getLanguageFlag, getLanguageName } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Job Details - GlobalHire AI",
  description: "View job details and generate a tailored resume",
};

// Fetch job details from API
async function getJob(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/jobs/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.job;
    }
  } catch (error) {
    console.error("Error fetching job:", error);
  }

  return null;
}

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {getLanguageFlag(job.original_language)}{" "}
                      {getLanguageName(job.original_language)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {job.job_type.replace("_", " ")}
                </Badge>
                {job.salary_range && (
                  <Badge variant="secondary">
                    <DollarSign className="mr-1 h-3 w-3" />
                    {job.salary_range}
                  </Badge>
                )}
                <Badge variant="outline">
                  Posted {formatDate(job.posted_at)}
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              {/* Job description */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {job.description.split("\n").map((paragraph: string, index: number) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="mt-6 text-lg font-semibold">
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-muted-foreground">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions card */}
          <Card>
            <CardHeader>
              <CardTitle>Apply for this job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <a
                  href={job.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply on Company Site
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/resume/generate?jobId=${job.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Tailored Resume
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/interview/setup?jobId=${job.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Practice Interview
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Translation card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This job was originally posted in{" "}
                <strong>{getLanguageName(job.original_language)}</strong>.
                Select your preferred language to translate the description.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["en", "es", "de", "fr", "ja"].map((lang) => (
                  <Button
                    key={lang}
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1"
                  >
                    {getLanguageFlag(lang)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company info card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                About {job.company}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn more about the company culture, values, and work
                environment to prepare for your application.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0">
                Research Company →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
