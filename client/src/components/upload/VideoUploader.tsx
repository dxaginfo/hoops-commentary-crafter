import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MovieIcon from '@mui/icons-material/Movie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface VideoUploaderProps {
  onUploadSuccess: (videoId: string, thumbnailUrl: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset states
    setError(null);
    
    // Check if any files were accepted
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, MOV, AVI, or WMV files.');
      return;
    }
    
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit.');
      return;
    }
    
    // Set the selected file
    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.wmv']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    
    try {
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      if (response.data.success) {
        onUploadSuccess(response.data.data.videoId, response.data.data.thumbnailUrl);
        navigate(`/style/${response.data.data.videoId}`);
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error uploading video. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          p: 4,
          mb: 3,
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        <input {...getInputProps()} />
        
        <CloudUploadIcon sx={{ fontSize: 48, color: isDragActive ? 'primary.main' : 'text.secondary', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the video here' : 'Drag & drop your video here'}
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          or click to browse files
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Supported formats: MP4, MOV, AVI, WMV (max 15 seconds, 50MB)
        </Typography>
      </Paper>
      
      {selectedFile && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MovieIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1" noWrap sx={{ flex: 1 }}>
              {selectedFile.name}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </Typography>
          
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearSelection}
              disabled={uploading}
              sx={{ mr: 1 }}
            >
              Clear
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
              sx={{ flex: 1 }}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </Box>
          
          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      {!selectedFile && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Upload a short basketball clip to get started with AI commentary
        </Typography>
      )}
    </Box>
  );
};

export default VideoUploader;