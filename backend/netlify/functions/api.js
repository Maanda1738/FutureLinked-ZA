const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const searchRoute = require('../../routes/search');
const healthRoute = require('../../routes/health');
const cvAnalysisRoute = require('../../routes/cv-analysis');

const app = express();

// Security middleware with relaxed CSP for file uploads
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',  // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parsing - IMPORTANT: Don't parse body for /cv routes (multer handles it)
app.use((req, res, next) => {
  if (req.path.includes('/cv/upload')) {
    // Skip body parsing for file uploads - multer will handle it
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

// Routes - handle both with and without leading slash
app.use('/search', searchRoute);
app.use('/health', healthRoute);
app.use('/cv', cvAnalysisRoute);

// Also handle routes without leading slash
app.use(/^\/?search/, searchRoute);
app.use(/^\/?health/, healthRoute);
app.use(/^\/?cv/, cvAnalysisRoute);

// Root handler for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'FutureLinked ZA API',
    endpoints: {
      health: '/.netlify/functions/api/health',
      search: '/.netlify/functions/api/search',
      cv: '/.netlify/functions/api/cv/upload'
    }
  });
});

// 404 handler - log unmatched routes
app.use((req, res, next) => {
  console.log(`⚠️ Route not found: ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      '/.netlify/functions/api/health',
      '/.netlify/functions/api/search',
      '/.netlify/functions/api/cv/upload'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export serverless handler with binary support for file uploads
module.exports.handler = serverless(app, {
  binary: ['multipart/form-data', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
});
