/**
 * API Endpoint: Parse CV using Gemini AI
 * POST /api/parse-cv-ai
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileName, fileType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'File data is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    console.log('🤖 Using Gemini AI to parse CV:', fileName);

    // Extract base64 data
    const base64Data = fileData.split(',')[1];
    const mimeType = fileData.split(':')[1].split(';')[0];

    // Call Gemini AI with file data
    const prompt = `You are an expert CV/Resume parser with deep understanding of South African job market and CV formats.

TASK: Extract structured data from this CV/Resume document.

CRITICAL PARSING RULES:
1. READ THE ENTIRE DOCUMENT carefully - don't miss any sections
2. OBJECTIVE/CAREER GOAL section is the MOST important - this tells you what jobs they want
3. SKILLS section - extract EVERY skill mentioned (technical, software, soft skills, languages, certifications)
4. WORK EXPERIENCE - note job titles, companies, dates, responsibilities
5. EDUCATION - all qualifications and institutions
6. Look for keywords like "seeking", "looking for", "aspiring", "interested in" to identify target roles
7. If CV mentions specific software (Excel, Python, SQL, Photoshop, etc.) - those are skills
8. If CV mentions "Junior X" or "Entry-level X" or "Graduate X" - they want those specific roles

RESPONSE FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations):

{
  "name": "Extract full name from CV",
  "email": "Extract email address",
  "phone": "Extract phone number with country code",
  "summary": "Write 2-3 sentence summary of who they are and what they want",
  "skills": [
    "List EVERY skill mentioned in CV",
    "Include technical skills (software, tools, languages)",
    "Include soft skills (communication, leadership, etc.)",
    "Include certifications and qualifications",
    "Minimum 5 skills, ideally 10-20 skills"
  ],
  "experience": {
    "years": 0,
    "roles": [
      {"title": "Most recent job title", "company": "Company name", "duration": "Start - End dates", "description": "Brief description"}
    ]
  },
  "education": ["Degree/Diploma/Matric at Institution name"],
  "targetRoles": [
    "EXACT job titles they're seeking (from objective/summary)",
    "Look for phrases like 'seeking X position', 'aspiring X', 'looking for X role'",
    "If they say 'Junior Data Analyst' - write exactly that",
    "If they say 'Entry Level Developer' - write exactly that",
    "Include 2-5 specific job titles"
  ],
  "desiredRoles": [
    "Similar/related job titles that match their skills",
    "Alternative titles in same field"
  ],
  "text": "Copy first 3000 characters of CV text exactly as written",
  "totalExperience": 0,
  "currentRole": "Their most recent/current job title",
  "seniorityLevel": "entry/junior/mid/senior"
}

EXAMPLES OF GOOD EXTRACTION:
- If CV says "Seeking Data Analyst position" → targetRoles: ["Data Analyst", "Junior Data Analyst", "Business Analyst"]
- If CV mentions "Excel, PowerBI, SQL" → skills: ["Microsoft Excel", "Power BI", "SQL", ...]
- If CV says "Entry-level Marketing" → targetRoles: ["Entry Level Marketing", "Marketing Assistant", "Junior Marketing Coordinator"]

NOW PARSE THE CV DOCUMENT AND RETURN ONLY THE JSON:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: prompt
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    let textResponse;
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      textResponse = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid Gemini API response structure');
    }

    console.log('📄 Gemini raw response length:', textResponse.length);
    console.log('📄 Gemini response preview:', textResponse.substring(0, 300));

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
      skills: cvData.skills,
      targetRoles: cvData.targetRoles,
      desiredRoles: cvData.desiredRoles,
      summary: cvData.summary?.substring(0, 100)
    });

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
