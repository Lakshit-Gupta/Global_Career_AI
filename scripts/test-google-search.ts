// Test script for Google Custom Search API
import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

async function testGoogleSearch() {
  console.log('🔍 Testing Google Custom Search API...\n');
  
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.error('❌ Missing credentials:');
    console.error('   GOOGLE_API_KEY:', GOOGLE_API_KEY ? '✅ Set' : '❌ Not set');
    console.error('   GOOGLE_SEARCH_ENGINE_ID:', GOOGLE_SEARCH_ENGINE_ID ? '✅ Set' : '❌ Not set');
    process.exit(1);
  }

  console.log('✅ Credentials found:');
  console.log('   API Key:', GOOGLE_API_KEY.substring(0, 20) + '...');
  console.log('   Search Engine ID:', GOOGLE_SEARCH_ENGINE_ID);
  console.log();

  try {
    console.log('📡 Making test search query: "Anthropic company"...\n');
    
    const response = await axios.get(
      'https://www.googleapis.com/customsearch/v1',
      {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_SEARCH_ENGINE_ID,
          q: 'Anthropic company',
          num: 3,
        },
        timeout: 10000,
      }
    );

    console.log('✅ SUCCESS! Google Search API is working!\n');
    console.log('📊 Results:');
    
    if (response.data.items) {
      response.data.items.forEach((item: any, i: number) => {
        console.log(`\n${i + 1}. ${item.title}`);
        console.log(`   URL: ${item.link}`);
        console.log(`   Snippet: ${item.snippet.substring(0, 100)}...`);
      });
    } else {
      console.log('⚠️  No results returned (but API call succeeded)');
    }

    console.log('\n✅ Test completed successfully!');
    
  } catch (error: any) {
    console.error('❌ FAILED! Google Search API error:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 403) {
        console.error('\n💡 Possible fixes for 403 Forbidden:');
        console.error('   1. Enable Custom Search API: https://console.cloud.google.com/apis/library/customsearch.googleapis.com');
        console.error('   2. Verify API key has Custom Search API enabled');
        console.error('   3. Check API key restrictions (HTTP referrers, IP addresses)');
        console.error('   4. Verify Search Engine ID is correct');
      } else if (error.response.status === 429) {
        console.error('\n💡 Rate limit exceeded. Wait a moment and try again.');
      }
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

testGoogleSearch();
