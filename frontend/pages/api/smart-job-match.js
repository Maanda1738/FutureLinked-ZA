/**
 * API Endpoint: Smart Job Matching based on CV analysis
 * POST /api/smart-job-match
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cvData, analysis } = req.body;

    if (!cvData || !analysis) {
      return res.status(400).json({ error: 'CV data and analysis required' });
    }

    // Search for jobs based on CV content
    const matches = await findMatchingJobs(cvData, analysis);

    return res.status(200).json({ 
      success: true,
      matches,
      totalMatches: matches.length 
    });
  } catch (error) {
    console.error('Job matching error:', error);
    return res.status(500).json({ error: 'Failed to find matching jobs' });
  }
}

async function findMatchingJobs(cvData, analysis) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Use OpenAI to extract better search terms if available
  let searchTerms;
  if (process.env.OPENAI_API_KEY && analysis.targetRoles) {
    searchTerms = analysis.targetRoles.slice(0, 5);
  } else {
    searchTerms = extractSearchTerms(cvData, analysis);
  }
  
  const allJobs = [];

  // Search for jobs using multiple keywords
  for (const term of searchTerms.slice(0, 5)) { // Top 5 search terms
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(term)}&limit=20&source=all`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results) {
          allJobs.push(...data.results);
        }
      }
    } catch (error) {
      console.error(`Error searching for ${term}:`, error);
    }
  }

  // Remove duplicates by job ID
  const uniqueJobs = [];
  const seenIds = new Set();
  
  for (const job of allJobs) {
    const jobId = job.id || `${job.title}-${job.company}`;
    if (!seenIds.has(jobId)) {
      seenIds.add(jobId);
      uniqueJobs.push(job);
    }
  }

  // Use OpenAI for intelligent job matching if available
  let scoredJobs;
  if (process.env.OPENAI_API_KEY && uniqueJobs.length > 0) {
    try {
      scoredJobs = await scoreJobsWithOpenAI(uniqueJobs, cvData, analysis);
    } catch (error) {
      console.error('OpenAI scoring failed, using fallback:', error);
      scoredJobs = uniqueJobs.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, cvData, analysis)
      }));
    }
  } else {
    scoredJobs = uniqueJobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, cvData, analysis)
    }));
  }

  // Sort by match score and return top matches
  const topMatches = scoredJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .filter(job => job.matchScore >= 60) // Only return jobs with 60%+ match
    .slice(0, 30); // Top 30 matches

  return topMatches;
}

async function scoreJobsWithOpenAI(jobs, cvData, analysis) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  // Process jobs in batches of 10
  const batchSize = 10;
  const scoredJobs = [];
  
  for (let i = 0; i < Math.min(jobs.length, 30); i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    
    const jobDescriptions = batch.map((job, idx) => 
      `Job ${idx + 1}: ${job.title} at ${job.company || 'Company'}\n${job.description?.substring(0, 300) || 'No description'}`
    ).join('\n\n');

    const prompt = `You are an expert job matching AI. Score how well each job matches the candidate's CV.

Candidate Profile:
- Skills: ${analysis.skills?.join(', ') || 'N/A'}
- Experience Level: ${analysis.experienceLevel || 'mid'}
- Target Roles: ${analysis.targetRoles?.join(', ') || 'N/A'}

Jobs to evaluate:
${jobDescriptions}

For each job, provide a match score (0-100) and brief reason. Return JSON array:
[
  {"jobIndex": 0, "score": 85, "reason": "Strong match because..."},
  {"jobIndex": 1, "score": 72, "reason": "Good match but..."},
  ...
]`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert job matching AI that accurately scores job-candidate fit.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const scores = JSON.parse(data.choices[0].message.content);
        const scoresArray = Array.isArray(scores) ? scores : scores.scores || [];
        
        batch.forEach((job, idx) => {
          const scoreData = scoresArray.find(s => s.jobIndex === idx) || { score: 70 };
          scoredJobs.push({
            ...job,
            matchScore: scoreData.score,
            matchReason: scoreData.reason
          });
        });
      } else {
        // Fallback to rule-based scoring
        batch.forEach(job => {
          scoredJobs.push({
            ...job,
            matchScore: calculateMatchScore(job, cvData, analysis)
          });
        });
      }
    } catch (error) {
      console.error('Batch scoring error:', error);
      // Fallback to rule-based scoring
      batch.forEach(job => {
        scoredJobs.push({
          ...job,
          matchScore: calculateMatchScore(job, cvData, analysis)
        });
      });
    }

    // Rate limiting delay
    if (i + batchSize < jobs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return scoredJobs;
}

function extractSearchTerms(cvData, analysis) {
  const terms = [];
  
  // 1. PRIORITY: Add desired roles if available (most important!)
  if (cvData.desiredRoles && cvData.desiredRoles.length > 0) {
    // Add full role names first (e.g., "data analyst", "software developer")
    terms.push(...cvData.desiredRoles);
    
    // Also add variations for better matching
    cvData.desiredRoles.forEach(role => {
      if (role === 'data analyst') {
        terms.push('data analysis', 'analyst', 'business intelligence');
      } else if (role === 'software developer') {
        terms.push('developer', 'software engineer', 'programmer');
      } else if (role === 'business analyst') {
        terms.push('analyst', 'business analysis');
      }
    });
  }

  // 2. Add role-specific key skills (for context)
  if (analysis.skills && analysis.skills.length > 0) {
    // For data analysts, prioritize data tools
    const dataSkills = analysis.skills.filter(s => 
      ['excel', 'power bi', 'tableau', 'sql', 'python', 'data analysis'].some(ds => s.toLowerCase().includes(ds))
    );
    if (dataSkills.length > 0) {
      terms.push(...dataSkills.slice(0, 2));
    } else {
      // Otherwise add top general skills
      terms.push(...analysis.skills.slice(0, 3));
    }
  }

  // 3. Extract job titles from experience as backup
  const text = (cvData.text || cvData.summary || '').toLowerCase();
  const commonJobTitles = [
    'data analyst', 'business analyst', 'financial analyst', // Analyst roles first
    'developer', 'engineer', 'manager', 'consultant',
    'designer', 'specialist', 'coordinator', 'administrator', 'accountant',
    'teacher', 'nurse', 'technician', 'assistant', 'supervisor'
  ];

  commonJobTitles.forEach(title => {
    if (text.includes(title) && !terms.includes(title)) {
      terms.push(title);
    }
  });

  // 4. Log extracted terms for debugging
  console.log('🔍 Search terms extracted:', terms.slice(0, 8));

  // Return unique terms, prioritizing desired roles
  const uniqueTerms = [...new Set(terms)].filter(t => t && t.length > 2);
  
  // Ensure desired roles are first in the array
  const desiredRoles = cvData.desiredRoles || [];
  const otherTerms = uniqueTerms.filter(t => !desiredRoles.includes(t));
  
  return [...desiredRoles, ...otherTerms];
}

function calculateMatchScore(job, cvData, analysis) {
  let score = 0;
  const jobText = `${job.title} ${job.description || ''} ${job.company || ''}`.toLowerCase();
  const cvText = (cvData.text || '').toLowerCase();
  const jobTitle = job.title.toLowerCase();

  // Check for role match (HIGHEST weight - 40 points possible)
  if (cvData.desiredRoles && cvData.desiredRoles.length > 0) {
    for (const role of cvData.desiredRoles) {
      const roleLower = role.toLowerCase();
      
      // EXACT match in job title (very strong signal)
      if (jobTitle.includes(roleLower)) {
        score += 40;
        break;
      }
      
      // Match in job description
      if (jobText.includes(roleLower)) {
        score += 30;
        break;
      }
      
      // Partial match (e.g., "analyst" matches "data analyst")
      const roleWords = roleLower.split(/\s+/);
      const matchedWords = roleWords.filter(word => word.length > 3 && jobTitle.includes(word)).length;
      if (matchedWords >= Math.ceil(roleWords.length * 0.6)) {
        score += 25;
        break;
      }
      
      // Weak partial match in description
      if (matchedWords > 0) {
        score += 15;
        break;
      }
    }
  }

  // Check for skill matches
  if (analysis.skills && analysis.skills.length > 0) {
    let matchedSkills = 0;
    for (const skill of analysis.skills) {
      if (jobText.includes(skill.toLowerCase())) {
        matchedSkills++;
      }
    }
    // Up to 30 points for skill matches
    score += Math.min(30, (matchedSkills / analysis.skills.length) * 30);
  }

  // Check for experience level match
  const yearsInCV = extractYearsOfExperience(cvText);
  const yearsInJob = extractYearsOfExperience(jobText);
  
  if (yearsInCV >= yearsInJob || yearsInJob === 0) {
    score += 15;
  } else if (yearsInCV >= yearsInJob - 1) {
    score += 10;
  }

  // Check for education match
  const educationKeywords = ['degree', 'bachelor', 'master', 'diploma', 'certificate', 'phd'];
  const hasEducationInCV = educationKeywords.some(kw => cvText.includes(kw));
  const requiresEducationInJob = educationKeywords.some(kw => jobText.includes(kw));
  
  if (hasEducationInCV && requiresEducationInJob) {
    score += 10;
  } else if (!requiresEducationInJob) {
    score += 5;
  }

  // Keyword frequency match
  const cvWords = cvText.split(/\s+/).filter(w => w.length > 4);
  const jobWords = jobText.split(/\s+/).filter(w => w.length > 4);
  let commonWords = 0;
  
  const uniqueJobWords = [...new Set(jobWords)];
  for (const word of uniqueJobWords) {
    if (cvWords.includes(word)) {
      commonWords++;
    }
  }
  
  // Up to 15 points for keyword overlap
  score += Math.min(15, (commonWords / uniqueJobWords.length) * 15);

  return Math.min(100, Math.round(score));
}

function extractYearsOfExperience(text) {
  // Look for patterns like "5 years", "5+ years", "5-7 years"
  const patterns = [
    /(\d+)\+?\s*years?/i,
    /(\d+)\s*-\s*\d+\s*years?/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }

  return 0;
}
