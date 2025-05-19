require('dotenv').config();
console.log("🔑 SESSION_SECRET is:", process.env.SESSION_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const { authenticateAdmin } = require('./middleware/auth');

const app = express();

// 🔍 Debug origin logging
app.use((req, res, next) => {
  console.log('🔍 Request Origin:', req.headers.origin);
  next();
});

// ✅ CORS config (cleaned)
const allowedOrigins = [
  'https://snap-news-admin-panel-1234.onrender.com',
  'https://snapnews-api.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Preflight request handler
app.options('*', cors(corsOptions));

// ✅ Static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// ✅ Public login route with explicit CORS
app.post('/admin/login', cors(corsOptions), require('./controllers/adminController').login);

// ✅ Protected routes
app.use('/admin', authenticateAdmin, adminRoutes);
app.use('/public', publicRoutes);

// ✅ Admin UI Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/content', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-content.html'));
});

app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-analytics.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-create.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
