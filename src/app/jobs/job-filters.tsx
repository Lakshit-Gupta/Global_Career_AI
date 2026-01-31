"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Briefcase } from "lucide-react";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "CONTRACTOR", label: "Contract" },
  { value: "INTERN", label: "Internship" },
];

const LOCATIONS = [
  { value: "", label: "All Locations" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "USA", label: "🇺🇸 United States" },
  { value: "UK", label: "🇬🇧 United Kingdom" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Remote", label: "🌍 Remote" },
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("type") || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (location) params.set("location", location);
    if (jobType) params.set("type", jobType);

    router.push(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery("");
    setLocation("");
    setJobType("");
    router.push("/jobs");
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="query">Keywords</Label>
          <Input
            id="query"
            placeholder="e.g., React Developer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            Job Type
          </Label>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleSearch} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset Filters
          </Button>
        </div>

        {/* Quick Searches */}
        <div className="border-t pt-4">
          <Label className="text-xs text-muted-foreground">
            Popular Searches
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              "Frontend Developer",
              "Backend Engineer",
              "Full Stack",
              "DevOps",
              "Data Scientist",
            ].map((term) => (
              <Button
                key={term}
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={() => {
                  setQuery(term);
                  router.push(`/jobs?query=${encodeURIComponent(term)}`);
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
