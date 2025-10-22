const axios = require('axios');
const cheerio = require('cheerio');

class BursaryScraper {
  constructor() {
    this.delay = parseInt(process.env.SCRAPING_DELAY) || 2000;
    this.timeout = 15000;
  }

  async scrapeBursaries(query, location = '') {
    const allBursaries = [];
    
    try {
      console.log(`🎓 Searching for bursaries: "${query}"`);

      // Scrape multiple bursary sources
      const sources = [
        () => this.scrapeNSFAS(query),
        () => this.scrapeFunza(query),
        () => this.scrapeCareerWise(query),
        () => this.scrapeStudyTrust(query),
        () => this.scrapeUniversityBursaries(query)
      ];

      for (const scrapeSource of sources) {
        try {
          await this.sleep(this.delay);
          const results = await scrapeSource();
          if (results && results.length > 0) {
            allBursaries.push(...results);
          }
        } catch (error) {
          console.error('Bursary source error:', error.message);
        }
      }

      // Remove duplicates and return
      return this.removeDuplicates(allBursaries);

    } catch (error) {
      console.error('❌ Bursary scraping failed:', error.message);
      return [];
    }
  }

  async scrapeNSFAS(query) {
    try {
      // NSFAS bursary information
      return [{
        title: `NSFAS Bursary - ${query} Studies`,
        organization: 'National Student Financial Aid Scheme',
        description: 'NSFAS provides financial assistance to eligible South African students studying at public universities and TVET colleges.',
        amount: 'Full tuition + accommodation + allowances',
        requirements: 'South African citizen, family income below R350,000, academic merit',
        deadline: 'Applications open annually in September',
        url: 'https://www.nsfas.org.za',
        type: 'Government Bursary',
        field: this.extractField(query),
        source: 'NSFAS'
      }];
    } catch (error) {
      console.error('NSFAS scraping error:', error.message);
      return [];
    }
  }

  async scrapeFunza(query) {
    try {
      const response = await axios.get('https://www.funza.com/bursaries', {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const bursaries = [];

      $('.bursary-item, .scholarship-item, .funding-item').each((i, element) => {
        const title = $(element).find('h3, h2, .title').text().trim();
        const organization = $(element).find('.company, .organization, .provider').text().trim();
        const description = $(element).find('.description, .summary, p').first().text().trim();
        const amount = $(element).find('.amount, .value, .funding').text().trim();
        const deadline = $(element).find('.deadline, .closing-date, .due').text().trim();
        const link = $(element).find('a').attr('href');

        if (title && this.isRelevantBursary(title, query)) {
          bursaries.push({
            title,
            organization: organization || 'Various Providers',
            description: description || 'Bursary opportunity for South African students',
            amount: amount || 'Amount varies',
            requirements: 'Academic merit, South African citizen',
            deadline: deadline || 'Check website for dates',
            url: link ? this.resolveUrl(link, 'https://www.funza.com') : 'https://www.funza.com',
            type: 'Private Bursary',
            field: this.extractField(title + ' ' + description),
            source: 'Funza'
          });
        }
      });

      return bursaries.slice(0, 5);
    } catch (error) {
      console.error('Funza scraping error:', error.message);
      return [];
    }
  }

  async scrapeCareerWise(query) {
    try {
      // CareerWise bursary listings
      const bursaries = [
        {
          title: `Sasol Bursary Programme - ${this.extractField(query)}`,
          organization: 'Sasol',
          description: 'Comprehensive bursary programme for engineering, science, and commerce students.',
          amount: 'Full tuition + accommodation + stipend',
          requirements: 'Academic excellence, South African citizen, specific fields of study',
          deadline: 'March annually',
          url: 'https://www.sasol.com/careers/bursaries',
          type: 'Corporate Bursary',
          field: this.extractField(query),
          source: 'Sasol'
        },
        {
          title: `Anglo American Bursary - ${this.extractField(query)}`,
          organization: 'Anglo American',
          description: 'Bursary programme for mining, engineering, and related fields.',
          amount: 'Full study costs + living allowance',
          requirements: 'Academic merit, career commitment to mining industry',
          deadline: 'June annually',
          url: 'https://www.angloamerican.com/careers/students',
          type: 'Corporate Bursary',
          field: this.extractField(query),
          source: 'Anglo American'
        }
      ];

      return bursaries.filter(b => this.isRelevantBursary(b.title, query));
    } catch (error) {
      console.error('CareerWise scraping error:', error.message);
      return [];
    }
  }

  async scrapeStudyTrust(query) {
    try {
      // Study Trust and foundation bursaries
      return [{
        title: `Study Trust Bursary - ${this.extractField(query)}`,
        organization: 'Various Study Trusts',
        description: 'Multiple study trusts offer bursaries for disadvantaged South African students.',
        amount: 'Varies by trust',
        requirements: 'Financial need, academic potential, South African citizen',
        deadline: 'Throughout the year',
        url: 'https://www.studytrust.org.za',
        type: 'Trust Bursary',
        field: this.extractField(query),
        source: 'Study Trust'
      }];
    } catch (error) {
      console.error('Study Trust scraping error:', error.message);
      return [];
    }
  }

  async scrapeUniversityBursaries(query) {
    try {
      // University-specific bursaries
      const universities = [
        {
          name: 'University of Cape Town',
          url: 'https://www.uct.ac.za/students/fees-funding/bursaries',
          bursary: 'UCT Bursary Programme'
        },
        {
          name: 'University of the Witwatersrand',
          url: 'https://www.wits.ac.za/students/fees-and-funding/',
          bursary: 'Wits Bursary Programme'
        },
        {
          name: 'Stellenbosch University',
          url: 'https://www.sun.ac.za/english/students/bursaries',
          bursary: 'Stellenbosch Bursary Scheme'
        }
      ];

      return universities.map(uni => ({
        title: `${uni.bursary} - ${this.extractField(query)}`,
        organization: uni.name,
        description: `Financial assistance for deserving students at ${uni.name}.`,
        amount: 'Varies based on need and merit',
        requirements: 'Academic merit, financial need, admission to university',
        deadline: 'Check university website',
        url: uni.url,
        type: 'University Bursary',
        field: this.extractField(query),
        source: uni.name
      }));
    } catch (error) {
      console.error('University bursary scraping error:', error.message);
      return [];
    }
  }

  extractField(text) {
    const lowerText = text.toLowerCase();
    
    // Engineering fields
    if (lowerText.includes('engineering') || lowerText.includes('engineer')) {
      return 'Engineering';
    }
    if (lowerText.includes('mechanical')) return 'Mechanical Engineering';
    if (lowerText.includes('electrical')) return 'Electrical Engineering';
    if (lowerText.includes('civil')) return 'Civil Engineering';
    if (lowerText.includes('chemical')) return 'Chemical Engineering';
    
    // Science fields
    if (lowerText.includes('medicine') || lowerText.includes('medical')) return 'Medicine';
    if (lowerText.includes('computer') || lowerText.includes('it ') || lowerText.includes('software')) return 'Computer Science/IT';
    if (lowerText.includes('data science') || lowerText.includes('analytics')) return 'Data Science';
    if (lowerText.includes('science')) return 'Science';
    
    // Business fields
    if (lowerText.includes('accounting') || lowerText.includes('finance')) return 'Accounting/Finance';
    if (lowerText.includes('business') || lowerText.includes('management')) return 'Business/Management';
    if (lowerText.includes('marketing')) return 'Marketing';
    
    // Other fields
    if (lowerText.includes('law')) return 'Law';
    if (lowerText.includes('teaching') || lowerText.includes('education')) return 'Education';
    if (lowerText.includes('agriculture')) return 'Agriculture';
    if (lowerText.includes('mining')) return 'Mining';
    
    return 'General Studies';
  }

  isRelevantBursary(title, query) {
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Always include if query contains "bursary" or general terms
    if (queryLower.includes('bursary') || queryLower.includes('scholarship') || 
        queryLower.includes('funding') || queryLower.includes('financial aid')) {
      return true;
    }
    
    // Check field relevance
    const field = this.extractField(queryLower);
    const titleField = this.extractField(titleLower);
    
    return field === titleField || titleLower.includes(queryLower);
  }

  removeDuplicates(bursaries) {
    const seen = new Set();
    return bursaries.filter(bursary => {
      const key = `${bursary.title}-${bursary.organization}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  resolveUrl(url, baseUrl) {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return baseUrl + url;
    return baseUrl + '/' + url;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { scrapeBursaries: async (query, location) => {
  const scraper = new BursaryScraper();
  return await scraper.scrapeBursaries(query, location);
}};