const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeIndeed(query, location = '') {
  try {
    console.log(`🔍 Indeed ZA: Searching for "${query}" in "${location || 'South Africa'}"`);
    
    // Indeed South Africa search URL with proper parameters
    const baseUrl = 'https://za.indeed.com/jobs';
    const searchParams = new URLSearchParams({
      q: query,
      l: location || 'South Africa',
      sort: 'relevance',
      fromage: '30' // Jobs from last 30 days
    });
    
    const searchUrl = `${baseUrl}?${searchParams}`;
    console.log(`📡 Indeed ZA: Fetching ${searchUrl}`);

    // Enhanced headers to avoid detection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
      'DNT': '1'
    };

    const response = await axios.get(searchUrl, { 
      headers,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500
    });

    if (response.status !== 200) {
      throw new Error(`Indeed ZA returned status ${response.status}`);
    }

    const $ = cheerio.load(response.data);
    const jobs = [];

    // Multiple selectors for different Indeed layouts
    const jobSelectors = [
      '[data-testid="job-tile"]',
      '.job_seen_beacon',
      '.jobsearch-SerpJobCard',
      '.job-card',
      '.slider_container .slider_item',
      '.job'
    ];

    let foundElements = false;

    jobSelectors.forEach(selector => {
      const elements = $(selector);
      if (elements.length > 0) {
        foundElements = true;
        console.log(`✅ Indeed ZA: Found ${elements.length} elements with selector "${selector}"`);
        
        elements.each((index, element) => {
          if (jobs.length >= 15) return false; // Limit results
          
          try {
            const $job = $(element);
            
            // Try multiple title selectors
            const titleSelectors = [
              'h2 a span[title]',
              '.jobTitle a span',
              'h2 .jobTitle',
              '[data-testid="job-title"] a',
              '.jobTitle-color-purple a span'
            ];
            
            let title = '';
            let url = '';
            
            for (const titleSel of titleSelectors) {
              const titleEl = $job.find(titleSel).first();
              if (titleEl.length > 0) {
                title = titleEl.text().trim() || titleEl.attr('title') || '';
                if (title) {
                  const linkEl = titleEl.closest('a');
                  url = linkEl.attr('href') || '';
                  break;
                }
              }
            }

            // Company selectors
            const companySelectors = [
              '.companyName a',
              '.companyName span',
              '[data-testid="company-name"]',
              '.companyName'
            ];
            
            let company = '';
            for (const companySel of companySelectors) {
              const companyEl = $job.find(companySel).first();
              if (companyEl.length > 0 && companyEl.text().trim()) {
                company = companyEl.text().trim();
                break;
              }
            }

            // Location selectors
            const locationSelectors = [
              '.companyLocation',
              '[data-testid="job-location"]',
              '.locationsContainer'
            ];
            
            let jobLocation = '';
            for (const locSel of locationSelectors) {
              const locEl = $job.find(locSel).first();
              if (locEl.length > 0 && locEl.text().trim()) {
                jobLocation = locEl.text().trim();
                break;
              }
            }

            // Description and salary
            const description = $job.find('.job-snippet, .summary, [data-testid="job-snippet"]').first().text().trim().substring(0, 300);
            const salaryElement = $job.find('.salaryText, .metadata .salary-snippet-container, .salary-snippet');
            const salary = salaryElement.length > 0 ? salaryElement.first().text().trim() : null;
            
            // Only add if we have essential information
            if (title && title.length > 3) {
              // Ensure URL is absolute
              const absoluteUrl = url && url.startsWith('http') 
                ? url 
                : url 
                  ? `https://za.indeed.com${url}`
                  : `https://za.indeed.com/jobs?q=${encodeURIComponent(query)}`;

              jobs.push({
                title: title,
                company: company || 'Company not specified',
                location: jobLocation || location || 'South Africa',
                description: description || `${title} position at ${company || 'company'}.`,
                url: absoluteUrl,
                salary: salary || null,
                posted: new Date().toISOString(),
                type: classifyJobType(title),
                source: 'Indeed ZA',
                requirements: extractRequirements(description || title)
              });
            }
          } catch (error) {
            console.warn(`⚠️ Indeed ZA: Error parsing job ${index}:`, error.message);
          }
        });
      }
    });

    if (!foundElements) {
      console.log('⚠️ Indeed ZA: No job elements found with known selectors');
      console.log('📄 Indeed ZA: Response length:', response.data.length);
      
      // Check for blocking indicators
      if (response.data.includes('blocked') || response.data.includes('captcha') || response.data.includes('Access Denied')) {
        throw new Error('Indeed ZA access blocked - may need different approach');
      }
    }

    console.log(`✅ Indeed ZA: Successfully scraped ${jobs.length} jobs`);
    return jobs;

  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('❌ Indeed ZA: Network connection failed');
    } else if (error.response?.status === 403) {
      console.error('❌ Indeed ZA: Access forbidden (403) - site may be blocking scrapers');
    } else if (error.response?.status === 429) {
      console.error('❌ Indeed ZA: Rate limited (429) - too many requests');
    } else {
      console.error('❌ Indeed ZA: Scraping error:', error.message);
    }
    return [];
  }
}

function classifyJobType(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('internship') || titleLower.includes('intern')) return 'internship';
  if (titleLower.includes('graduate') || titleLower.includes('grad') || titleLower.includes('trainee')) return 'graduate';
  if (titleLower.includes('bursary') || titleLower.includes('scholarship')) return 'bursary';
  return 'job';
}

function extractRequirements(description) {
  const requirements = [];
  const desc = description.toLowerCase();
  
  if (desc.includes('degree') || desc.includes('diploma') || desc.includes('qualification')) {
    requirements.push('Relevant qualification required');
  }
  if (desc.includes('experience') && desc.includes('year')) {
    requirements.push('Previous experience required');
  }
  if (desc.includes('skill') || desc.includes('proficient')) {
    requirements.push('Technical skills required');
  }
  
  return requirements.slice(0, 3);
}

module.exports = { scrapeIndeed };