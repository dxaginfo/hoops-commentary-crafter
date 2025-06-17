import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import StyleSelectPage from './pages/StyleSelectPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e35205', // Basketball orange
    },
    secondary: {
      main: '#17408b', // NBA blue
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/style/:videoId" element={<StyleSelectPage />} />
            <Route path="/processing/:videoId" element={<ProcessingPage />} />
            <Route path="/result/:resultId" element={<ResultPage />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;