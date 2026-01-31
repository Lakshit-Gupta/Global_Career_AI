import { Metadata } from "next";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Create Resume Profile - GlobalHire AI",
  description: "Enter your details to create your resume profile",
};

export default function CreateResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your details below. This information will be used to generate
            tailored resumes for any job.
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
