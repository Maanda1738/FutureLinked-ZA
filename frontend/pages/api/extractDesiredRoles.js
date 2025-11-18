// Extract desired job roles/titles from CV text
export function extractDesiredRoles(text) {
  const roles = new Set();
  const lowerText = text.toLowerCase();
  
  // Common job title patterns to look for
  const titlePatterns = [
    // IT & Tech roles
    'software developer', 'software engineer', 'web developer', 'full stack developer',
    'frontend developer', 'backend developer', 'mobile developer', 'app developer',
    'data analyst', 'data scientist', 'data engineer', 'database administrator',
    'it support', 'it technician', 'network engineer', 'system administrator',
    'devops engineer', 'cloud engineer', 'security analyst', 'cybersecurity specialist',
    'ui/ux designer', 'product manager', 'scrum master', 'business analyst',
    'qa engineer', 'test engineer', 'quality assurance',
    
    // Business & Finance
    'accountant', 'financial analyst', 'business analyst', 'financial manager',
    'bookkeeper', 'auditor', 'financial advisor', 'investment analyst',
    'business development manager', 'sales manager', 'marketing manager',
    'project manager', 'operations manager', 'general manager',
    
    // Admin & Support
    'administrative assistant', 'office administrator', 'receptionist',
    'personal assistant', 'executive assistant', 'office manager',
    'customer service representative', 'customer support', 'call center agent',
    'human resources', 'hr manager', 'recruiter', 'talent acquisition',
    
    // Healthcare
    'nurse', 'registered nurse', 'medical doctor', 'pharmacist',
    'healthcare assistant', 'medical assistant', 'care worker',
    
    // Engineering & Manufacturing
    'mechanical engineer', 'electrical engineer', 'civil engineer',
    'chemical engineer', 'production manager', 'quality control',
    'maintenance technician', 'industrial engineer',
    
    // Hospitality & Retail
    'retail manager', 'store manager', 'sales assistant', 'cashier',
    'hotel manager', 'restaurant manager', 'chef', 'waiter',
    'barista', 'bartender',
    
    // Education
    'teacher', 'lecturer', 'tutor', 'professor', 'trainer',
    'education coordinator',
    
    // Creative & Media
    'graphic designer', 'content writer', 'copywriter', 'social media manager',
    'digital marketing specialist', 'seo specialist', 'video editor',
    'photographer', 'videographer',
    
    // Legal & Compliance
    'lawyer', 'attorney', 'legal advisor', 'paralegal',
    'compliance officer', 'risk manager'
  ];
  
  // 1. Check for explicit career objective/summary sections
  const objectivePatterns = [
    /(?:objective|summary|profile|career goal|seeking|looking for)[:\s]+([^\n.]{10,100})/gi,
    /(?:interested in|applying for|position as)[:\s]+([^\n.]{10,80})/gi
  ];
  
  objectivePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const extracted = match[1].toLowerCase().trim();
        // Check if it contains job title keywords
        titlePatterns.forEach(title => {
          if (extracted.includes(title)) {
            roles.add(title);
          }
        });
      }
    }
  });
  
  // 2. Extract from work experience section (recent roles user has held)
  const experienceSection = extractExperienceTitles(text);
  experienceSection.forEach(title => roles.add(title));
  
  // 3. Scan entire CV for title patterns (weighted by frequency and position)
  const titleFrequency = {};
  const titleFirstPosition = {}; // Track where the title first appears (earlier = more relevant)
  
  titlePatterns.forEach(title => {
    const regex = new RegExp(`\\b${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      titleFrequency[title] = matches.length;
      // Find position of first occurrence (higher score for titles appearing early)
      const firstIndex = lowerText.indexOf(title.toLowerCase());
      titleFirstPosition[title] = firstIndex;
    }
  });
  
  // Calculate relevance score: (frequency * 10) + (early position bonus)
  const titleScores = {};
  Object.entries(titleFrequency).forEach(([title, count]) => {
    const positionScore = titleFirstPosition[title] < 500 ? 15 : // First 500 chars = very relevant
                          titleFirstPosition[title] < 1500 ? 10 : // First 1500 chars = relevant
                          titleFirstPosition[title] < 3000 ? 5 : 0; // Later = less relevant
    titleScores[title] = (count * 10) + positionScore;
  });
  
  // Add titles with high relevance score (score >= 15 or frequency >= 2)
  Object.entries(titleScores).forEach(([title, score]) => {
    if (score >= 15 || titleFrequency[title] >= 2) {
      roles.add(title);
    }
  });
  
  // Special case: If "analyst" appears with data-related keywords, ensure "data analyst" is included
  if (lowerText.includes('analyst') && 
      (lowerText.includes('data') || lowerText.includes('analytics') || 
       lowerText.includes('excel') || lowerText.includes('power bi') || 
       lowerText.includes('tableau') || lowerText.includes('sql'))) {
    roles.add('data analyst');
  }
  
  // Special case: If "developer" appears with programming languages, ensure "software developer" is included
  if (lowerText.includes('developer') || 
      (lowerText.includes('programming') && 
       (lowerText.includes('javascript') || lowerText.includes('python') || 
        lowerText.includes('java') || lowerText.includes('react')))) {
    roles.add('software developer');
  }
  
  // 4. If no roles found, extract from first work experience
  if (roles.size === 0 && experienceSection.length > 0) {
    experienceSection.slice(0, 2).forEach(title => roles.add(title));
  }
  
  // 5. Fallback: use generic role keywords if still empty
  if (roles.size === 0) {
    const genericRoles = extractGenericRoles(text);
    genericRoles.forEach(role => roles.add(role));
  }
  
  const rolesArray = Array.from(roles);
  console.log('🎯 Extracted desired roles:', rolesArray);
  
  return rolesArray;
}

// Helper: Extract job titles from experience section
function extractExperienceTitles(text) {
  const titles = [];
  const lines = text.split('\n');
  
  // Look for common experience section headers
  let inExperienceSection = false;
  let sectionEndPatterns = /^(education|skills|certifications|references|projects)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect experience section start
    if (/^(experience|employment|work history|career history)/i.test(line)) {
      inExperienceSection = true;
      continue;
    }
    
    // Detect section end
    if (inExperienceSection && sectionEndPatterns.test(line)) {
      break;
    }
    
    // Extract titles from experience section
    if (inExperienceSection && line.length > 5 && line.length < 100) {
      const lowerLine = line.toLowerCase();
      // Skip lines that are dates, companies, or locations
      if (!/^\d{4}|^\w{3,}\s+\d{4}|^[\d\s\-\/]+$/.test(line) && 
          !/\b(pty|ltd|inc|corp|company|university|college)\b/i.test(line)) {
        // Check if line contains job title keywords
        const titleKeywords = [
          'manager', 'engineer', 'developer', 'analyst', 'specialist',
          'coordinator', 'officer', 'assistant', 'administrator', 'technician',
          'consultant', 'director', 'supervisor', 'lead', 'senior', 'junior'
        ];
        
        if (titleKeywords.some(keyword => lowerLine.includes(keyword))) {
          titles.push(lowerLine);
        }
      }
    }
  }
  
  return titles.slice(0, 5); // Return top 5 titles from experience
}

// Helper: Extract generic role keywords
function extractGenericRoles(text) {
  const roleKeywords = [
    'manager', 'developer', 'engineer', 'analyst', 'consultant',
    'coordinator', 'specialist', 'assistant', 'officer', 'supervisor',
    'director', 'administrator', 'technician', 'designer', 'accountant'
  ];

  const foundRoles = [];
  const lowerText = text.toLowerCase();

  roleKeywords.forEach(role => {
    if (lowerText.includes(role)) {
      foundRoles.push(role);
    }
  });

  return [...new Set(foundRoles)];
}
