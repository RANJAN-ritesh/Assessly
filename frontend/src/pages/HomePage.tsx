import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, IconButton, Grid, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SubjectTile from '../components/SubjectTile';
import TopicGrid from '../components/TopicGrid';
import DurationSelector from '../components/DurationSelector';
import QuickRecap from '../components/QuickRecap';
import CometEffects from '../components/CometEffects';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import AdminAuthDialog from '../components/AdminAuthDialog';

interface Subject {
  _id: string;
  name: string;
}

interface Topic {
  _id: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const HomePage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(60);
  const [showRecap, setShowRecap] = useState(false);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [openAdminAuth, setOpenAdminAuth] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopics = async (subjectId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/topics/subject/${subjectId}`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleStartAssessment = async () => {
    if (!selectedSubject || selectedTopics.length === 0) {
      alert('Please select a subject and at least one topic');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/assessment/start`, {
        subjectIds: [selectedSubject],
        topicIds: selectedTopics,
        duration
      });

      if (response.data.problems && response.data.problems.length > 0) {
        navigate('/assessment', { state: response.data });
      } else {
        alert('No problems found for the selected criteria. Please try different topics.');
      }
    } catch (error: any) {
      console.error('Error starting assessment:', error);
      alert(error.response?.data?.message || 'Failed to start assessment. Please try again.');
    }
  };

  const handleNextSubject = () => {
    setCurrentSubjectIndex((prev) => (prev + 1) % subjects.length);
  };

  const handlePrevSubject = () => {
    setCurrentSubjectIndex((prev) => (prev - 1 + subjects.length) % subjects.length);
  };

  const selectedSubjectName = subjects.find(s => s._id === selectedSubject)?.name || '';
  const selectedTopicNames = topics
    .filter(t => selectedTopics.includes(t._id))
    .map(t => t.name);

  return (
    <Container maxWidth="lg">
      <CometEffects />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 112, 243, 0.1), transparent 50%)',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                background: 'linear-gradient(90deg, #0070f3, #4a90e2, #8b0000, #2e8b57, #0070f3)',
                backgroundSize: '400% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 20s ease-in-out infinite',
                mb: 2,
                '@keyframes gradient': {
                  '0%': {
                    backgroundPosition: '0% center',
                  },
                  '50%': {
                    backgroundPosition: '200% center',
                  },
                  '100%': {
                    backgroundPosition: '400% center',
                  },
                },
              }}
            >
              ASSESSLY: Personalized Coding Assessments
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
            >
              Test your coding skills with our interactive platform. Choose from multiple languages and solve real-world problems.
            </Typography>
          </Box>
        </motion.div>

        {/* Subject Selection */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(to right, #0070f3, #7928ca)',
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Select Subject & Topics
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '800px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <IconButton
                  onClick={handlePrevSubject}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    color: '#90caf9',
                    '&:hover': { color: '#ce93d8' },
                  }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>

                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {subjects.map((subject, index) => (
                      index === currentSubjectIndex && (
                        <motion.div
                          key={subject._id}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SubjectTile
                            subject={subject}
                            isSelected={selectedSubject === subject._id}
                            onClick={() => setSelectedSubject(subject._id)}
                            topics={topics}
                            selectedTopics={selectedTopics}
                            onTopicSelect={(topicId) => {
                              setSelectedTopics(prev =>
                                prev.includes(topicId)
                                  ? prev.filter(id => id !== topicId)
                                  : [...prev, topicId]
                              );
                            }}
                          />
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </Box>

                <IconButton
                  onClick={handleNextSubject}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    color: '#90caf9',
                    '&:hover': { color: '#ce93d8' },
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Assessment Duration
              </Typography>
              <DurationSelector
                selectedDuration={duration}
                onDurationSelect={setDuration}
              />
            </Paper>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartAssessment}
                sx={{
                  width: '100%',
                  py: 1.5,
                  fontSize: '1.1rem',
                  mb: 2,
                }}
              >
                Start Assessment
              </Button>

              {selectedTopics.length > 0 && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setShowRecap(true)}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Quick Recap
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Quick Recap Dialog */}
        <QuickRecap
          open={showRecap}
          onClose={() => setShowRecap(false)}
          subject={selectedSubjectName}
          topics={selectedTopics}
        />

        {/* Features Section */}
        <Box sx={{ mt: 12 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(to right, #0070f3, #7928ca)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Platform Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Interactive Code Editor',
                description: 'Write and test code in real-time with our VS Code-like editor.',
              },
              {
                title: 'Multiple Languages',
                description: 'Support for various programming languages with syntax highlighting.',
              },
              {
                title: 'Real-time Execution',
                description: 'Get instant feedback on your code submissions.',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'primary.main',
              transform: 'scale(1.3)',
            },
            transition: 'all 0.3s ease',
            width: '48px',
            height: '48px',
            '& .MuiSvgIcon-root': {
              fontSize: '2rem',
            },
          }}
          onClick={() => setOpenAdminAuth(true)}
        >
          <AdminIcon />
        </IconButton>
      </Box>

      <AdminAuthDialog
        open={openAdminAuth}
        onClose={() => setOpenAdminAuth(false)}
      />
    </Container>
  );
};

export default HomePage; 