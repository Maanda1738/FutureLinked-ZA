const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)} minutes`,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  res.json(status);
});

// GET /api/health/services
router.get('/services', async (req, res) => {
  const services = {
    cache: { status: 'operational' },
    jobAPIs: { 
      status: 'operational',
      sources: ['Adzuna', 'Custom scrapers']
    },
    database: { 
      status: process.env.DATABASE_URL ? 'connected' : 'not configured'
    }
  };

  res.json({
    success: true,
    services,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;