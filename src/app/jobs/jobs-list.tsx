"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { JobCard } from "./job-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { translate } from "@/lib/translate";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { Loader2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  description: string;
  job_type: string;
  salary_range: string | null;
  source_url: string;
  posted_at: string;
  original_language: string;
  translatedDescription?: string;
  translatedTitle?: string;
}

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [page, setPage] = useState(1);
  const { locale: userLang } = useLingoContext();
  const searchParams = useSearchParams();

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = searchParams.get("query") || "developer";
      const location = searchParams.get("location") || "";
      const type = searchParams.get("type") || "";

      const params = new URLSearchParams({
        query,
        location,
        type,
        page: page.toString(),
      });

      const response = await fetch(`/api/jobs/fetch?${params}`);
      const data = await response.json();

      if (data.jobs) {
        setJobs(data.jobs);
        // Auto-translate if user language differs
        if (userLang !== "en") {
          translateJobs(data.jobs, userLang);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, page, userLang]);

  const translateJobs = async (jobsToTranslate: Job[], targetLang: string) => {
    setIsTranslating(true);
    try {
      const translatedJobs = await Promise.all(
        jobsToTranslate.map(async (job) => {
          // Only translate if the job is in a different language
          if (job.original_language !== targetLang) {
            const [translatedTitle, translatedDescription] = await Promise.all([
              translate(job.title, {
                from: job.original_language,
                to: targetLang,
              }),
              translate(job.description.substring(0, 500), {
                from: job.original_language,
                to: targetLang,
              }),
            ]);

            return {
              ...job,
              translatedTitle,
              translatedDescription,
            };
          }
          return job;
        })
      );

      setJobs(translatedJobs);
    } catch (error) {
      console.error("Error translating jobs:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleTranslateAll = async () => {
    if (jobs.length > 0) {
      await translateJobs(jobs, userLang);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search filters or try a different query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Translation controls */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
        <span className="text-sm text-muted-foreground">
          Found {jobs.length} jobs
        </span>
        {userLang !== "en" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslateAll}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              `Translate all to ${userLang.toUpperCase()}`
            )}
          </Button>
        )}
      </div>

      {/* Jobs list */}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          userLang={userLang}
          isTranslating={isTranslating}
        />
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button variant="outline" disabled>
          Page {page}
        </Button>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
