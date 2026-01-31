import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Log In - GlobalHire AI",
  description: "Log in to your GlobalHire AI account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GlobalHire AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Log in to continue your job search journey
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
