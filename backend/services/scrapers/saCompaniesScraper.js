const axios = require('axios');
const cheerio = require('cheerio');

class SACompaniesScraper {
  constructor() {
    this.delay = parseInt(process.env.SCRAPING_DELAY) || 3000;
    this.timeout = 20000;
    this.companies = [
      // Banking & Finance
      {
        name: 'Standard Bank',
        careersUrl: 'https://standardbank.taleo.net/careersection/sb_external/jobsearch.ftl',
        searchUrl: 'https://www.standardbank.co.za/south-africa/personal/about-us/careers/job-opportunities',
        selector: '.job-item, .vacancy, .opportunity'
      },
      {
        name: 'FNB',
        careersUrl: 'https://fnb.taleo.net/careersection/10000/jobsearch.ftl',
        searchUrl: 'https://www.fnb.co.za/about-fnb/careers.html',
        selector: '.job-listing, .career-opportunity'
      },
      {
        name: 'ABSA',
        careersUrl: 'https://absa.wd3.myworkdayjobs.com/External',
        searchUrl: 'https://www.absa.africa/careers/',
        selector: '[data-automation-id="jobTitle"]'
      },
      {
        name: 'Nedbank',
        careersUrl: 'https://nedbank.wd3.myworkdayjobs.com/Nedbank_Careers',
        searchUrl: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/careers.html',
        selector: '.job-title, .position'
      },
      // Mining & Resources
      {
        name: 'Anglo American',
        careersUrl: 'https://angloamerican.wd3.myworkdayjobs.com/External',
        searchUrl: 'https://www.angloamerican.com/careers/job-search',
        selector: '[data-automation-id="jobTitle"]'
      },
      {
        name: 'Sasol',
        careersUrl: 'https://sasol.wd3.myworkdayjobs.com/Sasol_Careers',
        searchUrl: 'https://www.sasol.com/careers/job-opportunities',
        selector: '.job-opportunity, .career-listing'
      },
      {
        name: 'Gold Fields',
        careersUrl: 'https://goldfields.wd1.myworkdayjobs.com/External',
        searchUrl: 'https://www.goldfields.com/careers.php',
        selector: '.job-title'
      },
      // Telecommunications
      {
        name: 'MTN',
        careersUrl: 'https://mtn.wd3.myworkdayjobs.com/MTN_Careers',
        searchUrl: 'https://www.mtn.com/careers/',
        selector: '.job-listing, .career-opportunity'
      },
      {
        name: 'Vodacom',
        careersUrl: 'https://vodacom.wd3.myworkdayjobs.com/Vodacom_Careers',
        searchUrl: 'https://www.vodacom.co.za/vodacom/about-vodacom/careers',
        selector: '.job-item'
      },
      {
        name: 'Cell C',
        careersUrl: 'https://www.cellc.co.za/cellc/about/careers',
        searchUrl: 'https://www.cellc.co.za/cellc/about/careers',
        selector: '.career-listing'
      },
      // Retail
      {
        name: 'Shoprite',
        careersUrl: 'https://www.shopriteholdings.co.za/careers.html',
        searchUrl: 'https://www.shopriteholdings.co.za/careers.html',
        selector: '.job-vacancy, .career-opportunity'
      },
      {
        name: 'Pick n Pay',
        careersUrl: 'https://www.picknpay.co.za/careers',
        searchUrl: 'https://www.picknpay.co.za/careers',
        selector: '.job-listing'
      },
      {
        name: 'Woolworths',
        careersUrl: 'https://www.woolworthsholdings.co.za/careers/',
        searchUrl: 'https://www.woolworthsholdings.co.za/careers/',
        selector: '.career-item'
      },
      // Technology
      {
        name: 'Naspers',
        careersUrl: 'https://www.naspers.com/careers',
        searchUrl: 'https://www.naspers.com/careers',
        selector: '.job-opportunity'
      },
      {
        name: 'Dimension Data',
        careersUrl: 'https://dimensiondata.wd3.myworkdayjobs.com/External',
        searchUrl: 'https://www.dimensiondata.com/careers',
        selector: '[data-automation-id="jobTitle"]'
      },
      // Government & SOEs
      {
        name: 'Eskom',
        careersUrl: 'https://www.eskom.co.za/careers/',
        searchUrl: 'https://www.eskom.co.za/careers/',
        selector: '.career-vacancy, .job-listing'
      },
      {
        name: 'Transnet',
        careersUrl: 'https://www.transnet.net/AboutUs/Careers/Pages/Home.aspx',
        searchUrl: 'https://www.transnet.net/AboutUs/Careers/Pages/Home.aspx',
        selector: '.vacancy-item'
      },
      {
        name: 'SAA',
        careersUrl: 'https://www.flysaa.com/careers',
        searchUrl: 'https://www.flysaa.com/careers',
        selector: '.career-opportunity'
      }
    ];
  }

  async scrapeSACompanies(query, location = '') {
    const allJobs = [];
    const queryLower = query.toLowerCase();
    
    try {
      console.log(`🏢 Scraping SA companies for: "${query}"`);

      // Select relevant companies based on query
      const relevantCompanies = this.filterCompaniesByQuery(queryLower);
      
      for (const company of relevantCompanies.slice(0, 8)) { // Limit to 8 companies
        try {
          await this.sleep(this.delay);
          const jobs = await this.scrapeCompany(company, query, location);
          if (jobs.length > 0) {
            allJobs.push(...jobs);
            console.log(`✅ ${company.name}: Found ${jobs.length} jobs`);
          }
        } catch (error) {
          console.error(`❌ ${company.name} scraping failed:`, error.message);
        }
      }

      // Remove duplicates and return
      return this.removeDuplicates(allJobs);

    } catch (error) {
      console.error('❌ SA Companies scraping failed:', error.message);
      return [];
    }
  }

  filterCompaniesByQuery(queryLower) {
    // Return all companies but prioritize based on query relevance
    const prioritized = [];
    const others = [];

    for (const company of this.companies) {
      const companyLower = company.name.toLowerCase();
      
      // High priority matches
      if (queryLower.includes('bank') && companyLower.includes('bank')) {
        prioritized.push(company);
      } else if (queryLower.includes('mining') && ['anglo', 'sasol', 'gold'].some(term => companyLower.includes(term))) {
        prioritized.push(company);
      } else if (queryLower.includes('telco') || queryLower.includes('telecom')) {
        if (['mtn', 'vodacom', 'cell c'].some(term => companyLower.includes(term))) {
          prioritized.push(company);
        }
      } else if (queryLower.includes('retail') && ['shoprite', 'pick', 'woolworths'].some(term => companyLower.includes(term))) {
        prioritized.push(company);
      } else if (queryLower.includes('tech') && ['naspers', 'dimension'].some(term => companyLower.includes(term))) {
        prioritized.push(company);
      } else if (queryLower.includes('government') || queryLower.includes('soe')) {
        if (['eskom', 'transnet', 'saa'].some(term => companyLower.includes(term))) {
          prioritized.push(company);
        }
      } else {
        others.push(company);
      }
    }

    return [...prioritized, ...others];
  }

  async scrapeCompany(company, query, location) {
    try {
      const jobs = [];
      
      // Try multiple URLs for each company
      const urlsToTry = [company.careersUrl, company.searchUrl].filter(Boolean);
      
      for (const url of urlsToTry) {
        try {
          const response = await axios.get(url, {
            timeout: this.timeout,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });

          const $ = cheerio.load(response.data);
          
          // Try multiple selectors
          const selectors = [
            company.selector,
            '.job-title, .position-title',
            '[data-automation-id="jobTitle"]',
            '.career-opportunity, .job-opportunity',
            '.job-listing, .job-item',
            '.vacancy, .opening',
            'h3, h4, .title'
          ];

          for (const selector of selectors) {
            $(selector).each((i, element) => {
              if (jobs.length >= 5) return false; // Limit per company

              try {
                const $el = $(element);
                
                const title = this.extractJobTitle($el);
                const description = this.extractDescription($el);
                const link = this.extractJobLink($el, url);
                
                if (title && this.isRelevantJob(title, query)) {
                  jobs.push({
                    title: this.cleanText(title),
                    company: company.name,
                    location: location || this.extractLocation($el) || 'South Africa',
                    description: this.cleanText(description) || `${title} position at ${company.name}`,
                    url: link || url,
                    salary: this.extractSalary($el),
                    posted: this.extractPostedDate($el) || 'Recently posted',
                    type: this.classifyJobType(title),
                    source: `${company.name} Careers`,
                    requirements: this.extractRequirements(description || title)
                  });
                }
              } catch (itemError) {
                console.error(`Error parsing job item for ${company.name}:`, itemError.message);
              }
            });

            if (jobs.length > 0) break; // Stop if we found jobs
          }

          if (jobs.length > 0) break; // Stop trying URLs if we found jobs

        } catch (urlError) {
          console.error(`Failed to scrape ${url}:`, urlError.message);
        }
      }

      return jobs;

    } catch (error) {
      console.error(`Company scraping error for ${company.name}:`, error.message);
      return [];
    }
  }

  extractJobTitle(element) {
    const titleSelectors = [
      'h1, h2, h3, h4',
      '.job-title, .position-title, .title',
      '[data-automation-id="jobTitle"]',
      'a[href*="job"]',
      '.career-title'
    ];

    for (const selector of titleSelectors) {
      const title = element.find(selector).first().text().trim();
      if (title && title.length > 3 && title.length < 200) {
        return title;
      }
    }

    // Fallback to element text if specific selectors fail
    const elementText = element.text().trim();
    if (elementText.length > 3 && elementText.length < 200) {
      return elementText.split('\n')[0].trim();
    }

    return '';
  }

  extractDescription(element) {
    const descSelectors = [
      '.description, .job-description',
      '.summary, .job-summary',
      '.content, .job-content',
      'p'
    ];

    for (const selector of descSelectors) {
      const desc = element.find(selector).first().text().trim();
      if (desc && desc.length > 10) {
        return desc.substring(0, 500);
      }
    }

    return '';
  }

  extractJobLink(element, baseUrl) {
    const linkSelectors = ['a[href]', '[data-href]'];
    
    for (const selector of linkSelectors) {
      const href = element.find(selector).first().attr('href') || element.attr('href');
      if (href) {
        if (href.startsWith('http')) return href;
        if (href.startsWith('/')) {
          try {
            const base = new URL(baseUrl);
            return `${base.protocol}//${base.host}${href}`;
          } catch {
            return baseUrl;
          }
        }
      }
    }

    return null;
  }

  extractLocation(element) {
    const locationSelectors = [
      '.location, .job-location',
      '.city, .region',
      '[class*="location"]'
    ];

    for (const selector of locationSelectors) {
      const location = element.find(selector).first().text().trim();
      if (location && location.length > 0) {
        return location;
      }
    }

    return '';
  }

  extractSalary(element) {
    const salarySelectors = [
      '.salary, .compensation',
      '.pay, .wage',
      '[class*="salary"]'
    ];

    for (const selector of salarySelectors) {
      const salary = element.find(selector).first().text().trim();
      if (salary && salary.match(/R?\d+/)) {
        return salary;
      }
    }

    return null;
  }

  extractPostedDate(element) {
    const dateSelectors = [
      '.date, .posted-date',
      '.time, .posted-time',
      '[class*="date"]'
    ];

    for (const selector of dateSelectors) {
      const date = element.find(selector).first().text().trim();
      if (date && date.length > 0) {
        return date;
      }
    }

    return '';
  }

  isRelevantJob(title, query) {
    const titleLower = title.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Always include if title contains query terms
    if (titleLower.includes(queryLower)) return true;
    
    // Check for individual query words
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    return queryWords.some(word => titleLower.includes(word));
  }

  classifyJobType(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('intern') || titleLower.includes('trainee')) return 'Internship';
    if (titleLower.includes('graduate') || titleLower.includes('junior')) return 'Graduate Program';
    if (titleLower.includes('senior') || titleLower.includes('lead')) return 'Senior Position';
    if (titleLower.includes('manager') || titleLower.includes('director')) return 'Management';
    if (titleLower.includes('contract') || titleLower.includes('freelance')) return 'Contract';
    return 'Full-time';
  }

  extractRequirements(description) {
    if (!description) return ['Experience required', 'South African residents preferred'];
    
    const requirements = [];
    const text = description.toLowerCase();
    
    if (text.includes('degree') || text.includes('qualification')) {
      requirements.push('Relevant degree/qualification');
    }
    if (text.includes('experience')) {
      const expMatch = text.match(/(\d+)[\+\-]?\s*years?\s*experience/);
      if (expMatch) {
        requirements.push(`${expMatch[1]}+ years experience`);
      } else {
        requirements.push('Experience preferred');
      }
    }
    if (text.includes('matric') || text.includes('grade 12')) {
      requirements.push('Matric/Grade 12 minimum');
    }
    
    return requirements.slice(0, 3);
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\n\r\t]/g, ' ')
      .trim()
      .substring(0, 300);
  }

  removeDuplicates(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { scrapeSACompanies: async (query, location) => {
  const scraper = new SACompaniesScraper();
  return await scraper.scrapeSACompanies(query, location);
}};