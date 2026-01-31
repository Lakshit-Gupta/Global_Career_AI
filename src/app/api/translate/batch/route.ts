import { NextResponse } from "next/server";

// Batch translation endpoint for translating multiple strings at once

export async function POST(request: Request) {
  try {
    const { texts, from, to } = await request.json();

    if (!texts || !Array.isArray(texts) || !to) {
      return NextResponse.json(
        { error: "Missing required fields: texts (array) and to" },
        { status: 400 }
      );
    }

    // Skip translation if same language
    if (from === to) {
      return NextResponse.json({ translatedTexts: texts });
    }

    const LINGO_API_KEY = process.env.LINGO_API_KEY;

    // If no API key, return mock translations
    if (!LINGO_API_KEY) {
      const langIndicator = `[${to.toUpperCase()}] `;
      const translatedTexts = texts.map((t: string) => langIndicator + t);
      return NextResponse.json({
        translatedTexts,
        mock: true,
      });
    }

    // Call Lingo.dev API for each text (in production, use batch API)
    const translatedTexts = await Promise.all(
      texts.map(async (text: string) => {
        try {
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
            return text;
          }

          const data = await response.json();
          return data.translatedText || text;
        } catch {
          return text;
        }
      })
    );

    return NextResponse.json({ translatedTexts });
  } catch (error) {
    console.error("Batch translation error:", error);
    return NextResponse.json(
      { error: "Batch translation failed", translatedTexts: null },
      { status: 500 }
    );
  }
}
