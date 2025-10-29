/**
 * Learnership & Internship Scraper
 * Scrapes learnership and internship opportunities
 */

const BaseScraper = require('./baseScraper');

class LearnershipScraper extends BaseScraper {
  constructor() {
    super('LearnershipScraper', 'https://www.youthvillage.co.za');
  }

  async scrape() {
    console.log('🎯 Starting learnership/internship scraping...');
    this.results = [];

    // Scrape multiple sources
    await this.scrapeYouthVillageLearnerships();
    await this.scrapeCareerPortalInternships();

    // Remove duplicates
    this.results = this.removeDuplicates(this.results);

    console.log(`✅ Total learnerships/internships scraped: ${this.results.length}`);
    await this.saveResults('learnerships.json');
    
    return this.results;
  }

  /**
   * Scrape Youth Village Learnerships
   */
  async scrapeYouthVillageLearnerships() {
    try {
      const html = await this.fetchPage('https://www.youthvillage.co.za/learnerships/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.post, article, .learnership-card').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .entry-title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.entry-content, .excerpt, p').first().text());
          const dateText = this.cleanText($(elem).find('.date, time').first().text());
          const company = this.cleanText($(elem).find('.company, .employer').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.youthvillage.co.za${link}`;
            
            // Determine if it's internship or learnership
            const type = title.toLowerCase().includes('internship') ? 'internship' : 'learnership';
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'YouthVillage'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} opportunity`,
              type: type,
              url: fullUrl,
              source: 'Youth Village',
              posted: this.parseDate(dateText),
              deadline: null,
              requirements: [],
              salary: 'Stipend/Training',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing learnership item:', error.message);
        }
      });

      console.log(`✅ Youth Village: Found ${this.results.length} opportunities`);
    } catch (error) {
      console.error('❌ Error scraping Youth Village learnerships:', error.message);
    }
  }

  /**
   * Scrape Careers Portal Internships
   */
  async scrapeCareerPortalInternships() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.careersportal.co.za/internships');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.internship-listing, .opportunity-item, .listing-item').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const company = this.cleanText($(elem).find('.company, .organization').first().text());
          const description = this.cleanText($(elem).find('.description, .summary, p').first().text());
          const location = this.cleanText($(elem).find('.location').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.careersportal.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'CareersPortal'),
              title: title,
              company: company || 'Various Companies',
              location: location || 'South Africa',
              description: description || 'Internship opportunity',
              type: 'internship',
              url: fullUrl,
              source: 'Careers Portal',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Stipend/Training',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing internship item:', error.message);
        }
      });

      console.log(`✅ Careers Portal: Found ${this.results.length - baseCount} new internships`);
    } catch (error) {
      console.error('❌ Error scraping Careers Portal internships:', error.message);
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

module.exports = LearnershipScraper;
