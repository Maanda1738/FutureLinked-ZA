/**
 * Test the Netlify search function locally with Jooble
 */

const searchHandler = require('./netlify/functions/search');

async function testSearch(query, source = 'adzuna') {
  console.log(`\n🔍 Testing search: "${query}" (source: ${source})\n`);
  
  const event = {
    httpMethod: 'GET',
    queryStringParameters: {
      q: query,
      location: 'south africa',
      page: '1',
      source: source
    }
  };
  
  const context = {};
  
  try {
    const result = await searchHandler.handler(event, context);
    const body = JSON.parse(result.body);
    
    if (body.success) {
      console.log(`✅ Search successful!`);
      console.log(`   Results: ${body.results.length}`);
      console.log(`   Total available: ${body.total}`);
      console.log(`   Page: ${body.page}`);
      
      if (body.results.length > 0) {
        console.log(`\n   📋 Sample results (first 3):\n`);
        body.results.slice(0, 3).forEach((job, i) => {
          console.log(`   ${i + 1}. ${job.title}`);
          console.log(`      Company: ${job.company}`);
          console.log(`      Location: ${job.location}`);
          console.log(`      Source: ${job.source}`);
          console.log(`      Salary: ${job.salary}`);
          console.log(`      URL: ${job.url.substring(0, 80)}...`);
          console.log('');
        });
      }
      
      return { success: true, count: body.results.length };
    } else {
      console.error(`❌ Search failed: ${body.error}`);
      return { success: false, error: body.error };
    }
  } catch (error) {
    console.error(`❌ Error running search:`, error.message);
    return { success: false, error: error.message };
  }
}

(async () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('        SEARCH FUNCTION INTEGRATION TEST');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Test 1: Adzuna bursary search
  const adzunaResult = await testSearch('engineering bursary', 'adzuna');
  
  // Test 2: Jooble bursary search
  const joobleResult = await testSearch('engineering bursary', 'jooble');
  
  // Test 3: Regular job search with Jooble
  const joobleJobResult = await testSearch('software developer', 'jooble');
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const tests = [
    { name: 'Adzuna (bursary)', result: adzunaResult },
    { name: 'Jooble (bursary)', result: joobleResult },
    { name: 'Jooble (jobs)', result: joobleJobResult }
  ];
  
  tests.forEach(test => {
    const icon = test.result.success ? '✅' : '❌';
    const status = test.result.success ? `SUCCESS (${test.result.count} results)` : `FAILED: ${test.result.error}`;
    console.log(`${icon} ${test.name.padEnd(20)} ${status}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
})();
