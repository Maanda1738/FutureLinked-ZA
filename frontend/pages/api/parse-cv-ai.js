/**
 * API Endpoint: Parse CV using AI (Affinda or Gemini)
 * POST /api/parse-cv-ai
 */

import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Parse CV with Affinda API using axios
async function parseWithAffinda(fileBuffer, fileName, apiKey) {
  try {
    
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/pdf'
    });
    form.append('wait', 'true');
    
    // Add workspace if configured
    const workspace = process.env.AFFINDA_WORKSPACE || process.env.NEXT_PUBLIC_AFFINDA_WORKSPACE;
    if (workspace) {
      form.append('workspace', workspace);
      console.log('📁 Using Affinda workspace:', workspace);
    }
    
    console.log('📤 Sending to Affinda API...');
    
    const response = await axios.post('https://api.affinda.com/v3/resumes', form, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      timeout: 30000
    });
    
    console.log('📥 Affinda response status:', response.status);
    
    const data = response.data?.data || response.data;
    
    console.log('✅ Affinda parsed CV:', {
      name: data.name?.raw,
      skillsCount: data.skills?.length,
      experienceCount: data.workExperience?.length
    });
  
    // Transform to our format
    return {
      name: data.name?.raw || '',
      email: data.emails?.[0] || '',
      phone: data.phoneNumbers?.[0] || '',
      summary: data.summary || data.objective || '',
      skills: (data.skills || []).map(s => s.name || s).filter(Boolean),
      experience: {
        years: calculateExperience(data.workExperience),
        roles: (data.workExperience || []).map(job => ({
          title: job.jobTitle || '',
          company: job.organization || '',
          duration: job.dates ? `${job.dates.startDate || ''} - ${job.dates.endDate || 'Present'}` : '',
          description: job.jobDescription || ''
        }))
      },
      education: (data.education || []).map(edu => 
        `${edu.accreditation?.education || ''} at ${edu.organization || ''}`.trim()
      ).filter(Boolean),
      targetRoles: extractTargetRoles(data),
      desiredRoles: extractDesiredRoles(data),
      text: data.rawText || '',
      totalExperience: calculateExperience(data.workExperience),
      currentRole: data.workExperience?.[0]?.jobTitle || '',
      seniorityLevel: determineSeniority(calculateExperience(data.workExperience)),
      fileName: fileName,
      uploadDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Affinda parsing exception:', error.message);
    throw error;
  }
}

function calculateExperience(workExperience) {
  if (!workExperience || !Array.isArray(workExperience)) return 0;
  
  let totalMonths = 0;
  workExperience.forEach(job => {
    if (job.dates?.startDate) {
      const start = new Date(job.dates.startDate);
      const end = job.dates?.endDate ? new Date(job.dates.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    }
  });
  
  return Math.round(totalMonths / 12);
}

function extractTargetRoles(data) {
  const roles = [];
  
  // From objective
  if (data.objective) {
    const obj = data.objective.toLowerCase();
    if (obj.includes('seeking') || obj.includes('looking for') || obj.includes('aspiring')) {
      roles.push(data.objective.substring(0, 100));
    }
  }
  
  // From recent job titles
  if (data.workExperience && data.workExperience.length > 0) {
    const recentJob = data.workExperience[0].jobTitle;
    if (recentJob) roles.push(recentJob);
  }
  
  return roles.filter(Boolean).slice(0, 5);
}

function extractDesiredRoles(data) {
  const roles = [];
  
  if (data.workExperience) {
    data.workExperience.slice(0, 3).forEach(job => {
      if (job.jobTitle) roles.push(job.jobTitle);
    });
  }
  
  return [...new Set(roles)];
}

function determineSeniority(years) {
  if (years === 0) return 'entry';
  if (years < 2) return 'junior';
  if (years < 5) return 'mid';
  if (years < 10) return 'senior';
  return 'expert';
}

// Analyze CV with Gemini
async function analyzeCV(cvData, geminiKey) {
  if (!geminiKey) {
    return {
      score: 75,
      atsScore: 70,
      description: cvData.summary || 'Professional candidate',
      targetRoles: cvData.targetRoles || [],
      recommendedSearchTerms: cvData.targetRoles || [],
      experienceLevel: cvData.seniorityLevel
    };
  }
  
  try {
    const analysisPrompt = `Analyze this CV and provide job search recommendations.

CV: ${JSON.stringify(cvData, null, 2).substring(0, 2000)}

Return ONLY valid JSON:
{
  "score": 75,
  "atsScore": 70,
  "description": "Brief description",
  "targetRoles": ["Specific job titles to search for"],
  "recommendedSearchTerms": ["Best search terms for job boards"],
  "experienceLevel": "entry/junior/mid/senior"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: analysisPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      }
    );
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    const jsonText = jsonStart !== -1 ? cleanText.substring(jsonStart, jsonEnd + 1) : cleanText;
    
    return JSON.parse(jsonText);
  } catch (e) {
    console.warn('Analysis failed, using defaults:', e.message);
    return {
      score: 75,
      atsScore: 70,
      description: cvData.summary || 'Professional candidate',
      targetRoles: cvData.targetRoles || [],
      recommendedSearchTerms: cvData.targetRoles || [],
      experienceLevel: cvData.seniorityLevel
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileName, fileType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'File data is required' });
    }

    // Try Affinda first (more reliable for CVs)
    const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY || process.env.NEXT_PUBLIC_AFFINDA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    console.log('🤖 Parsing CV:', fileName, '| Methods available:', {
      affinda: !!AFFINDA_API_KEY,
      gemini: !!GEMINI_API_KEY
    });
    
    // Extract base64 data from the data URL
    const dataUrlParts = fileData.split(',');
    const base64String = dataUrlParts[1];
    const mimeTypePart = dataUrlParts[0];
    const fileMimeType = mimeTypePart.split(':')[1].split(';')[0];
    const fileBuffer = Buffer.from(base64String, 'base64');
    
    console.log('📄 File info:', { fileName, mimeType: fileMimeType, size: fileBuffer.length });
    
    if (fileBuffer.length < 100) {
      throw new Error('Invalid file data - file may be empty or corrupted');
    }

    // Try Affinda first (professional CV parser)
    if (AFFINDA_API_KEY) {
      try {
        console.log('🔧 Using Affinda API for CV parsing...');
        const cvData = await parseWithAffinda(fileBuffer, fileName, AFFINDA_API_KEY);
        
        // Get AI analysis
        const analysis = await analyzeCV(cvData, GEMINI_API_KEY);
        
        return res.status(200).json({
          cvData,
          analysis,
          aiPowered: true,
          parser: 'affinda'
        });
      } catch (affindaError) {
        console.warn('⚠️ Affinda parsing failed, falling back to Gemini:', affindaError.message);
      }
    }
    
    // Fallback to Gemini
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'No CV parsing service configured' });
    }

    console.log('🤖 Using Gemini AI to parse CV:', fileName);
    
    console.log('📄 Using Gemini with file size:', base64String?.length);
    
    if (!base64String || base64String.length < 100) {
      throw new Error('Invalid file data - file may be empty or corrupted');
    }

    // Call Gemini AI with file data
    const prompt = `Read this CV/Resume document and extract the information into JSON format.

WHAT TO EXTRACT:
1. NAME - person's full name from top of CV
2. CONTACT - email and phone number
3. SKILLS - every skill mentioned anywhere in the CV (technical skills, soft skills, software, tools, languages)
4. OBJECTIVE/GOAL - what job(s) they want (look for "seeking", "aspiring to", "looking for", "career objective")
5. WORK HISTORY - job titles, companies, dates
6. EDUCATION - degrees, diplomas, certifications

Return ONLY this JSON (no explanations, no markdown):
{
  "name": "Person's actual name",
  "email": "their email",
  "phone": "their phone",
  "summary": "Brief description of this person",
  "skills": ["skill1", "skill2", "skill3", "etc"],
  "experience": {
    "years": 0,
    "roles": [{"title": "Job Title", "company": "Company", "duration": "dates"}]
  },
  "education": ["qualification 1", "qualification 2"],
  "targetRoles": ["Specific job title they want", "Alternative job title"],
  "desiredRoles": ["Related job title 1", "Related job title 2"],
  "text": "Full text from CV",
  "totalExperience": 0,
  "currentRole": "Most recent job title",
  "seniorityLevel": "entry or junior or mid or senior"
}

IMPORTANT: 
- Extract EXACT job titles from their objective/career goal section
- List ALL skills mentioned (software, technical, soft skills)
- If they say "Junior Data Analyst" write "Junior Data Analyst" not "Data Analyst"
- If no objective section, infer target roles from their experience and skills

Extract the data now:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: fileMimeType,
                    data: base64String
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
            topP: 1,
            topK: 32
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('📥 Gemini API response structure:', {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length,
      hasFinishReason: data.candidates?.[0]?.finishReason,
      safetyRatings: data.candidates?.[0]?.safetyRatings?.map(r => r.category)
    });
    
    let textResponse;
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      textResponse = data.candidates[0].content.parts[0].text;
    } else {
      console.error('❌ Unexpected Gemini response:', JSON.stringify(data, null, 2).substring(0, 1000));
      throw new Error('Gemini did not return text - file may be unreadable or blocked by safety filters');
    }

    console.log('📄 Gemini raw response length:', textResponse.length);
    console.log('📄 Gemini response preview:', textResponse.substring(0, 500));

    // Clean and parse JSON
    let jsonText = textResponse.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Find JSON object boundaries if there's extra text
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
    }
    
    let cvData;
    try {
      cvData = JSON.parse(jsonText);
      console.log('✅ Successfully parsed CV JSON');
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('❌ Failed JSON (first 1000 chars):', jsonText.substring(0, 1000));
      throw new Error(`AI returned invalid JSON: ${parseError.message}`);
    }

    // Ensure required fields
    cvData.fileName = fileName;
    cvData.uploadDate = new Date().toISOString();
    
    console.log('✅ Gemini extracted CV data:', {
      name: cvData.name,
      currentRole: cvData.currentRole,
      seniorityLevel: cvData.seniorityLevel,
      totalExperience: cvData.totalExperience,
      skillsCount: cvData.skills?.length,
      skills: cvData.skills,
      targetRolesCount: cvData.targetRoles?.length,
      targetRoles: cvData.targetRoles,
      desiredRoles: cvData.desiredRoles,
      summary: cvData.summary?.substring(0, 100),
      hasText: !!cvData.text,
      textLength: cvData.text?.length
    });
    
    // Validate extraction
    if (!cvData.name || cvData.name.includes('Extract') || cvData.name.includes('Full name')) {
      console.error('❌ PARSING FAILED: Gemini did not extract name properly');
      console.error('   This usually means the PDF is unreadable or the format is not supported');
    }
    if (!cvData.skills || cvData.skills.length === 0) {
      console.error('❌ PARSING FAILED: No skills extracted');
    }
    if (!cvData.targetRoles || cvData.targetRoles.length === 0 || cvData.targetRoles[0].includes('SPECIFIC')) {
      console.error('❌ PARSING FAILED: No target roles extracted');
      console.error('   Check if CV has an OBJECTIVE or CAREER GOAL section');
    }

    // Now analyze the CV for suggestions
    const analysisPrompt = `You are an expert ATS specialist and career advisor analyzing a CV.

CV EXTRACTED DATA:
${JSON.stringify(cvData, null, 2).substring(0, 2500)}

ANALYSIS TASK:
1. Read the candidate's targetRoles, skills, experience, and summary
2. Identify the SPECIFIC job titles they should search for on job boards
3. Create search terms that will find relevant jobs on platforms like Adzuna, Indeed, LinkedIn
4. Consider South African job market terminology

Return ONLY valid JSON:
{
  "score": 75,
  "atsScore": 70,
  "description": "2 sentence description of who this candidate is and what they're seeking",
  "careerSummary": "Professional summary for their profile",
  "suggestions": [
    {"title": "Improve CV", "description": "Specific suggestion", "priority": "high", "category": "ATS"}
  ],
  "atsIssues": [
    {"issue": "Problem found", "impact": "How it affects ATS", "fix": "How to fix it"}
  ],
  "strengths": ["What they do well", "Their strong points"],
  "weaknesses": ["What needs improvement"],
  "targetRoles": [
    "Use EXACT job titles from their CV targetRoles field",
    "If they want 'Data Analyst', write 'Data Analyst'",
    "Include variations like 'Junior Data Analyst', 'Entry Level Data Analyst'",
    "Include 3-6 specific job titles"
  ],
  "experienceLevel": "entry/junior/mid/senior",
  "recommendedSearchTerms": [
    "Best keywords to search on job boards",
    "Include the specific role name",
    "Include related role variations",
    "These will be used for Adzuna API searches"
  ]
}

IMPORTANT: 
- If CV targetRoles has ["Data Analyst"], your targetRoles should be ["Data Analyst", "Junior Data Analyst", "Business Analyst"]
- recommendedSearchTerms should be practical job board searches like "Data Analyst", "Junior Analyst", "Business Intelligence"
- Don't use generic terms like "Entry Level" unless that's their actual target`;

    const analysisResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: analysisPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      }
    );

    let analysis = {
      score: 75,
      atsScore: 70,
      description: cvData.summary || 'Professional candidate',
      suggestions: [],
      targetRoles: cvData.targetRoles || cvData.desiredRoles || []
    };

    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      const analysisText = analysisData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanAnalysis = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      try {
        const parsedAnalysis = JSON.parse(cleanAnalysis);
        analysis = { ...analysis, ...parsedAnalysis };
      } catch (e) {
        console.warn('⚠️ Could not parse analysis, using defaults');
      }
    }

    return res.status(200).json({
      cvData,
      analysis,
      aiPowered: true
    });

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    return res.status(500).json({ 
      error: 'Failed to parse CV',
      message: error.message 
    });
  }
}
