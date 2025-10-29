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
    const maxDaysOld = isBursarySearch ? 90 : 30;  // 90 days for bursaries/programs, 30 days for regular jobs
    
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

    // Helper: call Jooble REST API (POST to https://jooble.org/api/{KEY})
    const callJooble = async () => {
      const JOOBLE_KEY = process.env.JOOBLE_API_KEY || '414dfc47-c407-40dc-b7eb-3b8bc956f659';
      const endpoint = `https://jooble.org/api/${JOOBLE_KEY}`;
      try {
        const body = {
          keywords: improvedQuery,
          location: searchLocation,
          page: String(page)
        };
        console.log('📡 Calling Jooble:', endpoint, 'body:', body);
        const resp = await axios.post(endpoint, body, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        return { raw: resp.data, provider: 'Jooble' };
      } catch (err) {
        console.error('❌ Jooble call failed:', err && err.message);
        return { raw: { jobs: [], totalCount: 0 }, provider: 'Jooble' };
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

    // Helper: call Google Custom Search JSON API
    const callGoogleSearch = async () => {
      const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
      const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '025daad35782144af';
      
      if (!GOOGLE_API_KEY) {
        console.log('⚠️ Google API key not configured. Skipping Google Search.');
        return { raw: { items: [], searchInformation: { totalResults: 0 } }, provider: 'Google' };
      }
      
      try {
        const searchQuery = `${improvedQuery} jobs site:linkedin.com OR site:careers24.com OR site:pnet.co.za`;
        console.log('📡 Calling Google Custom Search API with query:', searchQuery);
        
        const resp = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: GOOGLE_API_KEY,
            cx: GOOGLE_CSE_ID,
            q: searchQuery,
            num: 10,
            gl: 'za',
            cr: 'countryZA'
          },
          timeout: 10000
        });
        
        console.log(`✅ Google: Found ${(resp.data.items || []).length} results`);
        return { raw: resp.data, provider: 'Google' };
      } catch (err) {
        console.error('❌ Google Search call failed:', err && err.message);
        return { raw: { items: [], searchInformation: { totalResults: 0 } }, provider: 'Google' };
      }
    };

    // Choose provider
    let providerResponse;
    if (source === 'jooble') providerResponse = await callJooble();
    else if (source === 'rapid' || source === 'jsearch' || source === 'rapidapi') providerResponse = await callRapidJsearch();
    else if (source === 'careerjet') providerResponse = await callCareerjet();
    else if (source === 'google') providerResponse = await callGoogleSearch();
    else if (source === 'all') {
      // Call ALL providers in parallel for comprehensive results
      console.log('🚀 Calling ALL providers in parallel...');
      const [adzunaResp, joobleResp, rapidResp, googleResp] = await Promise.allSettled([
        callAdzuna(),
        callJooble(),
        callRapidJsearch(),
        callGoogleSearch()
      ]);
      
      // Combine all successful results
      const allResults = [];
      let combinedTotal = 0;
      
      if (adzunaResp.status === 'fulfilled' && adzunaResp.value.raw) {
        const items = adzunaResp.value.raw.results || [];
        console.log(`✅ Adzuna: ${items.length} results`);
        allResults.push(...items.map(job => ({...job, _provider: 'Adzuna', _raw: adzunaResp.value.raw})));
        combinedTotal += adzunaResp.value.raw.count || items.length;
      }
      
      if (joobleResp.status === 'fulfilled' && joobleResp.value.raw) {
        const items = joobleResp.value.raw.jobs || [];
        console.log(`✅ Jooble: ${items.length} results`);
        allResults.push(...items.map(job => ({...job, _provider: 'Jooble', _raw: joobleResp.value.raw})));
        combinedTotal += joobleResp.value.raw.totalCount || items.length;
      }
      
      if (rapidResp.status === 'fulfilled' && rapidResp.value.raw) {
        const items = rapidResp.value.raw.data || [];
        console.log(`✅ RapidAPI: ${items.length} results`);
        allResults.push(...items.map(job => ({...job, _provider: 'RapidJsearch', _raw: rapidResp.value.raw})));
        combinedTotal += rapidResp.value.raw.total || items.length;
      }
      
      if (googleResp.status === 'fulfilled' && googleResp.value.raw) {
        const items = googleResp.value.raw.items || [];
        console.log(`✅ Google: ${items.length} results`);
        allResults.push(...items.map(job => ({...job, _provider: 'Google', _raw: googleResp.value.raw})));
        combinedTotal += parseInt(googleResp.value.raw.searchInformation?.totalResults || items.length);
      }
      
      console.log(`📊 Combined: ${allResults.length} total results from all providers`);
      
      // Create a combined response
      providerResponse = {
        raw: { results: allResults, count: combinedTotal },
        provider: 'Combined (All Sources)'
      };
    }
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
      
      // For bursary/funding searches, be more lenient - accept if keyword appears anywhere
      if (queryLower.includes('bursary') || queryLower.includes('scholarship') || 
          queryLower.includes('learnership') || queryLower.includes('internship') ||
          queryLower.includes('graduate program') || queryLower.includes('trainee')) {
        const fundingKeywords = ['bursary', 'scholarship', 'learnership', 'internship', 'graduate', 'trainee', 'funding'];
        const hasFundingMatch = fundingKeywords.some(keyword => 
          titleLower.includes(keyword) || descLower.includes(keyword)
        );
        
        if (hasFundingMatch) {
          return true;
        }
      }
      
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

    if (provider === 'Combined (All Sources)') {
      // Handle combined results from multiple providers
      rawItems = response.results || [];
      totalCount = response.count || rawItems.length;
      
      // Each item already has _provider tag, we'll use it during mapping
    } else if (provider === 'Adzuna') {
      rawItems = (response && response.results) || [];
      totalCount = (response && response.count) || 0;
    } else if (provider === 'Jooble') {
      // Jooble returns {jobs: [...], totalCount: N}
      rawItems = response.jobs || [];
      totalCount = response.totalCount || rawItems.length;
    } else if (provider === 'RapidJsearch') {
      // Rapid jsearch returns {data: [...], total: N} in many wrappers
      rawItems = response.data || response.results || [];
      totalCount = response.total || response.total_count || rawItems.length;
    } else if (provider === 'Careerjet') {
      rawItems = response.jobs || [];
      totalCount = response.count || rawItems.length;
    } else if (provider === 'Google') {
      // Google Custom Search returns {items: [...], searchInformation: { totalResults: "123" }}
      rawItems = response.items || [];
      totalCount = parseInt(response.searchInformation?.totalResults || rawItems.length);
    } else {
      rawItems = response.results || response.data || [];
      totalCount = response.count || response.total || rawItems.length;
    }

    const mapped = rawItems.map((job, idx) => {
      // For combined results, use the _provider tag if available
      const itemProvider = job._provider || provider;
      
      // Try to normalize fields defensively
      const title = job.title || job.job_title || job.position || job.name || '';
      
      // Handle company field carefully - could be object or string
      let company = 'Unknown';
      if (typeof job.company === 'string') {
        company = job.company;
      } else if (job.company && typeof job.company === 'object') {
        company = job.company.display_name || job.company.name || 'Unknown';
      } else if (job.job_publisher) {
        company = job.job_publisher;
      } else if (job.employer || job.employer_name) {
        company = job.employer || job.employer_name;
      }
      
      // Handle location field
      let locationField = searchLocation;
      if (typeof job.location === 'string') {
        locationField = job.location;
      } else if (job.location && typeof job.location === 'object') {
        locationField = job.location.display_name || job.location.name || searchLocation;
      } else if (job.location_name || job.job_location || job.city) {
        locationField = job.location_name || job.job_location || job.city;
      }
      
      const description = job.description || job.snippet || job.job_description || job.summary || '';
      const url = job.redirect_url || job.url || job.link || job.apply_link || job.job_apply_link || '';
      const created = job.created || job.posted || job.date || new Date().toISOString();
      const id = job.id || job.job_id || job.jobKey || `${itemProvider.toLowerCase()}-${idx}`;

      // Handle salary field
      let salaryText = 'Not specified';
      if (job.salary) {
        salaryText = job.salary;
      } else if (job.salary_min && job.salary_max) {
        salaryText = `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`;
      } else if (job.salary_min) {
        salaryText = `From R${job.salary_min.toLocaleString()}`;
      }

      return {
        id: `${itemProvider.toLowerCase()}-${id}`,
        title: title,
        company: company,
        location: locationField,
        description: description,
        requirements: extractRequirements(description),
        salary: salaryText,
        url: url,
        created: created,
        posted: created,
        source: itemProvider
      };
    });

    // Filter out old jobs (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentJobs = mapped.filter(job => {
      try {
        const jobDate = new Date(job.created || job.posted);
        // Filter out invalid dates and jobs older than 30 days
        if (isNaN(jobDate.getTime())) return true; // Keep if date is invalid (better than losing results)
        
        const isRecent = jobDate >= thirtyDaysAgo;
        if (!isRecent) {
          console.log(`📅 Filtering out old job: "${job.title}" from ${jobDate.toISOString().split('T')[0]} (${job.source})`);
        }
        return isRecent;
      } catch (e) {
        return true; // Keep if error parsing date
      }
    });
    
    console.log(`📅 Date filter: ${mapped.length} jobs → ${recentJobs.length} recent jobs (last 30 days)`);
    if (mapped.length > recentJobs.length) {
      console.log(`🗑️  Removed ${mapped.length - recentJobs.length} old jobs`);
    }

    // Apply relevance filter for all searches
    const relevantJobs = recentJobs.filter(job => isJobRelevant(job, query));
    console.log(`🎯 Relevance filter: ${recentJobs.length} jobs → ${relevantJobs.length} relevant results (provider: ${provider})`);

    // For multi-provider "all" searches, be more lenient - if we have very few results after filtering, use all
    let jobs = relevantJobs;
    if (provider === 'Combined (All Sources)' && relevantJobs.length < 5 && recentJobs.length > 10) {
      console.log(`⚠️ Multi-provider filter too strict (${relevantJobs.length}/${recentJobs.length}). Using all recent results for better coverage.`);
      jobs = recentJobs;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: jobs,
        total: totalCount,
        page: page,
        provider: provider
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
