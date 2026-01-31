import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Download, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume History - GlobalHire AI",
  description: "View and manage your saved resumes",
};

// This would normally fetch from the API
const mockResumes = [
  {
    id: "1",
    title: "Senior Developer - TechCorp",
    job: { title: "Senior Developer", company: "TechCorp Berlin" },
    language: "de",
    ats_score: 85,
    created_at: "2025-01-31T10:00:00Z",
  },
  {
    id: "2",
    title: "Full Stack Engineer - StartupXYZ",
    job: { title: "Full Stack Engineer", company: "StartupXYZ" },
    language: "en",
    ats_score: 78,
    created_at: "2025-01-30T15:00:00Z",
  },
  {
    id: "3",
    title: "Frontend Developer - DesignStudio",
    job: { title: "Frontend Developer", company: "DesignStudio Paris" },
    language: "fr",
    ats_score: 92,
    created_at: "2025-01-29T09:00:00Z",
  },
];

const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  ja: "🇯🇵",
};

export default function ResumeHistoryPage() {
  const resumes = mockResumes;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume History</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your previously generated resumes
          </p>
        </div>
        <Button asChild>
          <Link href="/resume/generate">
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h2 className="mb-2 text-xl font-semibold">No resumes yet</h2>
            <p className="mb-6 text-muted-foreground">
              Generate your first resume to see it here
            </p>
            <Button asChild>
              <Link href="/resume/generate">Generate Resume</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between text-lg">
                  <span className="line-clamp-1">{resume.title}</span>
                  <span className="ml-2 text-xl">
                    {languageFlags[resume.language] || "🌐"}
                  </span>
                </CardTitle>
                <CardDescription>
                  {resume.job?.company || "Custom Resume"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    ATS Score:
                  </span>
                  <Badge
                    variant={
                      resume.ats_score >= 80
                        ? "default"
                        : resume.ats_score >= 60
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {resume.ats_score}/100
                  </Badge>
                </div>

                <p className="mb-4 text-xs text-muted-foreground">
                  Created {new Date(resume.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
