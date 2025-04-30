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

const TopicManagement = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics();
    }
  }, [selectedSubject]);

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

  const handleAddTopic = async () => {
    try {
      await axios.post(`http://localhost:3000/api/topics/${selectedSubject}`, {
        name: newTopic,
      });
      setNewTopic('');
      fetchTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic) return;
    try {
      await axios.put(`http://localhost:3000/api/topics/${editingTopic._id}`, {
        name: editingTopic.name,
      });
      setEditingTopic(null);
      fetchTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/topics/${id}`);
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Topic Management
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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

            {selectedSubject && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="New Topic"
                      variant="outlined"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddTopic}
                      disabled={!newTopic.trim()}
                    >
                      Add Topic
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Topic Name</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topics.map((topic) => (
                          <TableRow key={topic._id}>
                            <TableCell>
                              {editingTopic?._id === topic._id ? (
                                <TextField
                                  fullWidth
                                  value={editingTopic.name}
                                  onChange={(e) =>
                                    setEditingTopic({ ...editingTopic, name: e.target.value })
                                  }
                                />
                              ) : (
                                topic.name
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {editingTopic?._id === topic._id ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleUpdateTopic}
                                >
                                  Save
                                </Button>
                              ) : (
                                <>
                                  <IconButton
                                    color="primary"
                                    onClick={() => setEditingTopic(topic)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDeleteTopic(topic._id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              )}
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

export default TopicManagement; 