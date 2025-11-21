/**
 * Test Affinda Configuration
 * Run this to check if Affinda is properly configured
 */

require('dotenv').config();

console.log('\n=== Affinda Configuration Test ===\n');

// Check environment variables
const hasApiKey = !!(process.env.AFFINDA_API_KEY && process.env.AFFINDA_API_KEY.length > 0);
const hasWorkspace = !!(process.env.AFFINDA_WORKSPACE && process.env.AFFINDA_WORKSPACE.length > 0);
const hasDocType = !!(process.env.AFFINDA_DOCUMENT_TYPE && process.env.AFFINDA_DOCUMENT_TYPE.length > 0);

console.log('✅ Environment Variables:');
console.log(`   AFFINDA_API_KEY: ${hasApiKey ? '✓ Configured (' + process.env.AFFINDA_API_KEY.substring(0, 10) + '...)' : '✗ Not configured'}`);
console.log(`   AFFINDA_REGION: ${process.env.AFFINDA_REGION || 'api (default)'}`);
console.log(`   AFFINDA_WORKSPACE: ${hasWorkspace ? '✓ Configured' : '⚠ Not configured (optional)'}`);
console.log(`   AFFINDA_DOCUMENT_TYPE: ${hasDocType ? '✓ Configured' : '⚠ Not configured (optional)'}`);

console.log('\n✅ Integration Status:');
if (hasApiKey) {
  console.log('   ✓ Affinda API enabled - Professional CV parsing active');
  console.log('   ✓ Backend will use Affinda for CV uploads');
  console.log('   ✓ Automatic fallback to basic extraction if Affinda fails');
} else {
  console.log('   ⚠ Affinda API disabled - Using basic extraction only');
  console.log('   → Add AFFINDA_API_KEY to .env to enable professional parsing');
}

if (!hasWorkspace || !hasDocType) {
  console.log('\n⚠️  Recommendations:');
  if (!hasWorkspace) {
    console.log('   - Configure AFFINDA_WORKSPACE for better organization');
  }
  if (!hasDocType) {
    console.log('   - Configure AFFINDA_DOCUMENT_TYPE for optimal parsing');
  }
  console.log('   → See AFFINDA_INTEGRATION_GUIDE.md for setup instructions');
}

console.log('\n✅ Configuration Test Complete!\n');

// Test the Affinda service
console.log('=== Testing Affinda Service ===\n');

try {
  const affindaService = require('./services/affindaService');
  
  console.log('✓ Affinda service loaded successfully');
  console.log(`  Base URL: https://${process.env.AFFINDA_REGION || 'api'}.affinda.com`);
  
  // Check if API is reachable (without making actual API call)
  if (hasApiKey) {
    console.log('✓ Service ready to parse CVs');
    console.log('  → Use POST /api/cv/upload to test CV parsing');
  }
  
} catch (error) {
  console.error('✗ Error loading Affinda service:', error.message);
}

console.log('\n=== Test Complete ===\n');
console.log('Next steps:');
console.log('1. Start backend: npm start');
console.log('2. Test config: http://localhost:3001/api/cv/config');
console.log('3. Upload CV: POST http://localhost:3001/api/cv/upload');
console.log('\n');
