require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Minimal health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Minimal server running' });
});

// Minimal search endpoint
app.get('/api/search', async (req, res) => {
  try {
    console.log('Received search request:', req.query);
    
    // Test basic functionality
    const results = [
      {
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        description: 'This is a test job',
        url: 'https://example.com',
        type: 'Full-time',
        source: 'Test'
      }
    ];

    res.json({
      success: true,
      results,
      total: 1,
      sources: ['Test']
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🧪 Minimal test server running on http://127.0.0.1:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET http://127.0.0.1:${PORT}/api/health`);
  console.log(`  GET http://127.0.0.1:${PORT}/api/search`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});