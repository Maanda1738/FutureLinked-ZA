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

    // Call Adzuna API
    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'aea61773';
    const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '3e762a8402260d23f5d5115d9ba80c26';
    
    // Call JSearch API (RapidAPI)
    const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || '9925807393msh164bd73c56850cep18f7c9jsn0c10b4650be6';
    
    // Fetch from both APIs in parallel
    const [adzunaResponse, jsearchResponse] = await Promise.allSettled([
      // Adzuna API call
      axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, {
        params: {
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_API_KEY,
          results_per_page: 10,
          what: query,
          where: location,
          max_days_old: 7,
          sort_by: 'date'
        }
      }),
      
      // JSearch API call
      axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
          query: `${query} in south africa`,
          page: page,
          num_pages: 1,
          date_posted: 'week'
        },
        headers: {
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'x-rapidapi-key': JSEARCH_API_KEY
        }
      })
    ]);

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
    let totalCount = 0;

    // Process Adzuna results
    if (adzunaResponse.status === 'fulfilled' && adzunaResponse.value.data) {
      const adzunaJobs = adzunaResponse.value.data.results.map(job => ({
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
      allJobs.push(...adzunaJobs);
      totalCount += adzunaResponse.value.data.count;
    }

    // Process JSearch results
    if (jsearchResponse.status === 'fulfilled' && jsearchResponse.value.data?.data) {
      const jsearchJobs = jsearchResponse.value.data.data.map(job => ({
        id: `jsearch-${job.job_id}`,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city || job.job_state || job.job_country || 'South Africa',
        description: job.job_description,
        requirements: extractRequirements(job.job_description),
        salary: job.job_salary || job.job_min_salary || job.job_max_salary 
          ? `${job.job_min_salary || 'Not specified'} - ${job.job_max_salary || ''}`.trim()
          : 'Not specified',
        url: job.job_apply_link,
        created: job.job_posted_at_datetime_utc,
        posted: job.job_posted_at_datetime_utc,
        source: 'JSearch',
        type: job.job_employment_type,
        isRemote: job.job_is_remote
      }));
      allJobs.push(...jsearchJobs);
      totalCount += jsearchResponse.value.data.total || jsearchJobs.length;
    }

    // Remove duplicates based on similar titles and companies
    const uniqueJobs = [];
    const seen = new Set();
    
    for (const job of allJobs) {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(job);
      }
    }

    // Sort by date (most recent first)
    uniqueJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));

    const jobs = uniqueJobs;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: jobs,
        total: uniqueJobs.length,
        totalAvailable: totalCount,
        page: page,
        sources: {
          adzuna: adzunaResponse.status === 'fulfilled',
          jsearch: jsearchResponse.status === 'fulfilled'
        }
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
