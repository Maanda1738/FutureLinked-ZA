# 🤖 FutureLinked ZA Web Scraper System

Comprehensive web scraping system for collecting opportunities from multiple South African sources.

## 📋 What It Scrapes

### 🎓 Bursaries
- **Bursaries South Africa** (bursaries-southafrica.co.za)
- **Careers Portal** (careersportal.co.za/bursaries)
- **Youth Village** (youthvillage.co.za/bursaries)

### 💼 Jobs
- **PNet** (pnet.co.za)
- **Career Junction** (careerjunction.co.za)
- **Plus Adzuna API** (already integrated)

### 🎯 Learnerships & Internships
- **Youth Village** (youthvillage.co.za/learnerships)
- **Careers Portal** (careersportal.co.za/internships)

---

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Run Manual Scrape

```powershell
node scrapers/masterScraper.js
```

### 3. View Results

Scraped data is saved to `backend/data/`:
- `bursaries.json` - All bursary opportunities
- `jobs.json` - Job listings
- `learnerships.json` - Learnerships and internships
- `scraper-metadata.json` - Scraping statistics and timestamps

---

## 📁 File Structure

```
backend/
├── scrapers/
│   ├── baseScraper.js          # Base class with common functionality
│   ├── bursaryScraper.js       # Scrapes bursary sites
│   ├── jobScraper.js           # Scrapes job boards
│   ├── learnershipScraper.js   # Scrapes learnership/internship sites
│   └── masterScraper.js        # Orchestrates all scrapers
├── data/
│   ├── bursaries.json          # Scraped bursaries (generated)
│   ├── jobs.json               # Scraped jobs (generated)
│   ├── learnerships.json       # Scraped learnerships (generated)
│   └── scraper-metadata.json   # Scraping stats (generated)
└── package.json
```

---

## ⚙️ How It Works

### Base Scraper (`baseScraper.js`)

Provides common functionality:
- ✅ HTTP requests with proper headers
- ✅ HTML parsing with Cheerio
- ✅ Text cleaning and normalization
- ✅ Date parsing (handles "3 days ago", "yesterday", etc.)
- ✅ Unique ID generation
- ✅ JSON file storage

### Individual Scrapers

Each scraper extends `BaseScraper` and implements:
- `scrape()` method - Main scraping logic
- Site-specific selectors
- Data normalization

### Master Scraper (`masterScraper.js`)

Coordinates all scrapers:
- Runs all scrapers in sequence
- Handles errors gracefully
- Generates summary statistics
- Saves combined metadata

---

## 🔧 Customization

### Adding a New Source

1. **Identify the website** you want to scrape
2. **Inspect the HTML** to find CSS selectors
3. **Add a new method** to the appropriate scraper:

```javascript
async scrapeNewSite() {
  const html = await this.fetchPage('https://example.com');
  if (!html) return;

  const $ = this.parseHTML(html);
  
  $('.job-item').each((i, elem) => {
    const title = this.cleanText($(elem).find('.title').text());
    const link = $(elem).find('a').attr('href');
    
    if (title && link) {
      this.results.push({
        id: this.generateId(title, 'Company', 'Source'),
        title: title,
        company: 'Company Name',
        location: 'Location',
        description: 'Description',
        type: 'job', // or 'bursary', 'learnership', 'internship'
        url: link,
        source: 'Source Name',
        posted: new Date(),
        salary: 'Not specified',
        created: new Date().toISOString()
      });
    }
  });
}
```

4. **Call the method** in the `scrape()` function

---

## 🕒 Automated Scheduling

### Option 1: Windows Task Scheduler

1. Open **Task Scheduler**
2. Create Basic Task
3. Set trigger: Daily at 3:00 AM
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\Users\maand\OneDrive\Desktop\FutureLinkedZA\backend\scrapers\masterScraper.js`

### Option 2: Node-Cron (Recommended)

Add to `backend/server.js`:

```javascript
const cron = require('node-cron');
const MasterScraper = require('./scrapers/masterScraper');

// Run scraper every day at 3 AM
cron.schedule('0 3 * * *', async () => {
  console.log('🤖 Starting scheduled scraping...');
  const master = new MasterScraper();
  await master.scrapeAll();
});
```

Install node-cron:
```powershell
npm install node-cron
```

---

## 📊 Data Format

Each scraped item has this structure:

```json
{
  "id": "unique-id-here",
  "title": "Software Developer",
  "company": "Company Name",
  "location": "Johannesburg, South Africa",
  "description": "Job description...",
  "type": "job",
  "url": "https://example.com/job/123",
  "source": "PNet",
  "posted": "2025-10-25T10:00:00.000Z",
  "deadline": null,
  "requirements": [],
  "salary": "R20,000 - R30,000",
  "created": "2025-10-25T12:00:00.000Z"
}
```

---

## 🔗 Integration with Search API

The search API (`backend/netlify/functions/search.js`) should be updated to:

1. Load scraped data from JSON files
2. Merge with Adzuna results
3. Deduplicate
4. Return combined results

Example:

```javascript
// Load scraped data
const MasterScraper = require('../../scrapers/masterScraper');
const master = new MasterScraper();
const scrapedData = await master.loadAllData();

// Merge with Adzuna results
if (query.includes('bursary')) {
  allJobs = [...scrapedData.bursaries, ...adzunaJobs];
} else {
  allJobs = [...scrapedData.jobs, ...adzunaJobs];
}
```

---

## ⚠️ Important Notes

### Ethical Scraping

- ✅ **Respect robots.txt** - Check each site's robots.txt file
- ✅ **Rate limiting** - Don't overwhelm servers (delays between requests)
- ✅ **User-Agent** - Identify your scraper properly
- ✅ **Cache results** - Don't scrape more than once per day
- ✅ **Attribution** - Link back to original sources

### Legal Considerations

- 📖 Review each website's Terms of Service
- 🔒 Some sites prohibit automated scraping
- ⚖️ Consider using official APIs when available
- 📧 Contact site owners if unsure

### Technical Limitations

- Some sites use JavaScript rendering (need Puppeteer)
- Anti-scraping measures (CAPTCHA, IP blocking)
- Frequent HTML structure changes
- Rate limiting and timeouts

---

## 🐛 Troubleshooting

### No results scraped

**Cause:** Website structure changed  
**Solution:** Update CSS selectors in scraper

### Timeout errors

**Cause:** Slow network or site  
**Solution:** Increase timeout in `baseScraper.js` (line 31)

### ECONNREFUSED errors

**Cause:** Site is down or blocking requests  
**Solution:** Add delay between requests, check robots.txt

---

## 📈 Performance

- **Average scrape time:** 30-60 seconds for all sources
- **Data size:** ~1-5 MB per day
- **Memory usage:** ~100 MB during scraping
- **Network:** ~10-20 MB downloaded

---

## 🎯 Next Steps

1. ✅ Test scrapers manually
2. ⏰ Set up automated scheduling
3. 🔗 Integrate with search API
4. 📊 Add monitoring/alerting
5. 🧹 Add data cleanup (remove old entries)

---

## 📞 Support

**Developer**: Maanda Netshisumbewa  
**Email**: futurelinked3@gmail.com  
**Phone**: 071 568 9064

---

*Built with ❤️ in South Africa 🇿🇦*
