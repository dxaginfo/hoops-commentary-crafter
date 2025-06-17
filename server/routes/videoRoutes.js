const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { processVideo } = require('../controllers/videoController');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter for video formats
const fileFilter = (req, file, cb) => {
  // Accept only video files
  const allowedTypes = [
    'video/mp4', 
    'video/quicktime', 
    'video/x-msvideo', 
    'video/x-ms-wmv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

// Configure upload settings
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// Routes
router.post('/upload', upload.single('video'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No video file uploaded' 
      });
    }

    // Process the uploaded video
    const result = await processVideo(req.file);
    
    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        videoId: result.videoId,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        duration: result.duration,
        thumbnailUrl: result.thumbnailUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get video info by ID
router.get('/:videoId', (req, res, next) => {
  try {
    const { videoId } = req.params;
    // Logic to retrieve video information
    // This would typically query a database
    
    // Placeholder response
    res.status(200).json({
      success: true,
      message: 'Video information retrieved',
      data: {
        videoId,
        // Other video details would be added here
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete video
router.delete('/:videoId', (req, res, next) => {
  try {
    const { videoId } = req.params;
    // Logic to delete video file and related data
    
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { videoRoutes: router };