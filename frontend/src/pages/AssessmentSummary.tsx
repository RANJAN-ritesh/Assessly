import React from 'react';
import { Container, Box, Typography, Button, Paper, Grid, CircularProgress, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

interface ProblemState {
  code: string;
  language: {
    id: number;
    value: string;
    label: string;
  };
  timeSpent: number;
  hasAttempted: boolean;
  hasRun: boolean;
  lastVisited: Date;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  languages: string[];
  state: ProblemState;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const AssessmentSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [downloading, setDownloading] = React.useState(false);
  const summaryData = location.state as AssessmentSummary;

  if (!summaryData) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            No Assessment Data Available
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/assessment/download`,
        { assessmentData: summaryData },
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `assessment-${format(new Date(summaryData.endTime), 'yyyy-MM-dd-HH-mm')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading assessment:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            background: 'linear-gradient(to right, #0070f3, #7928ca)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Assessment Summary
        </Typography>

        <Grid container spacing={3}>
          {/* Overview Card */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Time
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(summaryData.startTime), 'PPp')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    End Time
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(summaryData.endTime), 'PPp')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Total Time Spent
                  </Typography>
                  <Typography variant="body1">
                    {formatDuration(summaryData.totalTimeSpent)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Metrics Card */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {summaryData.metrics.totalProblems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Problems
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {summaryData.metrics.attemptedCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attempted
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {summaryData.metrics.skippedCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Skipped
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {summaryData.metrics.ranCodeCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code Runs
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Problem Details */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Problem Details
              </Typography>
              {summaryData.problems.map((problem, index) => (
                <Box key={problem._id} sx={{ mb: index < summaryData.problems.length - 1 ? 3 : 0 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {problem.title}
                  </Typography>
                  <Grid container spacing={2} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Time Spent: {formatDuration(problem.state.timeSpent)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Status: {problem.state.hasAttempted ? 'Attempted' : 'Not Attempted'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Code Runs: {problem.state.hasRun ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < summaryData.problems.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleDownload}
                disabled={downloading}
                sx={{ minWidth: 200 }}
              >
                {downloading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Download Assessment'
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ minWidth: 200 }}
              >
                Return to Home
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AssessmentSummary; 