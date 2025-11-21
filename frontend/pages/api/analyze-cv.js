/**
 * API Endpoint: Analyze CV and provide improvement suggestions using OpenAI
 * POST /api/analyze-cv
 */

// Increase body size limit to 2MB for large CVs
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cvData } = req.body;

    if (!cvData) {
      return res.status(400).json({ error: 'CV data is required' });
    }

    // Build text from cvData for analysis
    const cvText = cvData.text || cvData.summary || 
      `Skills: ${cvData.skills?.join(', ') || ''}\nExperience: ${cvData.experience?.years || 0} years\nEducation: ${cvData.education?.join(', ') || ''}\nKeywords: ${cvData.keywords?.join(', ') || ''}`;

    if (!cvText || cvText.length < 10) {
      return res.status(400).json({ error: 'Could not extract text from CV data' });
    }

    // Create a compatible cvData object for the analysis functions
    const cvDataForAnalysis = {
      ...cvData,
      text: cvText
    };

    // Try Google Gemini analysis first, fallback to rule-based
    let analysis;
    
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) {
      try {
        console.log('🤖 Using AI-powered CV analysis with Gemini');
        analysis = await analyzeCVWithGemini(cvDataForAnalysis);
      } catch (error) {
        console.warn('⚠️ Gemini analysis failed, using rule-based fallback:', error.message);
        analysis = analyzeCVContent(cvDataForAnalysis);
      }
    } else {
      console.log('📊 Using rule-based analysis (Gemini API key not configured)');
      analysis = analyzeCVContent(cvDataForAnalysis);
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('CV analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze CV' });
  }
}

async function analyzeCVWithGemini(cvData) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  const prompt = `You are an expert ATS (Applicant Tracking System) specialist and senior career coach. Perform a COMPREHENSIVE analysis of this CV.

CV Content:
${cvData.text.substring(0, 6000)}

Provide your analysis in valid JSON format with these exact fields:
{
  "score": <number between 0-100 representing ATS compatibility>,
  "atsScore": <number between 0-100 for ATS readability>,
  "description": "A detailed 3-4 sentence description of who this candidate is, their background, key strengths, and career focus",
  "careerSummary": "Professional summary of the candidate's experience and expertise",
  "skills": ["skill1", "skill2", ...],
  "suggestions": [
    {"title": "Suggestion Title", "description": "Detailed explanation", "priority": "high/medium/low", "category": "ATS/Content/Format"},
    ...
  ],
  "atsIssues": [
    {"issue": "Issue description", "impact": "How this affects ATS", "fix": "How to fix it"},
    ...
  ],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "targetRoles": ["role1", "role2", ...],
  "experienceLevel": "entry/mid/senior",
  "keyAchievements": ["achievement1", "achievement2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "formattingIssues": ["issue1", "issue2", ...],
  "recommendedSections": ["section1", "section2", ...]
}

Analyze comprehensively:
1. **CAREER GOALS**: Read the CV summary/objective carefully. What specific job role is this person seeking? Extract exact job titles they want (e.g., "Junior Data Analyst", "Software Developer", "Graphic Designer"). Look at their skills, education, and experience to infer their career direction.
2. **SENIORITY LEVEL**: Determine if they're entry-level/junior (0-2 years), mid-level (3-5 years), or senior (6+ years). Look for keywords like "junior", "graduate", "entry-level", "intern" in their objective.
3. **TARGET ROLES**: List 3-5 specific job titles this person should apply for based on their CV. Be specific (e.g., "Junior Data Analyst" not just "Analyst").
4. **ATS COMPATIBILITY**: Check if CV can be parsed by ATS systems (no tables, images, headers/footers issues)
5. **CONTENT DESCRIPTION**: Describe who this candidate is and what they bring
3. **KEYWORD OPTIMIZATION**: Identify missing industry keywords and suggest additions
4. **FORMAT & STRUCTURE**: Check for proper sections, bullet points, date formats
5. **QUANTIFIABLE ACHIEVEMENTS**: Look for measurable results and impact
6. **SKILLS GAPS**: Identify missing essential skills for target roles
7. **LANGUAGE & TONE**: Check for action verbs, active voice, professional language
8. **LENGTH & CLARITY**: Assess if CV is concise yet comprehensive

Return ONLY valid JSON, no markdown code blocks. Be specific, actionable, and prioritize ATS optimization. Provide 5-8 suggestions.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
  
  // Extract text from Gemini response
  let textResponse;
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    textResponse = data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Invalid Gemini API response structure');
  }
  
  // Remove markdown code blocks if present
  const jsonText = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  let result;
  try {
    result = JSON.parse(jsonText);
  } catch (parseError) {
    console.error('Failed to parse Gemini JSON response:', jsonText.substring(0, 500));
    throw new Error('Invalid JSON from AI analysis');
  }

  return {
    score: result.score || 70,
    atsScore: result.atsScore || result.score || 70,
    description: result.description || 'Professional candidate with relevant experience',
    careerSummary: result.careerSummary || '',
    suggestions: result.suggestions || [],
    atsIssues: result.atsIssues || [],
    skills: result.skills || [],
    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    targetRoles: result.targetRoles || [],
    experienceLevel: result.experienceLevel || 'mid',
    keyAchievements: result.keyAchievements || [],
    missingKeywords: result.missingKeywords || [],
    formattingIssues: result.formattingIssues || [],
    recommendedSections: result.recommendedSections || [],
    wordCount: cvData.text.split(/\s+/).length,
    aiPowered: true
  };
}

function analyzeCVContent(cvData) {
  const text = cvData.text.toLowerCase();
  const originalText = cvData.text;
  const wordCount = cvData.text.split(/\s+/).length;
  
  let score = 70; // Base score
  let atsScore = 75; // ATS compatibility score
  const suggestions = [];
  const atsIssues = [];
  const detectedSkills = [];
  const formattingIssues = [];
  const missingKeywords = [];
  
  // Generate CV description
  const description = generateCVDescription(cvData, originalText);
  const careerSummary = extractCareerSummary(originalText);

  // Extract skills from CV
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
    'communication', 'leadership', 'teamwork', 'project management', 'problem solving',
    'data analysis', 'excel', 'powerpoint', 'microsoft office', 'salesforce',
    'marketing', 'social media', 'seo', 'content writing', 'customer service',
    'accounting', 'finance', 'budgeting', 'engineering', 'design', 'research'
  ];

  skillKeywords.forEach(skill => {
    if (text.includes(skill)) {
      detectedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      score += 2;
    }
  });

  // Check for contact information
  const hasEmailOld = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cvData.text);
  const hasPhoneOld = /(\+27|0)[0-9]{9,10}/.test(cvData.text);
  
  if (!hasEmailOld) {
    suggestions.push({
      title: 'Add Email Address',
      description: 'Include a professional email address to make it easy for recruiters to contact you.'
    });
    score -= 5;
  } else {
    score += 3;
  }

  if (!hasPhoneOld) {
    suggestions.push({
      title: 'Add Phone Number',
      description: 'Include your phone number with country code (e.g., +27 for South Africa).'
    });
    score -= 5;
  } else {
    score += 3;
  }

  // Check for professional summary/objective
  const hasSummary = text.includes('summary') || text.includes('objective') || text.includes('profile');
  if (!hasSummary) {
    suggestions.push({
      title: 'Add Professional Summary',
      description: 'Include a compelling 2-3 sentence summary at the top highlighting your key skills and career goals.'
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Check for work experience
  const hasExperience = text.includes('experience') || text.includes('employment') || text.includes('work history');
  if (!hasExperience) {
    suggestions.push({
      title: 'Detail Your Work Experience',
      description: 'Add a work experience section with job titles, companies, dates, and key achievements.'
    });
    score -= 10;
  } else {
    score += 5;
  }

  // Check for education
  const hasEducation = text.includes('education') || text.includes('qualification') || text.includes('degree');
  if (!hasEducation) {
    suggestions.push({
      title: 'Include Education Details',
      description: 'Add your educational qualifications including institution names, degrees, and graduation dates.'
    });
    score -= 8;
  } else {
    score += 5;
  }

  // Check for achievements/quantifiable results
  const hasNumbers = /\d+%|\d+\s*(people|clients|projects|users|revenue|sales)/.test(text);
  if (!hasNumbers) {
    suggestions.push({
      title: 'Use Quantifiable Achievements',
      description: 'Add numbers and metrics to your achievements (e.g., "Increased sales by 30%" or "Managed team of 10").'
    });
    score -= 5;
  } else {
    score += 7;
  }

  // Check CV length
  if (wordCount < 200) {
    suggestions.push({
      title: 'Expand Your CV Content',
      description: 'Your CV is too short. Aim for 300-600 words with detailed descriptions of your experience and skills.'
    });
    score -= 10;
  } else if (wordCount > 1000) {
    suggestions.push({
      title: 'Make Your CV More Concise',
      description: 'Your CV is too long. Focus on the most relevant information and keep it to 1-2 pages.'
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Check for skills section
  const hasSkillsSection = text.includes('skills') || text.includes('competencies') || text.includes('expertise');
  if (!hasSkillsSection) {
    suggestions.push({
      title: 'Add a Skills Section',
      description: 'Create a dedicated skills section listing your technical and soft skills relevant to your target role.'
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Check for keywords
  if (detectedSkills.length < 5) {
    suggestions.push({
      title: 'Include More Industry Keywords',
      description: 'Add relevant industry-specific keywords and skills that match job descriptions in your field.'
    });
    score -= 5;
  } else if (detectedSkills.length > 15) {
    score += 5;
  }

  // Check for action verbs
  const actionVerbs = ['achieved', 'managed', 'developed', 'created', 'improved', 'increased', 
                       'designed', 'implemented', 'led', 'coordinated', 'analyzed'];
  const hasActionVerbs = actionVerbs.some(verb => text.includes(verb));
  if (!hasActionVerbs) {
    suggestions.push({
      title: 'Use Strong Action Verbs',
      description: 'Start bullet points with powerful action verbs like "Achieved", "Managed", "Developed", "Led".'
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Add formatting suggestion if no specific sections found
  if (!hasSummary && !hasExperience && !hasEducation) {
    suggestions.push({
      title: 'Structure Your CV Properly',
      description: 'Organize your CV with clear sections: Contact Info, Summary, Experience, Education, Skills.'
    });
    score -= 10;
  }

  // === ATS COMPATIBILITY CHECKS ===
  
  // Check for tables (ATS struggles with these)
  if (originalText.includes('|') || /\t{2,}/.test(originalText)) {
    atsIssues.push({
      issue: 'Tables or complex formatting detected',
      impact: 'ATS systems cannot read tables properly, causing data loss',
      fix: 'Convert tables to simple bullet points or text lists'
    });
    atsScore -= 15;
    formattingIssues.push('Remove tables and use bullet points instead');
  }
  
  // Check for headers/footers indicators
  if (text.includes('page ') || /\d+\s*\/\s*\d+/.test(text)) {
    atsIssues.push({
      issue: 'Page numbers or headers detected',
      impact: 'ATS may parse these as content, causing confusion',
      fix: 'Remove headers, footers, and page numbers'
    });
    atsScore -= 5;
  }
  
  // Check for special characters that break ATS
  if (/[①②③④⑤●○■□▪▫★☆]/.test(originalText)) {
    atsIssues.push({
      issue: 'Special symbols or unicode characters found',
      impact: 'ATS cannot parse special symbols, may skip sections',
      fix: 'Use standard bullet points (• or -) instead of special symbols'
    });
    atsScore -= 10;
    formattingIssues.push('Replace special symbols with standard bullets');
  }
  
  // Check for proper section headers
  const requiredSections = ['experience', 'education', 'skills'];
  const missingSections = requiredSections.filter(section => !text.includes(section));
  if (missingSections.length > 0) {
    atsIssues.push({
      issue: `Missing key sections: ${missingSections.join(', ')}`,
      impact: 'ATS looks for standard sections to categorize information',
      fix: `Add clear section headers: ${missingSections.map(s => s.toUpperCase()).join(', ')}`
    });
    atsScore -= (missingSections.length * 5);
  }
  
  // Check for contact information
  const hasEmailATS = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(originalText);
  const hasPhoneATS = /(\+27|0)[0-9]{9,10}|\(\d{3}\)\s*\d{3}-?\d{4}/.test(originalText);
  
  if (!hasEmailATS && !hasPhoneATS) {
    atsIssues.push({
      issue: 'Missing contact information',
      impact: 'Recruiters cannot contact you even if ATS ranks you high',
      fix: 'Add email and phone number at the top of your CV'
    });
    atsScore -= 20;
  }
  
  // Check for proper date formatting
  const hasStandardDates = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|\d{4}\s*-\s*\d{4}|\d{2}\/\d{4}/.test(originalText);
  if (!hasStandardDates && text.includes('experience')) {
    atsIssues.push({
      issue: 'Inconsistent or missing date formats',
      impact: 'ATS cannot parse experience timeline properly',
      fix: 'Use standard formats: "Jan 2020 - Dec 2023" or "2020-2023"'
    });
    atsScore -= 5;
  }
  
  // Check for keyword density
  const keywordDensity = detectedSkills.length / wordCount * 100;
  if (keywordDensity < 2) {
    atsIssues.push({
      issue: 'Low keyword density',
      impact: 'ATS ranks CVs based on keyword matches. Your CV may rank low',
      fix: 'Add more relevant industry keywords and skills throughout your CV'
    });
    atsScore -= 10;
    missingKeywords.push('Add more industry-specific keywords', 'Include technical skills', 'Add soft skills');
  }
  
  // Check for file name issues (if available)
  if (cvData.fileName && (cvData.fileName.includes('cv') || cvData.fileName.includes('resume'))) {
    suggestions.push({
      title: '✅ Good File Name',
      description: 'Your CV has a clear file name. Consider using: FirstName_LastName_CV.pdf',
      priority: 'low',
      category: 'ATS'
    });
  }
  
  // Ensure scores are within bounds
  score = Math.max(20, Math.min(100, score));
  atsScore = Math.max(20, Math.min(100, atsScore));
  
  // Add ATS issues as high-priority suggestions
  atsIssues.forEach(issue => {
    suggestions.unshift({
      title: `🚨 ATS Issue: ${issue.issue}`,
      description: `${issue.impact} → ${issue.fix}`,
      priority: 'high',
      category: 'ATS'
    });
  });

  // If score is good but no suggestions, add positive reinforcement
  if (suggestions.length === 0) {
    suggestions.push({
      title: '✅ Great Job!',
      description: 'Your CV is well-structured and ATS-friendly. Consider tailoring it for each job application for even better results.',
      priority: 'low',
      category: 'Content'
    });
  }

  return {
    score: Math.round(score),
    atsScore: Math.round(atsScore),
    description,
    careerSummary,
    suggestions: suggestions.slice(0, 8), // Top 8 suggestions
    atsIssues: atsIssues.slice(0, 5),
    skills: [...new Set(detectedSkills)].slice(0, 20), // Unique skills, max 20
    strengths: identifyStrengths(cvData, detectedSkills.length, score),
    weaknesses: identifyWeaknesses(atsScore, atsIssues.length, wordCount),
    missingKeywords: [...new Set(missingKeywords)].slice(0, 10),
    formattingIssues: [...new Set(formattingIssues)],
    recommendedSections: missingSections.map(s => s.toUpperCase()),
    wordCount,
    aiPowered: false
  };
}

function identifyStrengths(cvData, skillCount, score) {
  const strengths = [];
  const text = cvData.text.toLowerCase();

  if (skillCount >= 10) {
    strengths.push('Comprehensive skills list');
  }

  if (text.includes('experience') && text.split('experience')[1]?.length > 200) {
    strengths.push('Detailed work experience');
  }

  if (score >= 80) {
    strengths.push('Well-structured format');
  }

  if (/\d+%|\d+\s*(people|clients|projects)/.test(text)) {
    strengths.push('Quantifiable achievements');
  }
  
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cvData.text)) {
    strengths.push('Clear contact information');
  }
  
  if (text.includes('achieved') || text.includes('led') || text.includes('managed')) {
    strengths.push('Strong action verbs');
  }

  return strengths;
}

function identifyWeaknesses(atsScore, issuesCount, wordCount) {
  const weaknesses = [];
  
  if (atsScore < 60) {
    weaknesses.push('Poor ATS compatibility - needs formatting fixes');
  }
  
  if (issuesCount > 3) {
    weaknesses.push('Multiple formatting issues that block ATS parsing');
  }
  
  if (wordCount < 200) {
    weaknesses.push('CV is too brief - needs more detail');
  }
  
  if (wordCount > 1200) {
    weaknesses.push('CV is too long - should be more concise');
  }
  
  return weaknesses;
}

function generateCVDescription(cvData, text) {
  const skills = cvData.skills || [];
  const experience = cvData.experience?.years || 0;
  const roles = cvData.experience?.roles || [];
  const education = cvData.education || [];
  
  let description = '';
  
  // Identify candidate level
  const level = experience >= 7 ? 'Senior' : experience >= 3 ? 'Mid-level' : 'Entry-level';
  
  // Identify primary field with priority-based detection
  const lowerText = text.toLowerCase();
  let field = 'professional';
  
  // Priority 1: Specific data/analytics roles (most specific first)
  if (lowerText.includes('data analyst') || lowerText.includes('data analysis') || 
      lowerText.includes('data-analyst') || lowerText.includes('dataanalyst') ||
      (lowerText.includes('analyst') && (lowerText.includes('data') || lowerText.includes('analytics')))) {
    field = 'Data Analyst';
  } 
  // Check for data analyst by tools/skills (if they use these tools, likely a data analyst)
  else if ((lowerText.includes('excel') || lowerText.includes('power bi') || lowerText.includes('tableau') || 
            lowerText.includes('sql') || lowerText.includes('powerbi') || lowerText.includes('data visualization')) &&
           (lowerText.includes('analysis') || lowerText.includes('analyst') || lowerText.includes('reporting') ||
            lowerText.includes('dashboard') || lowerText.includes('analytics'))) {
    field = 'Data Analyst';
  }
  else if (lowerText.includes('data scientist') || lowerText.includes('data science') ||
      lowerText.includes('data-scientist') || lowerText.includes('datascientist')) {
    field = 'Data Scientist';
  } else if (lowerText.includes('business analyst') || lowerText.includes('business analysis') ||
      lowerText.includes('business-analyst') || lowerText.includes('businessanalyst')) {
    field = 'Business Analyst';
  } else if (lowerText.includes('financial analyst') || lowerText.includes('financial analysis') ||
      lowerText.includes('financial-analyst') || lowerText.includes('financialanalyst')) {
    field = 'Financial Analyst';
  } else if (lowerText.includes('business intelligence') || lowerText.includes('bi analyst') ||
      lowerText.includes('bi-analyst') || lowerText.includes('bi ')) {
    field = 'Business Intelligence Analyst';
  }
  // Priority 2: Development roles
  else if (lowerText.includes('software engineer') || lowerText.includes('software developer')) {
    field = 'Software Developer';
  } else if (lowerText.includes('web developer') || lowerText.includes('frontend') || lowerText.includes('backend')) {
    field = 'Web Developer';
  } else if (lowerText.includes('full stack') || lowerText.includes('fullstack')) {
    field = 'Full Stack Developer';
  }
  // Priority 3: Other IT roles
  else if (lowerText.includes('devops') || lowerText.includes('site reliability')) {
    field = 'DevOps Engineer';
  } else if (lowerText.includes('system administrator') || lowerText.includes('sysadmin')) {
    field = 'System Administrator';
  } else if (lowerText.includes('network engineer') || lowerText.includes('network administrator')) {
    field = 'Network Engineer';
  }
  // Priority 4: Marketing & Sales
  else if (lowerText.includes('digital marketing') || lowerText.includes('digital marketer')) {
    field = 'Digital Marketing Specialist';
  } else if (lowerText.includes('marketing') || lowerText.includes('social media')) {
    field = 'Marketing Professional';
  } else if (lowerText.includes('sales')) {
    field = 'Sales Professional';
  }
  // Priority 5: Finance & Accounting
  else if (lowerText.includes('accountant') || lowerText.includes('accounting')) {
    field = 'Accountant';
  } else if (lowerText.includes('finance') && lowerText.includes('manager')) {
    field = 'Finance Manager';
  } else if (lowerText.includes('finance')) {
    field = 'Finance Professional';
  }
  // Priority 6: Engineering
  else if (lowerText.includes('mechanical engineer')) {
    field = 'Mechanical Engineer';
  } else if (lowerText.includes('civil engineer')) {
    field = 'Civil Engineer';
  } else if (lowerText.includes('electrical engineer')) {
    field = 'Electrical Engineer';
  } else if (lowerText.includes('engineer')) {
    field = 'Engineering Professional';
  }
  // Priority 7: Management
  else if (lowerText.includes('project manager')) {
    field = 'Project Manager';
  } else if (lowerText.includes('manager') || lowerText.includes('management')) {
    field = 'Management Professional';
  }
  // Priority 8: HR & Admin
  else if (lowerText.includes('human resources') || lowerText.includes('hr ')) {
    field = 'Human Resources Professional';
  } else if (lowerText.includes('administrative') || lowerText.includes('administrator')) {
    field = 'Administrative Professional';
  }
  // Priority 9: Customer-facing
  else if (lowerText.includes('customer service') || lowerText.includes('customer support')) {
    field = 'Customer Service Professional';
  }
  // Priority 10: Generic programming (only if nothing else matches)
  else if (lowerText.includes('developer') || lowerText.includes('programming')) {
    field = 'Software Developer';
  }
  // Fallback: Use role from experience
  else if (roles.length > 0) {
    field = `${roles[0]}`;
  }
  
  description = `${level} ${field} with ${experience > 0 ? experience + ' years' : 'relevant'} experience. `;
  
  // Add skills summary
  if (skills.length >= 5) {
    const topSkills = skills.slice(0, 4).join(', ');
    description += `Skilled in ${topSkills}, and more. `;
  }
  
  // Add education if present
  if (education.length > 0) {
    const hasAdvanced = education.some(e => {
      const eduStr = typeof e === 'string' ? e.toLowerCase() : 
                     (e.degree || e.field || e.institution || '').toLowerCase();
      return ['master', 'phd', 'doctorate'].some(deg => eduStr.includes(deg));
    });
    const hasBachelor = education.some(e => {
      const eduStr = typeof e === 'string' ? e.toLowerCase() : 
                     (e.degree || e.field || e.institution || '').toLowerCase();
      return ['bachelor', 'degree', 'bsc', 'ba'].some(deg => eduStr.includes(deg));
    });
    
    if (hasAdvanced) {
      description += 'Holds advanced degree(s). ';
    } else if (hasBachelor) {
      description += 'University educated. ';
    }
  }
  
  // Add strength indicator
  if (skills.length >= 10 && experience >= 3) {
    description += 'Strong candidate with diverse skill set and proven track record.';
  } else if (skills.length >= 5) {
    description += 'Well-rounded candidate ready to contribute.';
  } else {
    description += 'Motivated candidate with growth potential.';
  }
  
  return description;
}

function extractCareerSummary(text) {
  // Try to find professional summary or objective section
  const summaryPatterns = [
    /(?:professional\s+)?summary[:\s]+([^\n]{50,300})/i,
    /(?:career\s+)?objective[:\s]+([^\n]{50,300})/i,
    /profile[:\s]+([^\n]{50,300})/i,
    /about\s+me[:\s]+([^\n]{50,300})/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no summary found, extract first meaningful paragraph
  const lines = text.split('\n').filter(line => line.trim().length > 50);
  if (lines.length > 0) {
    return lines[0].substring(0, 200) + (lines[0].length > 200 ? '...' : '');
  }
  
  return 'No professional summary found. Consider adding a 2-3 sentence summary at the top of your CV.';
}
