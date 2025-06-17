const { OpenAI } = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { getVideoById } = require('./videoController');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate commentary text based on user preferences
 * @param {string} videoId - The ID of the video
 * @param {string} style - The style of commentary (Excitable, Analytical, Old School)
 * @param {Array<string>} keywords - Keywords to guide the commentary
 * @returns {Promise<Object>} - Generated commentary text and metadata
 */
const generateCommentary = async (videoId, style, keywords = []) => {
  try {
    // Get video info
    const video = await getVideoById(videoId);
    
    // Construct prompt based on style and keywords
    let prompt = `Generate a short basketball play-by-play commentary in ${style} style`;
    
    if (keywords && keywords.length > 0) {
      prompt += ` focusing on these elements: ${keywords.join(', ')}`;
    }
    
    prompt += `. The commentary should be approximately 10-15 seconds long when spoken aloud, suitable for a short clip. Make it engaging and authentic.`;
    
    // Add style-specific guidance
    if (style.toLowerCase() === 'excitable') {
      prompt += ` Include enthusiasm, dynamic energy, and excited reactions like "WHAT A PLAY!" or "UNBELIEVABLE!" where appropriate.`;
    } else if (style.toLowerCase() === 'analytical') {
      prompt += ` Focus on technique, strategy, and player positioning. Use basketball terminology and analyze the effectiveness of the play.`;
    } else if (style.toLowerCase() === 'old school') {
      prompt += ` Use classic basketball phrases and a more measured, nostalgic tone reminiscent of commentators from the 1980s and 90s.`;
    }
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional basketball commentator with years of experience. Your job is to create engaging, realistic commentary for basketball plays." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    // Extract the generated text
    const commentaryText = response.choices[0].message.content.trim();
    
    // Save the commentary to a file
    const commentaryId = uuidv4();
    const commentaryDir = path.join(__dirname, '../uploads/commentaries');
    
    if (!fs.existsSync(commentaryDir)) {
      fs.mkdirSync(commentaryDir, { recursive: true });
    }
    
    const commentaryPath = path.join(commentaryDir, `${commentaryId}.txt`);
    fs.writeFileSync(commentaryPath, commentaryText);
    
    return {
      id: commentaryId,
      text: commentaryText,
      style,
      keywords
    };
  } catch (error) {
    console.error('Error generating commentary:', error);
    throw new Error('Failed to generate commentary: ' + error.message);
  }
};

/**
 * Convert commentary text to speech
 * @param {string} commentaryId - The ID of the commentary
 * @param {string} voiceStyle - The voice style to use
 * @returns {Promise<Object>} - Audio file metadata
 */
const textToSpeech = async (commentaryId, voiceStyle = 'default') => {
  try {
    // Read the commentary text
    const commentaryPath = path.join(__dirname, `../uploads/commentaries/${commentaryId}.txt`);
    
    if (!fs.existsSync(commentaryPath)) {
      throw new Error('Commentary not found');
    }
    
    const commentaryText = fs.readFileSync(commentaryPath, 'utf8');
    
    // Create directory for audio files if it doesn't exist
    const audioDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const audioId = uuidv4();
    const audioPath = path.join(audioDir, `${audioId}.mp3`);
    
    // In a production environment, we would use a Text-to-Speech API here
    // For this example, we'll simulate it and create a placeholder
    
    // TODO: Replace with actual TTS API call
    // For now, this is a simulation
    console.log(`[Simulated] Converting text to speech: "${commentaryText}"`);
    console.log(`[Simulated] Using voice style: ${voiceStyle}`);
    
    // Create an empty audio file as a placeholder
    fs.writeFileSync(audioPath, 'Placeholder for TTS audio');
    
    // In reality, we would return metadata from the TTS service
    return {
      audioId,
      audioUrl: `/api/audio/${audioId}.mp3`,
      duration: 10, // Simulated duration in seconds
      voiceStyle
    };
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw new Error('Failed to convert text to speech: ' + error.message);
  }
};

/**
 * Merge audio commentary with original video
 * @param {string} videoId - The ID of the video
 * @param {string} audioId - The ID of the audio commentary
 * @returns {Promise<Object>} - Result of the merge operation
 */
const mergeAudioVideo = async (videoId, audioId) => {
  try {
    // Get paths for video and audio
    const video = await getVideoById(videoId);
    const videoPath = video.filePath;
    
    const audioPath = path.join(__dirname, `../uploads/audio/${audioId}.mp3`);
    if (!fs.existsSync(audioPath)) {
      throw new Error('Audio file not found');
    }
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../uploads/results');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const resultId = uuidv4();
    const outputPath = path.join(outputDir, `${resultId}.mp4`);
    
    return new Promise((resolve, reject) => {
      // Use ffmpeg to merge audio and video
      ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions([
          '-c:v copy',          // Copy video codec
          '-c:a aac',           // Use AAC audio codec
          '-map 0:v',           // Use video from first input
          '-map 1:a',           // Use audio from second input
          '-shortest'           // Finish encoding when the shortest input stream ends
        ])
        .on('start', (commandLine) => {
          console.log('FFmpeg started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('FFmpeg has finished');
          resolve({
            resultId,
            resultUrl: `/api/results/${resultId}.mp4`
          });
        })
        .on('error', (err) => {
          console.error('Error merging audio and video:', err);
          reject(new Error('Failed to merge audio and video: ' + err.message));
        })
        .save(outputPath);
    });
  } catch (error) {
    console.error('Error in merge operation:', error);
    throw new Error('Failed to merge audio and video: ' + error.message);
  }
};

module.exports = {
  generateCommentary,
  textToSpeech,
  mergeAudioVideo
};