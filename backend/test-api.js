const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing FutureLinked ZA API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get('http://localhost:3001/');
    console.log('✅ Root endpoint:', rootResponse.data.message);

    // Test search endpoint
    console.log('\n3. Testing search endpoint...');
    const searchResponse = await axios.get('http://localhost:3001/api/search?q=IT internship');
    console.log('✅ Search results:', {
      success: searchResponse.data.success,
      resultsCount: searchResponse.data.results.length,
      sources: searchResponse.data.sources
    });

    console.log('\n🎉 All API tests passed!');

    // Show sample results
    if (searchResponse.data.results.length > 0) {
      console.log('\n📋 Sample job results:');
      searchResponse.data.results.slice(0, 3).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} at ${job.company} (${job.location})`);
      });
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();