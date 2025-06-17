import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Box, Paper } from '@mui/material';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  height?: string;
  width?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  poster, 
  height = '360px', 
  width = '100%' 
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: false,
        responsive: true,
        preload: 'auto',
        poster: poster,
        sources: [{
          src: src,
          type: 'video/mp4'
        }]
      }, () => {
        console.log('Player is ready');
      });
    } else if (playerRef.current) {
      // Update player source if it changes
      playerRef.current.src([{
        src: src,
        type: 'video/mp4'
      }]);
      
      if (poster) {
        playerRef.current.poster(poster);
      }
    }

    return () => {
      // Dispose the player when component unmounts
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        width: width
      }}
    >
      <Box 
        ref={videoRef} 
        data-vjs-player 
        sx={{ 
          height: height,
          width: '100%',
          '& .video-js': {
            width: '100%',
            height: '100%'
          },
          '& .vjs-big-play-button': {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }
          },
          '& .vjs-control-bar': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }
        }} 
      />
    </Paper>
  );
};

export default VideoPlayer;