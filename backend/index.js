const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { sanitizeInput } = require('./middleware/sanitize');
const { rateLimit } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeInput);

// Basic health check route (must be before catch-all)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ClearPath Backend', version: '1.0.0' });
});

// API Routes — auth is public, everything else behind rate limiter
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meetings', rateLimit({ maxRequests: 20 }), require('./routes/meetings'));
app.use('/api/scheduler', rateLimit({ maxRequests: 15 }), require('./routes/scheduler'));
app.use('/api/nudge', rateLimit({ maxRequests: 15 }), require('./routes/nudge'));
app.use('/api/ippo', rateLimit({ maxRequests: 20 }), require('./routes/ippo'));

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all handler for React Router (Express 5 compatible)
app.use((req, res, next) => {
  // Only serve index.html for non-API GET requests
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        next(err);
      }
    });
  } else {
    next();
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`ClearPath backend running on port ${PORT}`);
});
