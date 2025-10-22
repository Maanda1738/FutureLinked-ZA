# FutureLinked ZA — Technical Architecture

This document explains the high-level architecture for FutureLinked ZA, the components involved, and guidance for implementing each part.

## Overview
FutureLinked ZA is a web platform connecting South African job seekers to verified opportunities via on-demand search aggregation.

The main components are:
- Frontend (React/Next.js)
- Backend API (Node.js + Express)
- Job fetchers (API clients + scrapers)
- Optional data layer (MongoDB/Firebase)
- Ad integration (Google AdSense, YouTube)
- Hosting (Vercel/Netlify for frontend, Render/Railway for backend)
- Security & monitoring (HTTPS, rate limiting, Sentry)

## Component Details

### Frontend
- Build with React or Next.js for performance and SSR options.
- UI elements: search bar, results list, ad banners, video player component.
- Ad slots: 3-5 text ads near the top of results; optional video player for pre-roll or sponsored videos.
- Hosting: Vercel or Netlify.

### Backend
- Node.js + Express application exposing endpoints:
  - `GET /search?q=<query>&location=<loc>` — aggregate results
  - `GET /health` — health checks
  - `POST /admin/sponsor` — manage sponsored listings (auth-protected)
- Internal services:
  - Scraper workers for company pages (headless Chromium or simple HTML parsers)
  - API clients for Adzuna, CareerJet, etc.
  - Aggregator to deduplicate and normalize results
  - Ad selection engine to pick inline ads and sponsored placements

### Data Layer (optional)
- MongoDB Atlas or Firebase for storing:
  - Cached search results (TTL 24h)
  - Click-through and analytic events
  - Sponsored listing metadata and billing records

### Ad Integrations
- Google AdSense for text ads.
- YouTube embeds / Google Ad Manager for video ads.
- Ensure ad placement complies with Google policies.

### Hosting
- Frontend: Vercel / Netlify (static + SSR)
- Backend: Render / Railway / Fly.io
- DB: MongoDB Atlas / Firebase

### Security
- Serve over HTTPS.
- Keep API keys and secrets in environment variables (server-side only).
- Apply rate-limiting per IP for `/search` endpoint.
- Monitor errors and latency with Sentry or similar.

## Data Flow
1. User opens the site and submits a query via the search bar.
2. Frontend calls the backend `/search` API.
3. Backend checks cache; if missing, it queries external job APIs and/or triggers scrapers.
4. Results are normalized, deduplicated, and ads are inserted.
5. Backend returns the combined payload to the frontend.
6. Frontend displays ad slots and results. Clicking an item redirects to the original source.

## Deployment & CI
- Use GitHub Actions to run ESLint, unit tests, and deploy to Vercel/Render on merge to `main`.
- Store secrets in GitHub Actions or hosting provider env vars.

## Next Steps & Recommendations
- Start with API integrations (Adzuna) before adding scrapers.
- Keep scraping limited and cache aggressively to avoid IP blocks.
- Implement analytics tracking early to measure CTR and traffic.
- Prepare a privacy policy and terms since ads and tracking are involved.

---
Files in this repo:
- `architecture.svg` — visual diagram (simple SVG)
- `ARCHITECTURE.md` — this explanation

If you'd like, I can:
- Export `architecture.svg` to a PNG for inclusion in your PDF.
- Embed the diagram and text into a formatted PDF proposal (with logo and sections).
- Generate a small starter repo scaffold: Next.js frontend + Express backend with a mock `/search` endpoint.

Which would you like next?