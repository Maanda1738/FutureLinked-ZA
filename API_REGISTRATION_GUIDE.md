# API Registration Guide - FutureLinked ZA

## Required APIs for Production

### 1. Adzuna Job Search API (PRIMARY - FREE)
**Purpose:** Get reliable job data from South African job boards

**Registration Steps:**
1. Visit: https://developer.adzuna.com
2. Click "Get API Key"
3. Create account with your email
4. Create new application:
   - Name: "FutureLinked ZA"
   - Description: "South African job search platform"
   - Website: Your domain (or localhost for development)
5. Copy your credentials:
   - App ID: `your_app_id_here`
   - API Key: `your_api_key_here`

**Free Tier:** 1,000 calls/month (sufficient for testing)
**Paid Plans:** Available for higher volume

### 2. Google AdSense (MONETIZATION)
**Purpose:** Display ads to generate revenue

**Registration Steps:**
1. Visit: https://www.google.com/adsense
2. Click "Get started"
3. Add your website URL
4. Complete site review process (1-3 days)
5. Get AdSense ID: `ca-pub-xxxxxxxxxxxxxxxx`

**Requirements:**
- Live website with traffic
- Quality content
- Compliance with AdSense policies

### 3. Additional APIs (Optional)

#### Reed Jobs API (UK/International)
- URL: https://www.reed.co.uk/developers
- Free tier: 500 calls/month
- Good for international opportunities

#### Indeed API (Discontinued but alternatives exist)
- Consider: Indeed Employer API
- Or use web scraping (current implementation)

#### PNet API (South African)
- Contact: PNet directly for API access
- Focused on South African market

## API Key Configuration

### Backend (.env file)
```env
# Adzuna API
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_API_KEY=your_adzuna_api_key_here

# Google Services
GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx

# Optional APIs
REED_API_KEY=your_reed_api_key_here
```

### Frontend (.env.local file)
```env
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Testing Your APIs

### Test Adzuna API
```bash
# Test directly
curl "https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=YOUR_APP_ID&app_key=YOUR_API_KEY&what=developer&where=johannesburg"

# Test through our backend
curl "http://localhost:3001/api/search?q=developer&location=johannesburg"
```

### Test AdSense
- Deploy your site and add AdSense code
- Check for ad display in browser
- Monitor earnings in AdSense dashboard

## API Usage Best Practices

### Rate Limiting
- Adzuna: Max 1 request per second
- Implement caching (already done in our backend)
- Use pagination for large results

### Error Handling
- Always implement fallbacks
- Cache successful responses
- Log API errors for monitoring

### Security
- Never expose API keys in frontend code
- Use environment variables
- Implement request validation

## Cost Management

### Free Tiers
- Adzuna: 1,000 calls/month = ~33 searches/day
- Google AdSense: Free to use, you earn money

### Scaling Costs
- Adzuna Paid: $0.10 per 100 calls
- Alternative: Implement smart caching to reduce API calls

## Next Steps

1. **Register for Adzuna API** (Start here - it's free and immediate)
2. **Test with real API keys**
3. **Deploy your site** (required for AdSense)
4. **Apply for Google AdSense**
5. **Monitor usage and optimize**

## Backup Plan (No API Keys)

If you don't want to register for APIs immediately, our current web scraping implementation will work:
- Career24 scraping
- Indeed ZA scraping
- Cached results
- Basic functionality

However, APIs provide:
- More reliable data
- Better performance
- No scraping restrictions
- Professional compliance