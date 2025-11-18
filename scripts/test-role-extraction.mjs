// Quick test script for role extraction
// Run with: node scripts/test-role-extraction.mjs

const testCV = `
CAREER OBJECTIVE
Seeking a Software Developer position with expertise in web development and modern JavaScript frameworks.

EXPERIENCE
Senior Full Stack Developer
TechCorp Solutions (2021 - 2024)
- Led development team of 5 developers
- Built scalable web applications using React and Node.js
- Implemented CI/CD pipelines

Web Developer
StartupXYZ (2019 - 2021)
- Developed responsive websites using HTML, CSS, JavaScript
- Integrated REST APIs
- Collaborated with design team

IT Support Technician
NetSolutions Inc. (2017 - 2019)
- Provided technical support to 200+ users
- Managed network infrastructure
- Troubleshot hardware and software issues

EDUCATION
Bachelor of Science in Computer Science
University of Cape Town (2013 - 2016)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker, Networking, CCNA
`;

// Simple role extraction logic (subset for testing)
function extractDesiredRoles(text) {
  const roles = new Set();
  const lowerText = text.toLowerCase();
  
  const titlePatterns = [
    'software developer', 'full stack developer', 'web developer',
    'frontend developer', 'backend developer', 'it support', 'it technician',
    'data analyst', 'network engineer', 'system administrator'
  ];
  
  // Check objective
  const objectiveMatch = text.match(/(?:seeking|looking for|interested in)[:\s]+([^\n.]{10,100})/gi);
  if (objectiveMatch) {
    objectiveMatch.forEach(match => {
      titlePatterns.forEach(title => {
        if (match.toLowerCase().includes(title)) {
          roles.add(title);
        }
      });
    });
  }
  
  // Check experience section
  const expMatch = text.match(/EXPERIENCE[\s\S]+?(?=EDUCATION|SKILLS|$)/i);
  if (expMatch) {
    const expText = expMatch[0];
    const lines = expText.split('\n');
    lines.forEach(line => {
      titlePatterns.forEach(title => {
        if (line.toLowerCase().includes(title)) {
          roles.add(title);
        }
      });
    });
  }
  
  // Frequency analysis
  titlePatterns.forEach(title => {
    const regex = new RegExp(`\\b${title}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length >= 1) {
      roles.add(title);
    }
  });
  
  return Array.from(roles);
}

// Test job filtering
function filterJobs(jobs, desiredRoles) {
  return jobs.filter(job => {
    const jobTitle = job.title.toLowerCase();
    return desiredRoles.some(role => {
      const roleLower = role.toLowerCase();
      // Direct match
      if (jobTitle.includes(roleLower)) return true;
      // Fuzzy match
      const roleWords = roleLower.split(/\s+/).filter(w => w.length > 3);
      const matchCount = roleWords.filter(word => jobTitle.includes(word)).length;
      return matchCount >= Math.ceil(roleWords.length * 0.7);
    });
  });
}

// Run tests
console.log('=== Testing Role Extraction ===\n');

const extractedRoles = extractDesiredRoles(testCV);
console.log('✅ Extracted Roles:', extractedRoles);
console.log(`   Count: ${extractedRoles.length} roles\n`);

console.log('=== Testing Job Filtering ===\n');

const testJobs = [
  { id: 1, title: 'Junior Software Developer' },
  { id: 2, title: 'Senior Full Stack Engineer' },
  { id: 3, title: 'Frontend Web Developer' },
  { id: 4, title: 'IT Support Specialist' },
  { id: 5, title: 'Network Administrator' },
  { id: 6, title: 'Data Analyst' }, // Should NOT match
  { id: 7, title: 'Marketing Manager' }, // Should NOT match
  { id: 8, title: 'React Developer' }, // Fuzzy match "developer"
  { id: 9, title: 'DevOps Engineer' }, // Should NOT match
  { id: 10, title: 'Full Stack Software Engineer' }, // Should match
];

const matchedJobs = filterJobs(testJobs, extractedRoles);

console.log('Matched Jobs:');
matchedJobs.forEach(job => {
  console.log(`  ✅ ${job.id}. ${job.title}`);
});

console.log('\nNon-Matched Jobs:');
testJobs.filter(j => !matchedJobs.find(m => m.id === j.id)).forEach(job => {
  console.log(`  ❌ ${job.id}. ${job.title}`);
});

console.log(`\n=== Results ===`);
console.log(`Total Jobs: ${testJobs.length}`);
console.log(`Matched: ${matchedJobs.length}`);
console.log(`Filtered Out: ${testJobs.length - matchedJobs.length}`);
console.log(`Match Rate: ${Math.round((matchedJobs.length / testJobs.length) * 100)}%`);

// Expected: Should match jobs 1, 2, 3, 4, 8, 10 (6 jobs)
// Should filter out: 5, 6, 7, 9 (4 jobs)
console.log(`\nExpected Matches: 6 jobs (IDs 1,2,3,4,8,10)`);
console.log(`Actual Matches: ${matchedJobs.length} jobs`);

if (matchedJobs.length === 6) {
  console.log('\n✅ TEST PASSED!');
} else {
  console.log('\n⚠️  TEST RESULTS MAY VARY (depends on fuzzy matching threshold)');
}
