import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LingoProvider } from "@lingo.dev/compiler/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlobalHire AI - Break Language Barriers in Job Hunting",
  description:
    "Discover international jobs, generate multilingual resumes, and practice AI interviews in any language.",
  keywords: [
    "jobs",
    "international",
    "multilingual",
    "resume",
    "interview",
    "AI",
    "career",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </body>
      </html>
    </LingoProvider>
  );
}
