<<<<<<< HEAD
require('dotenv').config();
console.log("🔑 SESSION_SECRET is:", process.env.SESSION_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const { authenticateAdmin } = require('./middleware/auth');

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Public login route
app.post('/admin/login', require('./controllers/adminController').login);

// Protected admin routes
app.use('/admin', authenticateAdmin, adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const publicRoutes = require('./routes/public');
app.use('/public', publicRoutes);
=======
require('dotenv').config();
console.log("🔑 SESSION_SECRET is:", process.env.SESSION_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const { authenticateAdmin } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Public login route
app.post('/admin/login', require('./controllers/adminController').login);

// Protected admin routes
app.use('/admin', authenticateAdmin, adminRoutes);

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('✅ Snap News API is running.');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const publicRoutes = require('./routes/public');
app.use('/public', publicRoutes);
>>>>>>> 9a82c5d0e0788930f6b724dd46f1d59a2968580c
