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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Application Details - GlobalHire AI",
  description: "View and manage your job application",
};

// Mock data - would come from API
const mockApplication = {
  id: "1",
  job: {
    title: "Senior Frontend Developer",
    company: "TechCorp Berlin",
    location: "Berlin, Germany",
    url: "https://techcorp.de/jobs/senior-frontend",
  },
  status: "interviewing",
  appliedAt: "2025-01-28",
  updatedAt: "2025-01-30",
  notes: "Had first interview with HR, went well. Waiting for technical round scheduling.",
  nextStep: "Technical Interview - Feb 5",
  resume: {
    id: "r1",
    title: "Tailored Resume - TechCorp",
    atsScore: 85,
  },
  timeline: [
    {
      date: "2025-01-30",
      event: "First Interview",
      notes: "HR screening with Sarah. Discussed background and salary expectations.",
    },
    {
      date: "2025-01-28",
      event: "Applied",
      notes: "Submitted application through company website",
    },
    {
      date: "2025-01-27",
      event: "Created tailored resume",
      notes: "ATS score: 85/100",
    },
  ],
};

const statusConfig = {
  saved: { label: "Saved", color: "bg-gray-500" },
  applied: { label: "Applied", color: "bg-blue-500" },
  interviewing: { label: "Interviewing", color: "bg-yellow-500" },
  offer: { label: "Offer", color: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
};

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  const application = mockApplication;
  const config = statusConfig[application.status as keyof typeof statusConfig];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href="/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {application.job.title}
                </CardTitle>
                <CardDescription className="mt-1 text-lg">
                  {application.job.company}
                </CardDescription>
              </div>
              <Badge className={config.color}>{config.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {application.job.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </div>
            </div>

            {application.job.url && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={application.job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Job Posting
                </a>
              </Button>
            )}

            {application.nextStep && (
              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium text-primary">Next Step</h3>
                <p className="mt-1">{application.nextStep}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Button variant="outline" asChild>
            <Link href={`/resume/generate?applicationId=${application.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Update Resume
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/interview/setup?company=${application.job.company}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Practice Interview
            </Link>
          </Button>
          <Button variant="outline">Update Status</Button>
        </div>

        {/* Resume Used */}
        {application.resume && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Resume Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{application.resume.title}</p>
                  <p className="text-sm text-muted-foreground">
                    ATS Score: {application.resume.atsScore}/100
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{application.notes}</p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.timeline.map((event, index) => (
                <div key={index}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.event}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      {event.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < application.timeline.length - 1 && (
                    <Separator className="my-4 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
