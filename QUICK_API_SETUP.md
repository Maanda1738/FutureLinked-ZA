# Quick API Setup Instructions

## Step 1: Register for Adzuna API (FREE - 5 minutes)

1. Visit: https://developer.adzuna.com
2. Click "Get API Key" 
3. Sign up with your email
4. Create app named "FutureLinked ZA"
5. Copy your credentials

## Step 2: Update your .env file

Replace these lines in backend/.env:
```
ADZUNA_APP_ID=your_real_app_id_here
ADZUNA_API_KEY=your_real_api_key_here
```

## Step 3: Test the API

Run this command to test:
```bash
cd backend
node -e "
const axios = require('axios');
const APP_ID = 'your_app_id';
const API_KEY = 'your_api_key';
axios.get(\`https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=\${APP_ID}&app_key=\${API_KEY}&what=developer&where=johannesburg\`)
  .then(res => console.log('✅ API works! Found', res.data.count, 'jobs'))
  .catch(err => console.log('❌ API error:', err.response?.data || err.message));
"
```

## Current Status
- Your app is working with web scraping
- Adding real APIs will make it more reliable
- You can deploy and use it right now even without APIs

## Why register for APIs?
- More reliable data
- Better performance  
- No scraping restrictions
- Professional appearance
- Monetization opportunities

## Alternative: Use current setup
Your app works right now with web scraping! If you want to test it immediately:
1. Start backend: `cd backend && node server.js`
2. Start frontend: `cd frontend && npm run dev`
3. Visit: http://localhost:3000