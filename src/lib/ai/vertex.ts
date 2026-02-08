import { GoogleAuth } from 'google-auth-library';

// Using Vertex AI with Anthropic Claude on GCP
// Alternative: Gemini models

const auth = new GoogleAuth({
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS 
    ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : undefined,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const projectId = process.env.GCP_PROJECT_ID || '';
const location = process.env.GCP_LOCATION || 'us-central1';

/**
 * Generate text using Claude 3.5 Sonnet via Vertex AI (Anthropic on GCP)
 */
export async function generateWithClaude(
  prompt: string,
  maxTokens: number = 2048
): Promise<string> {
  const client = await auth.getClient();
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/anthropic/models/claude-3-5-sonnet@20240620:streamRawPredict`;

  const response = await client.request({
    url,
    method: 'POST',
    data: {
      anthropic_version: 'vertex-2023-10-16',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 0.9,
    },
  });

  const data = response.data as any;
  return data.content[0].text;
}

/**
 * Generate text using Google Gemini Pro
 */
export async function generateWithGemini(
  prompt: string,
  maxTokens: number = 2048
): Promise<string> {
  const client = await auth.getClient();
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-pro:generateContent`;

  const response = await client.request({
    url,
    method: 'POST',
    data: {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
        topP: 0.9,
      },
    },
  });

  const data = response.data as any;
  return data.candidates[0].content.parts[0].text;
}

/**
 * Main generation function - uses Claude by default
 */
export async function generateText(
  prompt: string,
  maxTokens: number = 2048
): Promise<string> {
  const model = process.env.GCP_MODEL || 'claude';

  if (model === 'gemini') {
    return generateWithGemini(prompt, maxTokens);
  }

  return generateWithClaude(prompt, maxTokens);
}

/**
 * Generate structured JSON responses
 */
export async function generateJSON<T>(
  prompt: string,
  maxTokens: number = 2048
): Promise<T> {
  const response = await generateText(prompt, maxTokens);

  // Try to extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  // If no JSON found, try parsing the entire response
  return JSON.parse(response);
}
