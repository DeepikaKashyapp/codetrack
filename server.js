const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const redisClient = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route for friendly welcome message
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to CodeTrack++ API!' });
});

// Basic health check route
app.get('/health', async (req, res) => {
  try {
    // Check DB
    await db.query('SELECT 1');
    // Check Redis
    await redisClient.ping();
    
    res.status(200).json({ status: 'ok', message: 'API, PostgreSQL, and Redis are running' });
  } catch (error) {
    console.error('Health check failed', error);
    res.status(500).json({ status: 'error', message: 'System unavailable' });
  }
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const listRoutes = require('./routes/listRoutes');

// Routes will be mounted here
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/lists', listRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

const syncLeaderboard = require('./scripts/syncLeaderboard');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  syncLeaderboard.startSyncJob();
});
