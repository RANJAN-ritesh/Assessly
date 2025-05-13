import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  expectedTime: number;
  testCases: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  solution: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    keyConcepts: string[];
  };
  createdAt: string;
  status: string;
  isValid: boolean;
  id: string;
}

interface Grading {
  score: {
    correctness: number;
    codeQuality: number;
    efficiency: number;
    bestPractices: number;
    overall: number;
  };
  feedback: {
    correctness: string[];
    codeQuality: string[];
    efficiency: string[];
    bestPractices: string[];
    suggestions: string[];
  };
  analysis: {
    timeComplexity: string;
    spaceComplexity: string;
    improvements: string[];
  };
  timestamp: string;
  submissionId: string;
  validated: boolean;
}

const AITestPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(1);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [grading, setGrading] = useState<Grading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3001/api/ai/generate-problems', {
        subject,
        topic,
        count
      });
      setProblems(response.data.problems);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate problems');
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async () => {
    if (!selectedProblem) {
      setError('Please select a problem first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3001/api/ai/grade-submission', {
        problem: selectedProblem,
        code,
        language
      });
      setGrading(response.data.grading);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to grade submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        AI Features Test Page
      </Typography>

      {/* Problem Generation Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate Problems
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
          <TextField
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fullWidth
          />
          <TextField
            label="Count"
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            sx={{ width: 100 }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={generateProblems}
          disabled={loading || !subject || !topic}
        >
          Generate Problems
        </Button>
      </Paper>

      {/* Generated Problems Section */}
      {problems.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Problems
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {problems.map((problem) => (
              <Paper
                key={problem.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  backgroundColor: selectedProblem?.id === problem.id ? 'primary.light' : 'background.paper'
                }}
                onClick={() => setSelectedProblem(problem)}
              >
                <Typography variant="subtitle1">{problem.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Difficulty: {problem.difficulty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expected Time: {problem.expectedTime} minutes
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* Code Submission Section */}
      {selectedProblem && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Submit Solution
          </Typography>
          <TextField
            label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            multiline
            rows={10}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={gradeSubmission}
            disabled={loading || !code}
          >
            Submit for Grading
          </Button>
        </Paper>
      )}

      {/* Grading Results Section */}
      {grading && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Grading Results
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Scores:</Typography>
            <Typography>Correctness: {grading.score.correctness}%</Typography>
            <Typography>Code Quality: {grading.score.codeQuality}%</Typography>
            <Typography>Efficiency: {grading.score.efficiency}%</Typography>
            <Typography>Best Practices: {grading.score.bestPractices}%</Typography>
            <Typography>Overall: {grading.score.overall}%</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Feedback:</Typography>
            {Object.entries(grading.feedback).map(([key, value]) => (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">{key}:</Typography>
                {value.map((item, index) => (
                  <Typography key={index} variant="body2">
                    - {item}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
          <Box>
            <Typography variant="subtitle1">Analysis:</Typography>
            <Typography>Time Complexity: {grading.analysis.timeComplexity}</Typography>
            <Typography>Space Complexity: {grading.analysis.spaceComplexity}</Typography>
            <Typography variant="subtitle2">Improvements:</Typography>
            {grading.analysis.improvements.map((item, index) => (
              <Typography key={index} variant="body2">
                - {item}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AITestPage; 