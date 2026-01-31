// Lingo.dev SDK wrapper for runtime translation
// This provides translation for dynamic content like job descriptions,
// resumes, and interview messages

import type { SupportedLanguage } from "@/lib/utils";

interface TranslateOptions {
  from?: string;
  to: string;
}

// In production, this would use the actual Lingo.dev SDK
// import { translate as lingoTranslate } from '@lingo.dev/sdk';

/**
 * Translate text from one language to another using Lingo.dev SDK
 * Falls back to original text if translation fails
 */
export async function translate(
  text: string,
  options: TranslateOptions
): Promise<string> {
  if (!text || text.trim() === "") {
    return text;
  }

  // Skip translation if source and target are the same
  if (options.from === options.to) {
    return text;
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        from: options.from || "en",
        to: options.to,
      }),
    });

    if (!response.ok) {
      console.error("Translation API error:", response.statusText);
      return text;
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

/**
 * Translate an array of strings
 */
export async function translateBatch(
  texts: string[],
  options: TranslateOptions
): Promise<string[]> {
  if (!texts || texts.length === 0) {
    return texts;
  }

  try {
    const response = await fetch("/api/translate/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts,
        from: options.from || "en",
        to: options.to,
      }),
    });

    if (!response.ok) {
      console.error("Batch translation API error:", response.statusText);
      return texts;
    }

    const data = await response.json();
    return data.translatedTexts || texts;
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
}

/**
 * Detect the language of a text
 */
export async function detectLanguage(text: string): Promise<string> {
  if (!text || text.trim() === "") {
    return "en";
  }

  try {
    const response = await fetch("/api/translate/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("Language detection API error:", response.statusText);
      return "en";
    }

    const data = await response.json();
    return data.language || "en";
  } catch (error) {
    console.error("Language detection error:", error);
    return "en";
  }
}

/**
 * Get the user's preferred language from localStorage or browser settings
 */
export function getUserLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = localStorage.getItem("preferred_language");
  if (stored) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language.split("-")[0];
  const supportedCodes = ["en", "es", "de", "fr", "ja"];
  
  if (supportedCodes.includes(browserLang)) {
    return browserLang as SupportedLanguage;
  }

  return "en";
}
