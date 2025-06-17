import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/result/VideoPlayer';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplayIcon from '@mui/icons-material/Replay';
import axios from 'axios';

const ResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultId) {
      navigate('/upload');
      return;
    }

    // Fetch result details
    const fetchResultDetails = async () => {
      try {
        const response = await axios.get(`/api/commentary/result/${resultId}`);
        
        if (response.data.success) {
          setResultUrl(response.data.data.resultUrl);
        } else {
          setError('Failed to load result');
        }
      } catch (err) {
        setError('Error loading result information');
        console.error('Error fetching result details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultDetails();
  }, [resultId, navigate]);

  const handleDownload = () => {
    // In a real application, this would trigger a download
    // For now, we'll just show a notification
    setSnackbarMessage('Download started');
    setSnackbarOpen(true);
  };

  const handleShare = () => {
    // In a real application, this would open a share dialog
    // For now, we'll just simulate copying a link
    navigator.clipboard.writeText(`https://yourapp.com/share/${resultId}`).then(() => {
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    });
  };

  const handleStartNew = () => {
    navigate('/upload');
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
          There was a problem loading your result. Please try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartNew}
          sx={{ mt: 2 }}
        >
          Start New Commentary
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Your Commentary is Ready!
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          {resultUrl && (
            <VideoPlayer 
              src={resultUrl} 
              height="500px"
            />
          )}
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownload}
              sx={{ py: 1.5 }}
            >
              Download
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{ py: 1.5 }}
            >
              Share
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={handleStartNew}
              sx={{ py: 1.5 }}
            >
              Create Another
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Suggested Next Steps
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Try Different Styles
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Upload the same clip with different commentary styles to find your favorite.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Share with Friends
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Share your commentated highlights on social media and with your team.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Provide Feedback
              </Typography>
              <Button
                startIcon={<ThumbUpIcon />}
                variant="text"
                color="primary"
                onClick={() => {
                  setSnackbarMessage('Thanks for your feedback!');
                  setSnackbarOpen(true);
                }}
              >
                Rate This Result
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ResultPage;