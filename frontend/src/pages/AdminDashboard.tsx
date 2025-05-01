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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TreeView from '../components/TreeView';
import AnalyticsView from '../components/AnalyticsView';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

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

  const handleAddProblem = async (topicId: string, problem: Omit<Problem, '_id' | 'topicId'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/problems`,
        { ...problem, topicId },
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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