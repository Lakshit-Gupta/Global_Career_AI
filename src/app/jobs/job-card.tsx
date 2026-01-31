"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  FileText,
  ExternalLink,
  Globe,
} from "lucide-react";
import { formatRelativeTime, getLanguageFlag } from "@/lib/utils";

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

interface JobCardProps {
  job: Job;
  userLang: string;
  isTranslating?: boolean;
}

export function JobCard({ job, userLang, isTranslating }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const displayTitle = job.translatedTitle || job.title;
  const displayDescription = job.translatedDescription || job.description;
  const isTranslated =
    job.translatedTitle !== undefined || job.translatedDescription !== undefined;
  const needsTranslation = job.original_language !== userLang && !isTranslated;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/jobs/save", {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isSaved ? { jobId: job.id } : job),
      });

      if (response.status === 401) {
        toast({
          title: "Login required",
          description: "Please log in to save jobs.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Job removed" : "Job saved",
        description: isSaved
          ? "Job removed from your saved list."
          : "Job added to your saved list.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{displayTitle}</CardTitle>
              {needsTranslation && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="mr-1 h-3 w-3" />
                  {getLanguageFlag(job.original_language)}
                </Badge>
              )}
              {isTranslated && (
                <Badge variant="secondary" className="text-xs">
                  Translated
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={isSaving}
            className="shrink-0"
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.job_type && (
            <Badge variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              {job.job_type.replace("_", " ")}
            </Badge>
          )}
          {job.salary_range && (
            <Badge variant="secondary">
              <DollarSign className="mr-1 h-3 w-3" />
              {job.salary_range}
            </Badge>
          )}
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {formatRelativeTime(job.posted_at)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Description preview */}
        <p
          className={`line-clamp-3 text-sm text-muted-foreground ${isTranslating ? "opacity-50" : ""}`}
        >
          {displayDescription}
        </p>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="default">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/resume/generate?jobId=${job.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Resume
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={job.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Apply
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
