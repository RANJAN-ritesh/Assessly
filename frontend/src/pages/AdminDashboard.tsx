import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Collapse,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TreeView from '../components/TreeView';
import AnalyticsView from '../components/AnalyticsView';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { ExpandMore, ExpandLess, Visibility, VisibilityOff, RocketLaunch } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Subject {
  _id: string;
  name: string;
  topics: Topic[];
}

interface Topic {
  _id: string;
  name: string;
  subjectId: string;
  problems: Problem[];
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: string;
  attempts?: number;
  successRate?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const problemTypes = [
  { value: 'implementation', label: 'Implementation-based' },
  { value: 'output', label: 'Output-based' },
  { value: 'application', label: 'Application-based' },
];

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const fileInputRef = useRef(null);
  const [showBulkUploadOptions, setShowBulkUploadOptions] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [model, setModel] = useState('gemini-1.5-pro');
  const [aiSubject, setAiSubject] = useState('');
  const [aiTopics, setAiTopics] = useState('');
  const [aiType, setAiType] = useState('implementation');
  const [aiNum, setAiNum] = useState(3);
  const [aiDifficulty, setAiDifficulty] = useState('easy');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiProblems, setAiProblems] = useState<any[]>([]);
  const [aiPreviewOpen, setAiPreviewOpen] = useState(false);
  const [aiPushLoading, setAiPushLoading] = useState(false);
  const [aiPushSuccess, setAiPushSuccess] = useState('');
  const [aiPushError, setAiPushError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    
    if (!token || !isAuthenticated) {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Admin authentication required');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      const [subjectsResponse, topicsResponse, problemsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/subjects/admin`, { headers }),
        axios.get(`${API_BASE_URL}/api/topics`, { headers }),
        axios.get(`${API_BASE_URL}/api/problems`, { headers })
      ]);

      // Map topics to subjects
      const subjectsWithTopics = subjectsResponse.data.map((subject: Subject) => ({
        ...subject,
        topics: topicsResponse.data.filter((topic: Topic) => topic.subjectId === subject._id),
      }));

      // Map problems to topics
      const subjectsWithTopicsAndProblems = subjectsWithTopics.map((subject: Subject) => ({
        ...subject,
        topics: subject.topics.map((topic: Topic) => ({
          ...topic,
          problems: problemsResponse.data.filter((problem: Problem) => problem.topicId === topic._id),
        })),
      }));
      
      setSubjects(subjectsWithTopicsAndProblems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (name: string) => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/subjects`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Subject added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subject';
      setError(errorMessage);
    }
  };

  const handleAddTopic = async (subjectId: string, name: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/topics`,
        { name, subjectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Topic added successfully');
    } catch (err) {
      setError('Failed to add topic');
    }
  };

  const handleAddProblem = async (topicId: string, problem: Omit<Problem, '_id' | 'topicId' | 'subjectId'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      // Find the subjectId for this topicId
      let subjectId = '';
      for (const subject of subjects) {
        if (subject.topics.some((topic) => topic._id === topicId)) {
          subjectId = subject._id;
          break;
        }
      }
      if (!subjectId) {
        setError('Subject ID not found for this topic');
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/problems`,
        { ...problem, topicId, subjectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Problem added successfully');
    } catch (err) {
      setError('Failed to add problem');
    }
  };

  const handleEditSubject = async (subjectId: string, name: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/subjects/${subjectId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Subject updated successfully');
    } catch (err) {
      setError('Failed to update subject');
    }
  };

  const handleEditTopic = async (topicId: string, name: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/topics/${topicId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Topic updated successfully');
    } catch (err) {
      setError('Failed to update topic');
    }
  };

  const handleEditProblem = async (problemId: string, problem: Partial<Problem>) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/problems/${problemId}`,
        problem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Problem updated successfully');
    } catch (err) {
      setError('Failed to update problem');
    }
  };

  const handleEditTopicRecap = async (topicId: string, recap: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/topics/${topicId}`,
        { recap },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Topic recap updated successfully');
    } catch (err) {
      setError('Failed to update topic recap');
    }
  };

  const handleEditProblemRecap = async (problemId: string, recap: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/problems/${problemId}`,
        { recap },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Problem recap updated successfully');
    } catch (err) {
      setError('Failed to update problem recap');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_BASE_URL}/api/subjects/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Subject deleted successfully');
    } catch (err) {
      setError('Failed to delete subject');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_BASE_URL}/api/topics/${topicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Topic deleted successfully');
    } catch (err) {
      setError('Failed to delete topic');
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_BASE_URL}/api/problems/${problemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
      setSuccess('Problem deleted successfully');
    } catch (err) {
      setError('Failed to delete problem');
    }
  };

  const handleDownloadTemplate = () => {
    const csv = `Subject Name,Topic Name,Topic Recap,Problem Title,Problem Description,Problem Difficulty\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setBulkResult(data);
        setBulkError('');
      } else {
        setBulkError(data.error || 'Bulk upload failed');
        setBulkResult(null);
      }
      setBulkDialogOpen(true);
    } catch (err) {
      setBulkError('Bulk upload failed');
      setBulkResult(null);
      setBulkDialogOpen(true);
    }
  };

  const buildPrompt = () => {
    const topicsList = aiTopics.split(/,|\n/).map(t => t.trim()).filter(Boolean);
    return `Generate ${aiNum} ${aiType} coding problems for the following subject and topics:\nSubject: ${aiSubject}\nTopics: ${topicsList.join(', ')}\nAll problems should be of '${aiDifficulty}' difficulty.\nEach problem should be in this JSON format (no explanation, no markdown, no extra text):\n{\n  "title": "...",\n  "description": "...",\n  "difficulty": "${aiDifficulty}",\n  "testCases": [\n    {\n      "input": "...",\n      "output": "...",\n      "explanation": "..."\n    }\n  ],\n  "solution": {\n    "approach": "...",\n    "timeComplexity": "...",\n    "spaceComplexity": "...",\n    "keyConcepts": ["..."]\n  }\n}\nReturn an array of problems.`;
  };

  const handleGeminiGenerate = async () => {
    setAiError('');
    setAiProblems([]);
    setAiPreviewOpen(false);
    setAiLoading(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ parts: [{ text: buildPrompt() }] }]
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
      }
      let text = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
      text = text.replace(/```json|```/g, '').trim();
      let parsed: any[] = [];
      try {
        parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('Not an array');
        setAiProblems(parsed);
        setAiPreviewOpen(true);
      } catch (e) {
        setAiError('Could not parse Gemini response as an array of problems. Please try again.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to fetch from Gemini');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApproveAndPush = async () => {
    if (!aiProblems.length) return;
    setAiPushLoading(true);
    setAiPushSuccess('');
    setAiPushError('');
    try {
      const topicsList = aiTopics.split(/,|\n/).map(t => t.trim()).filter(Boolean);
      let subjectObj = subjects.find(s => s.name === aiSubject);
      const token = localStorage.getItem('adminToken');
      // 1. Create subject if it doesn't exist
      if (!subjectObj) {
        const subjectRes = await axios.post(
          `${API_BASE_URL}/api/subjects`,
          { name: aiSubject },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        subjectObj = subjectRes.data;
        // Refetch subjects to get the new subject with _id
        await fetchData();
        subjectObj = (subjects.find(s => s.name === aiSubject)) || subjectObj;
      }
      // 2. For each topic, create if it doesn't exist
      const topicMap: Record<string, any> = {};
      for (const topicName of topicsList) {
        let topic = subjectObj.topics.find((t: any) => t.name === topicName);
        if (!topic) {
          const topicRes = await axios.post(
            `${API_BASE_URL}/api/topics`,
            { name: topicName, subjectId: subjectObj._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          topic = topicRes.data;
          // Refetch subjects to get the new topic with _id
          await fetchData();
          subjectObj = (subjects.find(s => s.name === aiSubject)) || subjectObj;
        }
        topicMap[topicName] = topic;
      }
      // 3. Prepare problems with correct topicId
      const problemsToPush = aiProblems.map((prob, idx) => {
        const topicName = topicsList[idx % topicsList.length];
        const topic = topicMap[topicName];
        if (!topic) throw new Error(`Topic '${topicName}' could not be created.`);
        return { ...prob, topicId: topic._id, subjectId: subjectObj._id, difficulty: aiDifficulty };
      });
      // 4. Push all problems
      await Promise.all(problemsToPush.map(prob =>
        axios.post(
          `${API_BASE_URL}/api/problems`,
          prob,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ));
      setAiPushSuccess('All problems successfully pushed to backend!');
      setAiPreviewOpen(false);
      await fetchData();
    } catch (err: any) {
      setAiPushError(err.message || 'Failed to push problems to backend');
    } finally {
      setAiPushLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      {/* AI Problem Generator : GEMINI Collapsible Panel */}
      <Fade in={true} timeout={900}>
        <Paper
          elevation={8}
          sx={{
            mb: 4,
            p: 0,
            borderRadius: 4,
            background: 'rgba(30,30,40,0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s cubic-bezier(.4,2,.6,1)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              py: 2,
              cursor: 'pointer',
              userSelect: 'none',
              background: 'linear-gradient(90deg, #23233b 0%, #1a1a2e 100%)',
              borderBottom: aiPanelOpen ? '1px solid #333' : 'none',
              transition: 'background 0.3s',
            }}
            onClick={() => setAiPanelOpen((open) => !open)}
          >
            <RocketLaunch sx={{ color: '#9C27B0', mr: 1, fontSize: 28, transition: 'transform 0.4s', transform: aiPanelOpen ? 'rotate(-10deg) scale(1.2)' : 'none' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
              AI Problem Generator : GEMINI
            </Typography>
            <Tooltip title={aiPanelOpen ? 'Collapse' : 'Expand'}>
              <IconButton size="large" sx={{ color: '#fff' }}>
                {aiPanelOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>
          <Collapse in={aiPanelOpen} timeout={600} unmountOnExit>
            <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2, background: 'rgba(20,20,30,0.85)' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  label="Gemini API Key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  sx={{ minWidth: 320, flex: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowApiKey(v => !v)} edge="end" size="small">
                          {showApiKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  sx={{ minWidth: 180, color: '#fff', background: 'rgba(60,60,80,0.7)', borderRadius: 2 }}
                >
                  <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
                  <MenuItem value="gemini-1.5-flash">Gemini 1.5 Flash</MenuItem>
                  <MenuItem value="gemini-1.0-pro">Gemini 1.0 Pro</MenuItem>
                </Select>
                <Select
                  value={aiDifficulty}
                  onChange={e => setAiDifficulty(e.target.value)}
                  sx={{ minWidth: 140, color: '#fff', background: 'rgba(60,60,80,0.7)', borderRadius: 2 }}
                >
                  {difficulties.map(d => (
                    <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Subject"
                  value={aiSubject}
                  onChange={e => setAiSubject(e.target.value)}
                  sx={{ minWidth: 180, flex: 1 }}
                />
                <TextField
                  label="Topics (comma or newline separated)"
                  value={aiTopics}
                  onChange={e => setAiTopics(e.target.value)}
                  sx={{ minWidth: 220, flex: 2 }}
                  multiline
                  minRows={1}
                  maxRows={3}
                />
                <Select
                  value={aiType}
                  onChange={e => setAiType(e.target.value)}
                  sx={{ minWidth: 200, color: '#fff', background: 'rgba(60,60,80,0.7)', borderRadius: 2 }}
                >
                  {problemTypes.map(pt => (
                    <MenuItem key={pt.value} value={pt.value}>{pt.label}</MenuItem>
                  ))}
                </Select>
                <TextField
                  label="# Problems"
                  type="number"
                  value={aiNum}
                  onChange={e => setAiNum(Number(e.target.value))}
                  sx={{ minWidth: 120 }}
                  inputProps={{ min: 1, max: 10 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGeminiGenerate}
                  disabled={!apiKey || !aiSubject || !aiTopics || aiLoading}
                  sx={{ minWidth: 180, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 12px #7928ca44' }}
                  endIcon={<RocketLaunch sx={{ ml: 1, fontSize: 22, animation: aiLoading ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />}
                >
                  {aiLoading ? 'Generating...' : 'Generate'}
                </Button>
                {aiError && <Alert severity="error" sx={{ ml: 2 }}>{aiError}</Alert>}
                {aiPushSuccess && <Alert severity="success" sx={{ ml: 2 }}>{aiPushSuccess}</Alert>}
                {aiPushError && <Alert severity="error" sx={{ ml: 2 }}>{aiPushError}</Alert>}
              </Box>
            </Box>
          </Collapse>
        </Paper>
      </Fade>

      {/* Preview Dialog for Generated Problems */}
      <Dialog open={aiPreviewOpen} onClose={() => setAiPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview Generated Problems</DialogTitle>
        <DialogContent>
          {aiProblems.length ? (
            aiProblems.map((prob, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#9EE5FF', fontWeight: 700 }}>
                  Problem {idx + 1}
                </Typography>
                <SyntaxHighlighter language="json" style={atomOneDark} customStyle={{ background: 'none', fontSize: 15, borderRadius: 8 }}>
                  {JSON.stringify(prob, null, 2)}
                </SyntaxHighlighter>
              </Box>
            ))
          ) : (
            <Typography color="error">No valid problems to preview.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiPreviewOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleApproveAndPush} color="primary" variant="contained" disabled={aiPushLoading}>
            {aiPushLoading ? 'Pushing...' : 'Approve & Push All'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              localStorage.removeItem('isAdminAuthenticated');
              localStorage.removeItem('adminToken');
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Box>

        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Collapse>

        <Collapse in={!!success}>
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Collapse>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {showBulkUploadOptions ? (
            <IconButton
              onClick={() => setShowBulkUploadOptions(false)}
              sx={{
                background: 'linear-gradient(45deg, #ff3b30, #ff9500)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff453a, #ff9f0a)',
                },
                width: '40px',
                height: '40px',
                transition: 'all 0.2s ease',
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setShowBulkUploadOptions(true)}
              sx={{
                background: 'linear-gradient(45deg, #0070f3, #7928ca)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0761d1, #4c2889)',
                },
                width: '200px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 22px',
                fontSize: '0.925rem',
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Bulk Upload Data
            </Button>
          )}
          
          <Collapse in={showBulkUploadOptions} orientation="horizontal">
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleDownloadTemplate}
                sx={{
                  width: '200px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                Download Template
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                component="label"
                sx={{
                  width: '200px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  ref={fileInputRef}
                  onChange={handleBulkUpload}
                />
              </Button>
            </Box>
          </Collapse>
        </Box>

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Content Management" />
          <Tab label="Analytics" />
        </Tabs>

        {tabValue === 0 && (
          <TreeView
            data={subjects}
            onAddSubject={handleAddSubject}
            onAddTopic={handleAddTopic}
            onAddProblem={handleAddProblem}
            onEditSubject={handleEditSubject}
            onEditTopic={handleEditTopic}
            onEditProblem={handleEditProblem}
            onDeleteSubject={handleDeleteSubject}
            onDeleteTopic={handleDeleteTopic}
            onDeleteProblem={handleDeleteProblem}
            onEditTopicRecap={handleEditTopicRecap}
            onEditProblemRecap={handleEditProblemRecap}
          />
        )}

        {tabValue === 1 && (
          <AnalyticsView data={subjects} loading={loading} />
        )}

        <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)}>
          <DialogTitle>Bulk Upload Result</DialogTitle>
          <DialogContent>
            {bulkError ? (
              <Alert severity="error">{bulkError}</Alert>
            ) : bulkResult ? (
              <Box>
                <Typography variant="subtitle1">Created Subjects: {bulkResult.createdSubjects?.join(', ') || 'None'}</Typography>
                <Typography variant="subtitle1">Created Topics: {bulkResult.createdTopics?.join(', ') || 'None'}</Typography>
                <Typography variant="subtitle1">Created Problems: {bulkResult.createdProblems?.join(', ') || 'None'}</Typography>
                {bulkResult.skipped && <Typography variant="body2" color="warning.main">Skipped: {bulkResult.skipped.join(', ')}</Typography>}
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 