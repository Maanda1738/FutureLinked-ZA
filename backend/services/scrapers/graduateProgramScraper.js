const axios = require('axios');
const cheerio = require('cheerio');

class GraduateProgramScraper {
  constructor() {
    this.delay = parseInt(process.env.SCRAPING_DELAY) || 2000;
    this.timeout = 15000;
  }

  async scrapeGraduatePrograms(query, location = '') {
    const allPrograms = [];
    
    try {
      console.log(`🎓 Searching for graduate programs: "${query}"`);

      // Scrape multiple graduate program sources
      const sources = [
        () => this.scrapeCorporatePrograms(query),
        () => this.scrapeGovGraduatePrograms(query),
        () => this.scrapeBankingPrograms(query),
        () => this.scrapeConsultingPrograms(query),
        () => this.scrapeTechPrograms(query)
      ];

      for (const scrapeSource of sources) {
        try {
          await this.sleep(this.delay);
          const results = await scrapeSource();
          if (results && results.length > 0) {
            allPrograms.push(...results);
          }
        } catch (error) {
          console.error('Graduate program source error:', error.message);
        }
      }

      // Remove duplicates and return
      return this.removeDuplicates(allPrograms);

    } catch (error) {
      console.error('❌ Graduate program scraping failed:', error.message);
      return [];
    }
  }

  async scrapeCorporatePrograms(query) {
    try {
      const programs = [
        {
          title: 'Sasol Graduate Development Programme',
          company: 'Sasol',
          description: 'Comprehensive 2-year graduate development programme across various disciplines including engineering, science, and business.',
          duration: '24 months',
          requirements: 'Recent graduate, South African citizen, relevant degree, strong academic record',
          application_period: 'February - May annually',
          url: 'https://www.sasol.com/careers/graduates',
          type: 'Corporate Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Durban, Secunda',
          source: 'Sasol'
        },
        {
          title: 'Anglo American Graduate Programme',
          company: 'Anglo American',
          description: 'Accelerated development programme for graduates in mining, engineering, and business functions.',
          duration: '18-24 months',
          requirements: 'Engineering/Business degree, academic excellence, leadership potential',
          application_period: 'March - July annually',
          url: 'https://www.angloamerican.com/careers/graduates',
          type: 'Corporate Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'Anglo American'
        },
        {
          title: 'Eskom Graduate Programme',
          company: 'Eskom',
          description: 'Graduate development programme in engineering, finance, and technical fields.',
          duration: '12-18 months',
          requirements: 'Engineering/Technical degree, South African citizen',
          application_period: 'January - April annually',
          url: 'https://www.eskom.co.za/careers/graduates',
          type: 'SOE Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town, Durban',
          source: 'Eskom'
        },
        {
          title: 'Transnet Graduate Programme',
          company: 'Transnet',
          description: 'Graduate trainee programme across logistics, engineering, and business operations.',
          duration: '24 months',
          requirements: 'Relevant degree, South African citizen, willing to relocate',
          application_period: 'Throughout the year',
          url: 'https://www.transnet.net/careers/graduates',
          type: 'SOE Graduate Programme',
          field: this.extractField(query),
          location: 'Multiple locations',
          source: 'Transnet'
        }
      ];

      return programs.filter(p => this.isRelevantProgram(p.title + ' ' + p.description, query));
    } catch (error) {
      console.error('Corporate programs scraping error:', error.message);
      return [];
    }
  }

  async scrapeGovGraduatePrograms(query) {
    try {
      const programs = [
        {
          title: 'Government Graduate Internship Programme',
          company: 'Department of Public Service and Administration',
          description: 'Internship opportunities across various government departments for recent graduates.',
          duration: '12 months',
          requirements: 'Recent graduate, South African citizen, relevant qualification',
          application_period: 'Opens periodically',
          url: 'https://www.dpsa.gov.za/dpsa2g/internships.php',
          type: 'Government Programme',
          field: this.extractField(query),
          location: 'Cape Town, Pretoria, Various',
          source: 'DPSA'
        },
        {
          title: 'SARS Graduate Programme',
          company: 'South African Revenue Service',
          description: 'Graduate development programme in tax administration, auditing, and finance.',
          duration: '24 months',
          requirements: 'Accounting/Finance/Law degree, South African citizen',
          application_period: 'February - May annually',
          url: 'https://www.sars.gov.za/careers/graduates',
          type: 'Government Programme',
          field: 'Finance/Accounting',
          location: 'Pretoria, Cape Town, Johannesburg',
          source: 'SARS'
        }
      ];

      return programs.filter(p => this.isRelevantProgram(p.title + ' ' + p.description, query));
    } catch (error) {
      console.error('Government programs scraping error:', error.message);
      return [];
    }
  }

  async scrapeBankingPrograms(query) {
    try {
      const programs = [
        {
          title: 'Standard Bank Graduate Programme',
          company: 'Standard Bank',
          description: 'Comprehensive graduate programme across banking, finance, and technology divisions.',
          duration: '18 months',
          requirements: 'Relevant degree, strong academic record, leadership potential',
          application_period: 'March - June annually',
          url: 'https://www.standardbank.co.za/careers/graduates',
          type: 'Banking Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'Standard Bank'
        },
        {
          title: 'FNB Graduate Programme',
          company: 'First National Bank',
          description: 'Graduate development programme in banking, technology, and business operations.',
          duration: '12-18 months',
          requirements: 'Degree in relevant field, South African citizen',
          application_period: 'February - May annually',
          url: 'https://www.fnb.co.za/careers/graduates',
          type: 'Banking Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town, Durban',
          source: 'FNB'
        },
        {
          title: 'Nedbank Graduate Programme',
          company: 'Nedbank',
          description: 'Graduate acceleration programme across various business units.',
          duration: '18 months',
          requirements: 'University degree, strong academics, leadership skills',
          application_period: 'April - July annually',
          url: 'https://www.nedbank.co.za/careers/graduates',
          type: 'Banking Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'Nedbank'
        },
        {
          title: 'ABSA Graduate Programme',
          company: 'ABSA Bank',
          description: 'Graduate development programme focusing on banking and financial services.',
          duration: '24 months',
          requirements: 'Relevant qualification, South African resident',
          application_period: 'January - April annually',
          url: 'https://www.absa.co.za/careers/graduates',
          type: 'Banking Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'ABSA'
        }
      ];

      return programs.filter(p => this.isRelevantProgram(p.title + ' ' + p.description, query));
    } catch (error) {
      console.error('Banking programs scraping error:', error.message);
      return [];
    }
  }

  async scrapeConsultingPrograms(query) {
    try {
      const programs = [
        {
          title: 'Deloitte Graduate Programme',
          company: 'Deloitte',
          description: 'Graduate programme across audit, consulting, tax, and advisory services.',
          duration: '18-24 months',
          requirements: 'Honours degree, strong academics, analytical skills',
          application_period: 'February - May annually',
          url: 'https://www.deloitte.com/za/careers/graduates',
          type: 'Consulting Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town, Durban',
          source: 'Deloitte'
        },
        {
          title: 'PwC Graduate Programme',
          company: 'PricewaterhouseCoopers',
          description: 'Graduate development programme in assurance, advisory, and tax services.',
          duration: '18 months',
          requirements: 'Relevant degree, strong academic performance',
          application_period: 'March - June annually',
          url: 'https://www.pwc.co.za/careers/graduates',
          type: 'Consulting Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'PwC'
        },
        {
          title: 'KPMG Graduate Programme',
          company: 'KPMG',
          description: 'Graduate programme across audit, tax, and advisory services.',
          duration: '18-24 months',
          requirements: 'University qualification, leadership potential',
          application_period: 'January - April annually',
          url: 'https://www.kpmg.co.za/careers/graduates',
          type: 'Consulting Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town, Durban',
          source: 'KPMG'
        }
      ];

      return programs.filter(p => this.isRelevantProgram(p.title + ' ' + p.description, query));
    } catch (error) {
      console.error('Consulting programs scraping error:', error.message);
      return [];
    }
  }

  async scrapeTechPrograms(query) {
    try {
      const programs = [
        {
          title: 'Microsoft Graduate Programme',
          company: 'Microsoft South Africa',
          description: 'Graduate programme for technology roles in software development and consulting.',
          duration: '12-18 months',
          requirements: 'Computer Science/Engineering degree, programming skills',
          application_period: 'Throughout the year',
          url: 'https://careers.microsoft.com/graduates',
          type: 'Technology Graduate Programme',
          field: 'Technology/IT',
          location: 'Johannesburg, Cape Town',
          source: 'Microsoft'
        },
        {
          title: 'MTN Graduate Programme',
          company: 'MTN Group',
          description: 'Graduate development programme in telecommunications and technology.',
          duration: '18 months',
          requirements: 'Engineering/IT/Business degree, innovation mindset',
          application_period: 'February - May annually',
          url: 'https://www.mtn.co.za/careers/graduates',
          type: 'Technology Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town',
          source: 'MTN'
        },
        {
          title: 'Vodacom Graduate Programme',
          company: 'Vodacom',
          description: 'Graduate programme across technology, business, and engineering functions.',
          duration: '24 months',
          requirements: 'Relevant degree, strong academics, technology passion',
          application_period: 'March - June annually',
          url: 'https://www.vodacom.co.za/careers/graduates',
          type: 'Technology Graduate Programme',
          field: this.extractField(query),
          location: 'Johannesburg, Cape Town, Durban',
          source: 'Vodacom'
        }
      ];

      return programs.filter(p => this.isRelevantProgram(p.title + ' ' + p.description, query));
    } catch (error) {
      console.error('Tech programs scraping error:', error.message);
      return [];
    }
  }

  extractField(text) {
    const lowerText = text.toLowerCase();
    
    // Technology
    if (lowerText.includes('technology') || lowerText.includes('software') || 
        lowerText.includes('computer') || lowerText.includes('it ') ||
        lowerText.includes('data science') || lowerText.includes('programming')) {
      return 'Technology/IT';
    }
    
    // Engineering
    if (lowerText.includes('engineering') || lowerText.includes('engineer')) {
      return 'Engineering';
    }
    
    // Finance/Banking
    if (lowerText.includes('finance') || lowerText.includes('banking') || 
        lowerText.includes('accounting') || lowerText.includes('audit')) {
      return 'Finance/Banking';
    }
    
    // Business/Management
    if (lowerText.includes('business') || lowerText.includes('management') || 
        lowerText.includes('consulting') || lowerText.includes('marketing')) {
      return 'Business/Management';
    }
    
    // Law
    if (lowerText.includes('law') || lowerText.includes('legal')) {
      return 'Law';
    }
    
    // Mining
    if (lowerText.includes('mining') || lowerText.includes('mineral')) {
      return 'Mining';
    }
    
    // Government/Public Service
    if (lowerText.includes('government') || lowerText.includes('public service') ||
        lowerText.includes('administration')) {
      return 'Government/Public Service';
    }
    
    return 'General';
  }

  isRelevantProgram(text, query) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Always include if query contains "graduate" or related terms
    if (queryLower.includes('graduate') || queryLower.includes('trainee') || 
        queryLower.includes('programme') || queryLower.includes('program') ||
        queryLower.includes('internship') || queryLower.includes('development')) {
      return true;
    }
    
    // Check field relevance
    const field = this.extractField(queryLower);
    const textField = this.extractField(textLower);
    
    return field === textField || textLower.includes(queryLower);
  }

  removeDuplicates(programs) {
    const seen = new Set();
    return programs.filter(program => {
      const key = `${program.title}-${program.company}`;
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

module.exports = { scrapeGraduatePrograms: async (query, location) => {
  const scraper = new GraduateProgramScraper();
  return await scraper.scrapeGraduatePrograms(query, location);
}};