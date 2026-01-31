"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/utils";

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    // Get language from localStorage or browser settings
    const stored = localStorage.getItem("preferred_language");
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      setLanguage(stored as SupportedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
        setLanguage(browserLang as SupportedLanguage);
      }
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
    localStorage.setItem("preferred_language", value);
    // In production, this would also update the user's preference in the database
    // and trigger UI re-translation via Lingo.dev Compiler
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{currentLang?.flag}</span>
            <span className="hidden sm:inline">{currentLang?.name}</span>
          </span>
        </SelectValue>
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
  );
}
