# 🚀 FutureLinked ZA - Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `FutureLinkedZA`
   - Description: `Student-friendly job search platform for South Africa - Find bursaries, scholarships, internships & jobs`
   - Make it Public (so you can deploy for free)
   - **DO NOT** initialize with README (we already have one)
   - Click "Create repository"

2. **Copy the repository URL** (it will look like: `https://github.com/YOUR_USERNAME/FutureLinkedZA.git`)

3. **Run these commands in PowerShell:**
   ```powershell
   cd C:\Users\maand\OneDrive\Desktop\FutureLinkedZA
   git remote add origin https://github.com/YOUR_USERNAME/FutureLinkedZA.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy Backend (FREE on Render.com)

1. **Go to [Render.com](https://render.com)** and sign up/login with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (FutureLinkedZA)

4. **Configure the service:**
   - Name: `futurelinked-za-backend`
   - Region: Choose closest to South Africa (e.g., Singapore or Frankfurt)
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   ADZUNA_APP_ID=aea61773
   ADZUNA_API_KEY=3e762a8402260d23f5d5115d9ba80c26
   ADZUNA_MAX_DAYS_OLD=7
   ADZUNA_SORT_BY=date
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://futurelinked-za.vercel.app
   ENABLE_GOOGLE_SCRAPER=false
   ENABLE_SA_COMPANIES_SCRAPER=false
   ENABLE_BURSARIES_SCRAPER=false
   ENABLE_GRADUATE_PROGRAMS_SCRAPER=false
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL** (will be like: `https://futurelinked-za-backend.onrender.com`)

---

## Step 3: Deploy Frontend (FREE on Vercel)

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login with GitHub

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository** (FutureLinkedZA)

4. **Configure the project:**
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `.next` (should auto-detect)

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://futurelinked-za-backend.onrender.com` (your backend URL from Step 2)

6. **Click "Deploy"**

7. **Wait for deployment** (2-3 minutes)

8. **Your site is live!** 🎉

---

## Step 4: Update Backend CORS (Important!)

After frontend is deployed, you need to update the backend to allow your frontend URL:

1. **Go back to Render.com** → Your backend service

2. **Environment** → Find `FRONTEND_URL`

3. **Update the value** to your Vercel URL (e.g., `https://futurelinked-za.vercel.app`)

4. **Save** → Service will auto-redeploy

---

## Step 5: Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `futurelinkedza.co.za`)
3. Update your domain's DNS settings as instructed

### For Render (Backend):
1. Free plan doesn't support custom domains
2. Upgrade to paid plan ($7/month) if needed

---

## 🎯 Your Deployed URLs

After deployment, you'll have:
- **Frontend**: `https://futurelinked-za.vercel.app`
- **Backend**: `https://futurelinked-za-backend.onrender.com`
- **API Health Check**: `https://futurelinked-za-backend.onrender.com/api/health`

---

## ⚠️ Important Notes

### Free Tier Limitations:

**Render.com (Backend):**
- ✅ 750 hours/month free (enough for 24/7)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds
- ✅ Auto-wakes on any request

**Vercel (Frontend):**
- ✅ Unlimited bandwidth
- ✅ Always fast (no sleeping)
- ✅ Automatic HTTPS
- ✅ Global CDN

### To Keep Backend Always Awake (Optional):
Use a free service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes:
- Add monitor: `https://futurelinked-za-backend.onrender.com/api/health`
- Interval: 5 minutes

---

## 🔧 Troubleshooting

### Backend not responding:
1. Check Render logs: Dashboard → Your service → Logs
2. Verify environment variables are set correctly
3. Check if service is running (not failed)

### Frontend can't reach backend:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check backend CORS allows your frontend URL
3. Test backend directly: `https://your-backend.onrender.com/api/health`

### Search returns no results:
1. Verify Adzuna API credentials in Render environment variables
2. Check backend logs for API errors
3. Test Adzuna API: `https://your-backend.onrender.com/api/search?query=developer`

---

## 📧 Support

If you need help:
- Email: maandanetshi657@gmail.com
- Check backend logs on Render
- Check browser console for frontend errors

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Test search: Try "bursary" or "developer"
- [ ] All quick search buttons working
- [ ] Fresh jobs badge showing on recent listings
- [ ] Logo and favicon displaying correctly

---

**Made with ❤️ by Maanda Netshisumbewa**
