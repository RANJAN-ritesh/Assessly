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
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const midnightBlueTheme = {
    backgroundColor: '#1a1f2e',
    color: '#e0e0e0',
    borderColor: '#2a2f3e',
    codeBackground: '#2a2f3e',
    linkColor: '#64b5f6',
    headingColor: '#ffffff',
    blockquoteBorder: '#3a3f4e',
  };

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
                    <Paper
                      elevation={0}
                      sx={{
                        padding: 3,
                        backgroundColor: midnightBlueTheme.backgroundColor,
                        color: midnightBlueTheme.color,
                        borderRadius: 2,
                        border: `1px solid ${midnightBlueTheme.borderColor}`,
                        '& pre': {
                          backgroundColor: midnightBlueTheme.codeBackground,
                          padding: 2,
                          borderRadius: 1,
                          overflowX: 'auto',
                          margin: '1em 0',
                        },
                        '& code': {
                          backgroundColor: midnightBlueTheme.codeBackground,
                          padding: '0.2em 0.4em',
                          borderRadius: 2,
                          fontSize: '0.9em',
                          fontFamily: 'monospace',
                        },
                        '& a': {
                          color: midnightBlueTheme.linkColor,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                          color: midnightBlueTheme.headingColor,
                          marginTop: 2,
                          marginBottom: 1,
                          fontWeight: 600,
                        },
                        '& h1': {
                          fontSize: '2em',
                          borderBottom: `1px solid ${midnightBlueTheme.borderColor}`,
                          paddingBottom: '0.3em',
                        },
                        '& h2': {
                          fontSize: '1.5em',
                          borderBottom: `1px solid ${midnightBlueTheme.borderColor}`,
                          paddingBottom: '0.3em',
                        },
                        '& h3': {
                          fontSize: '1.25em',
                        },
                        '& p': {
                          margin: '1em 0',
                          lineHeight: 1.6,
                        },
                        '& blockquote': {
                          borderLeft: `4px solid ${midnightBlueTheme.blockquoteBorder}`,
                          paddingLeft: 2,
                          marginLeft: 0,
                          fontStyle: 'italic',
                          margin: '1em 0',
                          padding: '0.5em 1em',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        '& table': {
                          borderCollapse: 'collapse',
                          width: '100%',
                          marginBottom: 2,
                          margin: '1em 0',
                        },
                        '& th, & td': {
                          border: `1px solid ${midnightBlueTheme.borderColor}`,
                          padding: '8px',
                        },
                        '& th': {
                          backgroundColor: midnightBlueTheme.codeBackground,
                          fontWeight: 600,
                        },
                        '& img': {
                          maxWidth: '100%',
                          borderRadius: 1,
                          margin: '1em 0',
                        },
                        '& ul, & ol': {
                          paddingLeft: 2,
                          margin: '1em 0',
                        },
                        '& li': {
                          margin: '0.5em 0',
                          lineHeight: 1.6,
                        },
                        '& hr': {
                          border: 'none',
                          borderTop: `1px solid ${midnightBlueTheme.borderColor}`,
                          margin: '2em 0',
                        },
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {recap.recap}
                      </ReactMarkdown>
                    </Paper>
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