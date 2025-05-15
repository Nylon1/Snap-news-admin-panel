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

// ✅ Allow only your admin panel to access the API
const allowedOrigins = ['https://snap-news-admin-panel-1234.onrender.com'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Serve static files (if needed)
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

// ✅ Public login route
app.post('/admin/login', require('./controllers/adminController').login);

// ✅ Protected admin routes
app.use('/admin', authenticateAdmin, adminRoutes);

// ✅ Optional public routes
app.use('/public', publicRoutes);

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ Snap News API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

