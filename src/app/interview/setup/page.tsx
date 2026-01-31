import { Metadata } from "next";
import { InterviewSetupForm } from "./setup-form";

export const metadata: Metadata = {
  title: "Interview Setup - GlobalHire AI",
  description: "Set up your AI interview practice session",
};

export default function InterviewSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Setup Interview</h1>
          <p className="mt-2 text-muted-foreground">
            Configure your practice interview session
          </p>
        </div>

        <InterviewSetupForm />
      </div>
    </div>
  );
}
