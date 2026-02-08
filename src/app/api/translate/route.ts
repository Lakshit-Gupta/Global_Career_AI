import { NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Simple in-memory cache for translations
const translationCache = new Map<string, string>();
const CACHE_MAX_SIZE = 1000;

// Initialize SDK once
let lingoDotDev: LingoDotDevEngine | null = null;

function getLingoDotDevEngine(): LingoDotDevEngine | null {
  if (!lingoDotDev) {
    const apiKey = process.env.LINGODOTDEV_API_KEY || process.env.LINGO_API_KEY;
    if (!apiKey) {
      return null;
    }
    lingoDotDev = new LingoDotDevEngine({
      apiKey,
      batchSize: 100,
      idealBatchItemSize: 1000,
    });
  }
  return lingoDotDev;
}

function getCacheKey(text: string, from: string, to: string): string {
  return `${from}:${to}:${text.substring(0, 100)}`;
}

// This API route handles translation using Lingo.dev SDK
export async function POST(request: Request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || !to) {
      return NextResponse.json(
        { error: "Missing required fields: text and to" },
        { status: 400 }
      );
    }

    // Skip translation if same language
    if (from === to) {
      return NextResponse.json({ translatedText: text });
    }

    // Check cache
    const cacheKey = getCacheKey(text, from || "auto", to);
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ translatedText: cached, cached: true });
    }

    const engine = getLingoDotDevEngine();

    // If no API key, return mock translation with prefix
    if (!engine) {
      // In demo mode, add language indicator
      const langIndicator = `[${to.toUpperCase()}] `;
      return NextResponse.json({
        translatedText: langIndicator + text,
        mock: true,
      });
    }

    // Use Lingo.dev SDK for translation
    const translatedText = await engine.localizeText(text, {
      sourceLocale: from || null, // null for auto-detect
      targetLocale: to,
      fast: false, // Use quality mode by default
    });

    // Cache the result (with size limit)
    if (translationCache.size >= CACHE_MAX_SIZE) {
      // Remove oldest entry
      const firstKey = translationCache.keys().next().value;
      if (firstKey) {
        translationCache.delete(firstKey);
      }
    }
    translationCache.set(cacheKey, translatedText);

    return NextResponse.json({
      translatedText,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed", translatedText: null },
      { status: 500 }
    );
  }
}
