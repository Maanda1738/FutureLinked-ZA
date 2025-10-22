const axios = require('axios');
const cheerio = require('cheerio');

class GoogleJobsScraper {
  constructor() {
    this.delay = parseInt(process.env.SCRAPING_DELAY) || 2000;
    this.timeout = 15000;
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    ];
  }

  async scrapeGoogleJobs(query, location = 'South Africa') {
    try {
      console.log(`🔍 Scraping Google Jobs for: "${query}" in "${location}"`);
      
      const searchQuery = `${query} jobs ${location}`.replace(/\s+/g, '+');
      const url = `https://www.google.com/search?q=${searchQuery}&ibp=htl;jobs`;
      
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      // Google Jobs uses various selectors
      const jobSelectors = [
        '.gws-plugins-horizon-jobs__job-container',
        '.job-result',
        '[data-ved][role="listitem"]',
        '.BjJfJf',
        '.PwjeAc'
      ];

      for (const selector of jobSelectors) {
        $(selector).each((i, element) => {
          if (jobs.length >= 10) return false;

          try {
            const $el = $(element);
            
            const title = this.extractText($el, [
              '.BjJfJf .vNEEBe',
              '.job-title',
              'h3',
              '.title',
              '[role="heading"]'
            ]);

            const company = this.extractText($el, [
              '.vNEEBe + div',
              '.company-name',
              '.company',
              '.source-name'
            ]);

            const location_text = this.extractText($el, [
              '.Qk80Jf',
              '.location',
              '.job-location'
            ]);

            const description = this.extractText($el, [
              '.job-snippet',
              '.description',
              '.summary'
            ]);

            const link = this.extractLink($el);

            if (title && title.length > 3) {
              jobs.push({
                title: this.cleanText(title),
                company: this.cleanText(company) || 'Company Name Not Listed',
                location: this.cleanText(location_text) || location,
                description: this.cleanText(description) || `${title} opportunity available.`,
                url: link || `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + company)}`,
                salary: null,
                posted: 'Recently posted',
                type: this.classifyJobType(title),
                source: 'Google Jobs',
                requirements: this.extractRequirements(description || title)
              });
            }
          } catch (error) {
            console.error('Error parsing Google job item:', error.message);
          }
        });

        if (jobs.length > 0) break; // Stop if we found jobs with this selector
      }

      console.log(`✅ Google Jobs: Found ${jobs.length} opportunities`);
      return jobs;

    } catch (error) {
      console.error('❌ Google Jobs scraping failed:', error.message);
      return [];
    }
  }

  extractText(element, selectors) {
    for (const selector of selectors) {
      const text = element.find(selector).first().text().trim();
      if (text && text.length > 0) {
        return text;
      }
    }
    return '';
  }

  extractLink(element) {
    const linkSelectors = ['a[href]', '[data-href]', '[href]'];
    for (const selector of linkSelectors) {
      const href = element.find(selector).first().attr('href');
      if (href) {
        if (href.startsWith('http')) return href;
        if (href.startsWith('/url?q=')) {
          const urlMatch = href.match(/\/url\?q=([^&]+)/);
          if (urlMatch) return decodeURIComponent(urlMatch[1]);
        }
      }
    }
    return null;
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\n\r\t]/g, ' ')
      .trim()
      .substring(0, 500); // Limit length
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
    if (!description) return ['Experience required', 'South African candidates preferred'];
    
    const requirements = [];
    const text = description.toLowerCase();
    
    if (text.includes('degree') || text.includes('qualification')) {
      requirements.push('Relevant degree/qualification required');
    }
    if (text.includes('experience')) {
      const expMatch = text.match(/(\d+)[\+\-]?\s*years?\s*(?:of\s*)?experience/);
      if (expMatch) {
        requirements.push(`${expMatch[1]}+ years experience required`);
      } else {
        requirements.push('Previous experience preferred');
      }
    }
    if (text.includes('skills') || text.includes('proficient')) {
      requirements.push('Relevant technical skills');
    }
    
    return requirements.slice(0, 3);
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { scrapeGoogleJobs: async (query, location) => {
  const scraper = new GoogleJobsScraper();
  return await scraper.scrapeGoogleJobs(query, location);
}};