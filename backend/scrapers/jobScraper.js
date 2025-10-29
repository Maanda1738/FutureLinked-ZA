/**
 * Job Scraper
 * Scrapes job opportunities from South African job boards
 */

const BaseScraper = require('./baseScraper');

class JobScraper extends BaseScraper {
  constructor() {
    super('JobScraper', 'https://www.pnet.co.za');
  }

  async scrape() {
    console.log('💼 Starting job scraping...');
    this.results = [];

    // Scrape multiple job sources
    await this.scrapePNet();
    await this.scrapeCareerJunction();

    // Remove duplicates
    this.results = this.removeDuplicates(this.results);

    console.log(`✅ Total jobs scraped: ${this.results.length}`);
    await this.saveResults('jobs.json');
    
    return this.results;
  }

  /**
   * Scrape PNet.co.za
   */
  async scrapePNet() {
    try {
      // Note: PNet requires more complex scraping due to dynamic content
      // This is a basic example - may need Puppeteer for full functionality
      const html = await this.fetchPage('https://www.pnet.co.za/jobs/results.html');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.job-result, .job-card, .listing-item').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('.job-title, h2, h3').first().text());
          const company = this.cleanText($(elem).find('.company-name, .employer').first().text());
          const location = this.cleanText($(elem).find('.location, .job-location').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.job-description, .summary').first().text());
          const salary = this.cleanText($(elem).find('.salary, .remuneration').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.pnet.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Unknown', 'PNet'),
              title: title,
              company: company || 'Company Not Specified',
              location: location || 'South Africa',
              description: description || 'Job opportunity',
              type: 'job',
              url: fullUrl,
              source: 'PNet',
              posted: new Date(),
              salary: salary || 'Not specified',
              requirements: [],
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing PNet item:', error.message);
        }
      });

      console.log(`✅ PNet: Found ${this.results.length} jobs`);
    } catch (error) {
      console.error('❌ Error scraping PNet:', error.message);
    }
  }

  /**
   * Scrape CareerJunction.co.za
   */
  async scrapeCareerJunction() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.careerjunction.co.za/jobs');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.job-item, .job-listing, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('.job-title, h2, h3').first().text());
          const company = this.cleanText($(elem).find('.company, .employer-name').first().text());
          const location = this.cleanText($(elem).find('.location').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .summary, p').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.careerjunction.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Unknown', 'CareerJunction'),
              title: title,
              company: company || 'Company Not Specified',
              location: location || 'South Africa',
              description: description || 'Job opportunity',
              type: 'job',
              url: fullUrl,
              source: 'Career Junction',
              posted: new Date(),
              salary: 'Not specified',
              requirements: [],
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Career Junction item:', error.message);
        }
      });

      console.log(`✅ Career Junction: Found ${this.results.length - baseCount} new jobs`);
    } catch (error) {
      console.error('❌ Error scraping Career Junction:', error.message);
    }
  }

  /**
   * Remove duplicate entries
   */
  removeDuplicates(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = `${item.title}-${item.company}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = JobScraper;
