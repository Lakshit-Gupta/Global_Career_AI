import { Metadata } from "next";
import { Suspense } from "react";
import { JobsList } from "./jobs-list";
import { JobFilters } from "./job-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Find Jobs - GlobalHire AI",
  description:
    "Discover international developer jobs with auto-translated descriptions",
};

function JobsLoading() {
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

function FiltersLoading() {
  return (
    <div className="rounded-lg border p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Jobs Worldwide</h1>
        <p className="mt-2 text-muted-foreground">
          Find developer jobs from any country. Job descriptions are
          automatically translated to your preferred language.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Suspense fallback={<FiltersLoading />}>
            <JobFilters />
          </Suspense>
        </aside>
        <main className="lg:col-span-3">
          <Suspense fallback={<JobsLoading />}>
            <JobsList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
