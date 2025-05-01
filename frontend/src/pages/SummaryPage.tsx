import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface Problem {
  _id: string;
  title: string;
  description: string;
  state: {
    code: string;
    language: string;
    timeSpent: number;
    hasAttempted: boolean;
    hasRun: boolean;
  };
}

interface AssessmentSummary {
  problems: Problem[];
  duration: number;
  startTime: string;
  endTime: string;
  totalTimeSpent: number;
  metrics: {
    totalProblems: number;
    attemptedCount: number;
    skippedCount: number;
    ranCodeCount: number;
  };
}

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const assessmentData = location.state as AssessmentSummary;

  useEffect(() => {
    if (!assessmentData) {
      navigate('/');
    }
  }, [assessmentData, navigate]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError('');

      // First, validate the assessment data
      if (!assessmentData || !assessmentData.problems || !assessmentData.metrics) {
        throw new Error('Invalid assessment data');
      }

      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/assessment/download`,
        data: { assessmentData },
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      });

      // Check if the response is a PDF
      if (response.headers['content-type'] !== 'application/pdf') {
        throw new Error('Invalid response format');
      }

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assessment-${format(new Date(assessmentData.endTime), 'yyyy-MM-dd-HH-mm')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading assessment:', error);
      setError(error instanceof Error ? error.message : 'Failed to download assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentData) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Assessment Summary
          </Typography>
          <Button
            variant="contained"
            onClick={handleDownload}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #0070f3, #7928ca)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0761d1, #4c2889)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Download PDF'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#3291ff' }}>
                Overview
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Start Time: {format(new Date(assessmentData.startTime), 'PPp')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                End Time: {format(new Date(assessmentData.endTime), 'PPp')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Duration: {Math.floor(assessmentData.duration)} hours
              </Typography>
              <Typography variant="body1">
                Total Time Spent: {formatDuration(assessmentData.totalTimeSpent)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#3291ff' }}>
                Performance Metrics
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Total Problems: {assessmentData.metrics.totalProblems}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Problems Attempted: {assessmentData.metrics.attemptedCount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Problems Skipped: {assessmentData.metrics.skippedCount}
              </Typography>
              <Typography variant="body1">
                Code Execution Attempts: {assessmentData.metrics.ranCodeCount}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 3, color: '#3291ff' }}>
              Problems
            </Typography>
            {assessmentData.problems.map((problem, index) => (
              <Paper 
                key={problem._id}
                elevation={0}
                sx={{ 
                  p: 3,
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {index + 1}. {problem.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {problem.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Time Spent: {formatDuration(problem.state.timeSpent)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Status: {problem.state.hasAttempted ? 'Attempted' : 'Not Attempted'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Code Runs: {problem.state.hasRun ? 'Yes' : 'No'}
                </Typography>
                {problem.state.hasAttempted && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Your Solution:
                    </Typography>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {problem.state.code}
                      </pre>
                    </Paper>
                  </Box>
                )}
              </Paper>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SummaryPage; 