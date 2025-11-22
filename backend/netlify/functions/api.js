const multipart = require('parse-multipart-data');
const axios = require('axios');
// Lazy load pdf-parse and mammoth only when needed to avoid DOMMatrix errors
let pdfParse = null;
let mammoth = null;

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Parse PDF
async function parsePDF(buffer) {
  try {
    // Lazy load pdf-parse only when needed
    if (!pdfParse) {
      pdfParse = require('pdf-parse');
    }
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
}

// Parse DOCX
async function parseDOCX(buffer) {
  try {
    // Lazy load mammoth only when needed
    if (!mammoth) {
      mammoth = require('mammoth');
    }
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX: ' + error.message);
  }
}

// Extract CV data from text
function extractCVData(text, filename) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Extract phone
  const phoneMatch = text.match(/(\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Extract name (usually first line)
  const name = lines[0] || '';
  
  // Extract skills
  const skillsSection = text.match(/skills?:?\s*(.*?)(?=\n\n|experience|education|$)/is);
  const skills = skillsSection ? 
    skillsSection[1].split(/[,\n]/).map(s => s.trim()).filter(s => s && s.length > 2).slice(0, 10) : 
    [];
  
  // Estimate experience years
  const yearMatches = text.match(/\b(19|20)\d{2}\b/g) || [];
  const years = yearMatches.map(y => parseInt(y)).filter(y => y >= 1990 && y <= new Date().getFullYear());
  const experienceYears = years.length >= 2 ? new Date().getFullYear() - Math.min(...years) : 0;
  
  return {
    fileName: filename,
    uploadDate: new Date().toISOString(),
    name: name.substring(0, 100),
    email,
    phone,
    skills,
    experience: {
      years: experienceYears,
      roles: []
    },
    education: [],
    text: text.substring(0, 5000),
    rawText: text
  };
}

// CV Upload handler
async function handleCVUpload(event) {
  try {
    console.log('📄 CV Upload request received');
    console.log('📦 Content-Type:', event.headers['content-type']);
    console.log('📦 isBase64Encoded:', event.isBase64Encoded);
    
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' })
      };
    }
    
    // Get boundary from content-type
    const boundary = multipart.getBoundary(contentType);
    if (!boundary) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No boundary found in Content-Type' })
      };
    }
    
    // Decode body
    const bodyBuffer = event.isBase64Encoded 
      ? Buffer.from(event.body, 'base64') 
      : Buffer.from(event.body);
    
    // Parse multipart data
    const parts = multipart.parse(bodyBuffer, boundary);
    
    if (!parts || parts.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file found in upload' })
      };
    }
    
    // Get the first file part
    const filePart = parts.find(part => part.filename);
    
    if (!filePart) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file found in upload' })
      };
    }
    
    const filename = filePart.filename;
    const fileBuffer = filePart.data;
    
    console.log('📦 File:', filename, 'Size:', fileBuffer.length);
    
    // Parse file based on extension
    let text = '';
    const ext = filename.toLowerCase();
    
    if (ext.endsWith('.pdf')) {
      console.log('🔄 Parsing PDF...');
      text = await parsePDF(fileBuffer);
    } else if (ext.endsWith('.docx') || ext.endsWith('.doc')) {
      console.log('🔄 Parsing DOCX...');
      text = await parseDOCX(fileBuffer);
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unsupported file type. Use PDF or DOCX.' })
      };
    }
    
    console.log('✅ Parsed text length:', text.length);
    
    const cvData = extractCVData(text, filename);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        cvData,
        message: 'CV uploaded and parsed successfully'
      })
    };
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process CV',
        details: error.message
      })
    };
  }
}

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

    console.log('🔍 Search query:', query, 'location:', location, 'page:', page, 'source:', source);

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
        return `${field} ${simpleTerm}`;
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
      const resp = await axios.get(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`, {
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
        const resp = await axios.post(`https://jooble.org/api/${JOOBLE_KEY}`, {
          keywords: improvedQuery,
          location: location,
          page: String(page)
        }, { timeout: 10000 });
        return { raw: resp.data, provider: 'Jooble' };
      } catch (err) {
        console.error('❌ Jooble failed:', err.message);
        return { raw: { jobs: [], totalCount: 0 }, provider: 'Jooble' };
      }
    };

    // Call Google Custom Search
    const callGoogleSearch = async () => {
      const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
      const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID || '025daad35782144af';
      
      if (!GOOGLE_API_KEY) {
        console.log('⚠️ Google API key not configured');
        return { raw: { items: [] }, provider: 'Google' };
      }
      
      try {
        const jobSites = [
          'careers24.com', 'jobmail.co.za', 'pnet.co.za', 'careerjunction.co.za',
          'linkedin.com', 'indeed.co.za', 'zabursaries.co.za'
        ];
        const siteQuery = jobSites.map(site => `site:${site}`).join(' OR ');
        const resp = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: GOOGLE_API_KEY,
            cx: GOOGLE_CSE_ID,
            q: `${improvedQuery} (${siteQuery})`,
            num: 10,
            gl: 'za'
          },
          timeout: 10000
        });
        return { raw: resp.data, provider: 'Google' };
      } catch (err) {
        console.error('❌ Google Search failed:', err.message);
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
        id: `${itemProvider.toLowerCase()}-${idx}`,
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
    console.error('❌ Search error:', error);
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
  console.log('🚀 Function invoked:', event.httpMethod, event.path);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  // Route: CV Upload
  if (event.path.includes('/cv/upload') && event.httpMethod === 'POST') {
    return await handleCVUpload(event);
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
      endpoints: ['/cv/upload', '/search', '/health']
    })
  };
};
