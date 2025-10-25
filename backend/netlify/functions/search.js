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
      
      // Check for specific bursary searches with fields
      if (lowerQuery.includes('bursary') || lowerQuery.includes('bursaries')) {
        // If searching for specific field (e.g., "IT bursary"), keep field but expand bursary term
        const parts = searchQuery.split(/\s+/);
        const field = parts.find(p => !['bursary', 'bursaries'].includes(p.toLowerCase()));
        if (field) {
          return `${field} (bursary OR scholarship OR funding)`;
        }
        return 'bursary OR scholarship OR funding';
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
    
    // Fetch from Adzuna API
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        results_per_page: 15,
        what: improvedQuery,
        where: location,
        max_days_old: 7,
        sort_by: 'date'
      }
    });

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
      
      // Extract main search terms (remove OR, AND, parentheses)
      const mainTerms = queryLower
        .replace(/\(|\)/g, '')
        .split(/\s+(?:or|and)\s+/i)
        .map(t => t.trim())
        .filter(t => t.length > 2); // Ignore very short terms
      
      // Check if ANY main term appears in title or description
      const hasRelevantTerm = mainTerms.some(term => {
        return titleLower.includes(term) || descLower.includes(term);
      });
      
      if (!hasRelevantTerm) {
        console.log(`❌ Filtering out irrelevant job: "${job.title}" - no match for "${queryLower}"`);
        return false;
      }
      
      // Additional checks for specific queries
      if (queryLower.includes('economics')) {
        // Must contain economics or economist
        if (!titleLower.includes('econom') && !descLower.includes('econom')) {
          console.log(`❌ Filtering out: "${job.title}" - not economics related`);
          return false;
        }
      }
      
      if (queryLower.includes('engineering')) {
        // Must contain engineer
        if (!titleLower.includes('engineer') && !descLower.includes('engineer')) {
          console.log(`❌ Filtering out: "${job.title}" - not engineering related`);
          return false;
        }
      }
      
      if (queryLower.includes('accounting')) {
        // Must contain account or accountant
        if (!titleLower.includes('account') && !descLower.includes('account')) {
          console.log(`❌ Filtering out: "${job.title}" - not accounting related`);
          return false;
        }
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
    
    // Filter out irrelevant jobs based on search query
    const relevantJobs = adzunaJobs.filter(job => isJobRelevant(job, query));
    console.log(`🎯 Relevance filter: ${adzunaJobs.length} jobs → ${relevantJobs.length} relevant jobs`);
    
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
