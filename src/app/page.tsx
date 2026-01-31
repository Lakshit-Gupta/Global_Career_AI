import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, FileText, MessageSquare, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Break Language Barriers in{" "}
              <span className="text-primary">Job Hunting</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Discover international jobs, generate multilingual resumes with
              ATS optimization, and practice AI-powered interviews in any
              language.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/jobs">Discover Jobs</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Everything You Need to Land Your Dream International Job
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Globe className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Job Discovery</CardTitle>
                <CardDescription>
                  Browse jobs from any country with auto-translated descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search thousands of jobs worldwide. Job descriptions are
                  automatically translated to your preferred language using
                  Lingo.dev.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Smart Resumes</CardTitle>
                <CardDescription>
                  AI-generated resumes tailored for each job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate professional resumes in any language. Get ATS scores
                  and automatic rewrites to maximize your chances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>AI Interviews</CardTitle>
                <CardDescription>
                  Practice interviews with AI in any language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI interviewer asks relevant questions based on the job.
                  Practice in German, Spanish, French, Japanese, or English.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor all your applications in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep track of every application, interview session, and
                  resume. Never lose sight of your job search progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 font-semibold">Find Jobs</h3>
                <p className="text-sm text-muted-foreground">
                  Search for jobs in any country. We translate job descriptions
                  to your language instantly.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 font-semibold">Generate Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI creates a tailored resume in the target language,
                  optimized for ATS systems.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 font-semibold">Practice Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Prepare with our AI interviewer who speaks the job&apos;s
                  language and knows the role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">Supported Languages</h2>
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4">
            {[
              { code: "en", name: "English", flag: "🇺🇸" },
              { code: "es", name: "Español", flag: "🇪🇸" },
              { code: "de", name: "Deutsch", flag: "🇩🇪" },
              { code: "fr", name: "Français", flag: "🇫🇷" },
              { code: "ja", name: "日本語", flag: "🇯🇵" },
            ].map((lang) => (
              <div
                key={lang.code}
                className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Land Your Dream International Job?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of developers who have broken language barriers with
            GlobalHire AI.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/signup">Start Free Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
