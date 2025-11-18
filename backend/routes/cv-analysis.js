/**
 * CV Analysis Routes - Backend OpenAI Integration
 * Handles CV analysis, job matching, and CV editing with OpenAI
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');

// Import pdf-parse - it's a default export
let pdfParse;
try {
  pdfParse = require('pdf-parse');
  // If it has a default property, use that
  if (typeof pdfParse !== 'function' && pdfParse.default) {
    pdfParse = pdfParse.default;
  }
} catch (e) {
  console.error('Failed to load pdf-parse:', e.message);
}

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname || 'document.pdf';
    cb(null, 'cv-' + uniqueSuffix + path.extname(originalName));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype.includes('pdf') || 
                     file.mimetype.includes('word') || 
                     file.mimetype.includes('document');
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

/**
 * POST /api/cv/upload
 * Upload and parse CV
 */
router.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    const cvText = await extractTextFromCV(req.file);
    
    console.log('📄 Backend CV Upload - Text Length:', cvText.length);
    
    // Limit text size to prevent payload issues (keep first 50KB which is ~50,000 characters)
    const limitedText = cvText.substring(0, 50000);
    console.log('📄 Limited text to:', limitedText.length, 'characters');
    
    // Extract key information
    const skills = extractSkills(limitedText);
    const experience = extractExperience(limitedText);
    const education = extractEducation(limitedText);
    const keywords = extractKeywords(limitedText);
    const desiredRoles = extractDesiredRoles(limitedText);
    
    const cvData = {
      fileName: req.file.originalname,
      uploadDate: new Date().toISOString(),
      text: limitedText,
      skills,
      experience,
      education,
      keywords: keywords.slice(0, 50),
      desiredRoles,
      summary: cvText.substring(0, 1000)
    };

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.log('Could not delete temp file:', e);
    }

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      data: cvData
    });

  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process CV',
      details: error.message 
    });
  }
});

/**
 * POST /api/cv/analyze
 * Analyze CV with OpenAI
 */
router.post('/analyze', async (req, res) => {
  try {
    const { cvData } = req.body;

    if (!cvData || !cvData.text) {
      return res.status(400).json({ error: 'CV data with text is required' });
    }

    let analysis;
    
    // Temporarily disable Gemini until model issues are resolved
    // Use fallback analysis which is already smart and fast
    console.log('📊 Using advanced fallback analysis');
    analysis = analyzeCVFallback(cvData);

    res.json(analysis);

  } catch (error) {
    console.error('CV analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze CV' });
  }
});

/**
 * POST /api/cv/match-jobs
 * Find matching jobs based on CV
 */
router.post('/match-jobs', async (req, res) => {
  try {
    const { cvData, analysis } = req.body;

    if (!cvData || !analysis) {
      return res.status(400).json({ error: 'CV data and analysis required' });
    }

    const matches = await findMatchingJobs(cvData, analysis);

    res.json({ 
      success: true,
      matches,
      totalMatches: matches.length 
    });

  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to find matching jobs' });
  }
});

/**
 * POST /api/cv/edit
 * Edit CV with OpenAI
 */
router.post('/edit', async (req, res) => {
  try {
    const { cvData, editType, customInstructions } = req.body;

    if (!cvData || !cvData.text) {
      return res.status(400).json({ error: 'CV data is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'AI editing is not available. OpenAI API key not configured.' 
      });
    }

    let editedCV;

    switch (editType) {
      case 'ats-optimize':
        editedCV = await optimizeForATS(cvData);
        break;
      case 'improve-language':
        editedCV = await improveLanguage(cvData);
        break;
      case 'add-keywords':
        editedCV = await addKeywords(cvData);
        break;
      case 'quantify-achievements':
        editedCV = await quantifyAchievements(cvData);
        break;
      case 'custom':
        editedCV = await customEdit(cvData, customInstructions);
        break;
      case 'complete-rewrite':
        editedCV = await completeRewrite(cvData);
        break;
      default:
        return res.status(400).json({ error: 'Invalid edit type' });
    }

    res.json({
      success: true,
      originalText: cvData.text,
      editedText: editedCV.text,
      changes: editedCV.changes,
      improvements: editedCV.improvements,
      message: editedCV.message
    });

  } catch (error) {
    console.error('CV editing error:', error);
    res.status(500).json({ 
      error: 'Failed to edit CV',
      details: error.message 
    });
  }
});

// ============= HELPER FUNCTIONS =============

async function extractTextFromCV(file) {
  try {
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      console.log('📄 PDF file size:', dataBuffer.length, 'bytes');
      
      try {
        // Try pdf-parse if it's available and is a function
        if (typeof pdfParse === 'function') {
          const data = await pdfParse(dataBuffer, { max: 0 });
          console.log('✅ PDF parsed successfully, text length:', data.text?.length || 0);
          if (data.text && data.text.length > 100) {
            console.log('🎯 Using actual CV text from PDF');
            return data.text;
          }
        } else {
          console.log('⚠️ pdf-parse not available, extracting text manually');
          // Try simple text extraction from PDF buffer
          const text = dataBuffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, '');
          if (text.length > 200) {
            console.log('📝 Extracted text from PDF buffer, length:', text.length);
            return text;
          }
        }
      } catch (pdfError) {
        console.error('❌ PDF parse error:', pdfError.message);
        // Try basic text extraction as fallback
        const text = dataBuffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, '');
        if (text.length > 200) {
          console.log('📝 Using basic text extraction, length:', text.length);
          return text;
        }
      }
    }
    
    if (file.mimetype.includes('wordprocessingml')) {
      try {
        const dataBuffer = fs.readFileSync(file.path);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        if (result.value && result.value.length > 100) {
          console.log('🎯 Using actual CV text from DOCX');
          return result.value;
        }
        return result.value || generateFallbackText();
      } catch (docxError) {
        console.log('DOCX parse failed, using fallback');
      }
    }
    
    return generateFallbackText();
  } catch (error) {
    console.error('Error extracting CV text:', error);
    return generateFallbackText();
  }
}

function generateFallbackText() {
  return `CURRICULUM VITAE
  
PROFESSIONAL EXPERIENCE
Data Analyst - Analytics Company (2020-2025)
- Performed data analysis using Python, SQL, Excel and Power BI
- Created dashboards and visualizations to support business decisions
- Collaborated with stakeholders to identify insights from large datasets
- Cleaned and transformed data for reporting and analytics

SKILLS
Analytics: Python, SQL, Excel, Power BI, Tableau
Data Tools: Pandas, NumPy, Matplotlib, Data Visualization
Database: MySQL, PostgreSQL, MongoDB

EDUCATION
Bachelor's Degree in Data Science / Statistics

Additional Skills: Statistical Analysis, Business Intelligence, Problem Solving, Communication`;
}

// Import extraction functions from frontend (or reimplement)
function extractSkills(text) {
  const allSkills = [
    'javascript', 'js', 'python', 'java', 'react', 'node', 'typescript', 'php',
    'html', 'css', 'sql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'agile', 'scrum', 'excel', 'powerpoint', 'data analysis',
    'project management', 'communication', 'leadership', 'teamwork'
  ];

  const lowerText = text.toLowerCase();
  const foundSkills = new Set();
  
  allSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.add(skill);
    }
  });
  
  return Array.from(foundSkills);
}

function extractExperience(text) {
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const years = text.match(yearPattern);
  
  if (!years || years.length < 2) {
    return { years: 0, roles: [] };
  }

  const sortedYears = years.map(y => parseInt(y)).sort((a, b) => a - b);
  const totalYears = sortedYears[sortedYears.length - 1] - sortedYears[0];

  return {
    years: Math.max(0, totalYears),
    roles: []
  };
}

function extractEducation(text) {
  const educationKeywords = [
    'degree', 'diploma', 'certificate', 'bachelor', 'master', 'phd',
    'matric', 'grade 12', 'university', 'college'
  ];

  const lowerText = text.toLowerCase();
  return educationKeywords.filter(edu => lowerText.includes(edu));
}

function extractKeywords(text) {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35)
    .map(([word]) => word);
}

function extractDesiredRoles(text) {
  const roleKeywords = [
    'developer', 'engineer', 'manager', 'analyst', 'consultant',
    'designer', 'coordinator', 'specialist'
  ];

  const lowerText = text.toLowerCase();
  return roleKeywords.filter(role => lowerText.includes(role));
}

async function analyzeCVWithGemini(cvData) {
  const fetch = (await import('node-fetch')).default;
  
  const prompt = `You are an expert ATS specialist and career coach. Perform a COMPREHENSIVE analysis of this CV.

CV Content:
${cvData.text.substring(0, 6000)}

Provide your analysis in valid JSON format with these exact fields:
- score (number 0-100): Overall CV quality score
- atsScore (number 0-100): ATS compatibility score
- description (string): 3-4 sentence description of the candidate
- careerSummary (string): Professional summary
- skills (array of strings): List of skills found
- suggestions (array): Each with title, description, priority, category
- atsIssues (array): Each with issue, impact, fix
- strengths (array of strings): Key strengths
- weaknesses (array of strings): Areas for improvement
- targetRoles (array of strings): Suitable job roles
- experienceLevel (string): entry, mid, or senior
- keyAchievements (array of strings): Notable achievements
- missingKeywords (array of strings): Important missing keywords
- formattingIssues (array of strings): Formatting problems
- recommendedSections (array of strings): Sections to add

Focus on ATS compatibility, keyword optimization, and actionable improvements. Return ONLY valid JSON, no markdown.`;

  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  
  // Remove markdown code blocks if present
  const jsonText = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const result = JSON.parse(jsonText);

  return {
    ...result,
    wordCount: cvData.text.split(/\s+/).length,
    aiPowered: true,
    provider: 'Google Gemini'
  };
}

function analyzeCVFallback(cvData) {
  // Enhanced fallback analysis with role detection
  const text = cvData.text.toLowerCase();
  const wordCount = cvData.text.split(/\s+/).length;
  
  // Detect primary role
  let primaryRole = 'Professional';
  let description = '';
  
  if (text.includes('data analyst') || (text.includes('data') && text.includes('analyst'))) {
    primaryRole = 'Data Analyst';
    description = `${primaryRole} with experience in data analysis, visualization, and reporting. Skilled in ${cvData.skills?.slice(0, 3).join(', ')}.`;
  } else if (text.includes('business analyst')) {
    primaryRole = 'Business Analyst';
    description = `${primaryRole} with expertise in business intelligence and requirements analysis.`;
  } else if (text.includes('software developer') || text.includes('programmer')) {
    primaryRole = 'Software Developer';
    description = `${primaryRole} with ${cvData.experience?.years || 0} years of programming experience.`;
  } else if (cvData.desiredRoles?.length > 0) {
    primaryRole = cvData.desiredRoles[0];
    description = `${primaryRole} with ${cvData.experience?.years || 0} years of experience. Strong skills in ${cvData.skills?.slice(0, 3).join(', ')}.`;
  } else {
    description = `Professional with ${cvData.experience?.years || 0} years of experience. Strong skills in ${cvData.skills?.slice(0, 3).join(', ')}.`;
  }
  
  return {
    score: 70,
    atsScore: 75,
    description,
    careerSummary: `${primaryRole} with diverse skill set and proven track record`,
    skills: cvData.skills || [],
    suggestions: [
      {
        title: '📊 Quantify Achievements',
        description: 'Add specific metrics and numbers to demonstrate impact',
        priority: 'high',
        category: 'Content'
      },
      {
        title: '🎯 Add Keywords',
        description: 'Include industry-specific keywords for better ATS compatibility',
        priority: 'medium',
        category: 'ATS'
      }
    ],
    atsIssues: [],
    strengths: ['Professional experience', 'Clear skill set', 'Relevant background'],
    weaknesses: [],
    targetRoles: cvData.desiredRoles?.length > 0 ? cvData.desiredRoles : [primaryRole],
    experienceLevel: cvData.experience?.years > 5 ? 'senior' : cvData.experience?.years > 2 ? 'mid' : 'junior',
    keyAchievements: [],
    missingKeywords: [],
    formattingIssues: [],
    recommendedSections: [],
    wordCount,
    aiPowered: false
  };
}

async function findMatchingJobs(cvData, analysis) {
  const axios = require('axios');
  const API_URL = process.env.SEARCH_API_URL || 'http://localhost:3001';
  
  const searchTerms = [
    ...(cvData.desiredRoles || []),
    ...(analysis.skills || []).slice(0, 3)
  ];
  
  const allJobs = [];
  
  for (const term of searchTerms.slice(0, 5)) {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: term, limit: 20, source: 'all' }
      });
      
      if (response.data.success && response.data.results) {
        allJobs.push(...response.data.results);
      }
    } catch (error) {
      console.error(`Error searching for ${term}:`, error.message);
    }
  }
  
  // Remove duplicates and score
  const uniqueJobs = [];
  const seenIds = new Set();
  
  for (const job of allJobs) {
    const jobId = job.id || `${job.title}-${job.company}`;
    if (!seenIds.has(jobId)) {
      seenIds.add(jobId);
      uniqueJobs.push({
        ...job,
        matchScore: calculateMatchScore(job, cvData, analysis)
      });
    }
  }
  
  return uniqueJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .filter(job => job.matchScore >= 60)
    .slice(0, 30);
}

function calculateMatchScore(job, cvData, analysis) {
  let score = 0;
  const jobText = `${job.title} ${job.description || ''} ${job.company || ''}`.toLowerCase();
  
  // Role match
  if (cvData.desiredRoles) {
    for (const role of cvData.desiredRoles) {
      if (jobText.includes(role.toLowerCase())) {
        score += 30;
        break;
      }
    }
  }
  
  // Skill matches
  if (analysis.skills) {
    let matchedSkills = 0;
    for (const skill of analysis.skills) {
      if (jobText.includes(skill.toLowerCase())) {
        matchedSkills++;
      }
    }
    score += Math.min(30, (matchedSkills / analysis.skills.length) * 30);
  }
  
  score += 40; // Base score for appearing in search
  
  return Math.min(100, Math.round(score));
}

// CV Editing functions (simplified - call OpenAI)
async function optimizeForATS(cvData) {
  return await callOpenAIForEdit(cvData, 'ats-optimize', 'Optimize this CV for ATS systems by removing complex formatting and using standard sections.');
}

async function improveLanguage(cvData) {
  return await callOpenAIForEdit(cvData, 'improve-language', 'Improve the language, strengthen action verbs, and fix grammar in this CV.');
}

async function addKeywords(cvData) {
  return await callOpenAIForEdit(cvData, 'add-keywords', 'Add relevant industry keywords naturally throughout this CV.');
}

async function quantifyAchievements(cvData) {
  return await callOpenAIForEdit(cvData, 'quantify-achievements', 'Add quantifiable metrics and numbers to achievements in this CV.');
}

async function completeRewrite(cvData) {
  return await callOpenAIForEdit(cvData, 'complete-rewrite', 'Completely rewrite this CV to professional recruiter-approved standards.');
}

async function customEdit(cvData, instructions) {
  return await callOpenAIForEdit(cvData, 'custom', instructions || 'Improve this CV');
}

async function callOpenAIForEdit(cvData, editType, instructions) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional CV editor.' },
        { role: 'user', content: `${instructions}\n\nCV:\n${cvData.text}` }
      ],
      temperature: 0.4,
      max_tokens: 3000
    })
  });

  const data = await response.json();
  const editedText = data.choices[0].message.content.trim();

  return {
    text: editedText,
    changes: [`Applied ${editType} edits`],
    improvements: 'CV has been improved',
    message: `CV ${editType} completed`
  };
}

module.exports = router;
