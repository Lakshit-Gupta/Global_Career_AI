import { Metadata } from "next";
import { NewApplicationForm } from "./new-application-form";

export const metadata: Metadata = {
  title: "Add Application - GlobalHire AI",
  description: "Track a new job application",
};

export default function NewApplicationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Application</h1>
          <p className="mt-2 text-muted-foreground">
            Track a new job application
          </p>
        </div>

        <NewApplicationForm />
      </div>
    </div>
  );
}
