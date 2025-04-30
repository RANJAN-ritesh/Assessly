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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Subject {
  _id: string;
  name: string;
}

const SubjectManagement = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddSubject = async () => {
    try {
      await axios.post('http://localhost:3000/api/subjects', { name: newSubject });
      setNewSubject('');
      fetchSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    try {
      await axios.put(`http://localhost:3000/api/subjects/${editingSubject._id}`, {
        name: editingSubject.name,
      });
      setEditingSubject(null);
      fetchSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Subject Management
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="New Subject"
                  variant="outlined"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSubject}
                  disabled={!newSubject.trim()}
                >
                  Add Subject
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject Name</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject._id}>
                        <TableCell>
                          {editingSubject?._id === subject._id ? (
                            <TextField
                              fullWidth
                              value={editingSubject.name}
                              onChange={(e) =>
                                setEditingSubject({ ...editingSubject, name: e.target.value })
                              }
                            />
                          ) : (
                            subject.name
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {editingSubject?._id === subject._id ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleUpdateSubject}
                            >
                              Save
                            </Button>
                          ) : (
                            <>
                              <IconButton
                                color="primary"
                                onClick={() => setEditingSubject(subject)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteSubject(subject._id)}
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

export default SubjectManagement; 