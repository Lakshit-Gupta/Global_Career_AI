"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, X, GraduationCap, Briefcase, Code } from "lucide-react";

interface Education {
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export function ProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Personal info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [summary, setSummary] = useState("");

  // Education
  const [education, setEducation] = useState<Education[]>([
    { degree: "", school: "", location: "", graduationDate: "" },
  ]);

  // Experience
  const [experience, setExperience] = useState<Experience[]>([
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  // Skills
  const [skills, setSkills] = useState("");

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", school: "", location: "", graduationDate: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const updated = [...experience];
    (updated[index][field] as string | boolean) = value;
    setExperience(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = {
        personalInfo: {
          name,
          email,
          phone,
          location,
          linkedin,
          portfolio,
        },
        summary,
        education: education.filter((e) => e.degree && e.school),
        experience: experience.filter((e) => e.title && e.company),
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      // Save to API/database
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      toast({
        title: "Profile saved!",
        description:
          "Your profile has been saved. You can now generate resumes.",
      });

      router.push("/resume/generate");
    } catch {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic contact information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio/Website</Label>
            <Input
              id="portfolio"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>
            A brief overview of your professional background (optional - AI can
            generate this)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., Full-stack developer with 5 years of experience building scalable web applications..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <CardDescription>Add your relevant work experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="relative rounded-lg border p-4">
              {experience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeExperience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(index, "title", e.target.value)
                    }
                    placeholder="E.g., Senior Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(index, "location", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(index, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          <CardDescription>Add your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="relative rounded-lg border p-4">
              {education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeEducation(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    placeholder="E.g., B.S. Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>School *</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(index, "location", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) =>
                      updateEducation(index, "graduationDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Skills
          </CardTitle>
          <CardDescription>
            List your technical and soft skills (comma-separated)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., JavaScript, TypeScript, React, Node.js, PostgreSQL, Team Leadership, Agile..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile & Continue"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
