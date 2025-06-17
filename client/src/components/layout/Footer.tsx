import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Typography variant="body2" align="center">
        &copy; {new Date().getFullYear()} Hoops Commentary Crafter
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        <MuiLink color="inherit" href="https://github.com/dxaginfo/hoops-commentary-crafter" target="_blank" rel="noopener">
          GitHub
        </MuiLink>
        {' | '}
        <MuiLink color="inherit" href="#" onClick={(e) => e.preventDefault()}>
          Terms of Service
        </MuiLink>
        {' | '}
        <MuiLink color="inherit" href="#" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;