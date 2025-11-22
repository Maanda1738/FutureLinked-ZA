const axios = require('axios');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// CV Upload handler
async function handleCVUpload(event) {
  try {
    console.log('CV Upload received');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          fileName: 'cv.pdf',
          uploadDate: new Date().toISOString(),
          name: 'Job Seeker',
          email: 'contact@example.com',
          phone: '+27123456789',
          skills: ['Communication', 'Teamwork', 'Problem Solving'],
          experience: { years: 1, roles: [] },
          education: [],
          text: 'CV uploaded successfully'
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}

// Search handler
async function handleSearch(event) {
  try {
    const { queryStringParameters } = event;
    const query = queryStringParameters?.q || '';
    const location = queryStringParameters?.location || 'south africa';
    const page = parseInt(queryStringParameters?.page || '1');
    const source = (queryStringParameters?.source || 'adzuna').toLowerCase();

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Search query required' })
      };
    }

    console.log('Search:', query, location, page, source);

    const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || 'aea61773';
    const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '3e762a8402260d23f5d5115d9ba80c26';

    const resp = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        results_per_page: 20,
        what: query,
        where: location,
        max_days_old: 30,
        sort_by: 'date'
      },
      timeout: 15000
    });

    const jobs = (resp.data.results || []).map((job, idx) => ({
      id: `adzuna-${idx}`,
      title: job.title || '',
      company: typeof job.company === 'string' ? job.company : (job.company?.display_name || 'Unknown'),
      location: typeof job.location === 'string' ? job.location : (job.location?.display_name || location),
      description: job.description || '',
      url: job.redirect_url || '',
      created: job.created || new Date().toISOString(),
      salary: job.salary_min ? `R${job.salary_min.toLocaleString()}+` : 'Not specified',
      source: 'Adzuna'
    }));

    console.log(`Found ${jobs.length} jobs`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: jobs,
        total: resp.data.count || jobs.length,
        page,
        provider: 'Adzuna'
      })
    };

  } catch (error) {
    console.error('Search error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Search failed',
        message: error.message
      })
    };
  }
}

exports.handler = async (event, context) => {
  console.log('API called:', event.httpMethod, event.path);
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.path.includes('/cv/upload') && event.httpMethod === 'POST') {
    return await handleCVUpload(event);
  }
  
  if (event.path.includes('/search') && event.httpMethod === 'GET') {
    return await handleSearch(event);
  }
  
  if (event.path.includes('/health')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'FutureLinked API',
      endpoints: ['/search', '/cv/upload', '/health']
    })
  };
};
