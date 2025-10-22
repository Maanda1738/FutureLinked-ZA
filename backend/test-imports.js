console.log('Testing jobService imports...');

try {
  console.log('1. Testing jobService...');
  const { searchJobs } = require('./services/jobService');
  console.log('✅ jobService imported successfully');
  
  console.log('2. Testing individual scrapers...');
  
  try {
    const { scrapeCareer24 } = require('./services/scrapers/career24Scraper');
    console.log('✅ career24Scraper imported successfully');
  } catch (error) {
    console.error('❌ career24Scraper failed:', error.message);
  }
  
  try {
    const { scrapeIndeed } = require('./services/scrapers/indeedScraper');
    console.log('✅ indeedScraper imported successfully');
  } catch (error) {
    console.error('❌ indeedScraper failed:', error.message);
  }
  
  try {
    const { scrapeBursaries } = require('./services/scrapers/bursaryScraper');
    console.log('✅ bursaryScraper imported successfully');
  } catch (error) {
    console.error('❌ bursaryScraper failed:', error.message);
  }
  
  try {
    const { scrapeGraduatePrograms } = require('./services/scrapers/graduateProgramScraper');
    console.log('✅ graduateProgramScraper imported successfully');
  } catch (error) {
    console.error('❌ graduateProgramScraper failed:', error.message);
  }
  
  console.log('\n🎉 All imports completed - if any errors above, they need to be fixed');
  
} catch (error) {
  console.error('❌ Critical error:', error.message);
  console.error('Stack:', error.stack);
}