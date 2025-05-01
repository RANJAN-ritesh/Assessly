import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface QuickRecapProps {
  open: boolean;
  onClose: () => void;
  subject: string;
  topics: string[];
}

const QuickRecap: React.FC<QuickRecapProps> = ({ open, onClose, subject, topics }) => {
  const [loading, setLoading] = useState(false);
  const [recaps, setRecaps] = useState<{ name: string; recap: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/recaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicIds: topics }),
      });
      const data = await response.json();
      if (response.ok && data.recaps) {
        setRecaps(data.recaps);
      } else {
        setError('Failed to generate recap. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching recap:', error);
      setError('Failed to generate recap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchRecap();
    } else {
      setRecaps([]);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            Quick Recap
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#90caf9' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
            >
              <CircularProgress sx={{ color: '#90caf9' }} />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Typography color="error" variant="body1">{error}</Typography>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {recaps.length > 0 ? (
                recaps.map((recap) => (
                  <Box key={recap.name} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#90caf9', mb: 1 }}>{recap.name}</Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        background: 'rgba(144,202,249,0.05)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      {recap.recap}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  No recap available for the selected topics.
                </Typography>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default QuickRecap; 