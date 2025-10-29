const axios = require('axios');

/**
 * Test script for job search providers
 */

// Test RapidAPI jsearch
async function testRapidAPI() {
  console.log('\n🔍 Testing RapidAPI jsearch...\n');
  
  const RAPID_KEY = '9925807393msh164bd73c56850cep18f7c9jsn0c10b4650be6';
  const params = {
    query: 'engineering bursary south africa',
    page: 1,
    num_pages: 1,
    country: 'za',
    date_posted: 'all'
  };
  
  try {
    const resp = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params,
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': RAPID_KEY
      },
      timeout: 15000
    });
    
    console.log('✅ RapidAPI jsearch SUCCESS');
    console.log(`   Status: ${resp.status}`);
    console.log(`   Data structure:`, Object.keys(resp.data));
    
    const jobs = resp.data.data || [];
    console.log(`   Jobs found: ${jobs.length}`);
    
    if (jobs.length > 0) {
      console.log('\n   Sample job:');
      const sample = jobs[0];
      console.log(`   - Title: ${sample.job_title || sample.title || 'N/A'}`);
      console.log(`   - Company: ${sample.employer_name || sample.company || 'N/A'}`);
      console.log(`   - Location: ${sample.job_location || sample.location || 'N/A'}`);
      console.log(`   - URL: ${sample.job_apply_link || sample.url || 'N/A'}`);
    }
    
    return { success: true, count: jobs.length };
  } catch (error) {
    console.error('❌ RapidAPI jsearch FAILED');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response:`, error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Test Jooble
async function testJooble() {
  console.log('\n🔍 Testing Jooble API...\n');
  
  const JOOBLE_KEY = '414dfc47-c407-40dc-b7eb-3b8bc956f659';
  const endpoint = 'https://jooble.org/api/' + JOOBLE_KEY;
  
  const body = {
    keywords: 'engineering bursary',
    location: 'south africa',
    page: '1'
  };
  
  try {
    const resp = await axios.post(endpoint, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Jooble API SUCCESS');
    console.log(`   Status: ${resp.status}`);
    console.log(`   Data structure:`, Object.keys(resp.data));
    
    const jobs = resp.data.jobs || [];
    const total = resp.data.totalCount || jobs.length;
    console.log(`   Jobs found: ${jobs.length}`);
    console.log(`   Total available: ${total}`);
    
    if (jobs.length > 0) {
      console.log('\n   Sample job:');
      const sample = jobs[0];
      console.log(`   - Title: ${sample.title || 'N/A'}`);
      console.log(`   - Company: ${sample.company || 'N/A'}`);
      console.log(`   - Location: ${sample.location || 'N/A'}`);
      console.log(`   - Snippet: ${(sample.snippet || '').substring(0, 100)}...`);
      console.log(`   - URL: ${sample.link || 'N/A'}`);
    }
    
    return { success: true, count: jobs.length };
  } catch (error) {
    console.error('❌ Jooble API FAILED');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response:`, JSON.stringify(error.response.data).substring(0, 200));
    }
    return { success: false, error: error.message };
  }
}

// Test Adzuna (baseline)
async function testAdzuna() {
  console.log('\n🔍 Testing Adzuna API (baseline)...\n');
  
  const ADZUNA_APP_ID = 'aea61773';
  const ADZUNA_API_KEY = '3e762a8402260d23f5d5115d9ba80c26';
  
  const params = {
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_API_KEY,
    results_per_page: 5,
    what: 'engineering bursary',
    where: 'south africa',
    max_days_old: 90,
    sort_by: 'date'
  };
  
  try {
    const resp = await axios.get('https://api.adzuna.com/v1/api/jobs/za/search/1', {
      params,
      timeout: 15000
    });
    
    console.log('✅ Adzuna API SUCCESS');
    console.log(`   Status: ${resp.status}`);
    console.log(`   Jobs found: ${resp.data.results.length}`);
    console.log(`   Total available: ${resp.data.count}`);
    
    if (resp.data.results.length > 0) {
      console.log('\n   Sample job:');
      const sample = resp.data.results[0];
      console.log(`   - Title: ${sample.title}`);
      console.log(`   - Company: ${sample.company.display_name}`);
      console.log(`   - Location: ${sample.location.display_name}`);
      console.log(`   - URL: ${sample.redirect_url}`);
    }
    
    return { success: true, count: resp.data.results.length };
  } catch (error) {
    console.error('❌ Adzuna API FAILED');
    console.error(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run all tests
(async () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('        JOB SEARCH PROVIDER INTEGRATION TESTS');
  console.log('═══════════════════════════════════════════════════════════');
  
  const results = {
    adzuna: await testAdzuna(),
    rapid: await testRapidAPI(),
    jooble: await testJooble()
  };
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  Object.entries(results).forEach(([provider, result]) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? `SUCCESS (${result.count} jobs)` : `FAILED: ${result.error}`;
    console.log(`${icon} ${provider.toUpperCase().padEnd(15)} ${status}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  
  const allSuccess = Object.values(results).every(r => r.success);
  process.exit(allSuccess ? 0 : 1);
})();
