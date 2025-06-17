import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProcessingStep {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progressPercent?: number;
  message?: string;
}

const ProcessingPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { name: 'Generating Commentary', status: 'pending' },
    { name: 'Converting Text to Speech', status: 'pending' },
    { name: 'Merging Audio with Video', status: 'pending' }
  ]);
  
  const navigate = useNavigate();
  
  // Steps for the stepper component at the top
  const mainSteps = ['Upload Video', 'Select Style', 'Generate Commentary'];

  useEffect(() => {
    if (!videoId) {
      navigate('/upload');
      return;
    }

    // Simulate the processing steps with timeouts
    const simulateProcessing = async () => {
      try {
        // Update step 1: Generating Commentary
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 0 ? { ...step, status: 'in_progress', progressPercent: 0 } : step
        ));
        
        // Simulate progress for step 1
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setProcessingSteps(prev => prev.map((step, index) => 
            index === 0 ? { ...step, progressPercent: i } : step
          ));
        }
        
        // Mark step 1 as completed
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 0 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 2: Converting Text to Speech
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 1 ? { ...step, status: 'in_progress', progressPercent: 0 } : step
        ));
        
        // Simulate progress for step 2
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProcessingSteps(prev => prev.map((step, index) => 
            index === 1 ? { ...step, progressPercent: i } : step
          ));
        }
        
        // Mark step 2 as completed
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 1 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 3: Merging Audio with Video
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 2 ? { ...step, status: 'in_progress', progressPercent: 0 } : step
        ));
        
        // Simulate progress for step 3
        for (let i = 0; i <= 100; i += 2) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setProcessingSteps(prev => prev.map((step, index) => 
            index === 2 ? { ...step, progressPercent: i } : step
          ));
        }
        
        // Mark step 3 as completed
        setProcessingSteps(prev => prev.map((step, index) => 
          index === 2 ? { ...step, status: 'completed' } : step
        ));
        
        // Set a result ID (in a real app, this would come from the API)
        const mockResultId = 'result_' + Math.random().toString(36).substring(2, 15);
        setResultId(mockResultId);
        
        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to result page
        navigate(`/result/${mockResultId}`);
      } catch (err) {
        console.error('Error during processing simulation:', err);
        setError('An error occurred during processing');
      } finally {
        setIsLoading(false);
      }
    };

    simulateProcessing();
  }, [videoId, navigate]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Generating Your Commentary
      </Typography>
      
      <Stepper activeStep={2} sx={{ mb: 4 }}>
        {mainSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Step 3: Processing Your Video
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Please wait while we generate and apply your custom commentary.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4 }}>
          {processingSteps.map((step, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {step.status === 'pending' && (
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'grey.300' }} />
                  )}
                  {step.status === 'in_progress' && (
                    <CircularProgress size={24} thickness={5} />
                  )}
                  {step.status === 'completed' && (
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      ✓
                    </Box>
                  )}
                  {step.status === 'error' && (
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      !
                    </Box>
                  )}
                </Box>
                <Typography 
                  variant="body1" 
                  fontWeight={step.status === 'in_progress' ? 'bold' : 'normal'}
                  color={
                    step.status === 'completed' ? 'success.main' : 
                    step.status === 'error' ? 'error.main' : 
                    step.status === 'in_progress' ? 'primary.main' : 
                    'text.primary'
                  }
                >
                  {step.name}
                  {step.status === 'in_progress' && step.progressPercent !== undefined && ` (${step.progressPercent}%)`}
                </Typography>
              </Box>
              
              {step.status === 'in_progress' && step.progressPercent !== undefined && (
                <LinearProgress 
                  variant="determinate" 
                  value={step.progressPercent} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              )}
              
              {step.message && (
                <Typography variant="body2" color="textSecondary" sx={{ ml: 5, mt: 0.5 }}>
                  {step.message}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          This process typically takes less than a minute. You'll be automatically redirected when complete.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProcessingPage;