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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Application Tracker - GlobalHire AI",
  description: "Track your job applications and their status",
};

// Mock data - would come from API
const mockApplications = [
  {
    id: "1",
    job: {
      title: "Senior Frontend Developer",
      company: "TechCorp Berlin",
      location: "Berlin, Germany",
    },
    status: "interviewing",
    appliedAt: "2025-01-28",
    updatedAt: "2025-01-30",
    notes: "Had first interview, waiting for technical round",
    nextStep: "Technical Interview - Feb 5",
  },
  {
    id: "2",
    job: {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
    },
    status: "applied",
    appliedAt: "2025-01-30",
    updatedAt: "2025-01-30",
    notes: "Applied through company website",
  },
  {
    id: "3",
    job: {
      title: "React Developer",
      company: "DesignStudio Paris",
      location: "Paris, France",
    },
    status: "offer",
    appliedAt: "2025-01-15",
    updatedAt: "2025-01-29",
    notes: "Received offer letter!",
    nextStep: "Respond by Feb 3",
  },
  {
    id: "4",
    job: {
      title: "Backend Developer",
      company: "DataCorp",
      location: "London, UK",
    },
    status: "rejected",
    appliedAt: "2025-01-20",
    updatedAt: "2025-01-27",
    notes: "Position filled internally",
  },
];

const statusConfig = {
  saved: { label: "Saved", color: "bg-gray-500", icon: Briefcase },
  applied: { label: "Applied", color: "bg-blue-500", icon: Clock },
  interviewing: { label: "Interviewing", color: "bg-yellow-500", icon: Calendar },
  offer: { label: "Offer", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
};

export default function ApplicationsPage() {
  const applications = mockApplications;

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offers: applications.filter((a) => a.status === "offer").length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application Tracker</h1>
          <p className="mt-2 text-muted-foreground">
            Track your job applications and stay organized
          </p>
        </div>
        <Button asChild>
          <Link href="/applications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Applied</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {stats.applied}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interviewing</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {stats.interviewing}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Offers</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.offers}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Applications List */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="interviewing">Interviewing</TabsTrigger>
          <TabsTrigger value="offer">Offers</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </TabsContent>

        {["applied", "interviewing", "offer", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {applications
              .filter((a) => a.status === status)
              .map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            {applications.filter((a) => a.status === status).length === 0 && (
              <Card>
                <CardContent className="flex min-h-[200px] items-center justify-center">
                  <p className="text-muted-foreground">
                    No applications with this status
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ApplicationCard({
  application,
}: {
  application: (typeof mockApplications)[0];
}) {
  const config = statusConfig[application.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{application.job.title}</h3>
              <Badge className={config.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {application.job.company} • {application.job.location}
            </p>

            {application.notes && (
              <p className="mt-3 text-sm">{application.notes}</p>
            )}

            {application.nextStep && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                <Calendar className="h-4 w-4" />
                {application.nextStep}
              </div>
            )}
          </div>

          <div className="text-right text-sm text-muted-foreground">
            <p>Applied: {new Date(application.appliedAt).toLocaleDateString()}</p>
            <p>
              Updated: {new Date(application.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/applications/${application.id}`}>View Details</Link>
          </Button>
          <Button variant="ghost" size="sm">
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
