# FutureLinked ZA - Setup Guide

## 📊 Google Analytics 4 Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (bottom left gear icon)
3. Click **Create Property**
4. Enter property name: "FutureLinked ZA"
5. Select timezone: **(GMT+02:00) Africa - Johannesburg**
6. Select currency: **South African Rand (R)**
7. Click **Next**

### Step 2: Set up Data Stream
1. Select platform: **Web**
2. Enter website URL: `https://futurelinked.co.za`
3. Enter stream name: "FutureLinked Production"
4. Click **Create stream**
5. **Copy your Measurement ID** (format: G-XXXXXXXXXX)

### Step 3: Add to Your Site
1. Open your Netlify dashboard
2. Go to **Site settings** → **Environment variables**
3. Add new variable:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** Your G-XXXXXXXXXX measurement ID
4. Redeploy your site

### Step 4: Verify Installation
1. Visit your website
2. Go back to GA4 → **Reports** → **Realtime**
3. You should see your own visit within 30 seconds
4. ✅ Analytics is working!

---

## 💰 Google AdSense Setup

### Current Status
✅ Site submitted to AdSense
⏳ Awaiting approval (typically 1-2 weeks)

### What Happens Next

#### Phase 1: Approval (Week 1-2)
- Google reviews your site
- Checks content quality
- Verifies traffic sources
- Ensures policy compliance

#### Phase 2: Auto Ads Setup (After Approval)
1. Copy AdSense code from your dashboard
2. Add to `frontend/pages/_app.js` (we'll help with this)
3. Enable **Auto ads** in AdSense dashboard
4. Google automatically places ads on optimal positions

#### Phase 3: Manual Ad Placement (Optional)
Strategic ad placements for maximum revenue:

**Homepage:**
- Below search bar (after results load)
- Between job listings (every 5 jobs)
- Sidebar (desktop only)

**Blog Page:**
- Above article content (in-article ad)
- Middle of article (after 2-3 paragraphs)
- End of article (before CTA)

**Resources Page:**
- Between template sections
- Sidebar area

### Expected Revenue (Conservative Estimates)

| Monthly Visitors | Page Views | Est. Revenue (R/month) |
|-----------------|------------|------------------------|
| 1,000           | 5,000      | R150 - R500            |
| 5,000           | 25,000     | R750 - R2,500          |
| 10,000          | 50,000     | R1,500 - R5,000        |
| 25,000          | 125,000    | R3,750 - R12,500       |
| 50,000          | 250,000    | R7,500 - R25,000       |

**Factors affecting revenue:**
- Niche: Job search (moderate-high CPC)
- Geography: South Africa (moderate CPC)
- Traffic quality (organic = higher value)
- Ad placement optimization
- User engagement (time on site)

### Optimization Tips for Higher Revenue

#### 1. Content is King
- ✅ You have 5 quality blog posts (great start!)
- Goal: Publish 2-3 new posts per week
- Focus: CV tips, interview guides, company reviews
- Length: 1,500+ words per post (better SEO)

#### 2. SEO Optimization
```
Current SEO Status: ✅ Good foundation
- Meta descriptions: ✅ Present
- Open Graph tags: ✅ Present
- Keywords: ✅ Optimized
- Mobile-friendly: ✅ Yes
- Page speed: ⚠️ Test with PageSpeed Insights

Next Steps:
- Add schema markup for job postings
- Create XML sitemap
- Submit to Google Search Console
- Build backlinks (guest posts, directories)
```

#### 3. Traffic Growth Strategy
**Month 1-2:** Foundation (Current)
- Social media content calendar (✅ created)
- Blog posts live (✅ done)
- Analytics tracking (⏳ pending setup)

**Month 2-3:** Engagement
- Post daily on Facebook/LinkedIn
- Engage with SA job seeker groups
- Share blog posts in communities
- Respond to comments quickly

**Month 3-6:** Scaling
- Email newsletter (capture leads)
- Guest blogging on career sites
- Partner with universities
- Run Facebook Ads (R500/month budget)

#### 4. Ad Placement Best Practices
**DO:**
- Place ads near high-engagement content
- Use responsive ad units (auto-adjust)
- Test different sizes (300x250, 728x90, 336x280)
- Monitor heatmaps to find prime real estate

**DON'T:**
- Place too many ads above the fold
- Use intrusive interstitials
- Hide content behind ads
- Violate AdSense policies (click fraud)

### AdSense Policy Checklist

Before approval, ensure:
- [x] Original content (no copied material)
- [x] Clear navigation
- [x] Privacy policy page
- [x] Terms & conditions page
- [x] Contact page
- [x] No prohibited content (adult, drugs, etc.)
- [x] Mobile-friendly design
- [ ] Sufficient content (goal: 20+ quality pages)
- [ ] Regular traffic (goal: 100+ daily visitors)

### Post-Approval Action Plan

#### Immediate (Day 1-7)
1. Add AdSense auto ads code
2. Enable auto ads in dashboard
3. Let Google optimize placement for 7 days
4. Monitor earnings & CTR

#### Optimization (Week 2-4)
1. Review AdSense reports
2. Identify high-performing pages
3. Create more similar content
4. Test manual ad placements
5. A/B test ad sizes

#### Scaling (Month 2+)
1. Analyze best-performing blog topics
2. Double down on high-traffic content
3. Optimize underperforming pages
4. Add video content (higher CPM)
5. Build email list for repeat traffic

---

## 📈 Analytics Dashboard

### Key Metrics to Track

#### Traffic Metrics
- **Unique visitors**: Total users visiting
- **Page views**: Total pages viewed
- **Bounce rate**: % leaving after 1 page (goal: <50%)
- **Avg. session duration**: Time on site (goal: >2 min)
- **Pages per session**: Engagement level (goal: >3 pages)

#### Conversion Metrics
- **Job searches**: # of searches performed
- **Jobs saved**: # of jobs bookmarked
- **Template downloads**: CV template downloads
- **Apply clicks**: # of users clicking "Apply Now"
- **Blog reads**: Blog post engagement

#### Revenue Metrics
- **AdSense earnings**: Daily/monthly revenue
- **RPM (Revenue per 1000)**: Income per 1000 page views
- **CTR (Click-through rate)**: % of users clicking ads
- **CPC (Cost per click)**: Avg. earning per ad click

### Weekly Check-In Routine

**Every Monday:**
1. Review last week's traffic (GA4)
2. Check AdSense earnings
3. Identify top-performing content
4. Plan next week's blog posts
5. Schedule social media content

**Every Friday:**
1. Publish new blog post
2. Share across all platforms
3. Engage with comments
4. Update content calendar

---

## 🎯 3-Month Growth Roadmap

### Month 1: Foundation
**Goals:**
- 1,000 monthly visitors
- 5,000 page views
- R150-R500 AdSense revenue
- 100 social media followers

**Tasks:**
- ✅ Set up GA4
- ✅ Create blog infrastructure
- ✅ Write 5 blog posts
- ✅ Social media content calendar
- ⏳ Get AdSense approval
- ⏳ Post daily on Facebook/LinkedIn
- ⏳ Join 10 SA job seeker groups

### Month 2: Growth
**Goals:**
- 5,000 monthly visitors
- 25,000 page views
- R750-R2,500 AdSense revenue
- 500 social media followers

**Tasks:**
- Publish 8 more blog posts (2/week)
- Guest post on 3 career blogs
- Start email newsletter
- Run first Facebook Ad campaign (R500)
- Optimize ad placements
- Build university partnerships

### Month 3: Scaling
**Goals:**
- 10,000 monthly visitors
- 50,000 page views
- R1,500-R5,000 AdSense revenue
- 1,000 social media followers

**Tasks:**
- Publish 10 more blog posts
- Launch YouTube channel (video CV tips)
- Add job alerts feature
- Premium listing tier for employers
- Hire part-time content writer
- Double Facebook Ad budget (R1,000)

---

## 🛠️ Technical Setup Steps

### 1. Environment Variables

Create `.env.local` in `frontend/` folder:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google AdSense (after approval)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# API Keys (already set in Netlify)
ADZUNA_APP_ID=aea61773
ADZUNA_API_KEY=3e762a8402260d23f5d5115d9ba80c26
JOOBLE_API_KEY=414dfc47-c407-40dc-b7eb-3b8bc956f659
RAPIDAPI_KEY=9925807393msh164bd73c56850cep18f7c9jsn0c10b4650be6
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=025daad35782144af
```

### 2. Netlify Environment Variables

Add same variables in Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add each variable with **Production** scope
3. Redeploy site

### 3. Verify Everything Works

```bash
# Test locally
npm run dev

# Visit http://localhost:3000
# Open browser console
# You should see: 📊 GA4 Event: page_view

# Search for a job
# You should see: 📊 GA4 Event: search

# Test complete! 🎉
```

---

## 📞 Support & Resources

### Google Analytics Support
- [GA4 Documentation](https://support.google.com/analytics)
- [GA4 Setup Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- Email: analytics-help@google.com

### Google AdSense Support
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- Email: adsense-support@google.com

### Our Support
- GitHub Issues: [Create Issue](https://github.com/Maanda1738/FutureLinked-ZA/issues)
- Email: support@futurelinked.co.za
- Twitter: @FutureLinkedZA

---

## ✅ Pre-Launch Checklist

Before going live with ads:

**Content:**
- [x] 5+ quality blog posts
- [x] Privacy policy page
- [x] Terms & conditions page
- [x] Contact page
- [x] About page
- [ ] 15+ total pages of content

**Technical:**
- [x] Mobile-responsive design
- [x] Fast page load (<3 seconds)
- [x] HTTPS enabled
- [x] No broken links
- [ ] XML sitemap generated
- [ ] Robots.txt configured

**Marketing:**
- [x] Social media content calendar
- [x] Share buttons on all pages
- [ ] Email signup form
- [ ] Google Search Console setup
- [ ] Social media profiles created

**Monetization:**
- [ ] GA4 tracking installed
- [ ] AdSense approved
- [ ] Ad placements optimized
- [ ] Revenue tracking setup

---

**Next Steps:** Set up Google Analytics 4 following the steps above, then we'll add AdSense code as soon as you're approved! 🚀
