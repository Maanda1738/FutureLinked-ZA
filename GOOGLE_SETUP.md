# Google Custom Search Integration - Setup Guide

## ✅ What's Already Done

1. **Google CSE UI Component** - Added to your website for manual searches
   - Script tag added to `_document.js`
   - `GoogleSearch.js` component created
   - `/google-search` page created
   - "Web Search" link in navigation

2. **Google Custom Search JSON API** - Integrated as 4th backend data source
   - `callGoogleSearch()` function added to `search.js`
   - Runs in parallel with Adzuna, Jooble, and RapidAPI when using `source=all`
   - Properly handles Google's response format (`items`, `searchInformation`)
   - Google CSE ID already configured: `025daad35782144af`

## 🔧 What You Need to Do

### Step 1: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Custom Search JSON API**:
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Custom Search JSON API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key (looks like: `AIzaSyDZW5xZ...`)
5. (Optional but recommended) Restrict the API key:
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Custom Search JSON API"
   - Under "Application restrictions", add your domain

### Step 2: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site (FutureLinkedZA)
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:

| Variable Name | Value |
|--------------|-------|
| `GOOGLE_API_KEY` | Your API key from Step 1 (e.g., `AIzaSyDZW5xZ...`) |
| `GOOGLE_CSE_ID` | `025daad35782144af` (already in code, but good to set) |
| `JOOBLE_API_KEY` | `414dfc47-c407-40dc-b7eb-3b8bc956f659` |
| `RAPIDAPI_KEY` | `9925807393msh164bd73c56850cep18f7c9jsn0c10b4650be6` |
| `CAREERJET_KEY` | `ad3cc98fd0afd9b05a68c956d9897c6a` |

5. **Important**: After adding env vars, you must **redeploy** your site for changes to take effect
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### Step 3: Test the Integration

1. After deployment completes, test the multi-provider search:
   ```
   https://your-site.netlify.app/.netlify/functions/search?query=software+developer&location=south+africa&source=all
   ```

2. Check the function logs in Netlify:
   - Go to "Functions" tab
   - Click on `search` function
   - View logs to see if Google is being called

3. You should see in the logs:
   ```
   ✅ Adzuna: X results
   ✅ Jooble: X results
   ✅ Google: X results
   ```

## 🎯 How It Works

### Single Provider Search
```
/search?query=bursary&location=south+africa&source=google
```
Only calls Google Custom Search API

### Multi-Provider Search (Default)
```
/search?query=bursary&location=south+africa&source=all
```
Calls ALL 4 providers in parallel:
- ✅ Adzuna (working)
- ✅ Jooble (working)
- ⚠️ RapidAPI (needs subscription - returns 403)
- ✅ Google (needs API key)

### Response Format

Google results are normalized to match other providers:
```json
{
  "id": "google-12345",
  "title": "Job Title from Page Title",
  "company": "Unknown",
  "location": "south africa",
  "description": "Snippet from Google search result",
  "url": "https://job-site.com/job/12345",
  "source": "Google",
  "created": "2024-01-15T10:30:00Z"
}
```

## 💰 Google Custom Search Pricing

- **Free tier**: 100 queries per day
- **Paid tier**: $5 per 1,000 queries (after free tier)
- Your CSE ID `025daad35782144af` is already configured

## 🔍 Google Search Strategy

The code searches for jobs using:
```javascript
const searchQuery = `${query} jobs site:linkedin.com OR site:careers24.com OR site:pnet.co.za`;
```

This targets South African job sites:
- LinkedIn
- Careers24
- PNet

You can customize this in `search.js` line ~200.

## 🐛 Troubleshooting

### Google returns 0 results
- ✅ Check API key is set in Netlify
- ✅ Check API key has Custom Search JSON API enabled
- ✅ Check CSE ID is correct: `025daad35782144af`
- ✅ Redeploy after setting env vars

### "Google API key not configured" message
- ❌ API key not set in Netlify environment variables
- ❌ Haven't redeployed after setting env vars

### 403 Forbidden error
- ❌ API key is invalid or restricted
- ❌ Custom Search JSON API not enabled in Google Cloud Console
- ❌ API key has domain restrictions that don't include your Netlify domain

### Quota exceeded (429 error)
- ❌ Exceeded 100 free queries per day
- ✅ Upgrade to paid tier in Google Cloud Console

## 📊 Current Status

✅ **Working**:
- Adzuna: ~15 jobs per search
- Jooble: ~24 jobs per search
- Multi-provider parallel execution: 39 jobs in ~2.7 seconds

⚠️ **Needs Configuration**:
- Google: Needs `GOOGLE_API_KEY` environment variable
- RapidAPI: Needs paid subscription (optional)

🎯 **Frontend**: Using `source=all` by default for comprehensive results

## 🚀 Next Steps

1. ✅ Get Google API key (see Step 1)
2. ✅ Add env vars to Netlify (see Step 2)
3. ✅ Redeploy site
4. ✅ Test with `/diagnostics` page
5. ✅ Monitor function logs
6. 🎉 Enjoy comprehensive job search results!

## 📝 Notes

- Google results may include job listings from LinkedIn, Careers24, PNet, etc.
- Results are filtered for relevance using the same algorithm as other providers
- For bursary/scholarship searches, filtering is more lenient
- Multi-provider searches use lenient filtering (if < 5 results after filtering but > 10 raw, uses all)

---

**Need help?** Check the function logs in Netlify or test using the `/diagnostics` page.
