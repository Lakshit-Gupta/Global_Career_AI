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
import { History, MessageSquare, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Interview History - GlobalHire AI",
  description: "View your past interview practice sessions",
};

// Mock data - would come from API
const mockInterviews = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Berlin",
    interviewType: "mixed",
    date: "2025-01-30",
    score: 82,
    questionsAnswered: 6,
    userLanguage: "en",
    interviewerLanguage: "de",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    interviewType: "technical",
    date: "2025-01-28",
    score: 75,
    questionsAnswered: 5,
    userLanguage: "en",
    interviewerLanguage: "en",
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "DesignStudio Paris",
    interviewType: "behavioral",
    date: "2025-01-25",
    score: 88,
    questionsAnswered: 7,
    userLanguage: "en",
    interviewerLanguage: "fr",
  },
];

const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  ja: "🇯🇵",
};

export default function InterviewHistoryPage() {
  const interviews = mockInterviews;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="mt-2 text-muted-foreground">
            Review your past practice sessions and track your progress
          </p>
        </div>
        <Button asChild>
          <Link href="/interview/setup">
            <Plus className="mr-2 h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center">
            <History className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h2 className="mb-2 text-xl font-semibold">No interviews yet</h2>
            <p className="mb-6 text-muted-foreground">
              Start practicing to see your history here
            </p>
            <Button asChild>
              <Link href="/interview/setup">Start Practice Interview</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {interview.jobTitle}
                      </h3>
                      <Badge variant="secondary">{interview.interviewType}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {interview.company}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        {interview.questionsAnswered} questions
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Languages:</span>
                        <span>
                          {languageFlags[interview.userLanguage]} →{" "}
                          {languageFlags[interview.interviewerLanguage]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        interview.score >= 80
                          ? "text-green-600"
                          : interview.score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {interview.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(interview.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/interview/${interview.id}/feedback`}>
                      View Feedback
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/interview/setup?jobTitle=${encodeURIComponent(interview.jobTitle)}&company=${encodeURIComponent(interview.company)}`}
                    >
                      Practice Again
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {interviews.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
            <CardDescription>
              Your interview practice statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{interviews.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Interviews
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(
                    interviews.reduce((acc, i) => acc + i.score, 0) /
                      interviews.length
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {interviews.reduce((acc, i) => acc + i.questionsAnswered, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Questions Answered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {
                    new Set(interviews.map((i) => i.interviewerLanguage)).size
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Languages Practiced
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
