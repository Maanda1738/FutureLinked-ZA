/**
 * Simple CV Smart Search Test
 * Tests CV upload, analysis, and job matching
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Start server programmatically
async function startServer() {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname),
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString());
      
      if (output.includes('running on port')) {
        setTimeout(() => resolve(serverProcess), 2000);
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    serverProcess.on('error', reject);
    
    // Timeout after 10 seconds
    setTimeout(() => reject(new Error('Server start timeout')), 10000);
  });
}

async function testCVSmartSearch() {
  console.log('\n🚀 Starting CV Smart Search Test\n');
  
  let serverProcess;
  
  try {
    // Start server
    console.log('📡 Starting server...');
    serverProcess = await startServer();
    console.log('✅ Server started successfully\n');
    
    const API_URL = 'http://localhost:3001';
    
    // Test 1: Check configuration
    console.log('📋 Test 1: Checking API Configuration');
    const configResponse = await axios.get(`${API_URL}/cv/config`);
    console.log('   ✅ Configuration:', JSON.stringify(configResponse.data, null, 2));
    
    // Test 2: Upload a CV
    console.log('\n📄 Test 2: Uploading CV');
    const cvPath = path.join(__dirname, '../frontend/uploads/cvs/cbshk9edzk0v0qewwcj4yochu.pdf');
    
    if (!fs.existsSync(cvPath)) {
      console.log('   ⚠ CV file not found, skipping upload test');
    } else {
      const form = new FormData();
      form.append('cv', fs.createReadStream(cvPath));
      
      const uploadResponse = await axios.post(`${API_URL}/cv/upload`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000
      });
      
      const cvData = uploadResponse.data.data;
      console.log('   ✅ CV uploaded successfully');
      console.log('   📝 Name:', cvData.name || 'Unknown');
      console.log('   🎯 Skills:', cvData.skills?.length || 0);
      console.log('   💼 Experience:', cvData.experience?.years || 0, 'years');
      
      // Test 3: Analyze CV
      console.log('\n📊 Test 3: Analyzing CV');
      const analyzeResponse = await axios.post(`${API_URL}/cv/analyze`, {
        cvData
      });
      
      const analysis = analyzeResponse.data;
      console.log('   ✅ Analysis complete');
      console.log('   ⭐ Score:', analysis.score, '/100');
      console.log('   🤖 ATS Score:', analysis.atsScore, '/100');
      console.log('   📈 Level:', analysis.experienceLevel);
      console.log('   💡 Suggestions:', analysis.suggestions?.length || 0);
      
      // Test 4: Find matching jobs
      console.log('\n🔍 Test 4: Finding Matching Jobs (Smart Search)');
      const matchResponse = await axios.post(`${API_URL}/cv/match-jobs`, {
        cvData,
        analysis
      });
      
      const matches = matchResponse.data.matches;
      console.log('   ✅ Found', matches.length, 'matching jobs');
      
      if (matches.length > 0) {
        console.log('\n   Top 3 Matches:');
        matches.slice(0, 3).forEach((match, i) => {
          console.log(`\n   ${i + 1}. ${match.title}`);
          console.log(`      Company: ${match.company || 'N/A'}`);
          console.log(`      Location: ${match.location || 'N/A'}`);
          console.log(`      Match: ${match.matchScore || 'N/A'}%`);
        });
      }
    }
    
    console.log('\n✅ All tests completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('   Details:', error.response.data);
    }
  } finally {
    // Clean up
    if (serverProcess) {
      console.log('\n🛑 Stopping server...');
      serverProcess.kill();
    }
  }
}

// Run tests
testCVSmartSearch().catch(console.error);
