import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentSummary from './pages/AssessmentSummary';
import AdminDashboard from './pages/AdminDashboard';
import AITestPage from './pages/AITestPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
      paper: '#111111',
    },
    primary: {
      main: '#0070f3',
      light: '#3291ff',
      dark: '#0761d1',
    },
    secondary: {
      main: '#7928ca',
      light: '#8a3fd1',
      dark: '#4c2889',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 22px',
          fontSize: '0.925rem',
          fontWeight: 500,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(to right, #0070f3, #7928ca)',
          '&:hover': {
            background: 'linear-gradient(to right, #0761d1, #4c2889)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111111',
          '&:hover': {
            backgroundColor: '#1a1a1a',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/summary" element={<AssessmentSummary />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ai-test" element={<AITestPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
