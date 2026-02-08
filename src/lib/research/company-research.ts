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
  rawData: string; // Full scraped data for Claude to analyze
}

export async function researchCompany(
  companyName: string,
  role: string,
  userProvidedDetails?: string
): Promise<CompanyResearch> {
  try {
    console.log(`🔍 Researching ${companyName} for ${role} position...`);

    // Step 1: Google Search for company info
    const searchResults = await googleSearch(
      `${companyName} ${role} job requirements tech stack culture`
    );

    // Step 2: Find company website
    const companyWebsite = await findCompanyWebsite(companyName);

    // Step 3: Scrape company website
    let websiteData = '';
    if (companyWebsite) {
      websiteData = await scrapeCompanyWebsite(companyWebsite);
    }

    // Step 4: Search for specific job postings
    const jobPostings = await searchJobPostings(companyName, role);

    // Step 5: Combine and analyze with Claude
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
    // Return minimal data if research fails
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

async function googleSearch(query: string): Promise<any[]> {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_CX = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.log('ℹ️  Google Search API not configured. Skipping web search.');
    return [];
  }

  try {
    const response = await axios.get(
      'https://www.googleapis.com/customsearch/v1',
      {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_CX,
          q: query,
          num: 5,
        },
        timeout: 10000,
      }
    );

    return (
      response.data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
      })) || []
    );
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.log('ℹ️  Google Search API not enabled. Enable it at: https://console.cloud.google.com/apis/library/customsearch.googleapis.com');
    } else {
      console.error('Google Search error:', error.message);
    }
    return [];
  }
}

async function findCompanyWebsite(companyName: string): Promise<string | null> {
  try {
    const results = await googleSearch(`${companyName} official website`);
    if (results.length > 0) {
      return results[0].link;
    }
    return null;
  } catch {
    return null;
  }
}

async function scrapeCompanyWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove script and style tags
    $('script, style, nav, footer, iframe').remove();

    // Extract main content
    const mainContent =
      $('main').text() || $('article').text() || $('body').text();

    // Clean and limit to first 3000 characters
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

async function searchJobPostings(
  companyName: string,
  role: string
): Promise<any[]> {
  try {
    const results = await googleSearch(
      `${companyName} ${role} job description requirements site:linkedin.com OR site:indeed.com OR site:glassdoor.com`
    );
    return results;
  } catch {
    return [];
  }
}

async function synthesizeCompanyData(data: any): Promise<CompanyResearch> {
  const { generateWithClaudeJSON } = await import('@/lib/ai/vertex-claude');

  const systemPrompt = `You are a company research analyst. Extract and synthesize company information from web search results.`;

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
  "techStack": ["Technology 1", "Technology 2", "Technology 3", "..."],
  "culture": "Company culture and values (2-3 sentences)",
  "recentNews": ["Recent news or achievement 1", "Recent news 2"],
  "jobRequirements": [
    "Key requirement 1",
    "Key requirement 2",
    "Key requirement 3",
    "Key skill 1",
    "Key skill 2"
  ],
  "rawData": "Summary of all gathered information"
}

Be specific and extract REAL information from the sources. If information is missing, use empty arrays/strings.`;

  try {
    const result = await generateWithClaudeJSON(prompt, systemPrompt, 3000);
    return result;
  } catch (error) {
    console.error('Claude synthesis error:', error);
    // Return fallback
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
