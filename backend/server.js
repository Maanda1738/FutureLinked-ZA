require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const searchRoutes = require('./routes/search');
const healthRoutes = require('./routes/health');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3003',
    'https://futurelinked-za.co.za',
    'https://futurelinked.netlify.app',
    'https://*.netlify.app' // Allows all Netlify preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/search', searchRoutes);
app.use('/health', healthRoutes);
app.use('/contact', contactRoutes);

// CV Analysis routes (OpenAI-powered)
const cvAnalysisRoutes = require('./routes/cv-analysis');
app.use('/cv', cvAnalysisRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'FutureLinked ZA API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      search: '/search',
      health: '/health',
      contact: '/contact',
      cv: {
        upload: '/cv/upload',
        analyze: '/cv/analyze',
        matchJobs: '/cv/match-jobs',
        edit: '/cv/edit'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FutureLinked ZA API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});