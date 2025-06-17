import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Chip,
  Stack,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import SportsIcon from '@mui/icons-material/Sports';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface StyleSelectorProps {
  videoId: string;
  onStyleSelected: (style: string, keywords: string[]) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ videoId, onStyleSelected }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('excitable');
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const styleOptions: StyleOption[] = [
    {
      id: 'excitable',
      name: 'Excitable',
      description: 'Energetic play-by-play with excitement and enthusiasm',
      icon: <SportsIcon fontSize="large" />
    },
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'Technical breakdown focusing on strategy and player technique',
      icon: <AnalyticsIcon fontSize="large" />
    },
    {
      id: 'oldSchool',
      name: 'Old School',
      description: 'Classic commentary style with nostalgic phrases and measured delivery',
      icon: <EmojiObjectsIcon fontSize="large" />
    }
  ];

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value);
  };

  const handleKeywordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(event.target.value);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddKeyword();
    }
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API to generate commentary
      const response = await axios.post('/api/commentary/generate', {
        videoId,
        style: selectedStyle,
        keywords
      });
      
      if (response.data.success) {
        onStyleSelected(selectedStyle, keywords);
        
        // Now send to text-to-speech
        const ttsResponse = await axios.post('/api/commentary/text-to-speech', {
          commentaryId: response.data.data.commentaryId,
          voiceStyle: selectedStyle
        });
        
        if (ttsResponse.data.success) {
          // Finally, merge audio and video
          const mergeResponse = await axios.post('/api/commentary/merge', {
            videoId,
            audioId: ttsResponse.data.data.audioId
          });
          
          if (mergeResponse.data.success) {
            navigate(`/result/${mergeResponse.data.data.resultId}`);
          } else {
            setError(mergeResponse.data.message || 'Failed to merge audio and video');
          }
        } else {
          setError(ttsResponse.data.message || 'Failed to convert text to speech');
        }
      } else {
        setError(response.data.message || 'Failed to generate commentary');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error processing request');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Style selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h5" gutterBottom>
        Choose Commentary Style
      </Typography>
      
      <RadioGroup
        value={selectedStyle}
        onChange={handleStyleChange}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={2}>
          {styleOptions.map((style) => (
            <Grid item xs={12} md={4} key={style.id}>
              <Card 
                sx={{
                  height: '100%',
                  border: selectedStyle === style.id ? '2px solid' : '1px solid',
                  borderColor: selectedStyle === style.id ? 'primary.main' : 'grey.300',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: 2
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <FormControlLabel
                      value={style.id}
                      control={<Radio />}
                      label=""
                      sx={{ mt: -1, mr: 0 }}
                    />
                    <Box>
                      <Typography variant="h6">{style.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {style.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {style.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
      
      <Typography variant="h5" gutterBottom>
        Add Keywords (Optional)
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Add keywords to guide the focus of your commentary
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          value={keywordInput}
          onChange={handleKeywordInputChange}
          onKeyPress={handleKeyPress}
          placeholder="e.g., three-pointer, defense, assist"
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleAddKeyword}
          disabled={!keywordInput.trim()}
        >
          Add
        </Button>
      </Box>
      
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4 }}>
        {keywords.map((keyword) => (
          <Chip
            key={keyword}
            label={keyword}
            onDelete={() => handleDeleteKeyword(keyword)}
            sx={{ m: 0.5 }}
          />
        ))}
        {keywords.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No keywords added
          </Typography>
        )}
      </Stack>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 200 }}
        >
          {isLoading ? 'Processing...' : 'Generate Commentary'}
        </Button>
      </Box>
    </Box>
  );
};

export default StyleSelector;