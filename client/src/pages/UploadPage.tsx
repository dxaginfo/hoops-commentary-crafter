import React, { useState } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel } from '@mui/material';
import VideoUploader from '../components/upload/VideoUploader';

const UploadPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const steps = ['Upload Video', 'Select Style', 'Generate Commentary'];

  const handleUploadSuccess = (newVideoId: string, newThumbnailUrl: string) => {
    setVideoId(newVideoId);
    setThumbnailUrl(newThumbnailUrl);
    setActiveStep(1); // Move to next step
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Upload Your Basketball Clip
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Step 1: Upload Your Video
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Upload a short basketball clip (up to 15 seconds) to add AI-generated commentary.
        </Typography>
        
        <VideoUploader onUploadSuccess={handleUploadSuccess} />
      </Paper>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          By uploading, you confirm that you have the rights to use this content.
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadPage;