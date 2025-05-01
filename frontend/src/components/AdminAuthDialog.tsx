import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface AdminAuthDialogProps {
  open: boolean;
  onClose: () => void;
}

const AdminAuthDialog: React.FC<AdminAuthDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password
      });

      if (response.data.token) {
        // Store the JWT token and authentication flag
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        onClose();
        navigate('/admin');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      {open && <AnimatedBackground />}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Fade in={open} timeout={500}>
          <Box>
            <DialogTitle>
              <Typography
                variant="h4"
                component="div"
                align="center"
                sx={{
                  background: 'linear-gradient(45deg, #0070f3, #7928ca)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Admin Login
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      background: 'rgba(211, 47, 47, 0.1)',
                      border: '1px solid rgba(211, 47, 47, 0.2)',
                    }}
                  >
                    {error}
                  </Alert>
                )}
                <TextField
                  autoFocus
                  margin="dense"
                  label="Username"
                  type="text"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0070f3',
                      },
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0070f3',
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={onClose}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#0070f3',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogin}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #0070f3, #7928ca)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0761d1, #4c2889)',
                  },
                }}
              >
                Login
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>
    </>
  );
};

export default AdminAuthDialog; 