import { NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

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

    const engine = getLingoDotDevEngine();

    // If no API key, return mock translations
    if (!engine) {
      const langIndicator = `[${to.toUpperCase()}] `;
      const translatedTexts = texts.map((t: string) => langIndicator + t);
      return NextResponse.json({
        translatedTexts,
        mock: true,
      });
    }

    // Use Lingo.dev SDK for batch translation
    const translatedTexts = await Promise.all(
      texts.map(async (text: string) => {
        try {
          return await engine.localizeText(text, {
            sourceLocale: from || null,
            targetLocale: to,
            fast: false,
          });
        } catch (error) {
          console.error(`Translation failed for text: ${text}`, error);
          return text; // Return original on error
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
