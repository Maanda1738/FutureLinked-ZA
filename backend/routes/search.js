const express = require('express');
const { searchJobs } = require('../services/jobService');
const cache = require('../utils/cache');

const router = express.Router();

// GET /api/search
router.get('/', async (req, res) => {
  try {
    const { q: query, location = '', page = 1, limit = 15 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Generate cache key
    const cacheKey = `search:${query}:${location}:${page}:${limit}`;
    
    // Check cache first
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      console.log(`Cache hit for: ${cacheKey}`);
      return res.json({
        success: true,
        results: cachedResults.results,
        total: cachedResults.total,
        page: parseInt(page),
        cached: true,
        timestamp: cachedResults.timestamp
      });
    }

    console.log(`Searching for: "${query}" in location: "${location}"`);

    // Perform search
    const searchResults = await searchJobs({
      query: query.trim(),
      location: location.trim(),
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Cache the results for 1 hour
    cache.set(cacheKey, {
      results: searchResults.results,
      total: searchResults.total,
      timestamp: new Date().toISOString()
    }, 3600);

    res.json({
      success: true,
      results: searchResults.results,
      total: searchResults.total,
      page: parseInt(page),
      cached: false,
      sources: searchResults.sources || ['Multiple job boards'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform search',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/search/suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      'IT internship',
      'Data analyst',
      'Graduate program',
      'Engineering bursary',
      'Marketing jobs',
      'Teaching positions',
      'Software developer',
      'Project manager',
      'Graphic designer',
      'Accounting internship'
    ];

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

module.exports = router;