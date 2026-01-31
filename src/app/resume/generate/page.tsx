import { Metadata } from "next";
import { GenerateResumeForm } from "./generate-form";

export const metadata: Metadata = {
  title: "Generate Resume - GlobalHire AI",
  description: "Generate an AI-powered resume tailored for your target job",
};

export default function GenerateResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate Tailored Resume</h1>
          <p className="mt-2 text-muted-foreground">
            Enter a job description and select your target language. Our AI will
            generate a professional resume optimized for ATS systems.
          </p>
        </div>

        <GenerateResumeForm />
      </div>
    </div>
  );
}
