import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Subject {
  _id: string;
  name: string;
}

interface Topic {
  _id: string;
  name: string;
  subjectId: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  subjectId: string;
  topicId: string;
  languages: string[];
}

const ProblemManagement = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    languages: [] as string[],
  });
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const availableLanguages = ['HTML', 'JavaScript', 'Python', 'C++'];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics();
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject && selectedTopic) {
      fetchProblems();
    }
  }, [selectedSubject, selectedTopic]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/topics/${selectedSubject}`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/problems/${selectedSubject}/${selectedTopic}`
      );
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleAddProblem = async () => {
    try {
      await axios.post(`http://localhost:3000/api/problems/${selectedSubject}/${selectedTopic}`, {
        ...newProblem,
      });
      setNewProblem({ title: '', description: '', languages: [] });
      fetchProblems();
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const handleUpdateProblem = async () => {
    if (!editingProblem) return;
    try {
      await axios.put(`http://localhost:3000/api/problems/${editingProblem._id}`, {
        ...editingProblem,
      });
      setEditingProblem(null);
      fetchProblems();
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/problems/${id}`);
      fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const handleLanguageToggle = (language: string) => {
    if (editingProblem) {
      setEditingProblem({
        ...editingProblem,
        languages: editingProblem.languages.includes(language)
          ? editingProblem.languages.filter((l) => l !== language)
          : [...editingProblem.languages, language],
      });
    } else {
      setNewProblem({
        ...newProblem,
        languages: newProblem.languages.includes(language)
          ? newProblem.languages.filter((l) => l !== language)
          : [...newProblem.languages, language],
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Problem Management
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  label="Select Subject"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Topic</InputLabel>
                <Select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  label="Select Topic"
                  disabled={!selectedSubject}
                >
                  {topics.map((topic) => (
                    <MenuItem key={topic._id} value={topic._id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedSubject && selectedTopic && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Problem Title"
                      variant="outlined"
                      value={editingProblem ? editingProblem.title : newProblem.title}
                      onChange={(e) =>
                        editingProblem
                          ? setEditingProblem({ ...editingProblem, title: e.target.value })
                          : setNewProblem({ ...newProblem, title: e.target.value })
                      }
                    />
                    <TextField
                      fullWidth
                      label="Problem Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={editingProblem ? editingProblem.description : newProblem.description}
                      onChange={(e) =>
                        editingProblem
                          ? setEditingProblem({ ...editingProblem, description: e.target.value })
                          : setNewProblem({ ...newProblem, description: e.target.value })
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {availableLanguages.map((language) => (
                        <Chip
                          key={language}
                          label={language}
                          onClick={() => handleLanguageToggle(language)}
                          color={
                            (editingProblem
                              ? editingProblem.languages
                              : newProblem.languages
                            ).includes(language)
                              ? 'primary'
                              : 'default'
                          }
                        />
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={editingProblem ? handleUpdateProblem : handleAddProblem}
                      disabled={
                        !(
                          editingProblem
                            ? editingProblem.title && editingProblem.description
                            : newProblem.title && newProblem.description
                        )
                      }
                    >
                      {editingProblem ? 'Update Problem' : 'Add Problem'}
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Languages</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {problems.map((problem) => (
                          <TableRow key={problem._id}>
                            <TableCell>{problem.title}</TableCell>
                            <TableCell>
                              {problem.description.length > 100
                                ? `${problem.description.substring(0, 100)}...`
                                : problem.description}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {problem.languages.map((language) => (
                                  <Chip key={language} label={language} size="small" />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => setEditingProblem(problem)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteProblem(problem._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate('/admin/dashboard')}
              >
                Back to Dashboard
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProblemManagement; 