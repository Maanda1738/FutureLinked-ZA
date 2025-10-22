# FutureLinked ZA

**Smart job search assistant for South Africa**

FutureLinked is a smart job search assistant created by **Maanda Netshisumbewa**, designed to make finding opportunities in South Africa simple, fast, and stress-free.

Powered by intelligent automation and the Adzuna API, FutureLinked scans top company websites and job boards in real time to bring you the most relevant openings — all in one convenient place.

![Architecture Diagram](./architecture.svg)

## 👨‍💻 About the Creator

**Maanda Netshisumbewa** - Founder & Developer

FutureLinked's mission is to bridge the gap between talent and opportunity through innovation, accessibility, and smart technology.

## 🚀 Features

- **🤖 Intelligent Automation**: Powered by Adzuna API for real-time job listings
- **🔍 Simple Search**: No sign-ups, no downloads, no complicated features
- **⚡ Lightning Fast**: Get results in seconds
- **🧭 Direct Applications**: Links directly to verified job portals
- **🇿� South African Focus**: Thousands of verified opportunities across SA

## 🛠 Technology Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Caching**: In-memory cache with TTL
- **Primary Data Source**: Adzuna API (52,315+ South African jobs)
- **Deployment**: Vercel (frontend) + Render/Railway (backend)

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
# Required
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Optional API Keys (demo data used if not provided)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key

# Optional monetization
GOOGLE_ADSENSE_ID=your_adsense_id
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
```

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

### Search Endpoint

```http
GET /api/search?q=query&location=location&page=1&limit=20
```

**Parameters:**
- `q` (required): Search query
- `location` (optional): Job location
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "results": [...],
  "total": 45,
  "page": 1,
  "cached": false,
  "sources": ["Adzuna", "Career24"],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Health Check

```http
GET /api/health
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

### APIs
- **Adzuna**: Official job search API
- **Custom scrapers**: Career24, Indeed ZA

### Adding New Sources

1. Create scraper in `backend/services/scrapers/`
2. Add to `jobService.js`
3. Test with demo queries

## 📈 Analytics & Monitoring

- **Google Analytics**: User behavior and traffic
- **Sentry**: Error monitoring
- **Custom metrics**: Search queries, click-through rates

## 🛡 Security

- Rate limiting on search endpoints
- CORS configured for frontend domain
- Environment variables for sensitive data
- Helmet.js for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Team

- **Maanda** - Project Creator & Developer

## 📞 Support

- Email: support@futurelinkedza.co.za
- Website: [futurelinkedza.co.za](https://futurelinkedza.co.za)

---

**Built with ❤️ for South African job seekers**