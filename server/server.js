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

// ✅ CORS config with updated allowed origins
const allowedOrigins = [
  'https://snap-news-admin-panel-1234.onrender.com',  // Admin panel (Render frontend)
  'https://snapnews-api.onrender.com',                // Optional: your backend’s own origin
  'https://snap-news-admin.vercel.app',               // Optional: if deployed on Vercel
  'http://localhost:5173'                             // Local dev
];

app.use(cors({
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
}));

// ✅ Preflight OPTIONS requests (important!)
app.options('*', cors());


// ✅ Handle preflight OPTIONS requests
app.options('*', cors());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Body parser & session middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// ✅ Public login route
app.post('/admin/login', require('./controllers/adminController').login);

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
