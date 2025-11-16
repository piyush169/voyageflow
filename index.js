// index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cors = require('cors');
app.use(cors());


const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // parse JSON bodies

// API routes
app.use('/api/auth', authRoutes);

// Serve static frontend
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback: serve index.html for any other route (SPA-friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VoyageFlow server running on http://localhost:${PORT}`);
});
