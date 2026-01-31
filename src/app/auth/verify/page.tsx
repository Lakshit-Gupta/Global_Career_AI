import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-4 text-muted-foreground">
          We&apos;ve sent you a verification link. Please check your email and
          click the link to verify your account.
        </p>
        <div className="mt-8 space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
