import { Metadata } from "next";
import { JobsList } from "./jobs-list";
import { JobFilters } from "./job-filters";

export const metadata: Metadata = {
  title: "Find Jobs - GlobalHire AI",
  description:
    "Discover international developer jobs with auto-translated descriptions",
};

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
          <JobFilters />
        </aside>
        <main className="lg:col-span-3">
          <JobsList />
        </main>
      </div>
    </div>
  );
}
