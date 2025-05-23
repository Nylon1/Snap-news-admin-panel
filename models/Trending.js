// server/models/Trending.js
const mongoose = require('mongoose');

const TrendingSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  videoUrl:   { type: String, required: true },
  description:{ type: String },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trending', TrendingSchema);

