import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generate text using Meta Llama 3.3 70B (free tier eligible)
 */
export async function generateWithLlama(prompt: string, maxTokens: number = 2048) {
  const command = new InvokeModelCommand({
    modelId: 'meta.llama3-3-70b-instruct-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`,
      max_gen_len: maxTokens,
      temperature: 0.7,
      top_p: 0.9,
    }),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.generation;
}

/**
 * Generate text using Amazon Nova Pro
 */
export async function generateWithNova(prompt: string, maxTokens: number = 2048) {
  const command = new InvokeModelCommand({
    modelId: 'amazon.nova-pro-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        max_new_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
      },
    }),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.output.message.content[0].text;
}

/**
 * Generate structured JSON responses
 */
export async function generateJSON<T>(
  prompt: string,
  maxTokens: number = 2048
): Promise<T> {
  const response = await generateWithLlama(prompt, maxTokens);

  // Try to extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  // If no JSON found, try parsing the entire response
  return JSON.parse(response);
}
