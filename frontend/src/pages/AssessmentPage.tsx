import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { languageOptions, LanguageOption } from '../languageOptions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface Problem {
  _id: string;
  title: string;
  description: string;
  languages: string[];
}

interface ProblemState {
  code: string;
  language: LanguageOption;
  timeSpent: number;
  hasAttempted: boolean;
  hasRun: boolean;
  lastVisited: Date;
}

interface AssessmentData {
  problems: Problem[];
  duration: number;
  startTime: string;
}

const AssessmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { problems = [], duration = 1, startTime = new Date().toISOString() } = (location.state as AssessmentData) || {};
  const [isAssessmentEnded, setIsAssessmentEnded] = useState(false);
  
  // If no problems are provided, redirect to home
  useEffect(() => {
    if (!problems || problems.length === 0) {
      navigate('/');
    }
  }, [problems, navigate]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60 * 60); // Convert hours to seconds
  const [code, setCode] = useState<string>('// Start coding here...');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0]);
  const [visitedProblems, setVisitedProblems] = useState<Set<number>>(new Set([0]));
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  // New state for tracking problem attempts and time
  const [problemStates, setProblemStates] = useState<Record<string, ProblemState>>(() => {
    const initialStates: Record<string, ProblemState> = {};
    problems.forEach((problem) => {
      initialStates[problem._id] = {
        code: '// Start coding here...',
        language: languageOptions[0],
        timeSpent: 0,
        hasAttempted: false,
        hasRun: false,
        lastVisited: new Date()
      };
    });
    return initialStates;
  });

  // Track time spent on current problem
  useEffect(() => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    const problemId = currentProblem._id;
    const problemTimer = setInterval(() => {
      setProblemStates((prev) => ({
        ...prev,
        [problemId]: {
          ...prev[problemId],
          timeSpent: prev[problemId].timeSpent + 1
        }
      }));
    }, 1000);

    return () => clearInterval(problemTimer);
  }, [currentProblemIndex, problems]);

  // Global assessment timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleEndAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update problem state when switching problems
  useEffect(() => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    const problemId = currentProblem._id;
    setCode(problemStates[problemId].code);
    setSelectedLanguage(problemStates[problemId].language);
    setProblemStates((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        lastVisited: new Date()
      }
    }));
  }, [currentProblemIndex]);

  // Handle code changes
  const handleCodeChange = (value: string | undefined) => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    const newCode = value || '';
    setCode(newCode);
    setProblemStates((prev) => ({
      ...prev,
      [currentProblem._id]: {
        ...prev[currentProblem._id],
        code: newCode,
        hasAttempted: newCode.trim() !== '// Start coding here...'
      }
    }));
  };

  // Handle language changes
  const handleLanguageChange = (langValue: string) => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    const lang = languageOptions.find(l => l.value === langValue) || languageOptions[0];
    setSelectedLanguage(lang);
    setProblemStates((prev) => ({
      ...prev,
      [currentProblem._id]: {
        ...prev[currentProblem._id],
        language: lang
      }
    }));
  };

  const handleRunCode = async () => {
    const currentProblem = problems[currentProblemIndex];
    if (!currentProblem) return;

    setProcessing(true);
    setOutput('');
    setOutputDetails(null);

    try {
      const response = await axios.post('http://localhost:3000/api/run', {
        code,
        languageId: selectedLanguage.id,
        input: customInput,
      });

      setProblemStates((prev) => ({
        ...prev,
        [currentProblem._id]: {
          ...prev[currentProblem._id],
          hasRun: true
        }
      }));

      const result = response.data.result;
      let outputText = '';
      if (result.status?.id === 6) {
        outputText = atob(result.compile_output || '');
      } else if (result.status?.id === 3) {
        outputText = atob(result.stdout || '');
      } else if (result.status?.id === 5) {
        outputText = 'Time Limit Exceeded';
      } else {
        outputText = atob(result.stderr || '');
      }
      setOutput(outputText);
      setOutputDetails(result);
    } catch (err: any) {
      setOutput('Failed to run code.');
    } finally {
      setProcessing(false);
    }
  };

  const handleEndAssessment = async () => {
    try {
      const endTime = new Date().toISOString();
      const totalTimeSpent = Object.values(problemStates).reduce((acc, state) => acc + state.timeSpent, 0);
      const attemptedCount = Object.values(problemStates).filter(state => state.hasAttempted).length;
      const ranCodeCount = Object.values(problemStates).filter(state => state.hasRun).length;
      const skippedCount = problems.length - attemptedCount;

      const assessmentSummary = {
        problems: problems.map(problem => ({
          ...problem,
          state: problemStates[problem._id]
        })),
        duration,
        startTime,
        endTime,
        totalTimeSpent,
        answers: problems.map(problem => ({
          problemId: problem._id,
          code: problemStates[problem._id].code,
          language: problemStates[problem._id].language.value,
          timeSpent: problemStates[problem._id].timeSpent,
          hasAttempted: problemStates[problem._id].hasAttempted,
          hasRun: problemStates[problem._id].hasRun
        })),
        metrics: {
          totalProblems: problems.length,
          attemptedCount,
          skippedCount,
          ranCodeCount
        }
      };

      const response = await axios.post(`${API_BASE_URL}/api/assessment/end`, {
        assessmentData: assessmentSummary
      });

      if (response.data.message === 'Assessment completed successfully') {
        setIsAssessmentEnded(true);
        navigate('/summary', { state: assessmentSummary });
      } else {
        throw new Error('Failed to complete assessment');
      }
    } catch (error) {
      console.error('Error ending assessment:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleLivePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(code);
      previewWindow.document.close();
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    try {
      const endTime = new Date().toISOString();
      const totalTimeSpent = Object.values(problemStates).reduce((acc, state) => acc + state.timeSpent, 0);
      const attemptedCount = Object.values(problemStates).filter(state => state.hasAttempted).length;
      const ranCodeCount = Object.values(problemStates).filter(state => state.hasRun).length;
      const skippedCount = problems.length - attemptedCount;

      const assessmentData = {
        problems: problems.map(problem => ({
          ...problem,
          state: problemStates[problem._id]
        })),
        duration,
        startTime,
        endTime,
        totalTimeSpent,
        answers: problems.map(problem => ({
          problemId: problem._id,
          code: problemStates[problem._id].code,
          language: problemStates[problem._id].language.value,
          timeSpent: problemStates[problem._id].timeSpent,
          hasAttempted: problemStates[problem._id].hasAttempted,
          hasRun: problemStates[problem._id].hasRun
        })),
        metrics: {
          totalProblems: problems.length,
          attemptedCount,
          skippedCount,
          ranCodeCount
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/assessment/download`,
        { assessmentData },
        { responseType: 'blob' }
      );

      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assessment-${format(new Date(endTime), 'yyyy-MM-dd-HH-mm')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading assessment:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 0%, rgba(0, 112, 243, 0.05), transparent 50%)',
        pt: 3,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Problem {currentProblemIndex + 1} of {problems.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" sx={{ color: '#3291ff' }}>
              {formatTime(timeLeft)}
            </Typography>
            {!isAssessmentEnded ? (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleEndAssessment}
                sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                End Assessment
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleDownload}
                sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                Download PDF
              </Button>
            )}
          </Box>
        </Paper>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3,
            gap: 1.5,
            '& .MuiChip-root': {
              fontSize: '0.9rem',
              height: 36,
              width: 36,
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              '&:hover': {
                transform: 'translateY(-2px)',
                background: 'rgba(255, 255, 255, 0.06)',
              },
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            },
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        >
          {problems.map((_, idx) => (
            <Chip
              key={idx}
              label={idx + 1}
              clickable
              onClick={() => setCurrentProblemIndex(idx)}
              sx={{
                ...(currentProblemIndex === idx && {
                  background: 'linear-gradient(135deg, #0070f3 0%, #7928ca 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 112, 243, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0070f3 0%, #7928ca 100%)',
                  },
                }),
                ...(visitedProblems.has(idx) && currentProblemIndex !== idx && {
                  background: 'rgba(50, 145, 255, 0.1)',
                  color: '#3291ff',
                }),
              }}
            />
          ))}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: 'calc(100vh - 250px)',
                overflow: 'auto',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(to right, #0070f3, #7928ca)',
                },
                '& ::-webkit-scrollbar': {
                  width: '8px',
                },
                '& ::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.05)',
                },
                '& ::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                },
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(to right, #3291ff, #8a3fd1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                }}
              >
                {problems[currentProblemIndex].title}
              </Typography>
              <Box sx={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                '& pre': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 1,
                  p: 2,
                },
                '& code': {
                  color: '#3291ff',
                },
                '& p': {
                  lineHeight: 1.7,
                  mb: 2,
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2,
                },
                '& li': {
                  mb: 1,
                },
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {problems[currentProblemIndex].description}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: 'calc(100vh - 250px)',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <FormControl size="small" sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage.value}
                  label="Language"
                  onChange={(e) => handleLanguageChange(e.target.value as string)}
                  sx={{ 
                    '& .MuiSelect-select': { 
                      py: 1,
                    },
                  }}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ flex: 1, mb: 2 }}>
                <Editor
                  height="100%"
                  defaultLanguage={selectedLanguage.value}
                  language={selectedLanguage.value}
                  value={code}
                  onChange={(value) => handleCodeChange(value)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </Box>

              {selectedLanguage.value !== 'html' ? (
                <>
                  <TextField
                    label="Custom Input"
                    multiline
                    rows={2}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleRunCode}
                    disabled={processing}
                    sx={{ mb: 2 }}
                  >
                    {processing ? 'Running...' : 'Run Code'}
                  </Button>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      maxHeight: '150px',
                      overflow: 'auto',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#0070f3', mb: 1 }}>
                      Output:
                    </Typography>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {output}
                    </pre>
                    {outputDetails && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                        Status: {outputDetails.status?.description} | Time: {outputDetails.time}s | Memory: {outputDetails.memory}KB
                      </Typography>
                    )}
                  </Paper>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleLivePreview}
                >
                  Live Preview
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            disabled={currentProblemIndex === 0}
            onClick={() => setCurrentProblemIndex((prev) => prev - 1)}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Previous Problem
          </Button>
          <Button
            variant="outlined"
            disabled={currentProblemIndex === problems.length - 1}
            onClick={() => setCurrentProblemIndex((prev) => prev + 1)}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Next Problem
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AssessmentPage; 