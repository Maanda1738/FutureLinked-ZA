const axios = require('axios');

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Search handler with real job search APIs
async function handleSearch(event) {
  try {
    const { queryStringParameters } = event;
    const query = queryStringParameters?.q || '';
    const location = queryStringParameters?.location || 'south africa';
    const page = parseInt(queryStringParameters?.page || '1');
    const source = (queryStringParameters?.source || 'all').toLowerCase();

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Search query is required'
        })
      };
    }

    console.log('Search query:', query, 'location:', location, 'page:', page, 'source:', source);

    // Improve search query
    const improveSearchQuery = (searchQuery) => {
      const lowerQuery = searchQuery.toLowerCase();
      const simpleTerms = {
        'bursary': 'bursary', 'bursaries': 'bursary',
        'scholarship': 'scholarship', 'scholarships': 'scholarship',
        'internship': 'internship', 'internships': 'internship',
        'learnership': 'learnership',
        'graduate program': 'graduate', 'graduate programme': 'graduate',
        'trainee': 'trainee'
      };
      
      const bursaryPattern = /(.+?)\s+(bursary|bursaries|scholarship|scholarships|funding)/i;
      const bursaryMatch = searchQuery.match(bursaryPattern);
      if (bursaryMatch) {
        const field = bursaryMatch[1].trim();
        const fundingTerm = bursaryMatch[2].toLowerCase();
        const simpleTerm = fundingTerm.includes('bursary') ? 'bursary' : 
                          fundingTerm.includes('scholarship') ? 'scholarship' : 'funding';
        return ` ``;
      }
      
      if (simpleTerms[lowerQuery]) return simpleTerms[lowerQuery];
      return searchQuery;
    };

    const improvedQuery = improveSearchQuery(query);
    const isBursarySearch = query.toLowerCase().includes('bursary') || 
                           query.toLowerCase().includes('scholarship') || 
                           query.toLowerCase().includes('funding') ||
                           query.toLowerCase().includes('learnership') ||
                           query.toLowerCase().includes('internship');
    const maxDaysOld = isBursarySearch ? 90 : 30;

    // Call Adzuna
    const callAdzuna = async () => {
      const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'aea61773';
      const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '3e762a8402260d23f5d5115d9ba80c26';
      const resp = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/``, {
        params: {
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_API_KEY,
          results_per_page: 15,
          what: improvedQuery,
          where: location,
          max_days_old: maxDaysOld,
          sort_by: 'date'
        }
      });
      return { raw: resp.data, provider: 'Adzuna' };
    };

    // Call Jooble
    const callJooble = async () => {
      const JOOBLE_KEY = process.env.JOOBLE_API_KEY || '414dfc47-c407-40dc-b7eb-3b8bc956f659';
      try {
        const resp = await axios.post(`https://jooble.org/api/``, {
          keywords: improvedQuery,
          location: location,
          page: String(page)
        }, { timeout: 10000 });
        return { raw: resp.data, provider: 'Jooble' };
      } catch (err) {
        console.error('Jooble failed:', err.message);
        return { raw: { jobs: [], totalCount: 0 }, provider: 'Jooble' };
      }
    };

    // Call Google Custom Search
    const callGoogleSearch = async () => {
      const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
      const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '025daad35782144af';
      
      if (!GOOGLE_API_KEY) {
        console.log('Google API key not configured');
        return { raw: { items: [] }, provider: 'Google' };
      }
      
      try {
        const jobSites = [
          'careers24.com', 'jobmail.co.za', 'pnet.co.za', 'careerjunction.co.za',
          'linkedin.com', 'indeed.co.za', 'zabursaries.co.za'
        ];
        const siteQuery = jobSites.map(site => `site:``).join(' OR ');
        const resp = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: GOOGLE_API_KEY,
            cx: GOOGLE_CSE_ID,
            q: ` (`)`,
            num: 10,
            gl: 'za'
          },
          timeout: 10000
        });
        return { raw: resp.data, provider: 'Google' };
      } catch (err) {
        console.error('Google Search failed:', err.message);
        return { raw: { items: [] }, provider: 'Google' };
      }
    };

    // Execute search
    let providerResponse;
    if (source === 'all') {
      const [adzunaResp, joobleResp, googleResp] = await Promise.allSettled([
        callAdzuna(), callJooble(), callGoogleSearch()
      ]);
      
      const allResults = [];
      if (adzunaResp.status === 'fulfilled' && adzunaResp.value.raw) {
        const items = adzunaResp.value.raw.results || [];
        allResults.push(...items.map(job => ({...job, _provider: 'Adzuna'})));
      }
      if (joobleResp.status === 'fulfilled' && joobleResp.value.raw) {
        const items = joobleResp.value.raw.jobs || [];
        allResults.push(...items.map(job => ({...job, _provider: 'Jooble'})));
      }
      if (googleResp.status === 'fulfilled' && googleResp.value.raw) {
        const items = googleResp.value.raw.items || [];
        allResults.push(...items.map(job => ({...job, _provider: 'Google'})));
      }
      
      providerResponse = { raw: { results: allResults, count: allResults.length }, provider: 'Combined' };
    } else if (source === 'jooble') {
      providerResponse = await callJooble();
    } else if (source === 'google') {
      providerResponse = await callGoogleSearch();
    } else {
      providerResponse = await callAdzuna();
    }

    const response = providerResponse.raw;
    const provider = providerResponse.provider;

    // Normalize results
    let rawItems = [];
    if (provider === 'Combined') {
      rawItems = response.results || [];
    } else if (provider === 'Adzuna') {
      rawItems = response.results || [];
    } else if (provider === 'Jooble') {
      rawItems = response.jobs || [];
    } else if (provider === 'Google') {
      rawItems = response.items || [];
    }

    const mapped = rawItems.map((job, idx) => {
      const itemProvider = job._provider || provider;
      const title = job.title || job.job_title || '';
      let company = 'Unknown';
      if (typeof job.company === 'string') company = job.company;
      else if (job.company?.display_name) company = job.company.display_name;
      
      let locationField = location;
      if (typeof job.location === 'string') locationField = job.location;
      else if (job.location?.display_name) locationField = job.location.display_name;
      
      const description = job.description || job.snippet || '';
      const url = job.redirect_url || job.url || job.link || '';
      const created = job.created || job.posted || new Date().toISOString();
      
      return {
        id: `-``,
        title,
        company,
        location: locationField,
        description,
        url,
        created,
        source: itemProvider
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: mapped,
        total: mapped.length,
        page,
        provider
      })
    };

  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch job listings',
        message: error.message
      })
    };
  }
}

// Main handler function
exports.handler = async (event, context) => {
  console.log('Function invoked:', event.httpMethod, event.path);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  // Route: Search
  if (event.path.includes('/search') && event.httpMethod === 'GET') {
    return await handleSearch(event);
  }
  
  // Route: Health
  if (event.path.includes('/health')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
    };
  }
  
  // Default response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'FutureLinked API',
      endpoints: ['/search', '/health']
    })
  };
};
