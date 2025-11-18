const axios = require('axios');

// Web scrapers disabled by default - Adzuna API is primary source
const ENABLE_CAREER24 = process.env.ENABLE_CAREER24 === 'true';
const ENABLE_INDEED = process.env.ENABLE_INDEED === 'true';
const ENABLE_GOOGLE_JOBS = process.env.ENABLE_GOOGLE_JOBS === 'true';
const ENABLE_SA_COMPANIES = process.env.ENABLE_SA_COMPANIES === 'true';
const ENABLE_BURSARIES = process.env.ENABLE_BURSARIES === 'true';
const ENABLE_GRADUATE_PROGRAMS = process.env.ENABLE_GRADUATE_PROGRAMS === 'true';

// Only load scrapers if explicitly enabled
let scrapeCareer24, scrapeIndeed, scrapeBursaries, scrapeGraduatePrograms, scrapeGoogleJobs, scrapeSACompanies;

if (ENABLE_CAREER24) {
  try {
    ({ scrapeCareer24 } = require('./scrapers/career24Scraper'));
  } catch (e) {
    console.warn('Career24 scraper failed to load:', e.message);
  }
}
if (ENABLE_INDEED) {
  try {
    ({ scrapeIndeed } = require('./scrapers/indeedScraper'));
  } catch (e) {
    console.warn('Indeed scraper failed to load:', e.message);
  }
}
if (ENABLE_BURSARIES) {
  try {
    ({ scrapeBursaries } = require('./scrapers/bursaryScraper'));
  } catch (e) {
    console.warn('Bursaries scraper failed to load:', e.message);
  }
}
if (ENABLE_GRADUATE_PROGRAMS) {
  try {
    ({ scrapeGraduatePrograms } = require('./scrapers/graduateProgramScraper'));
  } catch (e) {
    console.warn('Graduate programs scraper failed to load:', e.message);
  }
}
if (ENABLE_GOOGLE_JOBS) {
  try {
    ({ scrapeGoogleJobs } = require('./scrapers/googleJobsScraper'));
  } catch (e) {
    console.warn('Google Jobs scraper failed to load:', e.message);
  }
}
if (ENABLE_SA_COMPANIES) {
  try {
    ({ scrapeSACompanies } = require('./scrapers/saCompaniesScraper'));
  } catch (e) {
    console.warn('SA Companies scraper failed to load:', e.message);
  }
}

class JobService {
  constructor() {
    this.adzunaAppId = process.env.ADZUNA_APP_ID;
    this.adzunaApiKey = process.env.ADZUNA_API_KEY;
    this.rapidApiKey = process.env.RAPIDAPI_KEY || process.env.JSEARCH_API_KEY;
    this.joobleApiKey = process.env.JOOBLE_API_KEY;
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.googleCseId = process.env.GOOGLE_CSE_ID;
    this.scraperTimeoutMs = parseInt(process.env.SCRAPER_TIMEOUT_MS || '12000', 10);
    
    // ✅ Job freshness settings
    this.maxDaysOld = parseInt(process.env.ADZUNA_MAX_DAYS_OLD || '30', 10);
    this.sortBy = process.env.ADZUNA_SORT_BY || 'date';
    
    // ✅ Track seen job IDs to prevent showing same jobs repeatedly
    this.seenJobsToday = new Map(); // jobId -> timestamp
    this.lastCleanup = Date.now();

    // Set a realistic User-Agent to reduce blocks from some sites
    axios.defaults.headers.common['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
    axios.defaults.headers.common['Accept-Language'] = 'en-ZA,en;q=0.9';
  }
  
  // ✅ Clean up seen jobs older than 24 hours
  cleanupSeenJobs() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Only cleanup once per hour
    if (now - this.lastCleanup < 60 * 60 * 1000) {
      return;
    }
    
    let cleaned = 0;
    for (const [jobId, timestamp] of this.seenJobsToday.entries()) {
      if (now - timestamp > oneDayMs) {
        this.seenJobsToday.delete(jobId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} job IDs older than 24 hours`);
    }
    
    this.lastCleanup = now;
  }
  
  // ✅ Mark jobs as seen
  markJobsAsSeen(jobs) {
    const now = Date.now();
    jobs.forEach(job => {
      if (job.jobId) {
        this.seenJobsToday.set(job.jobId, now);
      }
    });
  }
  
  // ✅ Check if job was already shown recently
  wasJobSeenRecently(jobId) {
    return this.seenJobsToday.has(jobId);
  }

  async searchJobs({ query, location = '', page = 1, limit = 15 }) {
    const allResults = [];
    const sources = [];
    const errors = [];

    try {
      // ✅ Cleanup old seen jobs before starting search
      this.cleanupSeenJobs();
      
      console.log(`🔍 Starting job search for: "${query}" in "${location || 'South Africa'}"`);

      const withTimeout = (promise, name) => {
        return Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${name} timed out after ${this.scraperTimeoutMs}ms`)), this.scraperTimeoutMs)
          )
        ]);
      };

      // PRIMARY SOURCE: Jooble API (fast, reliable, comprehensive)
      if (this.joobleApiKey) {
        try {
          console.log('🔗 Searching Jooble API (primary source)...');
          const joobleResults = await withTimeout(this.searchJooble(query, location, page), 'Jooble API');
          if (joobleResults.length > 0) {
            allResults.push(...joobleResults);
            sources.push('Jooble API');
            console.log(`✅ Jooble API: Found ${joobleResults.length} jobs`);
          } else {
            console.log('⚠️ Jooble API: No jobs found');
          }
        } catch (error) {
          console.error('❌ Jooble API failed:', error.message);
          errors.push(`Jooble: ${error.message}`);
        }
      }

      // SECONDARY SOURCE: JSearch API via RapidAPI (backup)
      if (this.rapidApiKey) {
        try {
          console.log('🔗 Searching JSearch API (secondary source)...');
          const jsearchResults = await withTimeout(this.searchJSearch(query, location, page), 'JSearch API');
          if (jsearchResults.length > 0) {
            allResults.push(...jsearchResults);
            sources.push('JSearch API');
            console.log(`✅ JSearch API: Found ${jsearchResults.length} jobs`);
          } else {
            console.log('⚠️ JSearch API: No jobs found');
          }
        } catch (error) {
          console.error('❌ JSearch API failed:', error.message);
          errors.push(`JSearch: ${error.message}`);
        }
      }

      // TERTIARY SOURCE: Google Custom Search API (additional results)
      if (this.googleApiKey && this.googleCseId) {
        try {
          console.log('🔗 Searching Google Custom Search API...');
          const googleResults = await withTimeout(this.searchGoogle(query, location), 'Google API');
          if (googleResults.length > 0) {
            allResults.push(...googleResults);
            sources.push('Google Search');
            console.log(`✅ Google Search: Found ${googleResults.length} jobs`);
          } else {
            console.log('⚠️ Google Search: No jobs found');
          }
        } catch (error) {
          console.error('❌ Google Search failed:', error.message);
          errors.push(`Google: ${error.message}`);
        }
      }

      // QUATERNARY SOURCE: Adzuna API (backup when others fail)
      if (this.adzunaAppId && this.adzunaApiKey) {
        try {
          console.log('🔗 Searching Adzuna API (secondary source)...');
          const adzunaResults = await withTimeout(this.searchAdzuna(query, location, page), 'Adzuna API');
          if (adzunaResults.length > 0) {
            allResults.push(...adzunaResults);
            sources.push('Adzuna API');
            console.log(`✅ Adzuna API: Found ${adzunaResults.length} jobs`);
          } else {
            console.log('⚠️ Adzuna API: No jobs found');
          }
        } catch (error) {
          console.error('❌ Adzuna API failed:', error.message);
          errors.push(`Adzuna: ${error.message}`);
        }
      } else {
        console.warn('⚠️ Adzuna API: No credentials configured. Set ADZUNA_APP_ID and ADZUNA_API_KEY in .env');
        errors.push('Adzuna: No API credentials configured');
      }

      // SUPPLEMENTARY SOURCES (only if enabled via env flags)
      if (ENABLE_CAREER24 && typeof scrapeCareer24 === 'function') {
        try {
          console.log('🌐 Scraping Career24 (supplementary)...');
          const career24Results = await withTimeout(scrapeCareer24(query, location), 'Career24');
          if (career24Results.length > 0) {
            allResults.push(...career24Results);
            sources.push('Career24');
            console.log(`✅ Career24: Found ${career24Results.length} jobs`);
          }
        } catch (error) {
          console.error('❌ Career24 scraping failed:', error.message);
          errors.push(`Career24: ${error.message}`);
        }
      }

      if (ENABLE_INDEED && typeof scrapeIndeed === 'function') {
        try {
          console.log('🌐 Scraping Indeed ZA (supplementary)...');
          const indeedResults = await withTimeout(scrapeIndeed(query, location), 'Indeed ZA');
          if (indeedResults.length > 0) {
            allResults.push(...indeedResults);
            sources.push('Indeed ZA');
            console.log(`✅ Indeed ZA: Found ${indeedResults.length} jobs`);
          }
        } catch (error) {
          console.error('❌ Indeed scraping failed:', error.message);
          errors.push(`Indeed: ${error.message}`);
        }
      }

      if (ENABLE_GOOGLE_JOBS && typeof scrapeGoogleJobs === 'function') {
        try {
          console.log('🔍 Scraping Google Jobs (supplementary)...');
          const googleResults = await withTimeout(scrapeGoogleJobs(query, location), 'Google Jobs');
          if (googleResults.length > 0) {
            allResults.push(...googleResults);
            sources.push('Google Jobs');
            console.log(`✅ Google Jobs: Found ${googleResults.length} jobs`);
          }
        } catch (error) {
          console.error('❌ Google Jobs scraping failed:', error.message);
          errors.push(`Google Jobs: ${error.message}`);
        }
      }

      if (ENABLE_SA_COMPANIES && typeof scrapeSACompanies === 'function') {
        try {
          console.log('🏢 Scraping SA Companies (supplementary)...');
          const saCompanyResults = await withTimeout(scrapeSACompanies(query, location), 'SA Companies');
          if (saCompanyResults.length > 0) {
            allResults.push(...saCompanyResults);
            sources.push('SA Companies');
            console.log(`✅ SA Companies: Found ${saCompanyResults.length} jobs`);
          }
        } catch (error) {
          console.error('❌ SA Companies scraping failed:', error.message);
          errors.push(`SA Companies: ${error.message}`);
        }
      }

      // Keyword-specific scrapers (only if enabled)
      if (ENABLE_GRADUATE_PROGRAMS && typeof scrapeGraduatePrograms === 'function') {
        if (query.toLowerCase().includes('internship') || query.toLowerCase().includes('graduate') ||
            query.toLowerCase().includes('programme') || query.toLowerCase().includes('program') ||
            query.toLowerCase().includes('trainee')) {
          try {
            console.log('🎓 Searching graduate programs (supplementary)...');
            const graduateResults = await scrapeGraduatePrograms(query, location);
            if (graduateResults.length > 0) {
              allResults.push(...graduateResults.map(this.formatGraduateProgram));
              sources.push('Graduate Programs');
              console.log(`✅ Graduate programs: Found ${graduateResults.length} opportunities`);
            }
          } catch (error) {
            console.error('❌ Graduate program search failed:', error.message);
            errors.push(`Graduate Programs: ${error.message}`);
          }
        }
      }

      if (ENABLE_BURSARIES && typeof scrapeBursaries === 'function') {
        if (query.toLowerCase().includes('bursary') || query.toLowerCase().includes('bursaries') ||
            query.toLowerCase().includes('scholarship') || query.toLowerCase().includes('funding') ||
            query.toLowerCase().includes('financial aid')) {
          try {
            console.log('💰 Searching bursaries (supplementary)...');
            const bursaryResults = await scrapeBursaries(query, location);
            if (bursaryResults.length > 0) {
              allResults.push(...bursaryResults.map(this.formatBursary));
              sources.push('Bursaries & Scholarships');
              console.log(`✅ Bursaries: Found ${bursaryResults.length} opportunities`);
            }
          } catch (error) {
            console.error('❌ Bursary search failed:', error.message);
            errors.push(`Bursaries: ${error.message}`);
          }
        }
      }

      // If absolutely no results found, return demo data
      if (allResults.length === 0) {
        console.log('❌ No jobs found from APIs');
        console.log('🔍 Sources attempted:', sources.length > 0 ? sources.join(', ') : 'Adzuna API');
        if (errors.length > 0) {
          console.log('⚠️ Errors encountered:', errors.join('; '));
        }
        
        // Return demo data so users can see the interface works
        const demoJobs = this.getDemoJobs(query, location);
        console.log(`📝 Returning ${demoJobs.length} demo jobs for testing`);
        
        return {
          results: demoJobs,
          total: demoJobs.length,
          sources: ['Demo Data'],
          message: 'Showing sample results. Live API data temporarily unavailable.',
          isDemo: true
        };
      }

      // Remove duplicates based on title and company
      const uniqueResults = this.removeDuplicates(allResults);

      // Sort by relevance and posted date (freshest first)
      const sortedResults = this.sortResults(uniqueResults, query);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedResults = sortedResults.slice(startIndex, startIndex + limit);
      
      // ✅ Mark these jobs as seen for this session
      this.markJobsAsSeen(paginatedResults);
      
      console.log(`✅ Returning ${paginatedResults.length} jobs (page ${page} of ${Math.ceil(sortedResults.length / limit)})`);

      return {
        results: paginatedResults,
        total: sortedResults.length,
        sources,
        freshness: '≤7 days old' // ✅ Indicate to frontend that these are fresh jobs
      };

    } catch (error) {
      console.error('❌ Job search error:', error);
      
      // Return error response instead of demo data
      return {
        results: [],
        total: 0,
        sources: ['Error'],
        error: 'Search temporarily unavailable. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }

  async searchJooble(query, location, page) {
    try {
      const url = `https://jooble.org/api/${this.joobleApiKey}`;
      
      // Force South African locations
      const searchLocation = location || 'South Africa';
      
      const data = {
        keywords: `${query} South Africa`,
        location: searchLocation
      };

      console.log('📡 Calling Jooble API with keywords:', data.keywords, 'Location:', searchLocation);
      const response = await axios.post(url, data, { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 
      });
      
      if (!response.data || !response.data.jobs) {
        console.log('⚠️ Jooble returned no jobs');
        return [];
      }

      // Filter for South African jobs only
      const saJobs = response.data.jobs.filter(job => {
        const location = job.location?.toLowerCase() || '';
        return location.includes('south africa') || 
               location.includes('johannesburg') ||
               location.includes('cape town') ||
               location.includes('pretoria') ||
               location.includes('durban') ||
               location.includes('gauteng') ||
               location.includes('western cape') ||
               location.includes('kwazulu') ||
               location.includes('eastern cape') ||
               location.includes('free state') ||
               location.includes('limpopo') ||
               location.includes('mpumalanga') ||
               location.includes('northern cape') ||
               location.includes('north west');
      });

      const jobs = saJobs.map(job => {
        const jobDate = job.updated ? new Date(job.updated) : new Date();
        const daysOld = (Date.now() - jobDate) / (1000 * 60 * 60 * 24);
        
        return {
          title: job.title,
          company: job.company || 'Company Not Listed',
          location: job.location,
          description: job.snippet || 'No description available',
          url: job.link,
          salary: job.salary || null,
          posted: job.updated || new Date().toISOString(),
          daysOld: Math.floor(daysOld),
          type: job.type || this.classifyJobType(job.title, job.snippet || ''),
          source: 'Jooble',
          requirements: [],
          jobId: job.id?.toString()
        };
      });
      
      console.log(`📅 Jooble returned ${saJobs.length} South African jobs out of ${response.data.jobs.length} total`);
      return jobs;
      
    } catch (error) {
      console.error('Jooble API error:', error.message);
      if (error.response) {
        console.error('Jooble response status:', error.response.status);
        console.error('Jooble response data:', error.response.data);
      }
      throw error;
    }
  }

  async searchJSearch(query, location, page) {
    try {
      const url = 'https://jsearch.p.rapidapi.com/search';
      
      const params = {
        query: `${query} in South Africa`.trim(),
        page: page || 1,
        num_pages: 1,
        date_posted: 'month', // Last 30 days
        country: 'za' // South Africa country code
      };

      const headers = {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      };

      console.log('📡 Calling JSearch API with query:', params.query);
      const response = await axios.get(url, { params, headers, timeout: 10000 });
      
      if (!response.data || !response.data.data) {
        console.log('⚠️ JSearch returned no data');
        return [];
      }

      // Filter for South African jobs only
      const saJobs = response.data.data.filter(job => {
        const country = job.job_country?.toLowerCase() || '';
        const city = job.job_city?.toLowerCase() || '';
        return country.includes('south africa') || 
               country === 'za' ||
               city.includes('johannesburg') ||
               city.includes('cape town') ||
               city.includes('pretoria') ||
               city.includes('durban');
      });

      const jobs = saJobs.map(job => {
        const jobDate = job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date();
        const daysOld = (Date.now() - jobDate) / (1000 * 60 * 60 * 24);
        
        return {
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : (job.job_country || 'Remote'),
          description: job.job_description || job.job_highlights?.Qualifications?.join('. ') || 'No description available',
          url: job.job_apply_link || job.job_google_link,
          salary: job.job_min_salary && job.job_max_salary 
            ? `${job.job_min_salary} - ${job.job_max_salary} ${job.job_salary_currency || ''}`
            : null,
          posted: job.job_posted_at_datetime_utc || new Date().toISOString(),
          daysOld: Math.floor(daysOld),
          type: this.classifyJobType(job.job_title, job.job_description || ''),
          source: 'JSearch',
          requirements: job.job_highlights?.Qualifications?.slice(0, 5) || [],
          jobId: job.job_id
        };
      });
      
      console.log(`📅 JSearch returned ${saJobs.length} South African jobs out of ${response.data.data.length} total`);
      return jobs;
      
    } catch (error) {
      console.error('JSearch API error:', error.message);
      if (error.response) {
        console.error('JSearch response status:', error.response.status);
        console.error('JSearch response data:', error.response.data);
      }
      throw error;
    }
  }

  async searchGoogle(query, location) {
    try {
      const url = 'https://www.googleapis.com/customsearch/v1';
      
      const searchQuery = `${query} jobs ${location || 'South Africa'}`;
      
      const params = {
        key: this.googleApiKey,
        cx: this.googleCseId,
        q: searchQuery,
        num: 10 // Max 10 results per request
      };

      console.log('📡 Calling Google Custom Search API');
      const response = await axios.get(url, { params, timeout: 10000 });
      
      if (!response.data || !response.data.items) {
        console.log('⚠️ Google returned no items');
        return [];
      }

      const jobs = response.data.items
        .filter(item => {
          // Only include South African job listings
          const text = `${item.title} ${item.snippet} ${item.link}`.toLowerCase();
          return text.includes('south africa') || 
                 text.includes('johannesburg') ||
                 text.includes('cape town') ||
                 text.includes('pretoria') ||
                 text.includes('durban') ||
                 text.includes('.co.za');
        })
        .map(item => {
          return {
            title: item.title,
            company: this.extractCompanyFromGoogle(item),
            location: location || 'South Africa',
            description: item.snippet,
            url: item.link,
            salary: null,
            posted: new Date().toISOString(),
            daysOld: 0,
            type: this.classifyJobType(item.title, item.snippet),
            source: 'Google',
            requirements: [],
            jobId: item.cacheId || item.link
          };
        });
      
      console.log(`📅 Google returned ${jobs.length} South African jobs`);
      return jobs;
      
    } catch (error) {
      console.error('Google API error:', error.message);
      if (error.response) {
        console.error('Google response status:', error.response.status);
        console.error('Google response data:', error.response.data);
      }
      throw error;
    }
  }

  extractCompanyFromGoogle(item) {
    // Try to extract company name from title or snippet
    if (item.title.includes(' at ')) {
      return item.title.split(' at ')[1].split(' - ')[0].trim();
    }
    if (item.title.includes(' - ')) {
      const parts = item.title.split(' - ');
      if (parts.length > 1) return parts[parts.length - 1].trim();
    }
    return 'Company Not Listed';
  }

  async searchAdzuna(query, location, page) {
    try {
      const country = 'za'; // South Africa
      const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
      
      const params = {
        app_id: this.adzunaAppId,
        app_key: this.adzunaApiKey,
        what: query,
        where: location || 'South Africa',
        results_per_page: 50, // Increased from 20 to get more results per request
        sort_by: this.sortBy, // ✅ Sort by newest first (configurable)
        max_days_old: this.maxDaysOld // ✅ Only jobs posted within configured days (default: 7)
      };

      const response = await axios.get(url, { params, timeout: 10000 });
      
      // ✅ Additional client-side filtering for extra freshness
      const jobs = response.data.results.map(job => {
        const jobDate = new Date(job.created);
        const daysOld = (Date.now() - jobDate) / (1000 * 60 * 60 * 24);
        
        return {
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          url: job.redirect_url,
          salary: job.salary_min && job.salary_max 
            ? `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`
            : null,
          posted: job.created,
          daysOld: Math.floor(daysOld), // Track age for filtering
          type: this.classifyJobType(job.title, job.description),
          source: 'Adzuna',
          requirements: this.extractRequirements(job.description),
          jobId: job.id // ✅ Track job ID for duplicate detection
        };
      });
      
      // ✅ Filter out jobs older than configured max days (double-check API filter)
      const freshJobs = jobs.filter(job => job.daysOld <= this.maxDaysOld);
      
      console.log(`📅 Filtered ${jobs.length} jobs → ${freshJobs.length} fresh jobs (≤${this.maxDaysOld} days old)`);
      
      return freshJobs;
    } catch (error) {
      console.error('Adzuna API error:', error.message);
      if (error.response) {
        console.error('Adzuna response status:', error.response.status);
        console.error('Adzuna response data:', error.response.data);
      }
      throw error; // Re-throw so caller can handle
    }
  }

  removeDuplicates(jobs) {
    const seenIds = new Set();
    const seenUrls = new Set();
    const seenTitleCompany = new Set();
    
    return jobs.filter(job => {
      // ✅ 1. Check by job ID (if available from Adzuna)
      if (job.jobId) {
        if (seenIds.has(job.jobId)) {
          console.log(`🔄 Duplicate job ID skipped: ${job.title} (ID: ${job.jobId})`);
          return false;
        }
        seenIds.add(job.jobId);
      }
      
      // ✅ 2. Check by redirect URL (catches reposts with same URL)
      if (job.url) {
        const normalizedUrl = job.url.split('?')[0]; // Remove query params
        if (seenUrls.has(normalizedUrl)) {
          console.log(`🔄 Duplicate URL skipped: ${job.title}`);
          return false;
        }
        seenUrls.add(normalizedUrl);
      }
      
      // ✅ 3. Check by title + company combination
      const key = `${job.title?.toLowerCase().trim()}-${job.company?.toLowerCase().trim()}`;
      if (seenTitleCompany.has(key)) {
        console.log(`🔄 Duplicate title+company skipped: ${job.title} at ${job.company}`);
        return false;
      }
      seenTitleCompany.add(key);
      
      return true;
    });
  }

  sortResults(jobs, query) {
    const queryWords = query.toLowerCase().split(' ');
    
    return jobs.sort((a, b) => {
      // ✅ 1. Prioritize jobs posted within last 3 days (super fresh)
      const superFreshA = a.daysOld !== undefined && a.daysOld <= 3;
      const superFreshB = b.daysOld !== undefined && b.daysOld <= 3;
      
      if (superFreshA && !superFreshB) return -1;
      if (!superFreshA && superFreshB) return 1;
      
      // ✅ 2. Calculate relevance score
      const scoreA = this.calculateRelevanceScore(a, queryWords);
      const scoreB = this.calculateRelevanceScore(b, queryWords);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
      
      // ✅ 3. If equal relevance, sort by date (newer first)
      const dateA = new Date(a.posted || '2000-01-01');
      const dateB = new Date(b.posted || '2000-01-01');
      return dateB - dateA;
    });
  }

  calculateRelevanceScore(job, queryWords) {
    let score = 0;
    const title = (job.title || '').toLowerCase();
    const description = (job.description || '').toLowerCase();
    
    queryWords.forEach(word => {
      if (title.includes(word)) score += 3;
      if (description.includes(word)) score += 1;
    });
    
    return score;
  }

  classifyJobType(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('internship') || text.includes('intern')) return 'internship';
    if (text.includes('graduate') || text.includes('grad') || text.includes('trainee')) return 'graduate';
    if (text.includes('bursary') || text.includes('scholarship')) return 'bursary';
    
    return 'job';
  }

  extractRequirements(description) {
    if (!description) return [];
    
    const requirements = [];
    const text = description.toLowerCase();
    
    // Common requirements patterns
    const patterns = [
      /(?:bachelor|degree|diploma|matric|grade 12)/g,
      /(?:\d+[\+\-]?\s*years?\s*(?:of\s*)?experience)/g,
      /(?:knowledge\s+(?:of|in)\s+\w+)/g,
      /(?:proficient\s+(?:in|with)\s+\w+)/g,
      /(?:experience\s+(?:with|in)\s+\w+)/g
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        requirements.push(...matches.slice(0, 2)); // Limit to 2 per pattern
      }
    });
    
    return requirements.slice(0, 5); // Limit total requirements
  }

  // New method for specialized graduate/internship sources
  async searchSpecializedSources(query, location) {
    const results = [];
    
    // Add searches for specific SA university career portals, government programs, etc.
    try {
      // This could be expanded to include:
      // - University career portals (UCT, Wits, UP, etc.)
      // - Government internship programs
      // - SETA programs
      // - Graduate development programs
      
      // For now, return empty but log the attempt
      console.log('🎓 Specialized sources search completed (expandable)');
      
    } catch (error) {
      console.error('Specialized sources error:', error.message);
    }
    
    return results;
  }

  // Format graduate program data to match job structure
  formatGraduateProgram(program) {
    return {
      title: program.title,
      company: program.company,
      location: program.location || 'Multiple locations',
      description: program.description,
      url: program.url,
      salary: null,
      posted: 'Recently posted',
      type: program.type || 'Graduate Programme',
      source: program.source,
      requirements: [
        program.requirements || 'Recent graduate',
        `Duration: ${program.duration || 'Varies'}`,
        `Application period: ${program.application_period || 'Check website'}`
      ],
      field: program.field || 'General'
    };
  }

  // Format bursary data to match job structure
  formatBursary(bursary) {
    return {
      title: bursary.title,
      company: bursary.organization,
      location: 'South Africa',
      description: bursary.description,
      url: bursary.url,
      salary: bursary.amount || 'Amount varies',
      posted: 'Application open',
      type: bursary.type || 'Bursary',
      source: bursary.source,
      requirements: [
        bursary.requirements || 'Academic merit required',
        `Field: ${bursary.field || 'General Studies'}`,
        `Deadline: ${bursary.deadline || 'Check website'}`
      ],
      field: bursary.field || 'General Studies'
    };
  }

  // Demo data for when API is unavailable
  getDemoJobs(query, location) {
    const queryLower = query.toLowerCase();
    const demoJobs = [
      {
        title: 'Software Developer',
        company: 'TechCorp SA',
        location: 'Johannesburg, Gauteng',
        description: 'We are looking for a talented software developer to join our growing team. You will work on exciting projects using modern technologies.',
        url: '#',
        salary: 'R35,000 - R50,000',
        posted: new Date().toISOString(),
        daysOld: 1,
        type: 'job',
        source: 'Demo',
        requirements: ['Bachelor\'s degree in Computer Science', '2+ years experience', 'Knowledge of React and Node.js']
      },
      {
        title: 'Graduate Programme - IT',
        company: 'Future Solutions',
        location: 'Cape Town, Western Cape',
        description: 'Join our prestigious graduate programme designed to fast-track your career in technology.',
        url: '#',
        salary: 'R25,000 - R30,000',
        posted: new Date().toISOString(),
        daysOld: 2,
        type: 'graduate',
        source: 'Demo',
        requirements: ['Recent graduate', 'Degree in IT or related field', 'Strong problem-solving skills']
      },
      {
        title: 'Data Analyst Internship',
        company: 'Data Insights Ltd',
        location: 'Pretoria, Gauteng',
        description: 'Exciting internship opportunity for aspiring data analysts to gain hands-on experience.',
        url: '#',
        salary: 'R12,000 - R15,000',
        posted: new Date().toISOString(),
        daysOld: 3,
        type: 'internship',
        source: 'Demo',
        requirements: ['Currently studying or recent graduate', 'Knowledge of Excel and SQL', 'Analytical mindset']
      },
      {
        title: 'Marketing Coordinator',
        company: 'Brand Builders',
        location: 'Durban, KwaZulu-Natal',
        description: 'We are seeking a creative marketing coordinator to support our dynamic marketing team.',
        url: '#',
        salary: 'R20,000 - R28,000',
        posted: new Date().toISOString(),
        daysOld: 1,
        type: 'job',
        source: 'Demo',
        requirements: ['Marketing qualification', '1-2 years experience', 'Social media expertise']
      },
      {
        title: 'Engineering Bursary 2025',
        company: 'SA Engineering Corp',
        location: 'Various Locations',
        description: 'Full bursary covering tuition fees and accommodation for outstanding engineering students.',
        url: '#',
        salary: 'Full tuition + R5,000/month',
        posted: new Date().toISOString(),
        daysOld: 5,
        type: 'bursary',
        source: 'Demo',
        requirements: ['Engineering student', 'Minimum 65% average', 'South African citizen']
      }
    ];

    // Filter demo jobs based on query
    if (queryLower.includes('internship')) {
      return demoJobs.filter(j => j.type === 'internship' || j.type === 'graduate');
    } else if (queryLower.includes('bursary') || queryLower.includes('scholarship')) {
      return demoJobs.filter(j => j.type === 'bursary');
    } else if (queryLower.includes('graduate')) {
      return demoJobs.filter(j => j.type === 'graduate');
    }

    return demoJobs;
  }
}

const jobService = new JobService();

module.exports = {
  searchJobs: (params) => jobService.searchJobs(params)
};