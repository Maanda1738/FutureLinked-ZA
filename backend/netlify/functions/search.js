const axios = require('axios');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { queryStringParameters } = event;
    const query = queryStringParameters?.q || '';
    const location = queryStringParameters?.location || 'south africa';
    const page = parseInt(queryStringParameters?.page || '1');

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

    // Improve search query for better results
    const improveSearchQuery = (searchQuery) => {
      const lowerQuery = searchQuery.toLowerCase();
      
      // For bursary/scholarship searches, keep it simple - Adzuna doesn't handle complex OR queries well
      // Just use the main term without expansion
      const simpleTerms = {
        'bursary': 'bursary',
        'bursaries': 'bursary',
        'scholarship': 'scholarship',
        'scholarships': 'scholarship',
        'internship': 'internship',
        'internships': 'internship',
        'learnership': 'learnership',
        'graduate program': 'graduate',
        'graduate programme': 'graduate',
        'trainee': 'trainee'
      };
      
      // Check if query contains bursary/scholarship terms with a field/course
      const bursaryPattern = /(.+?)\s+(bursary|bursaries|scholarship|scholarships|funding)/i;
      const bursaryMatch = searchQuery.match(bursaryPattern);
      
      if (bursaryMatch) {
        const field = bursaryMatch[1].trim(); // e.g., "computer science", "engineering", "accounting"
        const fundingTerm = bursaryMatch[2].toLowerCase();
        
        console.log(`📚 Detected field-specific bursary search: "${field}" + "${fundingTerm}"`);
        
        // Keep it simple - just combine field with main term
        const simpleTerm = fundingTerm.includes('bursary') ? 'bursary' : 
                          fundingTerm.includes('scholarship') ? 'scholarship' : 'funding';
        return `${field} ${simpleTerm}`;
      }
      
      // Check for reverse pattern: "bursary for engineering" or "bursary in IT"
      const reverseBursaryPattern = /(bursary|bursaries|scholarship|scholarships|funding)\s+(?:for|in|to|study)\s+(.+)/i;
      const reverseMatch = searchQuery.match(reverseBursaryPattern);
      
      if (reverseMatch) {
        const field = reverseMatch[2].trim();
        const fundingTerm = reverseMatch[1].toLowerCase();
        const simpleTerm = fundingTerm.includes('bursary') ? 'bursary' : 
                          fundingTerm.includes('scholarship') ? 'scholarship' : 'funding';
        console.log(`📚 Detected reverse bursary search: "${field}"`);
        return `${simpleTerm} ${field}`;
      }
      
      // Check for exact matches in simple terms mapping
      if (simpleTerms[lowerQuery]) {
        return simpleTerms[lowerQuery];
      }
      
      // Return original query if no mapping
      return searchQuery;
    };

    const improvedQuery = improveSearchQuery(query);
    console.log('Original query:', query, '-> Improved query:', improvedQuery);

  // Determine max_days_old based on search type
    // Bursaries/scholarships/graduate programs are typically open for longer periods
    const isBursarySearch = query.toLowerCase().includes('bursary') || 
                           query.toLowerCase().includes('scholarship') || 
                           query.toLowerCase().includes('funding') ||
                           query.toLowerCase().includes('learnership') ||
                           query.toLowerCase().includes('graduate program') ||
                           query.toLowerCase().includes('graduate programme') ||
                           query.toLowerCase().includes('internship') ||
                           query.toLowerCase().includes('trainee');
    const maxDaysOld = isBursarySearch ? 90 : 7;  // 90 days for bursaries/programs (they stay open longer), 7 days for jobs
    
    console.log(`🔍 Search type: ${isBursarySearch ? 'BURSARY/FUNDING' : 'REGULAR JOB'} (max_days_old: ${maxDaysOld})`);
    
    // For bursary searches, make location less restrictive (use broader "south africa" instead of specific cities)
    const searchLocation = isBursarySearch ? 'south africa' : location;
    
    // For flexibility, allow choosing a provider via ?source=adzuna|jooble|rapid|careerjet
    const source = (queryStringParameters?.source || 'adzuna').toLowerCase();

    // Helper: call Adzuna
    const callAdzuna = async () => {
      const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'aea61773';
      const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '3e762a8402260d23f5d5115d9ba80c26';
      const adzunaParams = {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        results_per_page: 15,
        what: improvedQuery,
        where: searchLocation,
        max_days_old: maxDaysOld,
        sort_by: 'date'
      };

      console.log('📡 Calling Adzuna with params:', JSON.stringify(adzunaParams));
      const resp = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, { params: adzunaParams });
      return { raw: resp.data, provider: 'Adzuna' };
    };

    // Helper: call Jooble REST API (assumptions: POST to https://jooble.org/api/ ; header X-Api-Key)
    const callJooble = async () => {
      const JOOBLE_KEY = process.env.JOOBLE_API_KEY || '414dfc47-c407-40dc-b7eb-3b8bc956f659';
      const endpoint = process.env.JOOBLE_ENDPOINT || 'https://jooble.org/api/';
      try {
        const body = {
          keywords: improvedQuery,
          location: searchLocation,
          page: page,
          size: 15
        };
        console.log('📡 Calling Jooble:', endpoint, 'body:', body);
        const resp = await axios.post(endpoint, body, {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': JOOBLE_KEY
          },
          timeout: 10000
        });
        return { raw: resp.data, provider: 'Jooble' };
      } catch (err) {
        console.error('❌ Jooble call failed:', err && err.message);
        return { raw: { jobs: [] , count: 0 }, provider: 'Jooble' };
      }
    };

    // Helper: call RapidAPI jsearch (example from RapidAPI)
    const callRapidJsearch = async () => {
      const RAPID_KEY = process.env.RAPIDAPI_KEY || '9925807393msh164bd73c56850cep18f7c9jsn0c10b4650be6';
      const host = 'jsearch.p.rapidapi.com';
      const params = {
        query: improvedQuery,
        page: page,
        num_pages: 1,
        country: 'za',
        date_posted: 'all'
      };
      try {
        console.log('📡 Calling RapidAPI jsearch with params:', params);
        const resp = await axios.get('https://jsearch.p.rapidapi.com/search', {
          params,
          headers: {
            'x-rapidapi-host': host,
            'x-rapidapi-key': RAPID_KEY
          },
          timeout: 10000
        });
        return { raw: resp.data, provider: 'RapidJsearch' };
      } catch (err) {
        console.error('❌ Rapid jsearch call failed:', err && err.message);
        return { raw: { data: [], total: 0 }, provider: 'RapidJsearch' };
      }
    };

    // Helper: placeholder for Careerjet (requires IP registration)
    const callCareerjet = async () => {
      const CAREERJET_KEY = process.env.CAREERJET_KEY || 'ad3cc98fd0afd9b05a68c956d9897c6a';
      console.log('⚠️ Careerjet support requires server IP registration with Careerjet. Skipping unless configured.');
      return { raw: { jobs: [], count: 0 }, provider: 'Careerjet' };
    };

    // Choose provider
    let providerResponse;
    if (source === 'jooble') providerResponse = await callJooble();
    else if (source === 'rapid' || source === 'jsearch' || source === 'rapidapi') providerResponse = await callRapidJsearch();
    else if (source === 'careerjet') providerResponse = await callCareerjet();
    else providerResponse = await callAdzuna();

    const response = providerResponse.raw;

    // Debug output: log counts and sample titles to help diagnose empty results
    try {
      console.log(`📥 Adzuna returned count=${response.data.count}, results.length=${(response.data.results||[]).length}`);
      if (response.data.results && response.data.results.length > 0) {
        const sample = response.data.results.slice(0,3).map(r => r.title);
        console.log('📚 Sample titles:', JSON.stringify(sample));
      }
    } catch (e) {
      console.log('⚠️ Failed to parse Adzuna response for debug logging', e && e.message);
    }

    // Helper function to extract requirements from description
    const extractRequirements = (description) => {
      if (!description) return [];
      
      const requirements = [];
      const text = description.toLowerCase();
      
      // Look for sections with requirements keywords
      const sections = [
        { pattern: /requirements?[:\s]+(.+?)(?:responsibilities|duties|about|what we offer|benefits|apply|$)/is, priority: 1 },
        { pattern: /qualifications?[:\s]+(.+?)(?:responsibilities|duties|about|what we offer|benefits|apply|$)/is, priority: 1 },
        { pattern: /minimum requirements?[:\s]+(.+?)(?:responsibilities|duties|about|what we offer|benefits|apply|$)/is, priority: 1 },
        { pattern: /essential[:\s]+(.+?)(?:responsibilities|duties|about|what we offer|benefits|apply|$)/is, priority: 2 },
        { pattern: /you (?:will need|must have|should have)[:\s]+(.+?)(?:responsibilities|duties|about|what we offer|benefits|apply|$)/is, priority: 2 },
      ];
      
      for (const section of sections) {
        const match = description.match(section.pattern);
        if (match && match[1]) {
          const reqText = match[1];
          // Split by bullet points, newlines, or numbered lists
          const items = reqText.split(/[•\-\n]|(?:\d+\.)/).filter(item => {
            const cleaned = item.trim();
            return cleaned.length > 15 && cleaned.length < 200;
          });
          
          requirements.push(...items.map(item => item.trim().replace(/^[:\s]+/, '')).slice(0, 5));
          if (requirements.length >= 3) break;
        }
      }
      
      // If no structured requirements found, extract key qualifications from text
      if (requirements.length === 0) {
        const keywords = [
          /(?:bachelor'?s?|master'?s?|degree|diploma|matric)/i,
          /\d+\+?\s*(?:years?|months?) (?:of )?experience/i,
          /(?:must have|required|essential).*?(?:qualification|certificate|license)/i,
        ];
        
        keywords.forEach(keyword => {
          const match = description.match(keyword);
          if (match && requirements.length < 3) {
            const sentence = description.substring(
              Math.max(0, match.index - 50),
              Math.min(description.length, match.index + match[0].length + 100)
            ).trim();
            if (sentence.length > 20) {
              requirements.push(sentence);
            }
          }
        });
      }
      
      return requirements.slice(0, 5);
    };

    // Process Adzuna results
    const isJobRelevant = (job, searchQuery) => {
      const queryLower = searchQuery.toLowerCase();
      const titleLower = job.title.toLowerCase();
      const descLower = (job.description || '').toLowerCase();
      
      // For regular job searches, use lenient matching
      // Extract main search terms (remove OR, AND, parentheses, quotes)
      const mainTerms = queryLower
        .replace(/[()'"]/g, '')
        .split(/\s+(?:or|and)\s+/i)
        .filter(t => t.trim().length > 2);
      
      // If no valid terms, accept the job (don't filter)
      if (mainTerms.length === 0) {
        return true;
      }
      
      // Check if ANY term appears in title or description
      const hasMatch = mainTerms.some(term => {
        const cleanTerm = term.trim();
        return titleLower.includes(cleanTerm) || descLower.includes(cleanTerm);
      });
      
      return hasMatch;
    };

    // Normalize results from different providers into a common shape
    const provider = providerResponse.provider || 'Adzuna';
    let rawItems = [];
    let totalCount = 0;

    if (provider === 'Adzuna') {
      rawItems = (response && response.results) || [];
      totalCount = (response && response.count) || 0;
    } else if (provider === 'Jooble') {
      // Jooble commonly returns {jobs: [...], total: N}
      rawItems = response.jobs || response.results || [];
      totalCount = response.total || response.count || rawItems.length;
    } else if (provider === 'RapidJsearch') {
      // Rapid jsearch returns {data: [...], total: N} in many wrappers
      rawItems = response.data || response.results || [];
      totalCount = response.total || response.total_count || rawItems.length;
    } else if (provider === 'Careerjet') {
      rawItems = response.jobs || [];
      totalCount = response.count || rawItems.length;
    } else {
      rawItems = response.results || response.data || [];
      totalCount = response.count || response.total || rawItems.length;
    }

    const mapped = rawItems.map((job, idx) => {
      // Try to normalize fields defensively
      const title = job.title || job.job_title || job.position || job.name || '';
      const company = (job.company && (job.company.display_name || job.company.name)) || job.company || job.job_publisher || job.employer || '';
      const locationField = job.location || job.location_name || job.job_location || job.city || '';
      const description = job.description || job.snippet || job.job_description || job.summary || '';
      const url = job.redirect_url || job.url || job.link || job.apply_link || job.job_apply_link || '';
      const created = job.created || job.posted || job.date || null;
      const id = job.id || job.job_id || job.jobKey || `${provider.toLowerCase()}-${idx}`;

      return {
        id: `${provider.toLowerCase()}-${id}`,
        title: title,
        company: company || 'Unknown',
        location: locationField || searchLocation,
        description: description,
        requirements: extractRequirements(description),
        salary: job.salary || job.salary_min && job.salary_max ? `${job.salary_min || ''}-${job.salary_max || ''}` : 'Not specified',
        url: url,
        created: created,
        posted: created,
        source: provider
      };
    });

    // Apply relevance filter for all searches
    const relevantJobs = mapped.filter(job => isJobRelevant(job, query));
    console.log(`🎯 Filter: ${mapped.length} jobs → ${relevantJobs.length} relevant results (provider: ${provider})`);

    const jobs = relevantJobs;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: jobs,
        total: response.data.count,
        page: page
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
};
