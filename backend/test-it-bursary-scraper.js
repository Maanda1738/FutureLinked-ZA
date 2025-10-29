const ITBursaryScraper = require('./scrapers/itBursaryScraper');

(async () => {
  const scraper = new ITBursaryScraper();
  
  console.log('\n💻 Testing IT Bursary Scraper...\n');
  console.log('Sources: Youth Village IT, Study Trust IT, Career Junction IT,');
  console.log('         Tech Companies (Microsoft, IBM, Telkom, Vodacom, etc.), Government IT\n');
  
  await scraper.scrape();
  
  console.log(`\n\n📊 FINAL RESULTS: ${scraper.results.length} IT bursaries found\n`);
  
  if (scraper.results.length > 0) {
    console.log('📋 IT Bursaries found:');
    scraper.results.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.title}`);
      console.log(`   Company: ${r.company}`);
      console.log(`   Source: ${r.source}`);
      console.log(`   Category: ${r.category}`);
      console.log(`   URL: ${r.url}`);
    });
  } else {
    console.log('⚠️ No IT bursaries found. This could be due to:');
    console.log('   - Websites blocking scrapers');
    console.log('   - No current IT bursary listings available');
    console.log('   - Different HTML structure than expected');
  }
})().catch(error => {
  console.error('❌ Error running IT bursary scraper test:', error);
  process.exit(1);
});
