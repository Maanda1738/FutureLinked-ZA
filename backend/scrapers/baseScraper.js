/**
 * Base Scraper Class
 * Provides common functionality for all scrapers
 */

const axios = require('axios');
const cheerio = require('cheerio');

class BaseScraper {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.results = [];
  }

  /**
   * Fetch HTML content from a URL
   */
  async fetchPage(url, headers = {}) {
    try {
      const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      };

      console.log(`🌐 Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: { ...defaultHeaders, ...headers },
        timeout: 15000,
        maxRedirects: 5
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Parse HTML and return cheerio object
   */
  parseHTML(html) {
    return cheerio.load(html);
  }

  /**
   * Clean and normalize text
   */
  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
  }

  /**
   * Extract date from various formats
   */
  parseDate(dateString) {
    if (!dateString) return new Date();

    const cleaned = dateString.toLowerCase().trim();
    
    // Handle relative dates
    if (cleaned.includes('today') || cleaned.includes('just now')) {
      return new Date();
    }
    if (cleaned.includes('yesterday')) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    }
    
    // Extract days ago (e.g., "3 days ago")
    const daysMatch = cleaned.match(/(\d+)\s*days?\s*ago/);
    if (daysMatch) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(daysMatch[1]));
      return date;
    }

    // Extract weeks ago
    const weeksMatch = cleaned.match(/(\d+)\s*weeks?\s*ago/);
    if (weeksMatch) {
      const date = new Date();
      date.setDate(date.getDate() - (parseInt(weeksMatch[1]) * 7));
      return date;
    }

    // Extract months ago
    const monthsMatch = cleaned.match(/(\d+)\s*months?\s*ago/);
    if (monthsMatch) {
      const date = new Date();
      date.setMonth(date.getMonth() - parseInt(monthsMatch[1]));
      return date;
    }

    // Try to parse as standard date
    try {
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch (e) {
      // Fall through
    }

    // Default to current date if parsing fails
    return new Date();
  }

  /**
   * Generate unique ID from title and company
   */
  generateId(title, company, source) {
    const str = `${title}-${company}-${source}`.toLowerCase();
    return str.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }

  /**
   * Save results to JSON file
   */
  async saveResults(filename) {
    const fs = require('fs').promises;
    const path = require('path');
    const dataDir = path.join(__dirname, '..', 'data');
    const filepath = path.join(dataDir, filename);

    try {
      await fs.writeFile(filepath, JSON.stringify(this.results, null, 2));
      console.log(`✅ Saved ${this.results.length} results to ${filename}`);
    } catch (error) {
      console.error(`❌ Error saving results:`, error.message);
    }
  }

  /**
   * Load existing results from JSON file
   */
  async loadResults(filename) {
    const fs = require('fs').promises;
    const path = require('path');
    const dataDir = path.join(__dirname, '..', 'data');
    const filepath = path.join(dataDir, filename);

    try {
      const data = await fs.readFile(filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`⚠️ No existing data found: ${filename}`);
      return [];
    }
  }

  /**
   * Abstract method - must be implemented by child classes
   */
  async scrape() {
    throw new Error('scrape() method must be implemented by child class');
  }
}

module.exports = BaseScraper;
