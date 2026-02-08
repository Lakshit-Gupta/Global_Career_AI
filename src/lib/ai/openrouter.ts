import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Global Career AI - ATS Resume Optimizer',
  },
});

// Primary free model - CRITICAL: Keep :free suffix!
const PRIMARY_MODEL = 'openai/gpt-oss-120b:free';
// Fallback to auto-select free model
const FALLBACK_MODEL = 'openrouter/free';

export async function generateWithOpenRouter(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 4096,
  useFallback: boolean = false
): Promise<string> {
  try {
    const model = useFallback ? FALLBACK_MODEL : PRIMARY_MODEL;

    console.log(`🤖 Using OpenRouter model: ${model}`);

    const completion = await openrouter.chat.completions.create({
      model: model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenRouter response');
    }

    return content;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error);

    // If primary model fails, try fallback
    if (!useFallback && (error.message?.includes('model') || error.status === 404)) {
      console.log('⚠️  Primary model failed, trying fallback...');
      return generateWithOpenRouter(prompt, systemPrompt, maxTokens, true);
    }

    throw new Error(`Failed to generate content: ${error.message || error}`);
  }
}

export async function generateWithOpenRouterJSON(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 4096
): Promise<any> {
  const fullPrompt = `${prompt}

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON
- No markdown formatting
- No code blocks (\`\`\`json)
- No explanatory text before or after
- Just pure JSON starting with { and ending with }`;

  const response = await generateWithOpenRouter(
    fullPrompt,
    systemPrompt,
    maxTokens
  );

  // Clean response - remove markdown if present
  let cleaned = response.trim();

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```json\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  cleaned = cleaned.trim();

  // Extract JSON from response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Raw response:', response);
    console.error('Cleaned response:', cleaned);
    throw new Error('No valid JSON found in response');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Attempted to parse:', jsonMatch[0]);
    throw new Error('Failed to parse JSON from response');
  }
}
