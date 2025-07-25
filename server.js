require('dotenv').config();
console.log("🔑 SESSION_SECRET is:", process.env.SESSION_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Import controllers and routes
const adminController = require('./server/controllers/adminController');
const adminRoutes = require('./server/routes/admin');
const publicRoutes = require('./server/routes/public');
const { authenticateAdmin } = require('./server/middleware/auth');

const app = express();

// Debug origin logging
app.use((req, res, next) => {
  console.log('🔍 Request Origin:', req.headers.origin);
  next();
});

// CORS configuration
const allowedOrigins = [
  'https://snap-news-admin-panel-1234.onrender.com',

  'http://localhost:5173',
  'https://snap-news.onrender.com',
  'https://snapbackend-new.onrender.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Serve static frontend files for admin UI
app.use(express.static(path.join(__dirname, 'server', 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Public login route
app.post('/admin/login', cors(corsOptions), adminController.login);

// Protected admin API routes
app.use('/admin', authenticateAdmin, adminRoutes);

// Public content API routes
app.use('/public', publicRoutes);

// Admin UI pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-dashboard.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-dashboard.html'));
});
app.get('/content', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-content.html'));
});
app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-analytics.html'));
});
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-create.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'public', 'admin-login.html'));
});

// CORS test endpoint
app.get('/cors-check', cors(corsOptions), (req, res) => {
  res.json({ message: 'CORS is working ✅' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

