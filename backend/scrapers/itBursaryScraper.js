const BaseScraper = require('./baseScraper');

/**
 * IT Bursaries Scraper
 * Specialized scraper for IT, Computer Science, and Tech bursaries in South Africa
 */
class ITBursaryScraper extends BaseScraper {
  constructor() {
    super('IT Bursaries');
  }

  /**
   * Main scraping method - coordinates all IT bursary sources
   */
  async scrape() {
    console.log('\n💻 Starting IT bursary scraping...');
    
    // Scrape all IT bursary sources
    await this.scrapeYouthVillageIT();
    await this.scrapeStudyTrustIT();
    await this.scrapeCareerJunctionIT();
    await this.scrapeTechCompanies();
    await this.scrapeGovernmentIT();
    
    console.log(`✅ Total IT bursaries scraped: ${this.results.length}`);
    
    // Save results
    if (this.results.length > 0) {
      await this.saveResults('it-bursaries.json');
    }
    
    return this.results;
  }

  /**
   * Scrape Youth Village for IT bursaries
   */
  async scrapeYouthVillageIT() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.youthvillage.co.za/bursaries/');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.bursary-item, .post, article').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .title').first().text());
          const link = $(elem).find('a').first().attr('href');
          const description = this.cleanText($(elem).find('.description, .excerpt, p').first().text());
          
          // Filter for IT-related bursaries
          const itKeywords = ['it', 'information technology', 'computer science', 'software', 'programming', 
                             'coding', 'data science', 'cyber security', 'network', 'developer', 'tech', 
                             'computing', 'digital', 'artificial intelligence', 'ai', 'machine learning'];
          
          const titleLower = title.toLowerCase();
          const descLower = description.toLowerCase();
          const isITRelated = itKeywords.some(keyword => 
            titleLower.includes(keyword) || descLower.includes(keyword)
          );

          if (title && link && isITRelated) {
            const fullUrl = link.startsWith('http') ? link : `https://www.youthvillage.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, 'Various', 'YouthVillage-IT'),
              title: title,
              company: 'Various IT Companies',
              location: 'South Africa',
              description: description || 'IT/Computer Science bursary opportunity',
              type: 'bursary',
              category: 'IT & Technology',
              url: fullUrl,
              source: 'Youth Village IT',
              posted: new Date(),
              deadline: null,
              requirements: ['IT or Computer Science field of study'],
              salary: 'IT Bursary',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Youth Village IT item:', error.message);
        }
      });

      console.log(`✅ Youth Village IT: Found ${this.results.length - baseCount} IT bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Youth Village IT:', error.message);
    }
  }

  /**
   * Scrape Study Trust for IT bursaries
   */
  async scrapeStudyTrustIT() {
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

          // Filter for IT-related bursaries
          const itKeywords = ['it', 'information technology', 'computer science', 'software', 'programming', 
                             'coding', 'data science', 'cyber security', 'network', 'developer', 'tech', 
                             'computing', 'digital', 'ict'];
          
          const titleLower = title.toLowerCase();
          const descLower = description.toLowerCase();
          const isITRelated = itKeywords.some(keyword => 
            titleLower.includes(keyword) || descLower.includes(keyword)
          );

          if (title && link && isITRelated) {
            const fullUrl = link.startsWith('http') ? link : `https://www.studytrust.org.za${link}`;
            
            this.results.push({
              id: this.generateId(title, 'Various', 'StudyTrust-IT'),
              title: title,
              company: 'Various IT Companies',
              location: 'South Africa',
              description: description || 'IT/Technology bursary opportunity',
              type: 'bursary',
              category: 'IT & Technology',
              url: fullUrl,
              source: 'Study Trust IT',
              posted: new Date(),
              deadline: null,
              requirements: ['IT or related field'],
              salary: 'IT Bursary',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Study Trust IT item:', error.message);
        }
      });

      console.log(`✅ Study Trust IT: Found ${this.results.length - baseCount} IT bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Study Trust IT:', error.message);
    }
  }

  /**
   * Scrape Career Junction for IT bursaries
   */
  async scrapeCareerJunctionIT() {
    try {
      const baseCount = this.results.length;
      const html = await this.fetchPage('https://www.careerjunction.co.za/jobs/results?keywords=bursary+it');
      if (!html) return;

      const $ = this.parseHTML(html);
      
      $('.job, .job-item, article[class*="job"]').each((i, elem) => {
        try {
          const title = this.cleanText($(elem).find('h2, h3, .job-title, a[class*="title"]').first().text());
          const link = $(elem).find('a').first().attr('href');
          const company = this.cleanText($(elem).find('.company, [class*="company"]').first().text());
          const location = this.cleanText($(elem).find('.location, [class*="location"]').first().text());

          // Check if it's a bursary and IT-related
          const titleLower = title.toLowerCase();
          const isBursary = titleLower.includes('bursary') || titleLower.includes('scholarship');
          const isIT = titleLower.includes('it') || titleLower.includes('computer') || 
                      titleLower.includes('software') || titleLower.includes('tech');

          if (title && link && isBursary && isIT) {
            const fullUrl = link.startsWith('http') ? link : `https://www.careerjunction.co.za${link}`;
            
            this.results.push({
              id: this.generateId(title, company || 'Various', 'CareerJunction-IT'),
              title: title,
              company: company || 'Various IT Companies',
              location: location || 'South Africa',
              description: 'IT Bursary opportunity from Career Junction',
              type: 'bursary',
              category: 'IT & Technology',
              url: fullUrl,
              source: 'Career Junction IT',
              posted: new Date(),
              deadline: null,
              requirements: ['IT/Computer Science students'],
              salary: 'IT Bursary',
              created: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Error parsing Career Junction IT item:', error.message);
        }
      });

      console.log(`✅ Career Junction IT: Found ${this.results.length - baseCount} IT bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Career Junction IT:', error.message);
    }
  }

  /**
   * Scrape major tech companies for IT bursaries
   */
  async scrapeTechCompanies() {
    const techCompanies = [
      { name: 'Microsoft', url: 'https://www.microsoft.com/en-za/careers' },
      { name: 'IBM', url: 'https://www.ibm.com/za-en/employment/' },
      { name: 'Dimension Data', url: 'https://www.dimensiondata.com/en-za/careers' },
      { name: 'Telkom', url: 'https://www.telkom.co.za/careers/' },
      { name: 'Vodacom', url: 'https://www.vodacom.co.za/vodacom/about/about-vodacom/careers' },
      { name: 'MTN', url: 'https://www.mtn.com/career/' },
      { name: 'Accenture', url: 'https://www.accenture.com/za-en/careers' },
      { name: 'BCX', url: 'https://www.bcx.co.za/careers/' },
    ];

    for (const company of techCompanies) {
      try {
        const baseCount = this.results.length;
        const html = await this.fetchPage(company.url);
        if (!html) continue;

        const $ = this.parseHTML(html);
        
        // Look for bursary/graduate program links
        $('a').each((i, elem) => {
          const linkText = this.cleanText($(elem).text());
          const href = $(elem).attr('href');
          
          const textLower = linkText.toLowerCase();
          const hasBursary = textLower.includes('bursary') || textLower.includes('scholarship') || 
                            textLower.includes('student') || textLower.includes('graduate program');
          
          if (hasBursary && href) {
            const fullUrl = href.startsWith('http') ? href : `${company.url}${href}`;
            
            this.results.push({
              id: this.generateId(linkText, company.name, 'TechCompany'),
              title: `${company.name} IT Bursary/Graduate Program`,
              company: company.name,
              location: 'South Africa',
              description: `IT bursary or graduate program opportunity at ${company.name}`,
              type: 'bursary',
              category: 'IT & Technology',
              url: fullUrl,
              source: `${company.name} Careers`,
              posted: new Date(),
              deadline: null,
              requirements: ['IT/Computer Science/Engineering students'],
              salary: 'IT Bursary/Graduate Program',
              created: new Date().toISOString()
            });
          }
        });

        if (this.results.length > baseCount) {
          console.log(`✅ ${company.name}: Found ${this.results.length - baseCount} IT opportunities`);
        }
      } catch (error) {
        console.error(`❌ Error scraping ${company.name}:`, error.message);
      }
    }
  }

  /**
   * Scrape government IT bursaries (SITA, NEMISA, etc.)
   */
  async scrapeGovernmentIT() {
    try {
      const baseCount = this.results.length;
      
      // SITA (State Information Technology Agency)
      const sitaHtml = await this.fetchPage('https://www.sita.co.za/');
      if (sitaHtml) {
        const $ = this.parseHTML(sitaHtml);
        
        $('a').each((i, elem) => {
          const linkText = this.cleanText($(elem).text());
          const href = $(elem).attr('href');
          
          const textLower = linkText.toLowerCase();
          const hasBursary = textLower.includes('bursary') || textLower.includes('learnership') || 
                            textLower.includes('internship') || textLower.includes('graduate');
          
          if (hasBursary && href && linkText.length > 5) {
            const fullUrl = href.startsWith('http') ? href : `https://www.sita.co.za${href}`;
            
            this.results.push({
              id: this.generateId(linkText, 'SITA', 'Gov-IT'),
              title: `SITA ${linkText}`,
              company: 'SITA - State Information Technology Agency',
              location: 'South Africa (National)',
              description: 'Government IT bursary/learnership from SITA',
              type: 'bursary',
              category: 'IT & Technology',
              url: fullUrl,
              source: 'SITA (Government)',
              posted: new Date(),
              deadline: null,
              requirements: ['South African citizen', 'IT/Computer Science field'],
              salary: 'Government IT Bursary',
              created: new Date().toISOString()
            });
          }
        });
      }

      console.log(`✅ Government IT: Found ${this.results.length - baseCount} IT bursaries`);
    } catch (error) {
      console.error('❌ Error scraping Government IT:', error.message);
    }
  }
}

module.exports = ITBursaryScraper;
