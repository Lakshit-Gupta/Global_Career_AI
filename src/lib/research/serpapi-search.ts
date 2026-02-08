import axios from 'axios';
import * as cheerio from 'cheerio';

interface CompanyResearch {
  name: string;
  website: string;
  description: string;
  industry: string;
  techStack: string[];
  culture: string;
  recentNews: string[];
  jobRequirements: string[];
  rawData: string;
}

export async function researchCompany(
  companyName: string,
  role: string,
  userProvidedDetails?: string
): Promise<CompanyResearch> {
  try {
    console.log(`🔍 Researching ${companyName} for ${role} position...`);

    // Step 1: Search with SerpAPI
    const searchResults = await serpApiSearch(
      `${companyName} ${role} job requirements tech stack`
    );

    // Step 2: Get company website
    const companyWebsite = await findCompanyWebsite(companyName);

    // Step 3: Scrape company website
    let websiteData = '';
    if (companyWebsite) {
      websiteData = await scrapeWebsite(companyWebsite);
    }

    // Step 4: Search for job postings
    const jobPostings = await serpApiSearch(
      `${companyName} ${role} job description requirements`
    );

    // Step 5: Synthesize with AI
    const synthesized = await synthesizeCompanyData({
      companyName,
      role,
      userProvidedDetails,
      searchResults,
      websiteData,
      jobPostings,
    });

    return synthesized;
  } catch (error) {
    console.error('Company research error:', error);
    return {
      name: companyName,
      website: '',
      description: userProvidedDetails || `${companyName} - ${role} position`,
      industry: '',
      techStack: [],
      culture: '',
      recentNews: [],
      jobRequirements: [],
      rawData: userProvidedDetails || '',
    };
  }
}

async function serpApiSearch(query: string): Promise<any[]> {
  const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

  if (!SERPAPI_KEY) {
    console.log('ℹ️  SerpAPI key not configured. Skipping web search.');
    return [];
  }

  try {
    console.log(`🔎 SerpAPI search: "${query}"`);
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: SERPAPI_KEY,
        engine: 'google',
        num: 5,
      },
      timeout: 10000,
    });

    const results = response.data.organic_results || [];

    return results.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('ℹ️  SerpAPI authentication failed. Check API key.');
    } else if (error.response?.status === 403) {
      console.log('ℹ️  SerpAPI quota exceeded or account issue.');
    } else {
      console.error('SerpAPI error:', error.message);
    }
    return [];
  }
}

async function findCompanyWebsite(companyName: string): Promise<string | null> {
  try {
    const results = await serpApiSearch(`${companyName} official website`);
    if (results.length > 0) {
      return results[0].link;
    }
    return null;
  } catch {
    return null;
  }
}

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove unnecessary elements
    $('script, style, nav, footer, iframe, header').remove();

    // Extract main content
    const mainContent =
      $('main').text() || $('article').text() || $('body').text();

    // Clean and limit
    const cleaned = mainContent
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000);

    return cleaned;
  } catch (error) {
    console.error('Website scraping error:', error);
    return '';
  }
}

async function synthesizeCompanyData(data: any): Promise<CompanyResearch> {
  const { generateWithOpenRouterJSON } = await import('@/lib/ai/openrouter');

  const systemPrompt = `You are a company research analyst. Extract and synthesize company information from web search results into a structured format.`;

  const prompt = `Analyze the following information about ${data.companyName} and create a structured company profile for a ${data.role} position.

COMPANY NAME: ${data.companyName}
TARGET ROLE: ${data.role}

USER PROVIDED DETAILS:
${data.userProvidedDetails || 'None provided'}

WEB SEARCH RESULTS:
${JSON.stringify(data.searchResults, null, 2)}

WEBSITE CONTENT:
${data.websiteData}

JOB POSTINGS:
${JSON.stringify(data.jobPostings, null, 2)}

Extract and return a JSON object with this exact structure:
{
  "name": "Official company name",
  "website": "Company website URL",
  "description": "Concise 2-3 sentence company description",
  "industry": "Primary industry/sector",
  "techStack": ["Technology 1", "Technology 2", "Technology 3"],
  "culture": "Company culture and values (2-3 sentences)",
  "recentNews": ["Recent news item 1", "Recent news item 2"],
  "jobRequirements": [
    "Key requirement 1",
    "Key requirement 2",
    "Key requirement 3",
    "Key skill 1",
    "Key skill 2"
  ],
  "rawData": "Summary of all gathered information"
}

Extract REAL information from the sources. If information is missing, use empty arrays/strings.`;

  try {
    const result = await generateWithOpenRouterJSON(prompt, systemPrompt, 3000);
    return result;
  } catch (error) {
    console.error('AI synthesis error:', error);
    return {
      name: data.companyName,
      website: '',
      description: data.userProvidedDetails || '',
      industry: '',
      techStack: [],
      culture: '',
      recentNews: [],
      jobRequirements: [],
      rawData: JSON.stringify(data),
    };
  }
}
