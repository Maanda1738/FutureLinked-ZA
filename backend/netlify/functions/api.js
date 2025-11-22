const axios = require('axios');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// CV Upload handler - returns data for frontend to analyze
async function handleCVUpload(event) {
  try {
    console.log('CV Upload received');
    
    // Extract basic info from the uploaded file if possible
    // For now, return structured mock data that the frontend analyze-cv endpoint will process
    const cvData = {
      fileName: 'cv-uploaded.pdf',
      uploadDate: new Date().toISOString(),
      name: 'Job Seeker',
      email: 'jobseeker@example.com',
      phone: '+27 123 456 7890',
      skills: ['Data Analysis', 'Excel', 'Power BI', 'SQL', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management'],
      experience: { 
        years: 2, 
        roles: ['Junior Data Analyst', 'Data Intern'] 
      },
      education: ['BCom in Economics', 'Matric Certificate'],
      desiredRoles: ['Junior Data Analyst', 'Data Analyst', 'Business Analyst'],
      text: `OBJECTIVE: Seeking a Junior Data Analyst position to leverage my Excel, Power BI, and SQL skills in a dynamic team environment.

SKILLS:
- Data Analysis & Visualization (Excel, Power BI, Tableau)
- SQL & Database Management
- Statistical Analysis
- Report Generation
- Communication & Presentation
- Team Collaboration
- Problem Solving

EXPERIENCE:
Junior Data Analyst - ABC Company (Jan 2023 - Present)
- Analyzed sales data using Excel and Power BI
- Created interactive dashboards for management
- Generated weekly reports on key metrics
- Collaborated with cross-functional teams

Data Analyst Intern - XYZ Corp (Jun 2022 - Dec 2022)
- Assisted in data collection and cleaning
- Performed statistical analysis on customer data
- Contributed to report automation projects

EDUCATION:
BCom in Economics - University of Johannesburg (2018-2021)
Matric Certificate - High School (2017)`,
      summary: 'Junior Data Analyst with 2 years of experience in data analysis, visualization, and reporting using Excel, Power BI, and SQL.',
      totalExperience: 2
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: cvData,
        cvData: cvData // Also include as cvData for compatibility
      })
    };
  } catch (error) {
    console.error('CV Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
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
