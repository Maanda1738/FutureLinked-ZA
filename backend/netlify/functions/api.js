const serverless = require('serverless-http');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Multer for file uploads (memory storage for serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

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

// CV Upload endpoint
app.post('/cv/upload', upload.single('cv'), async (req, res) => {
  try {
    console.log('📄 CV Upload request received');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('📦 File:', req.file.originalname, 'Size:', req.file.size);
    
    let text = '';
    const ext = req.file.originalname.toLowerCase();
    
    if (ext.endsWith('.pdf')) {
      text = await parsePDF(req.file.buffer);
    } else if (ext.endsWith('.docx') || ext.endsWith('.doc')) {
      text = await parseDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or DOCX.' });
    }
    
    console.log('✅ Parsed text length:', text.length);
    
    const cvData = extractCVData(text, req.file.originalname);
    
    return res.json({
      success: true,
      cvData,
      message: 'CV uploaded and parsed successfully'
    });
    
  } catch (error) {
    console.error('❌ CV upload error:', error);
    return res.status(500).json({ 
      error: 'Failed to process CV',
      details: error.message 
    });
  }
});

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    console.log('🔍 Search query:', query);
    
    // Return mock jobs for now
    return res.json({
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
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root handler for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'FutureLinked ZA API',
    endpoints: {
      health: '/.netlify/functions/api/health',
      search: '/.netlify/functions/api/search',
      cv: '/.netlify/functions/api/cv/upload'
    }
  });
});

// 404 handler - log unmatched routes
app.use((req, res, next) => {
  console.log(`⚠️ Route not found: ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      '/.netlify/functions/api/health',
      '/.netlify/functions/api/search',
      '/.netlify/functions/api/cv/upload'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export serverless handler with binary support for file uploads
module.exports.handler = serverless(app, {
  binary: ['multipart/form-data', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
});
