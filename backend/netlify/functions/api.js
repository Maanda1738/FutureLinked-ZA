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

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - handle both with and without leading slash
app.use('/search', searchRoute);
app.use('/health', healthRoute);
app.use('/cv', cvAnalysisRoute);
app.use('/:path(search)', searchRoute);
app.use('/:path(health)', healthRoute);
app.use('/:path(cv)', cvAnalysisRoute);

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

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export serverless handler
module.exports.handler = serverless(app);
