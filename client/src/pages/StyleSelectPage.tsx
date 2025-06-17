import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import StyleSelector from '../components/style/StyleSelector';
import axios from 'axios';

const StyleSelectPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const steps = ['Upload Video', 'Select Style', 'Generate Commentary'];

  useEffect(() => {
    if (!videoId) {
      navigate('/upload');
      return;
    }

    // Fetch video details
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/videos/${videoId}`);
        
        if (response.data.success) {
          setThumbnailUrl(response.data.data.thumbnailUrl);
        } else {
          setError('Failed to load video details');
        }
      } catch (err) {
        setError('Error loading video information');
        console.error('Error fetching video details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, navigate]);

  const handleStyleSelected = (style: string, keywords: string[]) => {
    console.log('Selected style:', style);
    console.log('Keywords:', keywords);
    // Navigation is handled in the StyleSelector component
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          There was a problem loading the video information. Please try uploading again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Customize Your Commentary
      </Typography>
      
      <Stepper activeStep={1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Step 2: Choose Commentary Style
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Select a commentary style and add optional keywords to guide the AI.
        </Typography>
        
        {thumbnailUrl && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
          </Box>
        )}
        
        <StyleSelector videoId={videoId!} onStyleSelected={handleStyleSelected} />
      </Paper>
    </Box>
  );
};

export default StyleSelectPage;