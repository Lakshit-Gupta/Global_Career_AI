import { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up - GlobalHire AI",
  description: "Create your GlobalHire AI account and start your international job search",
};

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GlobalHire AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Start breaking language barriers in your job search
          </p>
        </div>

        <SignupForm />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
