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
    
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/za/search/${page}`;
    const response = await axios.get(adzunaUrl, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        results_per_page: 15,
        what: query,
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
      
      // Common requirement patterns
      const patterns = [
        /requirements?:(.+?)(?:\n\n|\.|responsibilities|duties|$)/is,
        /qualifications?:(.+?)(?:\n\n|\.|responsibilities|duties|$)/is,
        /must have:(.+?)(?:\n\n|\.|responsibilities|duties|$)/is,
        /skills?:(.+?)(?:\n\n|\.|responsibilities|duties|$)/is,
      ];
      
      for (const pattern of patterns) {
        const match = description.match(pattern);
        if (match && match[1]) {
          const reqText = match[1];
          // Split by bullet points or newlines
          const items = reqText.split(/[•\-\n]/).filter(item => {
            const cleaned = item.trim();
            return cleaned.length > 10 && cleaned.length < 150;
          });
          requirements.push(...items.map(item => item.trim()).slice(0, 5));
          break;
        }
      }
      
      return requirements.slice(0, 5);
    };

    const jobs = response.data.results.map(job => ({
      id: job.id,
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
