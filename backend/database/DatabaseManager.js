/**
 * Database Manager
 * Manages SQLite database for storing scraped opportunities
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseManager {
  constructor() {
    const dbPath = path.join(__dirname, '..', 'data', 'opportunities.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  /**
   * Initialize database tables
   */
  initializeTables() {
    const createOpportunitiesTable = `
      CREATE TABLE IF NOT EXISTS opportunities (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        description TEXT,
        type TEXT NOT NULL,
        url TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL,
        posted_date TEXT,
        deadline_date TEXT,
        salary TEXT,
        requirements TEXT,
        scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        views INTEGER DEFAULT 0
      )
    `;

    const createCompaniesTable = `
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        website TEXT,
        careers_url TEXT,
        industry TEXT,
        logo_url TEXT,
        last_scraped TEXT,
        scrape_count INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )
    `;

    const createScrapingLogsTable = `
      CREATE TABLE IF NOT EXISTS scraping_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scraper_name TEXT NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        items_found INTEGER DEFAULT 0,
        items_new INTEGER DEFAULT 0,
        items_updated INTEGER DEFAULT 0,
        status TEXT,
        error_message TEXT
      )
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_type ON opportunities(type);
      CREATE INDEX IF NOT EXISTS idx_company ON opportunities(company);
      CREATE INDEX IF NOT EXISTS idx_posted_date ON opportunities(posted_date);
      CREATE INDEX IF NOT EXISTS idx_is_active ON opportunities(is_active);
      CREATE INDEX IF NOT EXISTS idx_source ON opportunities(source);
    `;

    this.db.serialize(() => {
      this.db.run(createOpportunitiesTable);
      this.db.run(createCompaniesTable);
      this.db.run(createScrapingLogsTable);
      this.db.run(createIndexes);
      console.log('✅ Database tables initialized');
    });
  }

  /**
   * Insert or update opportunity
   */
  async saveOpportunity(opportunity) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO opportunities 
        (id, title, company, location, description, type, url, source, posted_date, deadline_date, salary, requirements, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const params = [
        opportunity.id,
        opportunity.title,
        opportunity.company,
        opportunity.location || 'South Africa',
        opportunity.description,
        opportunity.type,
        opportunity.url,
        opportunity.source,
        opportunity.posted instanceof Date ? opportunity.posted.toISOString() : opportunity.posted,
        opportunity.deadline || null,
        opportunity.salary || 'Not specified',
        JSON.stringify(opportunity.requirements || [])
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: opportunity.id, changes: this.changes });
        }
      });
    });
  }

  /**
   * Batch insert opportunities
   */
  async saveOpportunities(opportunities) {
    const results = {
      success: 0,
      errors: 0,
      updated: 0,
      new: 0
    };

    for (const opp of opportunities) {
      try {
        const result = await this.saveOpportunity(opp);
        if (result.changes > 0) {
          results.new++;
        } else {
          results.updated++;
        }
        results.success++;
      } catch (error) {
        console.error(`Error saving opportunity ${opp.id}:`, error.message);
        results.errors++;
      }
    }

    return results;
  }

  /**
   * Search opportunities
   */
  async searchOpportunities(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM opportunities WHERE is_active = 1';
      const params = [];

      if (filters.type) {
        sql += ' AND type = ?';
        params.push(filters.type);
      }

      if (filters.query) {
        sql += ' AND (title LIKE ? OR description LIKE ? OR company LIKE ?)';
        const searchTerm = `%${filters.query}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (filters.company) {
        sql += ' AND company LIKE ?';
        params.push(`%${filters.company}%`);
      }

      if (filters.location) {
        sql += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
      }

      if (filters.daysOld) {
        sql += ` AND posted_date >= datetime('now', '-${filters.daysOld} days')`;
      }

      sql += ' ORDER BY posted_date DESC';

      if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse requirements JSON
          const results = rows.map(row => ({
            ...row,
            requirements: JSON.parse(row.requirements || '[]')
          }));
          resolve(results);
        }
      });
    });
  }

  /**
   * Get statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          type,
          COUNT(*) as count,
          COUNT(CASE WHEN date(posted_date) >= date('now', '-7 days') THEN 1 END) as count_7days,
          COUNT(CASE WHEN date(posted_date) >= date('now', '-30 days') THEN 1 END) as count_30days
        FROM opportunities
        WHERE is_active = 1
        GROUP BY type
      `;

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Log scraping activity
   */
  async logScraping(scraperName, itemsFound, itemsNew, itemsUpdated, status, errorMessage = null) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO scraping_logs 
        (scraper_name, started_at, completed_at, items_found, items_new, items_updated, status, error_message)
        VALUES (?, datetime('now', '-1 minutes'), CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)
      `;

      this.db.run(sql, [scraperName, itemsFound, itemsNew, itemsUpdated, status, errorMessage], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  /**
   * Get scraping history
   */
  async getScrapingHistory(limit = 50) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM scraping_logs 
        ORDER BY started_at DESC 
        LIMIT ?
      `;

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Mark old opportunities as inactive
   */
  async markOldOpportunitiesInactive(daysOld = 90) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE opportunities 
        SET is_active = 0 
        WHERE posted_date < datetime('now', '-${daysOld} days')
        AND is_active = 1
      `;

      this.db.run(sql, [], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database connection closed');
          resolve();
        }
      });
    });
  }
}

module.exports = DatabaseManager;
