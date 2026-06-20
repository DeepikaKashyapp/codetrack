const redis = require('redis');
require('dotenv').config();

async function run() {
  const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  await client.connect();
  try {
    await client.zIncBy('leaderboard', 1, '1');
    console.log('zIncBy worked!');
  } catch (err) {
    console.error('zIncBy error:', err.message);
  }
  
  try {
    await client.zIncrBy('leaderboard', 1, '1');
    console.log('zIncrBy worked!');
  } catch (err) {
    console.error('zIncrBy error:', err.message);
  }
  
  await client.disconnect();
}
run();
