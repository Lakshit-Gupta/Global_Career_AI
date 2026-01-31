"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

interface Feedback {
  overallScore: number;
  summary: string;
  strengths: Array<{ area: string; feedback: string }>;
  improvements: Array<{ area: string; feedback: string }>;
  questionAnalysis: Array<{
    question: string;
    responseQuality: "good" | "average" | "needs-improvement";
    feedback: string;
  }>;
  tips: string[];
}

export function InterviewFeedback({ sessionId }: { sessionId: string }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        // For demo, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFeedback({
          overallScore: 78,
          summary:
            "You demonstrated strong communication skills and good technical knowledge. With some improvements in providing specific examples and metrics, you would be an even stronger candidate.",
          strengths: [
            {
              area: "Communication",
              feedback:
                "You articulated your thoughts clearly and maintained a professional tone throughout the interview.",
            },
            {
              area: "Technical Knowledge",
              feedback:
                "You showed solid understanding of core concepts and current technologies.",
            },
          ],
          improvements: [
            {
              area: "Specific Examples",
              feedback:
                "Try to include more specific examples from your past experience with quantifiable results.",
            },
            {
              area: "STAR Method",
              feedback:
                "Structure behavioral answers using Situation, Task, Action, Result for more impact.",
            },
          ],
          questionAnalysis: [
            {
              question: "Tell me about yourself",
              responseQuality: "good",
              feedback:
                "Good overview of your background, but could be more concise.",
            },
            {
              question: "Describe a challenging project",
              responseQuality: "average",
              feedback:
                "Good story, but missing specific metrics on the outcome.",
            },
          ],
          tips: [
            "Research the company's recent news and projects before interviews",
            "Prepare 3-5 specific examples of achievements with metrics",
            "Practice the STAR method for behavioral questions",
            "Prepare thoughtful questions to ask the interviewer",
          ],
        });
      } catch (error) {
        console.error("Error loading feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold">Feedback Not Available</h1>
        <p className="mt-2 text-muted-foreground">
          Unable to load feedback for this interview session.
        </p>
        <Button asChild className="mt-4">
          <Link href="/interview">Back to Interviews</Link>
        </Button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "good":
        return <Badge className="bg-green-500">Good</Badge>;
      case "average":
        return <Badge className="bg-yellow-500">Average</Badge>;
      default:
        return <Badge className="bg-red-500">Needs Work</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Feedback</h1>
          <p className="text-muted-foreground">
            Review your performance and areas for improvement
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/interview">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${getScoreColor(feedback.overallScore)}`}
              >
                {feedback.overallScore}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <div className="flex-1">
              <Progress value={feedback.overallScore} className="h-3" />
              <p className="mt-4 text-sm">{feedback.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.strengths.map((strength, i) => (
            <div key={i} className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="font-semibold text-green-800">{strength.area}</h4>
              <p className="mt-1 text-sm text-green-700">{strength.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.improvements.map((improvement, i) => (
            <div
              key={i}
              className="rounded-lg border border-yellow-200 bg-yellow-50 p-4"
            >
              <h4 className="font-semibold text-yellow-800">
                {improvement.area}
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                {improvement.feedback}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Question Analysis
          </CardTitle>
          <CardDescription>
            Detailed feedback on your responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.questionAnalysis.map((qa, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium">{qa.question}</h4>
                {getQualityBadge(qa.responseQuality)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{qa.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            Tips for Next Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button asChild className="flex-1">
          <Link href="/interview/setup">
            <RefreshCw className="mr-2 h-4 w-4" />
            Practice Again
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/interview/history">View All Interviews</Link>
        </Button>
      </div>
    </div>
  );
}
