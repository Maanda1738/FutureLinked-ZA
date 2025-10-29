/**
 * Bursary Scraper
 * Scrapes bursary opportunities from multiple South African sources
 */

const BaseScraper = require('./baseScraper');

class BursaryScraper extends BaseScraper {
  constructor() {
    super('BursaryScraper', 'https://bursaries-southafrica.co.za');
  }

  async scrape() {
    console.log('🎓 Starting bursary scraping...');
    this.results = [];

    // Scrape all major SA bursary sources
    await this.scrapeBursariesSA();
    await this.scrapeCareerPortal();
    await this.scrapeYouthVillage();
    await this.scrapeSAStudy();
    await this.scrapeStudyTrust();
    await this.scrapeBursarySA();
    await this.scrapeAfriSmart();
    await this.scrapeGraduateConnection();
    await this.scrapeNSFAS();

    // Remove duplicates
    this.results = this.removeDuplicates(this.results);

    console.log(`✅ Total bursaries scraped: ${this.results.length}`);
    await this.saveResults('bursaries.json');
    
    return this.results;
  }

  /**
   * Scrape bursaries-southafrica.co.za
   */
  async scrapeBursariesSA() {
    try {
      const html = await this.fetchPage('https://bursaries-southafrica.co.za/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      // Find bursary listings (adjust selectors based on actual site structure)
      $('.post, .bursary-item, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title, .post-title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.excerpt, .description, p').first().text());
          const dateText = this.cleanText($(elem).find('.date, .post-date, time').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `${this.baseUrl}${link}`;
            
            this.results.push({
              id: this.generateId(title, 'Various', 'BursariesSA'),
              title: title,
              company: 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary opportunity in South Africa',
              type: 'bursary',
              url: fullUrl,
              source: 'Bursaries South Africa',
              posted: this.parseDate(dateText),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing bursary item:', error.message);
        }
      });

      console.log(`✅ BursariesSA: Found ${this.results.length} bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Bursaries SA:', error.message);
    }
  }

  /**
   * Scrape careersportal.co.za
   */
  async scrapeCareerPortal() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.careersportal.co.za/bursaries');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary-listing, .opportunity-item, .listing-item').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const company = this.cleanText($(elem).find('.company, .organization').first().text());
          const description = this.cleanText($(elem).find('.description, .summary, p').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.careersportal.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'CareersPortal'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary opportunity',
              type: 'bursary',
              url: fullUrl,
              source: 'Careers Portal',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing careers portal item:', error.message);
        }
      });

      console.log(`✅ Careers Portal: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Careers Portal:', error.message);
    }
  }

  /**
   * Scrape youthvillage.co.za
   */
  async scrapeYouthVillage() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.youthvillage.co.za/bursaries/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.post, article, .bursary-card').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .entry-title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.entry-content, .excerpt, p').first().text());
          const dateText = this.cleanText($(elem).find('.date, time').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.youthvillage.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, 'Various', 'YouthVillage'),
              title: title,
              company: 'Various Companies',
              location: 'South Africa',
              description: description || 'Youth opportunity in South Africa',
              type: 'bursary',
              url: fullUrl,
              source: 'Youth Village',
              posted: this.parseDate(dateText),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing youth village item:', error.message);
        }
      });

      console.log(`✅ Youth Village: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Youth Village:', error.message);
    }
  }

  /**
   * Scrape sastudy.co.za (corrected URL)
   */
  async scrapeSAStudy() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.sastudy.co.za/bursaries/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary-item, .post, article, .listing').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title, .post-title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .excerpt, p').first().text());
          const company = this.cleanText($(elem).find('.company, .organization').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.sastudy.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'SAStudy'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary opportunity in South Africa',
              type: 'bursary',
              url: fullUrl,
              source: 'SA Study',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing SA Study item:', error.message);
        }
      });

      console.log(`✅ SA Study: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping SA Study:', error.message);
    }
  }

  /**
   * Scrape studytrust.org.za
   */
  async scrapeStudyTrust() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.studytrust.org.za/bursaries');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary, .opportunity, article, .post').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .content, p').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.studytrust.org.za${link}`;
            
            this.results.push({
              id: this.generateId(title, 'Various', 'StudyTrust'),
              title: title,
              company: 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary and scholarship opportunity',
              type: 'bursary',
              url: fullUrl,
              source: 'Study Trust',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Study Trust item:', error.message);
        }
      });

      console.log(`✅ Study Trust: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Study Trust:', error.message);
    }
  }

  /**
   * Scrape opportunitiesforafricans.com (alternative source)
   */
  async scrapeBursarySA() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.opportunitiesforafricans.com/category/bursaries-in-south-africa/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary-listing, .post, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .entry-title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.entry-content, .excerpt, p').first().text());
          const company = this.cleanText($(elem).find('.company').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.opportunitiesforafricans.com${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'BursarySA'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary opportunity',
              type: 'bursary',
              url: fullUrl,
              source: 'Bursary SA',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Bursary SA item:', error.message);
        }
      });

      console.log(`✅ Opportunities for Africans: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Opportunities for Africans:', error.message);
    }
  }

  /**
   * Scrape afrismart.com
   */
  async scrapeAfriSmart() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.afrismart.com/bursaries');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary-card, .scholarship, article, .listing').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .summary, p').first().text());
          const company = this.cleanText($(elem).find('.provider, .company').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.afrismart.com${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'AfriSmart'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || 'Scholarship and bursary opportunity',
              type: 'bursary',
              url: fullUrl,
              source: 'AfriSmart',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing AfriSmart item:', error.message);
        }
      });

      console.log(`✅ AfriSmart: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping AfriSmart:', error.message);
    }
  }

  /**
   * Scrape careers24.com/jobs/bursary (alternative to graduate connection)
   */
  async scrapeGraduateConnection() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.careers24.com/jobs/bursary');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary, .opportunity, .listing, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, h4, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .content, p').first().text());
          const company = this.cleanText($(elem).find('.company, .employer').first().text());

          if (title && link) {
            const fullUrl = link.startsWith('http') ? link : `https://www.careers24.com${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'GraduateConnection'),
              title: title,
              company: company || 'Various Companies',
              location: 'South Africa',
              description: description || 'Bursary and graduate opportunity',
              type: 'bursary',
              url: fullUrl,
              source: 'Graduate Connection',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Bursary/Scholarship',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Graduate Connection item:', error.message);
        }
      });

      console.log(`✅ Careers24 Bursaries: Found ${this.results.length - baseCount} new bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Careers24:', error.message);
    }
  }

  /**
   * Scrape nsfas.org.za (Government funding)
   */
  async scrapeNSFAS() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.nsfas.org.za/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      // NSFAS has different structure - look for funding info, news, announcements
      $('.funding-info, .announcement, .news-item, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, h4, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .content, p').first().text());

          // Only include if it's about funding/bursaries/applications
          const relevantKeywords = ['funding', 'bursary', 'application', 'financial aid', 'student loan'];
          const isRelevant = relevantKeywords.some(keyword => 
            title.toLowerCase().includes(keyword) || description.toLowerCase().includes(keyword)
          );

          if (title && link && isRelevant) {
            const fullUrl = link.startsWith('http') ? link : `https://www.nsfas.org.za${link}`;
            
            this.results.push({
              id: this.generateId(title, 'NSFAS', 'NSFAS'),
              title: title,
              company: 'NSFAS - Government of South Africa',
              location: 'South Africa (National)',
              description: description || 'Government student financial aid',
              type: 'bursary',
              url: fullUrl,
              source: 'NSFAS',
              posted: new Date(),
              deadline: null,
              requirements: [],
              salary: 'Government Financial Aid',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing NSFAS item:', error.message);
        }
      });

      console.log(`✅ NSFAS: Found ${this.results.length - baseCount} new funding opportunities`);
    } catch (error) {
      console.error('❌ Error scraping NSFAS:', error.message);
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

module.exports = BursaryScraper;
