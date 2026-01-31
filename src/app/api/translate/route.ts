import { NextResponse } from "next/server";

// This API route handles translation using Lingo.dev SDK
// In production, this would call the actual Lingo.dev API

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

    const LINGO_API_KEY = process.env.LINGO_API_KEY;

    // If no API key, return mock translation with prefix
    if (!LINGO_API_KEY) {
      // In demo mode, add language indicator
      const langIndicator = `[${to.toUpperCase()}] `;
      return NextResponse.json({
        translatedText: langIndicator + text,
        mock: true,
      });
    }

    // Call Lingo.dev API
    const response = await fetch("https://api.lingo.dev/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINGO_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        sourceLocale: from || "auto",
        targetLocale: to,
      }),
    });

    if (!response.ok) {
      throw new Error(`Lingo.dev API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      translatedText: data.translatedText || text,
      detectedLanguage: data.detectedLanguage,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed", translatedText: null },
      { status: 500 }
    );
  }
}
