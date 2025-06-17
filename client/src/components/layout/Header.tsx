import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
          <SportsBasketballIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Hoops Commentary Crafter
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          component={Link}
          to="/upload"
          sx={{
            ml: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.common.white}`,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Create New Commentary
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;