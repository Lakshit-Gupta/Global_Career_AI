// Test script for SerpAPI web search
import axios from 'axios';

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

async function testSerpAPI() {
  console.log('🔍 Testing SerpAPI web search...\n');
  
  if (!SERPAPI_KEY) {
    console.error('❌ SERPAPI_API_KEY environment variable not set!');
    console.error('\n💡 Add to .env.local:');
    console.error('   SERPAPI_API_KEY=your-key-here');
    process.exit(1);
  }

  console.log('✅ API Key found:', SERPAPI_KEY.substring(0, 20) + '...');
  console.log();

  const testQuery = 'Stripe company careers';

  console.log(`🧪 Test Query: "${testQuery}"`);
  console.log('📡 Making API call to SerpAPI...\n');

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: testQuery,
        api_key: SERPAPI_KEY,
        engine: 'google',
        num: 5,
      },
    });

    if (response.data.error) {
      console.error('❌ API Error:', response.data.error);
      process.exit(1);
    }

    const results = response.data.organic_results || [];

    console.log('✅ SUCCESS! SerpAPI is working!\n');
    console.log(`📊 Found ${results.length} organic results:\n`);

    results.forEach((result: any, index: number) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.link}`);
      console.log(`   Snippet: ${result.snippet?.substring(0, 100)}...`);
      console.log();
    });

    console.log('✅ Test completed successfully!');
    console.log('\n📈 Search Credits Info:');
    console.log('   - Free tier: 100 searches/month');
    console.log('   - Check usage: https://serpapi.com/dashboard');
    
  } catch (error: any) {
    console.error('❌ FAILED! SerpAPI error:\n');
    console.error('Error:', error.message);
    
    if (error.response?.status === 401) {
      console.error('\n💡 Authentication failed!');
      console.error('   1. Verify your API key is correct');
      console.error('   2. Check https://serpapi.com/manage-api-key');
    } else if (error.response?.status === 429) {
      console.error('\n💡 Rate limit exceeded!');
      console.error('   1. Free tier: 100 searches/month');
      console.error('   2. Check usage: https://serpapi.com/dashboard');
      console.error('   3. Consider upgrading plan if needed');
    } else if (error.response?.data) {
      console.error('\n🔧 API Response:');
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    
    console.error('\n🔧 Debug info:');
    console.error(error);
    
    process.exit(1);
  }
}

testSerpAPI();
