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
    const prompt = `You are an expert CV/Resume parser. Analyze this CV document and extract ALL information in valid JSON format.

CRITICAL: Return ONLY valid JSON, no markdown code blocks, no explanations.

Extract and return this exact JSON structure:
{
  "name": "Full name of the candidate",
  "email": "email@example.com",
  "phone": "+27 XXX XXX XXXX",
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": {
    "years": <total years of experience as number>,
    "roles": [
      {"title": "Job Title", "company": "Company Name", "duration": "Jan 2020 - Dec 2022", "description": "What they did"}
    ]
  },
  "education": ["Degree/Qualification at Institution", "Another qualification"],
  "targetRoles": ["Specific job title they're seeking", "Another target role"],
  "desiredRoles": ["Role1", "Role2", "Role3"],
  "text": "Full extracted text from CV (first 3000 characters)",
  "totalExperience": <years as number>
}

Be specific about job titles they want (look in objective/summary). Extract ALL skills mentioned. Include complete work history.`;

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

    console.log('📄 Gemini response (first 200 chars):', textResponse.substring(0, 200));

    // Clean and parse JSON
    let jsonText = textResponse.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let cvData;
    try {
      cvData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', jsonText.substring(0, 500));
      throw new Error('AI returned invalid JSON');
    }

    // Ensure required fields
    cvData.fileName = fileName;
    cvData.uploadDate = new Date().toISOString();
    
    console.log('✅ Parsed CV data:', {
      name: cvData.name,
      skills: cvData.skills?.length,
      experience: cvData.experience?.years,
      targetRoles: cvData.targetRoles?.length
    });

    // Now analyze the CV for suggestions
    const analysisPrompt = `You are an ATS specialist. Analyze this CV and provide improvement suggestions.

CV Data: ${JSON.stringify(cvData).substring(0, 2000)}

Return valid JSON with:
{
  "score": <0-100>,
  "atsScore": <0-100>,
  "description": "Who this candidate is and their background",
  "careerSummary": "Professional summary",
  "suggestions": [
    {"title": "Suggestion", "description": "Details", "priority": "high/medium/low", "category": "ATS/Content/Format"}
  ],
  "atsIssues": [
    {"issue": "Problem", "impact": "Impact on ATS", "fix": "How to fix"}
  ],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "targetRoles": ["role1", "role2"],
  "experienceLevel": "entry/mid/senior"
}`;

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
