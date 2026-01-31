"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES } from "@/lib/utils";
import {
  Loader2,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface GeneratedResume {
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bullets: string[];
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
}

interface ATSResult {
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
  };
  suggestions: string[];
}

export function GenerateResumeForm() {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [generatedResume, setGeneratedResume] =
    useState<GeneratedResume | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedResume(null);
    setAtsResult(null);
    setAttempts(0);

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }

      const data = await response.json();
      setGeneratedResume(data.resume);
      setAtsResult(data.ats);
      setAttempts(data.attempts || 1);

      toast({
        title: "Resume generated!",
        description: `ATS Score: ${data.ats.score}/100`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async () => {
    if (!generatedResume) return;

    setIsScoring(true);

    try {
      const response = await fetch("/api/resume/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: generatedResume,
          jobDescription,
          targetLanguage,
          feedback: atsResult?.feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rewrite resume");
      }

      const data = await response.json();
      setGeneratedResume(data.resume);
      setAtsResult(data.ats);
      setAttempts((prev) => prev + 1);

      toast({
        title: "Resume optimized!",
        description: `New ATS Score: ${data.ats.score}/100`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to rewrite resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description you want to tailor your resume for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              className="resize-none"
            />

            <div className="space-y-2">
              <Label>Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ATS Score */}
        {atsResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ATS Score
                <Badge variant={getScoreVariant(atsResult.score)}>
                  {atsResult.score >= 70 ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {atsResult.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Score</span>
                  <span className={getScoreColor(atsResult.score)}>
                    {atsResult.score}%
                  </span>
                </div>
                <Progress value={atsResult.score} />
              </div>

              {atsResult.feedback.strengths.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-green-600">Strengths</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {atsResult.feedback.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {atsResult.feedback.improvements.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-yellow-600">
                    Areas to Improve
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {atsResult.feedback.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {atsResult.score < 70 && attempts < 3 && (
                <Button
                  onClick={handleRewrite}
                  disabled={isScoring}
                  variant="outline"
                  className="w-full"
                >
                  {isScoring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Auto-Rewrite for Higher Score ({3 - attempts} attempts
                      left)
                    </>
                  )}
                </Button>
              )}

              {attempts >= 3 && atsResult.score < 70 && (
                <p className="text-center text-sm text-muted-foreground">
                  Maximum rewrite attempts reached. Consider manually adjusting
                  your experience or skills.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Section */}
      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Resume Preview
              {generatedResume && (
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!generatedResume ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Your generated resume will appear here</p>
                </div>
              </div>
            ) : (
              <div className="max-h-[600px] space-y-6 overflow-auto rounded-lg border bg-white p-6 text-sm">
                {/* Summary */}
                <div>
                  <h3 className="mb-2 font-semibold uppercase tracking-wide text-primary">
                    Professional Summary
                  </h3>
                  <p className="text-gray-700">{generatedResume.summary}</p>
                </div>

                {/* Experience */}
                {generatedResume.experience.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-semibold uppercase tracking-wide text-primary">
                      Experience
                    </h3>
                    {generatedResume.experience.map((exp, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between">
                          <strong>{exp.title}</strong>
                          <span className="text-gray-500">{exp.duration}</span>
                        </div>
                        <div className="text-gray-600">{exp.company}</div>
                        <ul className="mt-2 list-inside list-disc text-gray-700">
                          {exp.bullets.map((bullet, j) => (
                            <li key={j}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {generatedResume.skills.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold uppercase tracking-wide text-primary">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedResume.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {generatedResume.education.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold uppercase tracking-wide text-primary">
                      Education
                    </h3>
                    {generatedResume.education.map((edu, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <strong>{edu.degree}</strong>
                          <span className="text-gray-500">{edu.year}</span>
                        </div>
                        <div className="text-gray-600">{edu.school}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
