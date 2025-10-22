require('dotenv').config();
const axios = require('axios');

async function testAdzuna() {
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  
  console.log('Testing Adzuna API...');
  console.log('App ID:', appId);
  console.log('API Key:', apiKey ? `${apiKey.slice(0, 8)}...` : 'NOT SET');
  
  if (!appId || !apiKey) {
    console.error('❌ Adzuna credentials not found in .env');
    return;
  }
  
  try {
    const url = 'https://api.adzuna.com/v1/api/jobs/za/search/1';
    const params = {
      app_id: appId,
      app_key: apiKey,
      what: 'developer',
      where: 'South Africa',
      results_per_page: 20,
      sort_by: 'relevance'
    };
    
    console.log('\nMaking request to:', url);
    console.log('Query:', params.what);
    
    const response = await axios.get(url, { params, timeout: 10000 });
    
    console.log('\n✅ Adzuna API Success!');
    console.log('Status:', response.status);
    console.log('Total results available:', response.data.count);
    console.log('Results in this page:', response.data.results.length);
    
    if (response.data.results.length > 0) {
      console.log('\nFirst 3 jobs:');
      response.data.results.slice(0, 3).forEach((job, i) => {
        console.log(`\n${i + 1}. ${job.title}`);
        console.log(`   Company: ${job.company.display_name}`);
        console.log(`   Location: ${job.location.display_name}`);
        if (job.salary_min && job.salary_max) {
          console.log(`   Salary: R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`);
        }
        console.log(`   URL: ${job.redirect_url}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Adzuna API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAdzuna();
