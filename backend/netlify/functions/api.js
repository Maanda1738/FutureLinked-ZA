const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
}

// Parse DOCX
async function parseDOCX(buffer) {
  try {
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
    
    // Parse multipart form data
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' })
      };
    }
    
    // Decode base64 body (Netlify encodes binary data)
    const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body, 'binary');
    
    // Simple multipart parser (extract file from body)
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No boundary found in Content-Type' })
      };
    }
    
    // Extract file data from multipart body
    const parts = body.toString('binary').split(`--${boundary}`);
    let fileBuffer = null;
    let filename = '';
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
          // Extract file content (after double newline)
          const fileStart = part.indexOf('\r\n\r\n') + 4;
          const fileEnd = part.lastIndexOf('\r\n');
          if (fileStart > 3 && fileEnd > fileStart) {
            const fileContent = part.substring(fileStart, fileEnd);
            fileBuffer = Buffer.from(fileContent, 'binary');
          }
        }
      }
    }
    
    if (!fileBuffer || !filename) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file found in upload' })
      };
    }
    
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
    console.error('❌ CV upload error:', error);
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

// Search handler
async function handleSearch(event) {
  try {
    const query = event.queryStringParameters?.q || '';
    console.log('🔍 Search query:', query);
    
    // Return mock jobs for now
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results: [
          {
            id: '1',
            title: 'Junior Developer - ' + query,
            company: 'Tech Company',
            location: 'Remote',
            description: 'Entry-level position for ' + query,
            source: 'internal',
            url: '#',
            matchScore: 85
          },
          {
            id: '2',
            title: 'Graduate Program - ' + query,
            company: 'Innovation Hub',
            location: 'Johannesburg',
            description: 'Graduate opportunity in ' + query,
            source: 'internal',
            url: '#',
            matchScore: 80
          }
        ],
        count: 2
      })
    };
  } catch (error) {
    console.error('❌ Search error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Search failed' })
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
