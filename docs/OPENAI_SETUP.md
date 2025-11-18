# 🤖 OpenAI Integration Setup Guide

## Overview
The Smart CV Matcher feature can use OpenAI's GPT-4 for intelligent CV analysis and job matching. This provides:
- **Smarter CV Analysis**: Deep understanding of your experience and skills
- **Better Suggestions**: Personalized, actionable improvement tips
- **Accurate Job Matching**: AI-powered matching that understands context and nuance
- **Match Explanations**: Understand why each job is a good fit

## Quick Setup (5 minutes)

### 1. Get Your OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Important**: Save it securely - you won't see it again!

### 2. Add API Key to Your Project

1. Navigate to the `frontend` folder
2. Create a file named `.env.local` (or copy `.env.example`)
3. Add this line:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
4. Replace `sk-your-actual-api-key-here` with your real API key

### 3. Restart Your Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

That's it! 🎉 The system will now use OpenAI for CV analysis.

## Cost & Usage

### Pricing (as of 2024)
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Average CV Analysis**: ~$0.005 (half a cent)
- **Average Job Matching**: ~$0.01-0.02 per CV upload

### Monthly Estimates
- **100 CV uploads/month**: ~$1-2
- **500 CV uploads/month**: ~$5-10
- **1,000 CV uploads/month**: ~$10-20

Very affordable for the value it provides!

### Free Trial
OpenAI provides **$5 in free credits** for new accounts. This is enough for:
- ~500-1000 CV analyses
- Perfect for testing and initial users

## Features With OpenAI

### ✅ Enabled Features
1. **Intelligent CV Analysis**
   - Deep understanding of experience and skills
   - Context-aware suggestions
   - Industry-specific feedback

2. **Smart Job Matching**
   - Understands role requirements vs. candidate fit
   - Explains why each job matches
   - Considers soft skills and cultural fit

3. **Personalized Suggestions**
   - Tailored to specific career goals
   - Industry best practices
   - ATS optimization tips

### 🔄 Fallback (Without OpenAI Key)
If no API key is provided, the system automatically uses:
- Rule-based CV analysis (still effective)
- Keyword matching for jobs
- Pattern-based suggestions

**The system works fine without OpenAI, but with it, it's exceptional!**

## Testing

### Test CV Analysis
1. Upload a CV through the Smart CV Matcher
2. Check the analysis results
3. If OpenAI is working, you'll see: **"Powered by OpenAI GPT-4"**

### View Logs
Check your terminal for:
```
✓ Using OpenAI for CV analysis
✓ Using OpenAI for job matching
```

Or if no key:
```
ℹ No OpenAI API key found, using rule-based analysis
```

## Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already configured)
- Use environment variables for API keys
- Rotate keys if exposed
- Monitor usage on OpenAI dashboard

### ❌ DON'T:
- Commit API keys to Git
- Share keys publicly
- Use production keys in development
- Expose keys in frontend code

## Troubleshooting

### "OpenAI API error: 401"
- **Cause**: Invalid API key
- **Fix**: Double-check your key in `.env.local`

### "OpenAI API error: 429"
- **Cause**: Rate limit exceeded or no credits
- **Fix**: 
  - Add payment method to OpenAI account
  - Check usage limits
  - Wait a few minutes and retry

### Not seeing AI-powered results
- **Check**: File is named `.env.local` (not `.env.example`)
- **Check**: Server was restarted after adding key
- **Check**: Key starts with `sk-`

### System using fallback
- This is normal if no key is provided
- Features still work, just less intelligent
- Add OpenAI key for best results

## Alternative: Use for Production Only

You can configure the system to:
1. Use OpenAI in production (live site)
2. Use fallback in development (free testing)

Just add the API key to your production environment variables, not your local `.env.local`.

## Support

### OpenAI Documentation
- [API Keys](https://platform.openai.com/api-keys)
- [Pricing](https://openai.com/pricing)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

### FutureLinked Support
- Check terminal logs for error messages
- Review the `.env.example` file
- Ensure API key has proper format

---

**Pro Tip**: Start with the free $5 credit, test the features, and add billing only when you're ready to scale! 🚀
