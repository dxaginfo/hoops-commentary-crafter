const express = require('express');
const { 
  generateCommentary, 
  textToSpeech, 
  mergeAudioVideo 
} = require('../controllers/commentaryController');

const router = express.Router();

// Generate text commentary based on user preferences
router.post('/generate', async (req, res, next) => {
  try {
    const { videoId, style, keywords } = req.body;
    
    if (!videoId || !style) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: videoId and style are required'
      });
    }
    
    // Generate commentary text
    const commentary = await generateCommentary(videoId, style, keywords);
    
    res.status(200).json({
      success: true,
      message: 'Commentary generated successfully',
      data: {
        videoId,
        commentaryText: commentary.text,
        commentaryId: commentary.id
      }
    });
  } catch (error) {
    next(error);
  }
});

// Convert commentary text to speech
router.post('/text-to-speech', async (req, res, next) => {
  try {
    const { commentaryId, voiceStyle } = req.body;
    
    if (!commentaryId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: commentaryId'
      });
    }
    
    // Convert text to speech
    const audioResult = await textToSpeech(commentaryId, voiceStyle);
    
    res.status(200).json({
      success: true,
      message: 'Text-to-speech conversion successful',
      data: {
        commentaryId,
        audioId: audioResult.audioId,
        audioUrl: audioResult.audioUrl,
        duration: audioResult.duration
      }
    });
  } catch (error) {
    next(error);
  }
});

// Merge audio commentary with original video
router.post('/merge', async (req, res, next) => {
  try {
    const { videoId, audioId } = req.body;
    
    if (!videoId || !audioId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: videoId and audioId'
      });
    }
    
    // Merge audio and video
    const mergeResult = await mergeAudioVideo(videoId, audioId);
    
    res.status(200).json({
      success: true,
      message: 'Audio and video merged successfully',
      data: {
        resultId: mergeResult.resultId,
        resultUrl: mergeResult.resultUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get a processed video with commentary
router.get('/result/:resultId', (req, res, next) => {
  try {
    const { resultId } = req.params;
    
    // Logic to retrieve the processed video result
    // Placeholder response
    res.status(200).json({
      success: true,
      message: 'Result retrieved successfully',
      data: {
        resultId,
        resultUrl: `/api/results/${resultId}.mp4`,
        // Other metadata would be added here
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { commentaryRoutes: router };