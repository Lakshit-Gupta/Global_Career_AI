// Test script for OpenRouter with free models
import OpenAI from 'openai';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const PRIMARY_MODEL = 'openai/gpt-oss-120b:free';
const FALLBACK_MODEL = 'openrouter/free';

async function testOpenRouter() {
  console.log('🤖 Testing OpenRouter with FREE models...\n');
  
  if (!OPENROUTER_KEY) {
    console.error('❌ OPENROUTER_API_KEY environment variable not set!');
    console.error('\n💡 Add to .env.local:');
    console.error('   OPENROUTER_API_KEY=your-key-here');
    process.exit(1);
  }

  console.log('✅ API Key found:', OPENROUTER_KEY.substring(0, 20) + '...');
  console.log();

  const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPENROUTER_KEY,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Global Career AI - Test',
    },
  });

  // Test primary model
  try {
    console.log(`🧪 Testing PRIMARY model: ${PRIMARY_MODEL}`);
    console.log('📡 Making API call...\n');

    const completion = await openrouter.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'user', content: 'Say "Hello from OpenRouter free tier!" in exactly 5 words.' },
      ],
      max_tokens: 50,
    });

    const content = completion.choices[0]?.message?.content;

    console.log('✅ SUCCESS! Primary model working!\n');
    console.log('📝 Response:');
    console.log('   ', content);
    console.log();

  } catch (error: any) {
    console.error('❌ Primary model failed:', error.message);
    
    // Try fallback
    console.log(`\n🔄 Trying FALLBACK model: ${FALLBACK_MODEL}...\n`);
    
    try {
      const completion = await openrouter.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: [
          { role: 'user', content: 'Say "Hello from fallback model!" in 5 words.' },
        ],
        max_tokens: 50,
      });

      const content = completion.choices[0]?.message?.content;

      console.log('✅ SUCCESS! Fallback model working!\n');
      console.log('📝 Response:');
      console.log('   ', content);
      console.log();

    } catch (fallbackError: any) {
      console.error('❌ Fallback model also failed:', fallbackError.message);
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check API key is valid');
      console.error('   2. Verify OpenRouter account has free tier access');
      console.error('   3. Check https://openrouter.ai/keys for usage');
      process.exit(1);
    }
  }

  console.log('✅ Test completed successfully!');
  console.log('\n📊 Available FREE models on OpenRouter:');
  console.log('   - openai/gpt-oss-120b:free (primary)');
  console.log('   - openrouter/free (auto-fallback)');
  console.log('   - google/gemma-2-9b-it:free');
  console.log('   - meta-llama/llama-3-8b-instruct:free');
}

testOpenRouter();
