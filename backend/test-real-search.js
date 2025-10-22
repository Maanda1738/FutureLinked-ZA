const { searchJobs } = require('./services/jobService');

async function testRealJobSearch() {
  console.log('🚀 Testing FutureLinked ZA Real Job Search...\n');

  const testQueries = [
    { query: 'data analyst', location: 'johannesburg' },
    { query: 'software developer', location: 'cape town' },
    { query: 'internship', location: '' },
    { query: 'graduate program', location: 'durban' },
    { query: 'marketing coordinator', location: 'pretoria' }
  ];

  for (const test of testQueries) {
    console.log(`\n🔍 Testing: "${test.query}" in "${test.location || 'South Africa'}"`);
    console.log('─'.repeat(60));
    
    try {
      const startTime = Date.now();
      const results = await searchJobs({
        query: test.query,
        location: test.location,
        page: 1,
        limit: 10
      });
      const duration = Date.now() - startTime;

      console.log(`✅ Search completed in ${duration}ms`);
      console.log(`📊 Results: ${results.results.length} jobs found`);
      console.log(`🌐 Sources: ${results.sources?.join(', ') || 'None'}`);
      
      if (results.error) {
        console.log(`❌ Error: ${results.error}`);
      }

      if (results.results.length > 0) {
        console.log('\n📋 Sample jobs:');
        results.results.slice(0, 3).forEach((job, index) => {
          console.log(`  ${index + 1}. ${job.title}`);
          console.log(`     Company: ${job.company}`);
          console.log(`     Location: ${job.location}`);
          console.log(`     Source: ${job.source}`);
          console.log(`     URL: ${job.url}`);
          console.log('');
        });
      } else {
        console.log('📭 No jobs found for this search');
      }

    } catch (error) {
      console.error(`❌ Test failed:`, error.message);
    }

    // Add delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🎉 Real job search testing completed!');
  console.log('\n💡 Tips:');
  console.log('- If no results, the scrapers may need adjustment for current site layouts');
  console.log('- Consider adding Adzuna API keys for more reliable results');
  console.log('- Check network connectivity to job sites');
  
  process.exit(0);
}

testRealJobSearch().catch(console.error);