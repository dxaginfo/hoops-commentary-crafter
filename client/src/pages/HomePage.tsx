import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import MicIcon from '@mui/icons-material/Mic';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <SportsBasketballIcon sx={{ fontSize: 40 }} />,
      title: 'Upload Your Plays',
      description: 'Share your best basketball moments with quick and easy video upload.'
    },
    {
      icon: <MicIcon sx={{ fontSize: 40 }} />,
      title: 'Choose Your Style',
      description: 'Select from different commentary styles to match your play's energy.'
    },
    {
      icon: <MovieFilterIcon sx={{ fontSize: 40 }} />,
      title: 'Generate & Share',
      description: 'Get professional-sounding commentary and share with your friends.'
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          mb: 6,
          bgcolor: 'secondary.main',
          color: 'white',
          borderRadius: 4,
          backgroundImage: 'linear-gradient(rgba(23, 64, 139, 0.8), rgba(23, 64, 139, 1))',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Hoops Commentary Crafter
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          Add professional commentary to your basketball highlights in seconds
        </Typography>
        <Button
          component={Link}
          to="/upload"
          variant="contained"
          color="primary"
          size="large"
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        How It Works
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 5,
                },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 2,
          mb: 4,
          bgcolor: 'grey.100',
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to add some professional flair to your game?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Transform your basketball clips with AI-powered commentary in just a few clicks.
        </Typography>
        <Button
          component={Link}
          to="/upload"
          variant="contained"
          color="primary"
          size="large"
          sx={{ py: 1.5, px: 4 }}
        >
          Create Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;