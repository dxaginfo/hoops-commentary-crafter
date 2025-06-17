require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Create uploads and results directories if they don't exist
const uploadDir = path.join(__dirname, 'uploads');
const resultsDir = path.join(__dirname, 'results');
const thumbnailsDir = path.join(__dirname, 'uploads/thumbnails');

[uploadDir, resultsDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/results', express.static(path.join(__dirname, 'results')));

// API Routes
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/commentary', require('./routes/commentaryRoutes'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 50MB.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;