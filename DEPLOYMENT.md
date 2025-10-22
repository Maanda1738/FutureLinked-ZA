# FutureLinked ZA - Deployment Guide

This guide covers multiple deployment options for FutureLinked ZA, from free hosting to production VPS setups.

## 🚀 Quick Deployment Options

### 1. Vercel (Frontend) + Render (Backend) - Recommended for Beginners

#### Frontend on Vercel (Free)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/futurelinked-za.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect GitHub account
   - Import your repository
   - Framework: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables on Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.render.com
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   ```

#### Backend on Render (Free Tier)

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Connect GitHub account
   - Create new Web Service
   - Repository: your-repo
   - Root Directory: **backend**
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables on Render**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_API_KEY=your_adzuna_api_key
   GOOGLE_ADSENSE_ID=your_adsense_id
   ```

### 2. Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify

1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `frontend` folder OR connect GitHub
   - Build Command: `npm run build`
   - Publish Directory: `.next`

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

#### Backend on Railway

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub
   - Deploy from repo
   - Select `backend` folder

2. **Environment Variables**
   - Add in Railway dashboard
   - Same variables as Render

### 3. Docker Deployment

#### Using Docker Compose (Local/VPS)

```bash
# Clone repository
git clone https://github.com/yourusername/futurelinked-za.git
cd futurelinked-za

# Create environment file
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Individual Docker Containers

```bash
# Build backend
cd backend
docker build -t futurelinked-backend .
docker run -p 3001:3001 --env-file .env futurelinked-backend

# Build frontend
cd ../frontend
docker build -t futurelinked-frontend .
docker run -p 3000:3000 futurelinked-frontend
```

## 🌐 VPS Production Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Domain name
- SSL certificate (Let's Encrypt)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/futurelinked-za.git
cd futurelinked-za

# Backend setup
cd backend
npm install --production
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start server.js --name futurelinked-api
pm2 save
pm2 startup

# Frontend setup
cd ../frontend
npm install
npm run build

# Copy build files to web directory
sudo cp -r .next /var/www/futurelinked-za/
sudo chown -R www-data:www-data /var/www/futurelinked-za/
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/futurelinked-za`:

```nginx
server {
    listen 80;
    server_name futurelinkedza.co.za www.futurelinkedza.co.za;

    # Frontend
    location / {
        root /var/www/futurelinked-za;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/futurelinked-za /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Certificate

```bash
sudo certbot --nginx -d futurelinkedza.co.za -d www.futurelinkedza.co.za
```

## 📊 Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Backend (.env)
```env
# Required
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com

# APIs (Optional)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key

# Monetization
GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxx

# Email (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
JWT_SECRET=your-super-secure-secret-key
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 Performance Optimization

### Frontend Optimizations
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['your-image-domains.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

### Backend Optimizations
```javascript
// Add to server.js
app.use(compression());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// Enable caching headers
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

## 📈 Monitoring Setup

### 1. Basic Monitoring
```bash
# Install monitoring tools
npm install sentry winston

# Add to package.json
"scripts": {
  "logs": "pm2 logs",
  "monitor": "pm2 monit",
  "restart": "pm2 restart all"
}
```

### 2. Health Checks
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:3001/api/health || systemctl restart futurelinked-api
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3001
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /path/to/project
   ```

3. **Environment variables not loading**
   ```bash
   # Check if .env exists and has correct format
   cat .env
   # Restart application
   pm2 restart all
   ```

4. **CORS errors**
   - Ensure FRONTEND_URL in backend .env matches your frontend domain
   - Check that API calls use the correct backend URL

### Logs
```bash
# Backend logs
pm2 logs futurelinked-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

## 🎯 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Search functionality works
- [ ] API endpoints respond
- [ ] Contact form sends emails
- [ ] Google Analytics tracking
- [ ] AdSense ads display (if configured)
- [ ] SSL certificate valid
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Monitoring alerts set up

## 💡 Cost Estimates

### Free Tier (Getting Started)
- Vercel Frontend: **Free**
- Render Backend: **Free** (with limitations)
- Domain: **$10-15/year**
- **Total: ~$15/year**

### Production Ready
- Vercel Pro: **$20/month**
- Railway Pro: **$5/month**
- Domain: **$15/year**
- **Total: ~$25/month**

### High Traffic
- VPS (4GB RAM): **$20-40/month**
- CDN: **$10-20/month**
- Monitoring: **$10/month**
- **Total: ~$50/month**

---

Need help with deployment? Contact us at support@futurelinkedza.co.za