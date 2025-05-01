import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
  const [openTopicDialog, setOpenTopicDialog] = useState(false);
  const [openProblemDialog, setOpenProblemDialog] = useState(false);
  
  // Form states
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState({ subjectId: '', name: '' });
  const [newProblem, setNewProblem] = useState({
    topicId: '',
    title: '',
    description: '',
    difficulty: 'easy' as const,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
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
        axios.get(`${API_BASE_URL}/api/subjects/admin`, { headers }).catch(err => {
          console.error('Subjects API Error:', err.response || err);
          throw new Error(`Failed to fetch subjects: ${err.message}`);
        }),
        axios.get(`${API_BASE_URL}/api/topics`, { headers }).catch(err => {
          console.error('Topics API Error:', err.response || err);
          throw new Error(`Failed to fetch topics: ${err.message}`);
        }),
        axios.get(`${API_BASE_URL}/api/problems`, { headers }).catch(err => {
          console.error('Problems API Error:', err.response || err);
          throw new Error(`Failed to fetch problems: ${err.message}`);
        })
      ]);

      console.log('API Responses:', {
        subjects: subjectsResponse.data,
        topics: topicsResponse.data,
        problems: problemsResponse.data
      });

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

      console.log('Processed Data:', subjectsWithTopicsAndProblems);
      
      setSubjects(subjectsWithTopicsAndProblems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    try {
      setError('');
      
      console.log('Adding subject:', newSubject);
      
      const response = await axios.post(`${API_BASE_URL}/subjects`, {
        name: newSubject,
      });
      
      console.log('Add subject response:', response.data);
      
      setSubjects([...subjects, { ...response.data, topics: [] }]);
      setOpenSubjectDialog(false);
      setNewSubject('');
      setSuccess('Subject added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subject';
      setError(errorMessage);
      console.error('Error adding subject:', err);
    }
  };

  const handleAddTopic = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/topics`, {
        name: newTopic.name,
        subjectId: newTopic.subjectId,
      });
      
      setSubjects(subjects.map(subject => 
        subject._id === newTopic.subjectId
          ? { ...subject, topics: [...subject.topics, { ...response.data, problems: [] }] }
          : subject
      ));
      
      setOpenTopicDialog(false);
      setNewTopic({ subjectId: '', name: '' });
      setSuccess('Topic added successfully');
    } catch (err) {
      setError('Failed to add topic');
      console.error('Error adding topic:', err);
    }
  };

  const handleAddProblem = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/problems`, {
        ...newProblem,
        topicId: newProblem.topicId,
      });
      
      setSubjects(subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic =>
          topic._id === newProblem.topicId
            ? { ...topic, problems: [...topic.problems, response.data] }
            : topic
        ),
      })));
      
      setOpenProblemDialog(false);
      setNewProblem({
        topicId: '',
        title: '',
        description: '',
        difficulty: 'easy',
      });
      setSuccess('Problem added successfully');
    } catch (err) {
      setError('Failed to add problem');
      console.error('Error adding problem:', err);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/subjects/${subjectId}`);
      setSubjects(subjects.filter(subject => subject._id !== subjectId));
      setSuccess('Subject deleted successfully');
    } catch (err) {
      setError('Failed to delete subject');
      console.error('Error deleting subject:', err);
    }
  };

  const handleDeleteTopic = async (subjectId: string, topicId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/topics/${topicId}`);
      setSubjects(subjects.map(subject =>
        subject._id === subjectId
          ? { ...subject, topics: subject.topics.filter(topic => topic._id !== topicId) }
          : subject
      ));
      setSuccess('Topic deleted successfully');
    } catch (err) {
      setError('Failed to delete topic');
      console.error('Error deleting topic:', err);
    }
  };

  const handleDeleteProblem = async (subjectId: string, topicId: string, problemId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/problems/${problemId}`);
      setSubjects(subjects.map(subject =>
        subject._id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic._id === topicId
                  ? { ...topic, problems: topic.problems.filter(problem => problem._id !== problemId) }
                  : topic
              ),
            }
          : subject
      ));
      setSuccess('Problem deleted successfully');
    } catch (err) {
      setError('Failed to delete problem');
      console.error('Error deleting problem:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

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
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Subjects" />
          <Tab label="Topics" />
          <Tab label="Problems" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenSubjectDialog(true)}
                sx={{ mb: 2 }}
              >
                Add Subject
              </Button>
              <List>
                {subjects.map((subject) => (
                  <ListItem key={subject._id}>
                    <ListItemText
                      primary={subject.name}
                      secondary={`${subject.topics.length} topics`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSubject(subject._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenTopicDialog(true)}
                sx={{ mb: 2 }}
              >
                Add Topic
              </Button>
              <List>
                {subjects.map((subject) => (
                  <Box key={subject._id}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      {subject.name}
                    </Typography>
                    {subject.topics.map((topic) => (
                      <ListItem key={topic._id}>
                        <ListItemText primary={topic.name} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTopic(subject._id, topic._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </Box>
                ))}
              </List>
            </>
          )}

          {tabValue === 2 && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenProblemDialog(true)}
                sx={{ mb: 2 }}
              >
                Add Problem
              </Button>
              <List>
                {subjects.map((subject) => (
                  <Box key={subject._id}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      {subject.name}
                    </Typography>
                    {subject.topics.map((topic) => (
                      <Box key={topic._id} sx={{ pl: 2 }}>
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                          {topic.name}
                        </Typography>
                        {topic.problems.map((problem) => (
                          <ListItem key={problem._id}>
                            <ListItemText
                              primary={problem.title}
                              secondary={`Difficulty: ${problem.difficulty}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProblem(subject._id, topic._id, problem._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </List>
            </>
          )}
        </Box>
      </Paper>

      {/* Subject Dialog */}
      <Dialog open={openSubjectDialog} onClose={() => setOpenSubjectDialog(false)}>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject Name"
            fullWidth
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubjectDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSubject} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Topic Dialog */}
      <Dialog open={openTopicDialog} onClose={() => setOpenTopicDialog(false)}>
        <DialogTitle>Add New Topic</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={newTopic.subjectId}
              onChange={(e) => setNewTopic({ ...newTopic, subjectId: e.target.value })}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Topic Name"
            fullWidth
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTopicDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTopic} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Problem Dialog */}
      <Dialog open={openProblemDialog} onClose={() => setOpenProblemDialog(false)}>
        <DialogTitle>Add New Problem</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Topic</InputLabel>
            <Select
              value={newProblem.topicId}
              onChange={(e) => setNewProblem({ ...newProblem, topicId: e.target.value })}
            >
              {subjects.flatMap(subject =>
                subject.topics.map(topic => (
                  <MenuItem key={topic._id} value={topic._id}>
                    {subject.name} - {topic.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Problem Title"
            fullWidth
            value={newProblem.title}
            onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Problem Description"
            fullWidth
            multiline
            rows={4}
            value={newProblem.description}
            onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={newProblem.difficulty}
              onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProblemDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProblem} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 