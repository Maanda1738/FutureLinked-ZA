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
      
      // Map common student searches to better terms
      const queryMappings = {
        'bursary': 'bursary OR scholarship OR funding',
        'bursaries': 'bursary OR scholarship OR funding',
        'scholarship': 'scholarship OR bursary OR funding',
        'scholarships': 'scholarship OR bursary OR funding',
        'internship': 'internship OR intern OR traineeship',
        'internships': 'internship OR intern OR traineeship',
        'graduate program': 'graduate program OR graduate programme OR grad programme',
        'learnership': 'learnership OR apprenticeship OR training program'
      };
      
      // Check if query contains bursary/scholarship terms with a field/course
      const bursaryPattern = /(.+?)\s+(bursary|bursaries|scholarship|scholarships|funding)/i;
      const bursaryMatch = searchQuery.match(bursaryPattern);
      
      if (bursaryMatch) {
        const field = bursaryMatch[1].trim(); // e.g., "computer science", "engineering", "accounting"
        const fundingTerm = bursaryMatch[2].toLowerCase();
        
        console.log(`📚 Detected field-specific bursary search: "${field}" + "${fundingTerm}"`);
        
        // Create expanded query: "field (bursary OR scholarship OR funding)"
        return `${field} (bursary OR scholarship OR funding OR "student funding" OR grant)`;
      }
      
      // Check for reverse pattern: "bursary for engineering" or "bursary in IT"
      const reverseBursaryPattern = /(bursary|bursaries|scholarship|scholarships|funding)\s+(?:for|in|to|study)\s+(.+)/i;
      const reverseMatch = searchQuery.match(reverseBursaryPattern);
      
      if (reverseMatch) {
        const field = reverseMatch[2].trim();
        console.log(`📚 Detected reverse bursary search: "${field}"`);
        return `${field} (bursary OR scholarship OR funding OR "student funding" OR grant)`;
      }
      
      // Check if searching for just "bursary" or "bursaries" alone
      if (lowerQuery === 'bursary' || lowerQuery === 'bursaries') {
        return 'bursary OR scholarship OR funding OR "student funding" OR grant';
      }
      
      // Check for exact matches in mapping
      if (queryMappings[lowerQuery]) {
        return queryMappings[lowerQuery];
      }
      
      // Return original query if no mapping
      return searchQuery;
    };

    const improvedQuery = improveSearchQuery(query);
    console.log('Original query:', query, '-> Improved query:', improvedQuery);

    // Call Adzuna API
    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'aea61773';
    const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '3e762a8402260d23f5d5115d9ba80c26';
    
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
    
    // Fetch from Adzuna API
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

    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, {
      params: adzunaParams
    });

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

    let allJobs = [];

    // Helper function to check if job is relevant to search query
    const isJobRelevant = (job, searchQuery) => {
      const queryLower = searchQuery.toLowerCase();
      const titleLower = job.title.toLowerCase();
      const descLower = (job.description || '').toLowerCase();
      
      // Special handling for bursary/funding searches - use more lenient matching
      if (queryLower.includes('bursary') || queryLower.includes('scholarship') || queryLower.includes('funding')) {
        const fundingKeywords = [
          'bursary', 'bursaries', 'scholarship', 'scholarships', 'funding', 'grant', 
          'student funding', 'financial aid', 'study assistance', 'internship', 
          'learnership', 'graduate program', 'graduate programme', 'trainee', 'training'
        ];
        const hasFundingTerm = fundingKeywords.some(keyword => 
          titleLower.includes(keyword) || descLower.includes(keyword)
        );
        
        // Log but DON'T filter out - let users see what Adzuna returns
        if (!hasFundingTerm) {
          console.log(`⚠️ Note: "${job.title}" - may not be traditional bursary, but keeping in results`);
        }
        
        // If searching for field-specific bursary (e.g., "engineering bursary")
        const fieldMatch = queryLower.match(/(.+?)\s+(?:bursary|scholarship|funding)/);
        if (fieldMatch) {
          const field = fieldMatch[1].trim();
          if (field.length > 2 && !field.match(/^(a|an|the|for|in)$/)) {
            // Check if field appears anywhere
            const hasFieldMatch = titleLower.includes(field) || descLower.includes(field);
            if (!hasFieldMatch) {
              console.log(`⚠️ Note: "${job.title}" - doesn't match field "${field}", but keeping in results`);
            }
          }
        }
        
        // Accept all results for bursary searches - let Adzuna API do the filtering
        return true;
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
      
      // Only filter out if NO terms match at all
      if (!hasMatch) {
        console.log(`❌ Filtering out: "${job.title}" - no match for search terms`);
        return false;
      }
      
      return true;
    };

    // Process Adzuna results
    const adzunaJobs = response.data.results.map(job => ({
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      requirements: extractRequirements(job.description),
      salary: job.salary_min && job.salary_max 
        ? `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`
        : 'Not specified',
      url: job.redirect_url,
      created: job.created,
      posted: job.created,
      source: 'Adzuna'
    }));
    
    // Apply relevance filter ONLY for bursary searches
    let relevantJobs = adzunaJobs;
    
    if (query.toLowerCase().includes('bursary') || 
        query.toLowerCase().includes('scholarship') || 
        query.toLowerCase().includes('funding')) {
      // Strict filtering for bursary searches
      relevantJobs = adzunaJobs.filter(job => isJobRelevant(job, query));
      console.log(`🎯 Bursary filter: ${adzunaJobs.length} jobs → ${relevantJobs.length} relevant bursaries`);
    } else {
      // No filtering for regular job searches - show all results from Adzuna
      console.log(`✅ Regular search - showing all ${adzunaJobs.length} results from Adzuna`);
    }
    
    allJobs = relevantJobs;
    const jobs = allJobs;

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
