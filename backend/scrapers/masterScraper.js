/**
 * Master Scraper
 * Orchestrates all scrapers and manages the scraping process
 */

const BursaryScraper = require('./bursaryScraper');
const JobScraper = require('./jobScraper');
const LearnershipScraper = require('./learnershipScraper');
const CorporateScraper = require('./corporateScraper');
const ITBursaryScraper = require('./itBursaryScraper');
const DatabaseManager = require('../database/DatabaseManager');
const fs = require('fs').promises;
const path = require('path');

class MasterScraper {
  constructor() {
    this.scrapers = {
      bursaries: new BursaryScraper(),
      itBursaries: new ITBursaryScraper(),
      jobs: new JobScraper(),
      learnerships: new LearnershipScraper(),
      corporate: new CorporateScraper()
    };
    
    this.dataDir = path.join(__dirname, '..', 'data');
    this.db = new DatabaseManager();
  }

  /**
   * Run all scrapers
   */
  async scrapeAll() {
    console.log('🚀 Starting master scraping process...\n');
    const startTime = Date.now();
    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
      stats: {},
      errors: []
    };

    // Run each scraper
    for (const [name, scraper] of Object.entries(this.scrapers)) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Starting ${name} scraper...`);
        console.log(`${'='.repeat(60)}\n`);
        
        const data = await scraper.scrape();
        results.data[name] = data;
        
        // Save to database
        if (data.length > 0) {
          console.log(`\n💾 Saving ${data.length} items to database...`);
          const dbResults = await this.db.saveOpportunities(data);
          console.log(`✅ Database: ${dbResults.new} new, ${dbResults.updated} updated, ${dbResults.errors} errors`);
          
          // Log scraping activity
          await this.db.logScraping(name, data.length, dbResults.new, dbResults.updated, 'success');
        }
        
        results.stats[name] = {
          count: data.length,
          success: true
        };
        
        console.log(`\n✅ ${name} completed: ${data.length} items\n`);
      } catch (error) {
        console.error(`\n❌ Error in ${name} scraper:`, error.message, '\n');
        results.errors.push({
          scraper: name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        results.stats[name] = {
          count: 0,
          success: false,
          error: error.message
        };
        
        // Log failed scraping
        await this.db.logScraping(name, 0, 0, 0, 'failed', error.message);
      }
    }

    // Save combined results
    await this.saveCombinedResults(results);
    
    // Mark old opportunities as inactive
    console.log('\n🧹 Cleaning up old opportunities...');
    const cleanup = await this.db.markOldOpportunitiesInactive(90);
    console.log(`✅ Marked ${cleanup.changes} old opportunities as inactive\n`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎉 Master scraping completed in ${duration}s`);
    console.log(`${'='.repeat(60)}\n`);
    
    this.printSummary(results);
    
    // Print database stats
    await this.printDatabaseStats();
    
    return results;
  }

  /**
   * Save combined results and metadata
   */
  async saveCombinedResults(results) {
    const metadataFile = path.join(this.dataDir, 'scraper-metadata.json');
    
    try {
      // Save metadata
      await fs.writeFile(metadataFile, JSON.stringify({
        timestamp: results.timestamp,
        stats: results.stats,
        errors: results.errors
      }, null, 2));

      console.log(`\n✅ Saved scraper metadata to scraper-metadata.json`);
    } catch (error) {
      console.error('❌ Error saving combined results:', error.message);
    }
  }

  /**
   * Print summary of scraping results
   */
  printSummary(results) {
    console.log('\n📊 SCRAPING SUMMARY');
    console.log('═'.repeat(60));
    
    let totalItems = 0;
    for (const [name, stats] of Object.entries(results.stats)) {
      const icon = stats.success ? '✅' : '❌';
      console.log(`${icon} ${name.padEnd(20)} ${stats.count.toString().padStart(5)} items`);
      totalItems += stats.count;
    }
    
    console.log('─'.repeat(60));
    console.log(`   ${'TOTAL'.padEnd(20)} ${totalItems.toString().padStart(5)} items`);
    console.log('═'.repeat(60));

    if (results.errors.length > 0) {
      console.log(`\n⚠️  ${results.errors.length} error(s) occurred during scraping`);
    }
    console.log('');
  }

  /**
   * Load all scraped data
   */
  async loadAllData() {
    const data = {
      bursaries: [],
      jobs: [],
      learnerships: [],
      internships: []
    };

    try {
      // Load bursaries
      const bursaryFile = path.join(this.dataDir, 'bursaries.json');
      try {
        const content = await fs.readFile(bursaryFile, 'utf8');
        data.bursaries = JSON.parse(content);
      } catch (e) {
        // File doesn't exist yet
      }

      // Load jobs
      const jobFile = path.join(this.dataDir, 'jobs.json');
      try {
        const content = await fs.readFile(jobFile, 'utf8');
        data.jobs = JSON.parse(content);
      } catch (e) {
        // File doesn't exist yet
      }

      // Load learnerships (includes internships)
      const learnershipFile = path.join(this.dataDir, 'learnerships.json');
      try {
        const content = await fs.readFile(learnershipFile, 'utf8');
        const items = JSON.parse(content);
        data.learnerships = items.filter(item => item.type === 'learnership');
        data.internships = items.filter(item => item.type === 'internship');
      } catch (e) {
        // File doesn't exist yet
      }

      return data;
    } catch (error) {
      console.error('Error loading scraped data:', error.message);
      return data;
    }
  }

  /**
   * Print database statistics
   */
  async printDatabaseStats() {
    try {
      const stats = await this.db.getStats();
      
      console.log('\n📊 DATABASE STATISTICS');
      console.log('═'.repeat(60));
      
      let totalActive = 0;
      for (const row of stats) {
        console.log(`${row.type.padEnd(20)} ${row.count.toString().padStart(6)} total | ${row.count_7days.toString().padStart(5)} (7d) | ${row.count_30days.toString().padStart(5)} (30d)`);
        totalActive += row.count;
      }
      
      console.log('─'.repeat(60));
      console.log(`${'TOTAL ACTIVE'.padEnd(20)} ${totalActive.toString().padStart(6)} opportunities`);
      console.log('═'.repeat(60));
      console.log('');
    } catch (error) {
      console.error('Error getting database stats:', error.message);
    }
  }

  /**
   * Query database for opportunities
   */
  async searchDatabase(filters) {
    try {
      return await this.db.searchOpportunities(filters);
    } catch (error) {
      console.error('Error searching database:', error.message);
      return [];
    }
  }

  /**
   * Close database connection
   */
  async closeDatabase() {
    await this.db.close();
  }
}

// If run directly, execute scraping
if (require.main === module) {
  const master = new MasterScraper();
  master.scrapeAll()
    .then(async () => {
      console.log('✅ Scraping completed successfully');
      await master.closeDatabase();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('❌ Scraping failed:', error);
      await master.closeDatabase();
      process.exit(1);
    });
}

module.exports = MasterScraper;
