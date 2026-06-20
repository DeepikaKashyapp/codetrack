const { createClient } = require('redis');
require('dotenv').config();

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on('error', (err) => console.error('Redis Client Error:', err.message));
  redisClient.on('connect', () => console.log('Redis Client Connected'));

  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis during startup:', err.message);
    }
  })();
} else {
  console.log('No REDIS_URL found. Running without Redis cache.');
  // Mock Redis client with empty functions so the app doesn't crash
  redisClient = {
    get: async () => null,
    set: async () => null,
    setEx: async () => null,
    del: async () => null,
    zAdd: async () => null,
    zIncrBy: async () => null,
    zRangeWithScores: async () => [],
    zRevRangeWithScores: async () => [],
    ping: async () => 'PONG',
    connect: async () => {}
  };
}

module.exports = redisClient;
