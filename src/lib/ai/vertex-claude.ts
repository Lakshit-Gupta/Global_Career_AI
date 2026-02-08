import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

// Initialize Anthropic Vertex client
// Credentials are loaded from Application Default Credentials (ADC)
// Set via: gcloud auth application-default login
// Or via service account key in GOOGLE_APPLICATION_CREDENTIALS environment variable
const client = new AnthropicVertex({
  projectId: process.env.GOOGLE_CLOUD_PROJECT!,
  region: process.env.GOOGLE_CLOUD_REGION || 'us-east5',
  // Don't pass googleAuth - let SDK handle credentials automatically
});

const MODEL = 'claude-sonnet-4-5@20250929';

export async function generateWithClaude(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 4096
): Promise<string> {
  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return textContent.text;
  } catch (error: any) {
    console.error('Claude Vertex AI Error:', error);
    
    if (error.status === 429) {
      throw new Error('Claude API quota exceeded. Please wait a moment or increase your quota at: https://cloud.google.com/vertex-ai/docs/generative-ai/quotas-genai');
    } else if (error.status === 403) {
      throw new Error('Permission denied. Enable Vertex AI API at: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com');
    } else {
      throw new Error('Failed to generate content with Claude: ' + error.message);
    }
  }
}

export async function generateWithClaudeJSON(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 4096
): Promise<any> {
  const fullPrompt = `${prompt}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanatory text. Just pure JSON.`;

  const response = await generateWithClaude(fullPrompt, systemPrompt, maxTokens);

  // Extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Response:', response);
    throw new Error('No valid JSON found in Claude response');
  }

  return JSON.parse(jsonMatch[0]);
}
