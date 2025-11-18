require('dotenv').config();
const { searchJobs } = require('./services/jobService');

async function test() {
  try {
    console.log('Starting search test...');
    console.log('API Keys configured:');
    console.log('- Adzuna:', !!process.env.ADZUNA_API_KEY);
    console.log('- Jooble:', !!process.env.JOOBLE_API_KEY);
    console.log('- JSearch:', !!process.env.JSEARCH_API_KEY || !!process.env.RAPIDAPI_KEY);
    console.log('- Google:', !!process.env.GOOGLE_API_KEY);
    
    const results = await searchJobs({
      query: 'developer',
      location: 'johannesburg',
      page: 1,
      limit: 10
    });
    
    console.log('\n✅ Search completed successfully!');
    console.log(`Found ${results.total} jobs from sources: ${results.sources.join(', ')}`);
    console.log(`\nFirst result:`, results.results[0]);
  } catch (error) {
    console.error('\n❌ Search failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
