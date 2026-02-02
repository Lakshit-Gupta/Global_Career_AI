import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">GlobalHire AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Break language barriers in job hunting with AI-powered
              multilingual resumes and interview prep.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jobs" className="hover:text-foreground">
                  Job Discovery
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-foreground">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-foreground">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-foreground">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="mb-4 font-semibold">Supported Languages</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🇺🇸 English</li>
              <li>🇪🇸 Español</li>
              <li>🇩🇪 Deutsch</li>
              <li>🇫🇷 Français</li>
              <li>🇯🇵 日本語</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2026 GlobalHire AI. Built with ❤️ for the
            Lingo.dev Hackathon.
          </p>
          <p className="mt-2">
            Powered by{" "}
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lingo.dev
            </a>
            ,{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Supabase
            </a>
            , and{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenRouter AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
