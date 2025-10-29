const BursaryScraper = require('./scrapers/bursaryScraper');

(async () => {
  const scraper = new BursaryScraper();
  
  console.log('\n🔍 Testing Bursary Scraper with all 9 sources...\n');
  console.log('Sources: Bursaries SA, Careers Portal, Youth Village, SA Study,');
  console.log('         Study Trust, Bursary SA, AfriSmart, Graduate Connection, NSFAS\n');
  
  await scraper.scrape();
  
  console.log(`\n\n📊 FINAL RESULTS: ${scraper.results.length} bursaries found\n`);
  
  // Count by source
  const bySource = {};
  scraper.results.forEach(r => {
    bySource[r.source] = (bySource[r.source] || 0) + 1;
  });
  
  console.log('Breakdown by source:');
  Object.entries(bySource).forEach(([source, count]) => {
    console.log(`  ${source}: ${count} bursaries`);
  });
  
  if (scraper.results.length > 0) {
    console.log('\n📋 Sample results (first 5):');
    scraper.results.slice(0, 5).forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.title}`);
      console.log(`   Company: ${r.company}`);
      console.log(`   Source: ${r.source}`);
      console.log(`   URL: ${r.url}`);
    });
  }
})().catch(error => {
  console.error('❌ Error running bursary scraper test:', error);
  process.exit(1);
});
