const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCareer24(query, location = '') {
  try {
    console.log(`🔍 Career24: Searching for "${query}" in "${location || 'South Africa'}"`);
    
    // Career24 search URL with proper parameters
    const baseUrl = 'https://www.career24.co.za/jobs/search';
    const searchParams = new URLSearchParams({
      q: query,
      where: location || 'south-africa',
      sort: 'relevance'
    });
    
    const searchUrl = `${baseUrl}?${searchParams}`;
    console.log(`📡 Career24: Fetching ${searchUrl}`);

    // Enhanced headers to avoid blocking
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
      'Cache-Control': 'max-age=0'
    };

    const response = await axios.get(searchUrl, { 
      headers,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept 4xx as valid responses
    });

    if (response.status !== 200) {
      throw new Error(`Career24 returned status ${response.status}`);
    }

    const $ = cheerio.load(response.data);
    const jobs = [];

    // Multiple selectors to catch different page layouts
    const jobSelectors = [
      '.job-card',
      '.job-item', 
      '.search-result',
      '[data-testid="job-card"]',
      '.listing-item',
      '.job-listing'
    ];

    let foundElements = false;

    jobSelectors.forEach(selector => {
      const elements = $(selector);
      if (elements.length > 0) {
        foundElements = true;
        console.log(`✅ Career24: Found ${elements.length} elements with selector "${selector}"`);
        
        elements.each((index, element) => {
          if (jobs.length >= 15) return false; // Limit results
          
          try {
            const $job = $(element);
            
            // Try multiple title selectors
            const titleSelectors = ['h2 a', '.job-title a', 'h3 a', '.title a', 'a[data-automation="jobTitle"]'];
            let title = '';
            let url = '';
            
            for (const titleSel of titleSelectors) {
              const titleEl = $job.find(titleSel).first();
              if (titleEl.length > 0 && titleEl.text().trim()) {
                title = titleEl.text().trim();
                url = titleEl.attr('href');
                break;
              }
            }

            // Try multiple company selectors
            const companySelectors = ['.company-name', '.employer-name', '.company', '[data-automation="jobCompany"]'];
            let company = '';
            
            for (const companySel of companySelectors) {
              const companyEl = $job.find(companySel).first();
              if (companyEl.length > 0 && companyEl.text().trim()) {
                company = companyEl.text().trim();
                break;
              }
            }

            // Try multiple location selectors
            const locationSelectors = ['.location', '.job-location', '[data-automation="jobLocation"]'];
            let jobLocation = '';
            
            for (const locSel of locationSelectors) {
              const locEl = $job.find(locSel).first();
              if (locEl.length > 0 && locEl.text().trim()) {
                jobLocation = locEl.text().trim();
                break;
              }
            }

            // Description
            const description = $job.find('.job-description, .description, .summary').first().text().trim().substring(0, 300);
            
            // Only add if we have at least a title
            if (title && title.length > 5) {
              // Ensure URL is absolute
              const absoluteUrl = url && url.startsWith('http') 
                ? url 
                : url 
                  ? `https://www.career24.co.za${url}`
                  : `https://www.career24.co.za/jobs?q=${encodeURIComponent(query)}`;

              jobs.push({
                title: title,
                company: company || 'Company not specified',
                location: jobLocation || location || 'South Africa',
                description: description || `${title} position available.`,
                url: absoluteUrl,
                posted: new Date().toISOString(),
                type: classifyJobType(title),
                source: 'Career24',
                requirements: extractRequirements(description || title)
              });
            }
          } catch (error) {
            console.warn(`⚠️ Career24: Error parsing job ${index}:`, error.message);
          }
        });
      }
    });

    if (!foundElements) {
      console.log('⚠️ Career24: No job elements found with known selectors');
      console.log('📄 Career24: Response length:', response.data.length);
      
      // Check if we're being blocked
      if (response.data.includes('blocked') || response.data.includes('captcha') || response.data.includes('Access Denied')) {
        throw new Error('Career24 access blocked - may need different approach');
      }
    }

    console.log(`✅ Career24: Successfully scraped ${jobs.length} jobs`);
    return jobs;

  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('❌ Career24: Network connection failed');
    } else if (error.response?.status === 403) {
      console.error('❌ Career24: Access forbidden (403) - site may be blocking scrapers');
    } else if (error.response?.status === 429) {
      console.error('❌ Career24: Rate limited (429) - too many requests');
    } else {
      console.error('❌ Career24: Scraping error:', error.message);
    }
    return [];
  }
}

function classifyJobType(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('internship') || titleLower.includes('intern')) return 'internship';
  if (titleLower.includes('graduate') || titleLower.includes('grad')) return 'graduate';
  if (titleLower.includes('bursary') || titleLower.includes('scholarship')) return 'bursary';
  return 'job';
}

function extractRequirements(description) {
  const requirements = [];
  const desc = description.toLowerCase();
  
  if (desc.includes('degree') || desc.includes('diploma')) {
    requirements.push('Relevant qualification required');
  }
  if (desc.includes('experience')) {
    requirements.push('Previous experience preferred');
  }
  if (desc.includes('skills')) {
    requirements.push('Strong technical skills');
  }
  
  return requirements.slice(0, 3);
}

module.exports = { scrapeCareer24 };