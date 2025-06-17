const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Process uploaded video to validate and extract metadata
 * @param {Object} file - The uploaded file object from multer
 * @returns {Promise<Object>} - Video processing result
 */
const processVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const videoId = uuidv4();
    const videoPath = file.path;
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    const thumbnailPath = path.join(thumbnailDir, `${videoId}.jpg`);
    
    // Create thumbnails directory if it doesn't exist
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    
    // Use ffmpeg to get video metadata and create thumbnail
    ffmpeg(videoPath)
      .on('filenames', (filenames) => {
        console.log('Generating thumbnail: ' + filenames.join(', '));
      })
      .on('end', function() {
        console.log('Screenshots taken');
        
        // Now get video metadata
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) {
            return reject(new Error('Failed to get video metadata: ' + err.message));
          }
          
          // Check if video duration is within limits (15 seconds max)
          const duration = metadata.format.duration;
          if (duration > 15) {
            return reject(new Error('Video duration exceeds the 15 second limit'));
          }
          
          resolve({
            videoId,
            duration,
            thumbnailUrl: `/api/videos/thumbnail/${videoId}.jpg`,
            metadata
          });
        });
      })
      .on('error', function(err) {
        console.error('Error generating thumbnail:', err);
        reject(new Error('Failed to process video: ' + err.message));
      })
      .screenshots({
        count: 1,
        folder: thumbnailDir,
        filename: `${videoId}.jpg`,
        size: '320x240'
      });
  });
};

/**
 * Get video details by ID
 * @param {string} videoId - The ID of the video
 * @returns {Promise<Object>} - Video details
 */
const getVideoById = async (videoId) => {
  // In a real application, this would query a database
  // For now, we'll just check if the file exists
  const videoDir = path.join(__dirname, '../uploads');
  const files = fs.readdirSync(videoDir);
  
  // Find a file that contains the videoId
  const videoFile = files.find(file => file.includes(videoId));
  
  if (!videoFile) {
    throw new Error('Video not found');
  }
  
  return {
    videoId,
    filePath: path.join(videoDir, videoFile),
    fileName: videoFile
  };
};

/**
 * Delete a video and its associated files
 * @param {string} videoId - The ID of the video to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteVideo = async (videoId) => {
  try {
    const videoDetails = await getVideoById(videoId);
    
    // Delete the video file
    fs.unlinkSync(videoDetails.filePath);
    
    // Delete thumbnail if it exists
    const thumbnailPath = path.join(__dirname, `../uploads/thumbnails/${videoId}.jpg`);
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video: ' + error.message);
  }
};

module.exports = {
  processVideo,
  getVideoById,
  deleteVideo
};