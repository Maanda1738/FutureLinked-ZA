# FutureLinked ZA 🚀

**Your Complete Career Platform for South Africa**

FutureLinked ZA is an all-in-one career platform created by **Maanda Netshisumbewa**, designed to help South Africans find jobs, improve their CVs, and discover educational opportunities—all powered by cutting-edge AI technology.

From job search to university applications, FutureLinked ZA is your trusted partner in building a successful career in South Africa.

![Architecture Diagram](./architecture.svg)

## 🆕 Latest Updates (November 2025)

### New Features Added
- ✅ **University & College Finder**: Browse 26 South African institutions with detailed course info, requirements, and fees
- ✅ **Serverless Architecture**: Backend migrated to Netlify Functions for better scalability
- ✅ **Memory-Based CV Processing**: CV uploads now work seamlessly in serverless environment
- ✅ **Enhanced CORS Support**: Cross-origin requests properly configured for all endpoints
- ✅ **Official University Logos**: Real branding from Wikipedia Commons for easy recognition

### Technical Improvements
- 🔧 Converted CV file storage from disk to memory-based (serverless-compatible)
- 🔧 Updated Netlify configurations for separate frontend/backend deployment
- 🔧 Fixed CORS policies to allow frontend-backend communication
- 🔧 Optimized CV parsing to use Affinda's buffer API for serverless
- 🔧 Added proper Node.js version management with .nvmrc

## 👨‍💻 About the Creator

**Maanda Netshisumbewa** - Founder & Developer

FutureLinked ZA's mission is to democratize career opportunities in South Africa by leveraging AI, automation, and smart technology to make career development accessible to everyone.

## ✨ Platform Features

### 🎯 Smart Job Search
- **AI-Powered Matching**: Upload your CV and get matched with jobs that fit your skills and experience level
- **Multi-Source Search**: Integrated with Adzuna, Google Custom Search, and Jooble APIs
- **Fresh Jobs Only**: Automatically filters jobs posted within the last 30 days
- **Intelligent Filters**: Removes senior positions for junior candidates and vice versa
- **Smart Scoring**: Match scores (0-100%) based on skills and job requirements
- **Real-time Results**: Get 20+ relevant jobs in seconds

### 📄 AI CV Tools
- **Affinda CV Parser**: Extract skills, experience, and education automatically
- **Google Gemini AI Editor**: 6 intelligent CV improvement tools
  - ATS Optimization
  - Language Enhancement
  - Keyword Addition
  - Achievement Quantification
  - Custom Editing
  - Complete Professional Rewrite
- **CV Analysis**: Get ATS scores, suggestions, and career insights
- **Smart Matching**: AI reads your CV to understand your career goals

### 🎓 University & College Finder
- **26 South African Institutions**: Complete database of universities and colleges
- **All 9 Provinces Covered**: From UCT to University of Venda
- **Detailed Course Information**: 
  - Entry requirements (APS scores, subject prerequisites)
  - Duration and fees
  - Field of study categories
  - Application links
- **Smart Filters**: Search by province, institution type, and field of study
- **Official Logos**: Real university branding for easy recognition

### 💼 Additional Features
- **Save Jobs**: Bookmark opportunities for later
- **Application Tracking**: Keep track of jobs you've applied to
- **Resources Hub**: Career guides, tips, and advice
- **Mobile Responsive**: Works perfectly on all devices

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14.2.33 with React
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Express
- **Serverless**: Netlify Functions (production)
- **Caching**: In-memory cache with TTL (15 minutes)
- **File Processing**: Multer with memory storage (serverless-compatible)
- **PDF Parsing**: PDF-parse for CV text extraction

### AI & APIs
- **CV Parsing**: Affinda API (professional CV data extraction)
- **AI Analysis**: Google Gemini 1.5 Flash
- **Job Search APIs**:
  - Google Custom Search API (primary)
  - Adzuna API (50,000+ SA jobs)
  - Jooble API (international coverage)
- **Authentication**: API key-based security

### Database & Storage
- **CV Data**: JSON-based storage
- **Job Cache**: In-memory with automatic invalidation
- **Application Tracking**: Local storage

### Deployment
- **Frontend**: Netlify (with Next.js plugin)
- **Backend**: Netlify Functions (serverless)
- **Architecture**: Separate Netlify sites for frontend and backend
- **CDN**: Netlify Edge Network
- **CORS**: Configured for cross-origin requests

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/futurelinked-za.git
cd futurelinked-za
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys (optional - demo data works without them)
npm run dev
```

The backend will start on `http://localhost:3001`

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Visit the Application

Open [http://localhost:3000](http://localhost:3000) in your browser and start searching!

## 🔧 Configuration

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# CV Parsing (Required for CV features)
AFFINDA_API_KEY=your_affinda_api_key
AFFINDA_WORKSPACE=your_workspace_id
AFFINDA_REGION=api

# AI Features (Required for CV analysis & editing)
GEMINI_API_KEY=your_google_gemini_api_key

# Job Search APIs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key
JOOBLE_API_KEY=your_jooble_api_key
GOOGLE_CSE_API_KEY=your_google_custom_search_key
GOOGLE_CSE_ID=your_search_engine_id

# Optional Monetization
GOOGLE_ADSENSE_ID=your_adsense_id
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# AI Features (for client-side CV editing)
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_API_KEY=your_google_gemini_api_key

# Optional Monetization
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
```

### API Keys Setup Guide

1. **Affinda CV Parser** (Required for CV features)
   - Sign up at https://app.affinda.com
   - Get API key and workspace ID
   - Free tier: 100 documents/month

2. **Google Gemini AI** (Required for AI features)
   - Get API key from https://makersuite.google.com/app/apikey
   - Free tier: Generous rate limits

3. **Job Search APIs** (At least one recommended)
   - **Google Custom Search**: https://developers.google.com/custom-search
   - **Adzuna**: https://developer.adzuna.com
   - **Jooble**: https://jooble.org/api/about

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`: Your AdSense ID

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect to Render or Railway
3. Set environment variables from `.env.example`
4. Deploy

### Alternative: Manual VPS Deployment

```bash
# Frontend build
cd frontend
npm run build
npm run export

# Backend setup
cd ../backend
npm install --production
pm2 start server.js --name futurelinked-api

# Nginx configuration for frontend static files + API proxy
```

## 📊 API Documentation

### Job Search

```http
GET /search?q=query&location=location&page=1&limit=20
```

**Parameters:**
- `q` (required): Search query (e.g., "Junior Data Analyst")
- `location` (optional): Job location filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "results": [...],
  "total": 45,
  "page": 1,
  "cached": true,
  "sources": ["Google CSE", "Adzuna", "Jooble"],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### CV Upload & Parsing

```http
POST /cv/upload
Content-Type: multipart/form-data
```

**Body:** CV file (PDF, DOCX, TXT)

**Response:**
```json
{
  "success": true,
  "cvData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "skills": ["Python", "SQL", "Data Analysis"],
    "experience": {...},
    "education": [...]
  }
}
```

### CV Analysis (Frontend API)

```http
POST /api/analyze-cv
Content-Type: application/json
```

**Body:**
```json
{
  "cvData": {
    "text": "Full CV text...",
    "skills": [...],
    "experience": {...}
  }
}
```

**Response:**
```json
{
  "score": 85,
  "atsScore": 90,
  "description": "Experienced data analyst...",
  "targetRoles": ["Junior Data Analyst", "Data Analyst"],
  "experienceLevel": "entry",
  "suggestions": [...],
  "strengths": [...],
  "weaknesses": [...]
}
```

### CV Editing (Frontend API)

```http
POST /api/edit-cv
Content-Type: application/json
```

**Body:**
```json
{
  "cvData": {"text": "..."},
  "editType": "ats-optimize",
  "customInstructions": "Optional custom prompt"
}
```

**Edit Types:**
- `ats-optimize`: Optimize for ATS systems
- `improve-language`: Enhance professional language
- `add-keywords`: Add industry keywords
- `quantify-achievements`: Add metrics
- `complete-rewrite`: Full professional rewrite
- `custom`: Custom AI editing

### Smart Job Matching (Frontend API)

```http
POST /api/smart-job-match
Content-Type: application/json
```

**Body:**
```json
{
  "cvData": {
    "skills": ["Python", "SQL"],
    "desiredRoles": ["Data Analyst"]
  }
}
```

**Response:** Returns matched jobs with relevance scores

### Health Check

```http
GET /health
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Manual Testing

1. Start both frontend and backend
2. Search for "IT internship"
3. Verify results display with ads
4. Check external links work
5. Test mobile responsiveness

## 💰 Monetization Setup

### Google AdSense

1. Apply for Google AdSense account
2. Get your AdSense ID
3. Add to environment variables
4. Update ad units in `AdBanner.js`

### Sponsored Listings

Premium companies can pay for featured placement:

```bash
# Add sponsored job via API (admin only)
POST /api/admin/sponsor
Authorization: Bearer <admin_token>
```

## 🔍 Data Sources

### Job Search APIs
- **Google Custom Search API**: Primary source with fresh South African jobs
- **Adzuna API**: 50,000+ verified South African opportunities
- **Jooble API**: International job coverage

### CV Parsing & AI
- **Affinda API**: Professional-grade CV data extraction
- **Google Gemini 1.5 Flash**: AI-powered CV analysis and editing

### University Database
- **Static Database**: 26 South African institutions
  - 17 Traditional Universities
  - 6 Universities of Technology
  - 3 Private Colleges
- **All 9 Provinces**: Complete national coverage
- **Official Logos**: Wikipedia public images

## 📊 Platform Statistics

- **Job Sources**: 3 major APIs (Google, Adzuna, Jooble)
- **Universities**: 26 institutions with 100+ courses
- **CV Tools**: 6 AI-powered editing features
- **Fresh Jobs**: Auto-filtered (≤30 days old)
- **Cache Duration**: 15 minutes
- **Match Accuracy**: Skill-based scoring algorithm

## 🛡 Security & Performance

### Security Features
- API key authentication
- CORS protection
- Rate limiting on search endpoints
- Environment variable encryption
- Secure file uploads (CV processing)
- Input sanitization

### Performance Optimizations
- **Intelligent Caching**: 15-minute TTL reduces API calls
- **Lazy Loading**: Universities load on demand
- **Duplicate Removal**: Smart job deduplication
- **Fresh Jobs Filter**: Only recent postings (30 days)
- **Parallel API Calls**: Multi-source job aggregation
- **Image Optimization**: Next.js automatic image handling

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Multi-API job search
- [x] AI CV parsing with Affinda
- [x] Gemini-powered CV editing
- [x] Smart job matching
- [x] University finder (26 institutions)

### Phase 2 (Coming Soon)
- [ ] User accounts & profiles
- [ ] Application tracking dashboard
- [ ] Email job alerts
- [ ] Interview preparation tools
- [ ] Salary insights & trends
- [ ] Company reviews

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] LinkedIn integration
- [ ] AI interview simulator
- [ ] Skills gap analysis
- [ ] Career path recommendations
- [ ] Networking features

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- One feature per pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Team

**Maanda Netshisumbewa** - Creator, Developer & Founder
- Full-stack development
- AI integration
- System architecture
- UI/UX design

## 📞 Support & Contact

- **Email**: <support@futurelinkedza.co.za>
- **Website**: [futurelinkedza.co.za](https://futurelinkedza.co.za)
- **GitHub**: [FutureLinked-ZA](https://github.com/Maanda1738/FutureLinked-ZA)

## 🙏 Acknowledgments

- **Affinda** for CV parsing API
- **Google** for Gemini AI and Custom Search
- **Adzuna** for job data API
- **Jooble** for international job coverage
- **Wikipedia** for university logos
- South African developer community

---

**Built with ❤️ for South African job seekers by Maanda Netshisumbewa**

*Empowering careers through AI and innovation*
