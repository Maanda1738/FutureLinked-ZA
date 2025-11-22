# Render Deployment Guide - FutureLinked Backend

I've prepared everything for you. Follow these exact steps:

## Step 1: Deploy to Render (5 minutes)

1. **Go to Render**: https://render.com/
2. **Sign in with GitHub** (or create account if needed)
3. Click **"New +"** → **"Web Service"**
4. Connect your **FutureLinked-ZA** repository
5. Configure the service:
   - **Name**: `futurelinked-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Select **Free** plan

6. Click **"Advanced"** and add these environment variables:
   ```
   NODE_ENV = production
   PORT = 3001
   CORS_ORIGIN = https://futurelinked-za.co.za
   ```

7. **Add your API keys** (if you have them):
   ```
   AFFINDA_API_KEY = your-affinda-key-here
   OPENAI_API_KEY = your-openai-key-here
   ```
   *(If you don't have these yet, you can add them later)*

8. Click **"Create Web Service"**
9. Wait 3-5 minutes for deployment to complete
10. **Copy your backend URL** - it will look like: `https://futurelinked-backend.onrender.com`

## Step 2: Configure Netlify (2 minutes)

1. **Go to Netlify**: https://app.netlify.com/
2. Select your **futurelinked-za** site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Add a variable"**
5. Add this variable:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://futurelinked-backend.onrender.com
   ```
   *(Use the URL you copied from Render in Step 1)*

6. Click **"Save"**
7. Go to **Deploys** tab
8. Click **"Trigger deploy"** → **"Deploy site"**

## Step 3: Test (1 minute)

1. Wait for Netlify deploy to finish (1-2 minutes)
2. Visit: https://futurelinked-za.co.za
3. Scroll to **"CV Smart Match"** section
4. Upload a test CV (PDF or DOCX)
5. You should see job matches!

## Troubleshooting

### If CV upload fails:
- Open DevTools (F12) → Console tab
- Look for the log: `✅ Upload succeeded at: <backend-url>`
- If you see 404 or CORS errors, check:
  - Backend is deployed and running on Render
  - Environment variable is set correctly in Netlify
  - You triggered a new deploy after adding the variable

### If backend won't start on Render:
- Check Render logs for errors
- Verify environment variables are set
- Ensure Root Directory is set to `backend`

### Free Render Limitations:
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- This is normal for free tier

## What I've Done For You:

✅ Created `render.yaml` configuration file
✅ Updated backend CORS to allow your production domain
✅ Pushed changes to GitHub
✅ Prepared step-by-step deployment instructions

## Next Steps After Deployment:

Once everything works, you might want to:
1. Add your Affinda API key for better CV parsing
2. Add OpenAI API key for AI-powered job matching
3. Consider upgrading Render plan to avoid cold starts ($7/month)

---

**Status**: Ready to deploy! Start with Step 1 above.
