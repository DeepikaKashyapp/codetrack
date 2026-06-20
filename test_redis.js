const redis = require('redis');
require('dotenv').config();

async function run() {
  const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  await client.connect();
  const res = await client.zRangeWithScores('leaderboard', 0, -1, { REV: true });
  console.log('Leaderboard in Redis:', res);
  
  await client.disconnect();
}
run();
