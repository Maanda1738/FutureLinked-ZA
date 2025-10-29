const searchHandler = require('./netlify/functions/search');

async function testMultiProvider() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('     MULTI-PROVIDER PARALLEL SEARCH TEST');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const event = {
    httpMethod: 'GET',
    queryStringParameters: {
      q: 'software developer',
      location: 'south africa',
      page: '1',
      source: 'all'  // Test the ALL providers mode
    }
  };
  
  console.log('🔍 Query: software developer');
  console.log('📍 Location: south africa');
  console.log('🌐 Source: ALL (Adzuna + Jooble + RapidAPI in parallel)\n');
  
  const startTime = Date.now();
  
  try {
    const result = await searchHandler.handler(event, {});
    const duration = Date.now() - startTime;
    const body = JSON.parse(result.body);
    
    if (body.success) {
      console.log(`\n✅ Multi-provider search completed in ${duration}ms\n`);
      console.log(`📊 Total Results: ${body.results.length}`);
      console.log(`📈 Total Available: ${body.total}`);
      console.log(`🔧 Provider: ${body.provider}\n`);
      
      // Count by source
      const bySource = {};
      body.results.forEach(job => {
        bySource[job.source] = (bySource[job.source] || 0) + 1;
      });
      
      console.log('📋 Results by source:');
      Object.entries(bySource).forEach(([source, count]) => {
        console.log(`   ${source.padEnd(20)} ${count} jobs`);
      });
      
      console.log('\n📄 Sample results (first 5):\n');
      body.results.slice(0, 5).forEach((job, i) => {
        console.log(`${i + 1}. ${job.title}`);
        console.log(`   Company: ${job.company}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Source: ${job.source}`);
        console.log('');
      });
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`✨ SUCCESS - ${body.results.length} jobs from ${Object.keys(bySource).length} providers in ${duration}ms`);
      console.log('═══════════════════════════════════════════════════════════\n');
    } else {
      console.error('❌ Search failed:', body.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

testMultiProvider();
