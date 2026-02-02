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
import { FileText, Plus, History } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Builder - GlobalHire AI",
  description: "Create AI-powered multilingual resumes tailored for any job",
};

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <p className="mt-2 text-muted-foreground">
          Create AI-powered resumes tailored for specific jobs, translated to
          any language, and optimized for ATS systems.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Resume */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create New Resume
            </CardTitle>
            <CardDescription>
              Start fresh with your profile data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Enter your education, experience, and skills. Our AI will help you
              create a professional resume.
            </p>
            <Button asChild className="w-full">
              <Link href="/resume/create">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Generate for Job */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generate for a Job
            </CardTitle>
            <CardDescription>
              Tailor your resume for a specific position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Select a job from your saved jobs or paste a job description. AI
              will optimize your resume.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/resume/generate">Generate Resume</Link>
            </Button>
          </CardContent>
        </Card>

        {/* View History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Resume History
            </CardTitle>
            <CardDescription>
              View and manage your saved resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Access all your previously generated resumes. Download PDFs or
              create new versions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/resume/history">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "AI-Powered",
              description:
                "AI generates compelling content based on your experience",
            },
            {
              title: "Multilingual",
              description:
                "Translate your resume to German, French, Spanish, Japanese, and more",
            },
            {
              title: "ATS Optimized",
              description:
                "Get ATS scores and automatic rewrites if score is below 70%",
            },
            {
              title: "PDF Export",
              description:
                "Download professional PDFs ready to submit to employers",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
