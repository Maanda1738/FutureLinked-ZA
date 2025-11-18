// CV Matching Algorithm - calculates match score between CV and job posting

export function calculateMatchScore(cvData, jobData) {
  if (!cvData || !jobData) {
    return { score: 0, breakdown: {} };
  }

  let totalScore = 0;
  const breakdown = {};

  // 1. Skills Match (40% weight)
  const skillsScore = calculateSkillsMatch(
    cvData.skills || [],
    jobData.title || '',
    jobData.description || ''
  );
  breakdown.skills = skillsScore;
  totalScore += skillsScore * 0.4;

  // 2. Keywords Match (30% weight)
  const keywordsScore = calculateKeywordsMatch(
    cvData.keywords || [],
    jobData.title || '',
    jobData.description || ''
  );
  breakdown.keywords = keywordsScore;
  totalScore += keywordsScore * 0.3;

  // 3. Experience Match (20% weight)
  const experienceScore = calculateExperienceMatch(
    cvData.experience || { years: 0 },
    jobData.description || ''
  );
  breakdown.experience = experienceScore;
  totalScore += experienceScore * 0.2;

  // 4. Education Match (10% weight)
  const educationScore = calculateEducationMatch(
    cvData.education || [],
    jobData.description || ''
  );
  breakdown.education = educationScore;
  totalScore += educationScore * 0.1;

  return {
    score: Math.round(totalScore),
    breakdown,
    recommendation: getRecommendation(Math.round(totalScore)),
  };
}

function calculateSkillsMatch(cvSkills, jobTitle, jobDescription) {
  // cvSkills: array of skill strings
  // jobDescription may come from job title + description
  const allJobText = `${jobTitle || ''} ${jobDescription || ''}`.toLowerCase();
  if (!cvSkills || cvSkills.length === 0) return 0;

  // Normalize skills and expand common synonyms
  const synMap = {
    'js': 'javascript',
    'reactjs': 'react',
    'nodejs': 'node',
    'csharp': 'c#',
    'cpp': 'c++'
  };

  const normalize = (s) => s.toLowerCase().replace(/[-_.]/g, ' ').trim();
  const cvSet = new Set(cvSkills.map(s => normalize(s)));

  // Derive skills mentioned in job text by matching against cvSet and synonyms
  const matched = [];
  cvSet.forEach(skill => {
    const mapped = synMap[skill] || skill;
    const re = new RegExp(`\\b${mapped.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(allJobText)) matched.push(skill);
  });

  // If job lists specific required skills (comma separated), prioritize those
  const reqSkillsMatch = (jobDescription || '').match(/skills?:?([\s\S]{0,200})/i);
  let requiredSkills = [];
  if (reqSkillsMatch && reqSkillsMatch[1]) {
    requiredSkills = reqSkillsMatch[1].split(/[,;\n]/).map(s => normalize(s)).filter(Boolean);
  }

  let score = 0;
  if (requiredSkills.length > 0) {
    const reqSet = new Set(requiredSkills);
    const matchedReq = requiredSkills.filter(rs => cvSet.has(rs) || matched.includes(rs));
    score = (matchedReq.length / requiredSkills.length) * 100;
  } else {
    score = (matched.length / Math.max(1, cvSet.size)) * 100;
  }

  // Slightly adjust for seniority words in title/description
  const seniorityBoost = (/\b(senior|lead|principal)\b/i.test(allJobText)) ? 0.95 : 1;
  return Math.min(100, Math.round(score * seniorityBoost));
}

function calculateKeywordsMatch(cvKeywords, jobTitle, jobDescription) {
  const allJobText = `${jobTitle || ''} ${jobDescription || ''}`.toLowerCase();
  if (!cvKeywords || cvKeywords.length === 0) return 0;

  // Normalize and count matches (phrase matches get higher weight)
  const normalize = s => s.toLowerCase().trim();
  const keywordSet = cvKeywords.slice(0, 40).map(normalize);

  let scoreSum = 0;
  keywordSet.forEach(k => {
    if (k.length < 3) return;
    const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(allJobText)) {
      // phrase match = +2, word match = +1
      scoreSum += (k.includes(' ') ? 2 : 1);
    }
  });

  const maxPossible = keywordSet.reduce((acc, k) => acc + (k.includes(' ') ? 2 : 1), 0) || 1;
  const pct = (scoreSum / maxPossible) * 100;
  return Math.min(100, Math.round(pct));
}

function calculateExperienceMatch(cvExperience, jobDescription) {
  const jobLower = jobDescription.toLowerCase();
  
  // Check if job mentions experience requirements
  const experiencePatterns = [
    /(\d+)\+?\s*years?/i,
    /minimum\s*(\d+)\s*years?/i,
    /at least\s*(\d+)\s*years?/i,
  ];

  let requiredYears = 0;
  for (const pattern of experiencePatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      requiredYears = parseInt(match[1]);
      break;
    }
  }

  // If no specific requirement, check for keywords
  if (requiredYears === 0) {
    if (jobLower.includes('entry level') || jobLower.includes('graduate')) {
      requiredYears = 0;
    } else if (jobLower.includes('junior')) {
      requiredYears = 1;
    } else if (jobLower.includes('senior')) {
      requiredYears = 5;
    } else {
      requiredYears = 2; // Default assumption
    }
  }

  const cvYears = cvExperience.years || 0;

  if (requiredYears === 0) {
    // No strong requirement — base on years but be generous
    if (cvYears >= 5) return 100;
    if (cvYears >= 3) return 85;
    if (cvYears >= 1) return 65;
    return Math.max(30, Math.round((cvYears / 1) * 50));
  }

  // Calculate score based on experience match to requirement
  const ratio = cvYears / requiredYears;
  if (ratio >= 1) return 100;
  if (ratio >= 0.8) return 85;
  if (ratio >= 0.6) return 70;
  if (ratio >= 0.4) return 50;
  return Math.max(20, Math.round(ratio * 100));
}

function calculateEducationMatch(cvEducation, jobDescription) {
  if (!cvEducation || cvEducation.length === 0) return 50; // Neutral score if no education data

  const jobLower = jobDescription.toLowerCase();
  const normalizedEdu = cvEducation.map(e => e.toLowerCase());

  // Look for degree levels in job description
  const eduLevels = ['phd', 'master', 'bachelor', 'diploma', 'certificate'];
  let requiredLevel = null;
  for (const lvl of eduLevels) {
    if (jobLower.includes(lvl)) { requiredLevel = lvl; break; }
  }

  if (!requiredLevel) {
    // No explicit education requirement -> reward presence
    return 100;
  }

  // If candidate has matching or higher qualification, return full score
  if (normalizedEdu.some(e => e.includes(requiredLevel) || requiredLevel.includes(e))) {
    return 100;
  }

  // Partial credit for related qualifications
  return 65;
}

function getRecommendation(score) {
  if (score >= 80) {
    return {
      level: 'Excellent Match',
      message: 'Your CV is a great match! Apply immediately.',
      color: 'green',
      action: 'Apply Now',
    };
  } else if (score >= 60) {
    return {
      level: 'Good Match',
      message: 'Strong candidate - good chance of success.',
      color: 'blue',
      action: 'Apply',
    };
  } else if (score >= 40) {
    return {
      level: 'Fair Match',
      message: 'Some skills match - consider applying if interested.',
      color: 'yellow',
      action: 'Review Job',
    };
  } else {
    return {
      level: 'Low Match',
      message: 'Limited match - may need more experience/skills.',
      color: 'red',
      action: 'View Similar Jobs',
    };
  }
}

// Get missing skills to improve match score
export function getMissingSkills(cvData, jobData) {
  const cvSkills = (cvData.skills || []).map(s => s.toLowerCase());
  const jobDescription = (jobData.description || '').toLowerCase();

  const commonSkills = [
    'communication', 'leadership', 'teamwork', 'problem solving',
    'microsoft office', 'excel', 'project management', 'customer service',
    'data analysis', 'time management', 'organization', 'attention to detail'
  ];

  const missingSkills = commonSkills.filter(skill =>
    jobDescription.includes(skill) && !cvSkills.includes(skill)
  );

  return missingSkills;
}

// Get personalized tips to improve application
export function getApplicationTips(matchScore, cvData, jobData) {
  const tips = [];

  if (matchScore.score < 60) {
    tips.push('Consider updating your CV to highlight relevant skills mentioned in the job description');
  }

  if (matchScore.breakdown.skills < 50) {
    const missingSkills = getMissingSkills(cvData, jobData);
    if (missingSkills.length > 0) {
      tips.push(`Add these skills to your CV if you have them: ${missingSkills.slice(0, 3).join(', ')}`);
    }
  }

  if (matchScore.breakdown.experience < 70) {
    tips.push('Emphasize your most relevant work experience in your application');
  }

  if (matchScore.score >= 80) {
    tips.push('You\'re a strong match! Personalize your cover letter to stand out');
  }

  return tips;
}
