/**
 * Corporate Careers Scraper
 * Intelligently scrapes career pages from top South African companies
 */

const BaseScraper = require('./baseScraper');
const cheerio = require('cheerio');

class CorporateScraper extends BaseScraper {
  constructor() {
    super('CorporateScraper', '');
    
    // Top 50+ South African Companies
    this.companies = [
      // Banks & Financial Services
      { name: 'Absa', website: 'https://www.absa.co.za', keywords: ['careers', 'jobs', 'vacancies', 'opportunities'] },
      { name: 'Standard Bank', website: 'https://www.standardbank.co.za', keywords: ['careers', 'jobs', 'graduate', 'bursaries'] },
      { name: 'Nedbank', website: 'https://www.nedbank.co.za', keywords: ['careers', 'jobs', 'opportunities'] },
      { name: 'FNB', website: 'https://www.fnb.co.za', keywords: ['careers', 'jobs', 'graduate'] },
      { name: 'Capitec Bank', website: 'https://www.capitecbank.co.za', keywords: ['careers', 'jobs', 'vacancies'] },
      { name: 'Old Mutual', website: 'https://www.oldmutual.co.za', keywords: ['careers', 'jobs', 'opportunities', 'bursaries'] },
      { name: 'Sanlam', website: 'https://www.sanlam.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Discovery', website: 'https://www.discovery.co.za', keywords: ['careers', 'jobs', 'graduate'] },
      
      // Retail
      { name: 'Shoprite', website: 'https://www.shoprite.co.za', keywords: ['careers', 'jobs', 'vacancies'] },
      { name: 'Pick n Pay', website: 'https://www.pnp.co.za', keywords: ['careers', 'jobs', 'opportunities'] },
      { name: 'Woolworths', website: 'https://www.woolworths.co.za', keywords: ['careers', 'jobs', 'graduate'] },
      { name: 'Spar', website: 'https://www.spar.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Massmart', website: 'https://www.massmart.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Mr Price', website: 'https://www.mrpricegroup.com', keywords: ['careers', 'jobs'] },
      { name: 'Truworths', website: 'https://www.truworths.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Foschini Group', website: 'https://www.tfglimited.co.za', keywords: ['careers', 'jobs'] },
      
      // Telecommunications
      { name: 'MTN', website: 'https://www.mtn.co.za', keywords: ['careers', 'jobs', 'graduate', 'internships'] },
      { name: 'Vodacom', website: 'https://www.vodacom.co.za', keywords: ['careers', 'jobs', 'graduate'] },
      { name: 'Telkom', website: 'https://www.telkom.co.za', keywords: ['careers', 'jobs', 'opportunities'] },
      { name: 'Cell C', website: 'https://www.cellc.co.za', keywords: ['careers', 'jobs'] },
      
      // Mining
      { name: 'Anglo American', website: 'https://www.angloamerican.com', keywords: ['careers', 'jobs', 'graduate', 'bursaries'] },
      { name: 'Sasol', website: 'https://www.sasol.com', keywords: ['careers', 'jobs', 'graduate', 'bursaries'] },
      { name: 'Exxaro', website: 'https://www.exxaro.com', keywords: ['careers', 'jobs', 'bursaries'] },
      { name: 'Sibanye-Stillwater', website: 'https://www.sibanyestillwater.com', keywords: ['careers', 'jobs'] },
      { name: 'Harmony Gold', website: 'https://www.harmony.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Impala Platinum', website: 'https://www.implats.co.za', keywords: ['careers', 'jobs', 'bursaries'] },
      { name: 'Gold Fields', website: 'https://www.goldfields.com', keywords: ['careers', 'jobs'] },
      
      // Technology
      { name: 'Naspers', website: 'https://www.naspers.com', keywords: ['careers', 'jobs'] },
      { name: 'Takealot', website: 'https://www.takealot.com', keywords: ['careers', 'jobs'] },
      { name: 'Dimension Data', website: 'https://www.dimensiondata.com', keywords: ['careers', 'jobs'] },
      { name: 'EOH', website: 'https://www.eoh.co.za', keywords: ['careers', 'jobs'] },
      
      // Manufacturing & Industry
      { name: 'Bidvest', website: 'https://www.bidvest.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Barloworld', website: 'https://www.barloworld.com', keywords: ['careers', 'jobs', 'graduate'] },
      { name: 'Clover', website: 'https://www.clover.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Tiger Brands', website: 'https://www.tigerbrands.com', keywords: ['careers', 'jobs'] },
      { name: 'RCL Foods', website: 'https://www.rclfoods.com', keywords: ['careers', 'jobs'] },
      { name: 'AVI', website: 'https://www.avi.co.za', keywords: ['careers', 'jobs'] },
      
      // Energy & Utilities
      { name: 'Eskom', website: 'https://www.eskom.co.za', keywords: ['careers', 'jobs', 'vacancies', 'bursaries'] },
      { name: 'Transnet', website: 'https://www.transnet.net', keywords: ['careers', 'jobs', 'opportunities', 'bursaries'] },
      { name: 'Rand Water', website: 'https://www.randwater.co.za', keywords: ['careers', 'jobs'] },
      
      // Insurance
      { name: 'Momentum', website: 'https://www.momentum.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Santam', website: 'https://www.santam.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Liberty', website: 'https://www.liberty.co.za', keywords: ['careers', 'jobs', 'graduate'] },
      
      // Media
      { name: 'MultiChoice', website: 'https://www.multichoice.com', keywords: ['careers', 'jobs'] },
      { name: 'Primedia', website: 'https://www.primedia.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Media24', website: 'https://www.media24.com', keywords: ['careers', 'jobs'] },
      
      // Healthcare & Pharma
      { name: 'Dis-Chem', website: 'https://www.dischem.co.za', keywords: ['careers', 'jobs', 'opportunities'] },
      { name: 'Clicks', website: 'https://www.clicksgroup.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Aspen Pharmacare', website: 'https://www.aspenpharma.com', keywords: ['careers', 'jobs'] },
      { name: 'Netcare', website: 'https://www.netcare.co.za', keywords: ['careers', 'jobs', 'bursaries'] },
      { name: 'Life Healthcare', website: 'https://www.lifehealthcare.co.za', keywords: ['careers', 'jobs'] },
      
      // Property & Construction
      { name: 'Growthpoint', website: 'https://www.growthpoint.co.za', keywords: ['careers', 'jobs'] },
      { name: 'Redefine Properties', website: 'https://www.redefine.co.za', keywords: ['careers', 'jobs'] },
      { name: 'WBHO', website: 'https://www.wbho.co.za', keywords: ['careers', 'jobs', 'bursaries'] },
      { name: 'Murray & Roberts', website: 'https://www.murrob.com', keywords: ['careers', 'jobs'] }
    ];
  }

  async scrape() {
    console.log('🏢 Starting corporate careers scraping...');
    console.log(`📊 Scraping ${this.companies.length} companies\n`);
    this.results = [];

    let successCount = 0;
    let errorCount = 0;

    for (const company of this.companies) {
      try {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`🏢 ${company.name}`);
        console.log(`${'─'.repeat(60)}`);
        
        const opportunities = await this.scrapeCompany(company);
        
        if (opportunities.length > 0) {
          this.results.push(...opportunities);
          console.log(`✅ ${company.name}: Found ${opportunities.length} opportunities`);
          successCount++;
        } else {
          console.log(`⚠️  ${company.name}: No opportunities found`);
        }
        
        // Be respectful - wait between requests
        await this.sleep(2000);
        
      } catch (error) {
        console.error(`❌ ${company.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ Scraping complete!`);
    console.log(`   Companies scraped: ${successCount}/${this.companies.length}`);
    console.log(`   Total opportunities: ${this.results.length}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`${'═'.repeat(60)}\n`);

    // Remove duplicates
    this.results = this.removeDuplicates(this.results);
    
    await this.saveResults('corporate-opportunities.json');
    return this.results;
  }

  /**
   * Scrape a single company's career page
   */
  async scrapeCompany(company) {
    const opportunities = [];
    
    // Try to find career page URLs
    const careerUrls = await this.findCareerPages(company);
    
    if (careerUrls.length === 0) {
      console.log(`   No career pages found`);
      return opportunities;
    }

    // Scrape each career page
    for (const url of careerUrls.slice(0, 3)) { // Limit to first 3 pages
      try {
        console.log(`   Checking: ${url}`);
        const pageOpportunities = await this.scrapeCareerPage(url, company);
        opportunities.push(...pageOpportunities);
      } catch (error) {
        console.log(`   Error scraping ${url}: ${error.message}`);
      }
    }

    return opportunities;
  }

  /**
   * Find career page URLs for a company
   */
  async findCareerPages(company) {
    const urls = [];
    
    try {
      // Try common career page patterns
      const patterns = [
        '/careers',
        '/jobs',
        '/vacancies',
        '/opportunities',
        '/work-with-us',
        '/join-us',
        '/about/careers',
        '/about/jobs',
        '/company/careers',
        '/bursaries',
        '/graduates',
        '/graduate-programme',
        '/internships',
        '/learnership'
      ];

      // Try to fetch main homepage first
      const html = await this.fetchPage(company.website);
      if (!html) return urls;

      const $ = this.parseHTML(html);
      
      // Look for career links in navigation, footer, etc.
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().toLowerCase();
        
        if (!href) return;
        
        // Check if link text contains career-related keywords
        const hasKeyword = company.keywords.some(keyword => 
          text.includes(keyword) || href.toLowerCase().includes(keyword)
        );
        
        if (hasKeyword) {
          // Build full URL
          let fullUrl = href;
          if (href.startsWith('/')) {
            fullUrl = company.website + href;
          } else if (!href.startsWith('http')) {
            fullUrl = company.website + '/' + href;
          }
          
          if (!urls.includes(fullUrl)) {
            urls.push(fullUrl);
          }
        }
      });

      // If no links found, try common patterns
      if (urls.length === 0) {
        for (const pattern of patterns) {
          urls.push(company.website + pattern);
        }
      }

    } catch (error) {
      console.log(`   Error finding career pages: ${error.message}`);
    }

    return urls;
  }

  /**
   * Scrape opportunities from a career page
   */
  async scrapeCareerPage(url, company) {
    const opportunities = [];
    
    try {
      const html = await this.fetchPage(url);
      if (!html) return opportunities;

      const $ = this.parseHTML(html);
      
      // Common selectors for job listings
      const selectors = [
        '.job-listing', '.job-item', '.job-card', '.job',
        '.vacancy', '.position', '.opportunity', '.career-item',
        '.bursary-item', '.graduate-item', '.internship-item',
        '[class*="job"]', '[class*="vacancy"]', '[class*="career"]',
        'article', '.listing', '.post'
      ];

      let foundItems = false;

      for (const selector of selectors) {
        const items = $(selector);
        
        if (items.length > 0) {
          console.log(`   Found ${items.length} items with selector: ${selector}`);
          foundItems = true;

          items.each((i, elem) => {
            try {
              const $elem = $(elem);
              
              // Extract job details
              const title = this.cleanText(
                $elem.find('h1, h2, h3, h4, .title, .job-title, .position-title').first().text() ||
                $elem.find('a').first().text()
              );
              
              const link = $elem.find('a').first().attr('href');
              
              const description = this.cleanText(
                $elem.find('.description, .summary, .excerpt, p').first().text()
              );
              
              const location = this.cleanText(
                $elem.find('.location, .job-location, [class*="location"]').first().text()
              );

              const dateText = this.cleanText(
                $elem.find('.date, .posted-date, time, [class*="date"]').first().text()
              );

              // Only add if we have at least title
              if (title && title.length > 5) {
                // Determine type
                const titleLower = title.toLowerCase();
                let type = 'job';
                if (titleLower.includes('bursary') || titleLower.includes('scholarship')) {
                  type = 'bursary';
                } else if (titleLower.includes('internship') || titleLower.includes('intern')) {
                  type = 'internship';
                } else if (titleLower.includes('learnership')) {
                  type = 'learnership';
                } else if (titleLower.includes('graduate') || titleLower.includes('grad')) {
                  type = 'graduate-program';
                }

                // Build full URL
                let fullUrl = url;
                if (link) {
                  if (link.startsWith('http')) {
                    fullUrl = link;
                  } else if (link.startsWith('/')) {
                    fullUrl = company.website + link;
                  } else {
                    fullUrl = company.website + '/' + link;
                  }
                }

                opportunities.push({
                  id: this.generateId(title, company.name, 'Corporate'),
                  title: title,
                  company: company.name,
                  location: location || 'South Africa',
                  description: description || `${type} opportunity at ${company.name}`,
                  type: type,
                  url: fullUrl,
                  source: `${company.name} Careers`,
                  posted: this.parseDate(dateText),
                  deadline: null,
                  requirements: [],
                  salary: 'Not specified',
                  created: new Date().toISOString()
                });
              }
            } catch (error) {
              // Skip individual items that fail
            }
          });

          break; // Found items, no need to try other selectors
        }
      }

      if (!foundItems) {
        console.log(`   No job listings found on page`);
      }

    } catch (error) {
      console.log(`   Error scraping page: ${error.message}`);
    }

    return opportunities;
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

module.exports = CorporateScraper;
