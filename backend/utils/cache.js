const NodeCache = require('node-cache');

// Create cache instance with default TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ 
  stdTTL: 3600,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false
});

// Cache statistics
cache.on('set', (key, value) => {
  console.log(`Cache SET: ${key}`);
});

cache.on('del', (key, value) => {
  console.log(`Cache DEL: ${key}`);
});

cache.on('expired', (key, value) => {
  console.log(`Cache EXPIRED: ${key}`);
});

module.exports = {
  get: (key) => {
    try {
      return cache.get(key);
    } catch (error) {
      console.error('Cache GET error:', error);
      return null;
    }
  },

  set: (key, value, ttl = 3600) => {
    try {
      return cache.set(key, value, ttl);
    } catch (error) {
      console.error('Cache SET error:', error);
      return false;
    }
  },

  del: (key) => {
    try {
      return cache.del(key);
    } catch (error) {
      console.error('Cache DEL error:', error);
      return false;
    }
  },

  flush: () => {
    try {
      cache.flushAll();
      console.log('Cache flushed');
      return true;
    } catch (error) {
      console.error('Cache FLUSH error:', error);
      return false;
    }
  },

  getStats: () => {
    try {
      return cache.getStats();
    } catch (error) {
      console.error('Cache STATS error:', error);
      return {};
    }
  },

  getKeys: () => {
    try {
      return cache.keys();
    } catch (error) {
      console.error('Cache KEYS error:', error);
      return [];
    }
  }
};