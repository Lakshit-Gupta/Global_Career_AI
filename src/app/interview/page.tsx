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
import { MessageSquare, History, Mic, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Interview Prep - GlobalHire AI",
  description:
    "Practice multilingual AI-powered interviews for your target jobs",
};

export default function InterviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Interview Prep</h1>
        <p className="mt-2 text-muted-foreground">
          Practice interviews with our AI in any language. Get real-time
          feedback and improve your responses.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Start New Interview */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Start New Interview
            </CardTitle>
            <CardDescription>
              Practice for a specific job position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose a job from your saved jobs or enter a custom position. Our
              AI will conduct a realistic interview.
            </p>
            <Button asChild className="w-full">
              <Link href="/interview/setup">Start Interview</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Past Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Interview History
            </CardTitle>
            <CardDescription>Review your past practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Access transcripts, feedback, and improvement suggestions from
              your previous interviews.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/interview/history">View History</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Multilingual Support
            </CardTitle>
            <CardDescription>Practice in 5+ languages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Practice interviews in English, German, French, Spanish, or
              Japanese. Speak in your language, respond in theirs.
            </p>
            <div className="flex gap-2 text-2xl">
              <span>🇺🇸</span>
              <span>🇩🇪</span>
              <span>🇫🇷</span>
              <span>🇪🇸</span>
              <span>🇯🇵</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <MessageSquare className="h-8 w-8 text-primary" />,
              title: "1. Choose a Job",
              description:
                "Select from your saved jobs or describe the position you're preparing for",
            },
            {
              icon: <Globe className="h-8 w-8 text-primary" />,
              title: "2. Set Languages",
              description:
                "Choose your comfortable language and the interviewer's language",
            },
            {
              icon: <Mic className="h-8 w-8 text-primary" />,
              title: "3. Practice",
              description:
                "Answer questions in real-time. Use text or voice (coming soon)",
            },
            {
              icon: <History className="h-8 w-8 text-primary" />,
              title: "4. Get Feedback",
              description:
                "Receive detailed feedback on your responses and areas to improve",
            },
          ].map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="mb-2">{step.icon}</div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Interview Tips</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Before the Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Research the company culture and values</li>
                <li>Review the job description thoroughly</li>
                <li>Prepare examples using the STAR method</li>
                <li>Practice common questions in your target language</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>During the Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Take a moment to think before answering</li>
                <li>Use specific examples and metrics</li>
                <li>Ask for clarification if needed</li>
                <li>Show enthusiasm for the role</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
