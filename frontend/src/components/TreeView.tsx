import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Tooltip,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  Visibility,
  Bookmark,
  Summarize,
} from '@mui/icons-material';
import MarkdownEditor from './MarkdownEditor';

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
  recap?: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: string;
}

interface TreeViewProps {
  data: Subject[];
  onAddSubject: (name: string) => Promise<void>;
  onAddTopic: (subjectId: string, name: string) => Promise<void>;
  onAddProblem: (topicId: string, problem: Omit<Problem, '_id' | 'topicId'>) => Promise<void>;
  onEditSubject: (subjectId: string, name: string) => Promise<void>;
  onEditTopic: (topicId: string, name: string) => Promise<void>;
  onEditProblem: (problemId: string, problem: Partial<Problem>) => Promise<void>;
  onDeleteSubject: (subjectId: string) => Promise<void>;
  onDeleteTopic: (topicId: string) => Promise<void>;
  onDeleteProblem: (problemId: string) => Promise<void>;
  onEditTopicRecap: (topicId: string, recap: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onAddSubject,
  onAddTopic,
  onAddProblem,
  onEditSubject,
  onEditTopic,
  onEditProblem,
  onDeleteSubject,
  onDeleteTopic,
  onDeleteProblem,
  onEditTopicRecap,
}) => {
  const theme = useTheme();
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{
    type: 'subject' | 'topic' | 'problem';
    id: string;
    name?: string;
    data?: Partial<Problem>;
  } | null>(null);
  const [newItemDialog, setNewItemDialog] = useState<{
    type: 'subject' | 'topic' | 'problem';
    parentId?: string;
  } | null>(null);
  const [viewingItem, setViewingItem] = useState<{
    type: 'problem' | 'recap';
    id: string;
    title: string;
    content: string;
  } | null>(null);

  const handleToggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const handleToggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleEdit = (type: 'subject' | 'topic' | 'problem', id: string, name?: string, data?: Partial<Problem>) => {
    setEditingItem({ type, id, name, data });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      if (editingItem.type === 'subject') {
        await onEditSubject(editingItem.id, editingItem.name || '');
      } else if (editingItem.type === 'topic') {
        await onEditTopic(editingItem.id, editingItem.name || '');
      } else if (editingItem.type === 'problem') {
        await onEditProblem(editingItem.id, editingItem.data || {});
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleAddNew = async (name: string, data?: Partial<Problem>) => {
    if (!newItemDialog) return;

    try {
      if (newItemDialog.type === 'subject') {
        await onAddSubject(name);
      } else if (newItemDialog.type === 'topic' && newItemDialog.parentId) {
        await onAddTopic(newItemDialog.parentId, name);
      } else if (newItemDialog.type === 'problem' && newItemDialog.parentId && data) {
        await onAddProblem(newItemDialog.parentId, {
          title: name,
          description: data.description || '',
          difficulty: data.difficulty || 'easy',
        });
      }
      setNewItemDialog(null);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleViewProblem = (problem: Problem) => {
    setViewingItem({
      type: 'problem',
      id: problem._id,
      title: problem.title,
      content: problem.description,
    });
  };

  const handleViewRecap = (topic: Topic) => {
    setViewingItem({
      type: 'recap',
      id: topic._id,
      title: `${topic.name} Recap`,
      content: topic.recap || '',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'hard':
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {data.map((subject) => (
          <React.Fragment key={subject._id}>
            <ListItem
              sx={{
                pl: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <IconButton
                  size="small"
                  onClick={() => handleToggleSubject(subject._id)}
                >
                  {expandedSubjects.has(subject._id) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItemIcon>
              <ListItemIcon>
                {expandedSubjects.has(subject._id) ? (
                  <FolderOpenIcon />
                ) : (
                  <FolderIcon />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={subject.name}
                secondary={`${subject.topics.length} topics`}
              />
              <Tooltip title="Add Topic">
                <IconButton
                  size="small"
                  onClick={() => setNewItemDialog({ type: 'topic', parentId: subject._id })}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Subject">
                <IconButton
                  size="small"
                  onClick={() => handleEdit('subject', subject._id, subject.name)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Subject">
                <IconButton
                  size="small"
                  onClick={() => onDeleteSubject(subject._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Collapse in={expandedSubjects.has(subject._id)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subject.topics.map((topic) => (
                  <React.Fragment key={topic._id}>
                    <ListItem
                      sx={{
                        pl: 6,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleTopic(topic._id)}
                        >
                          {expandedTopics.has(topic._id) ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemIcon>
                        {expandedTopics.has(topic._id) ? (
                          <FolderOpenIcon />
                        ) : (
                          <FolderIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={topic.name}
                        secondary={`${topic.problems.length} problems`}
                      />
                      <Tooltip title="View/Edit Recap">
                        <IconButton
                          size="small"
                          onClick={() => handleViewRecap(topic)}
                        >
                          <Summarize />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Problem">
                        <IconButton
                          size="small"
                          onClick={() => setNewItemDialog({ type: 'problem', parentId: topic._id })}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Topic">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit('topic', topic._id, topic.name)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Topic">
                        <IconButton
                          size="small"
                          onClick={() => onDeleteTopic(topic._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    <Collapse in={expandedTopics.has(topic._id)} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {topic.problems.map((problem) => (
                          <ListItem
                            key={problem._id}
                            sx={{
                              pl: 10,
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={problem.title}
                            />
                            <Tooltip title="View Problem">
                              <IconButton
                                size="small"
                                onClick={() => handleViewProblem(problem)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Problem">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit('problem', problem._id, problem.title, {
                                  description: problem.description,
                                  difficulty: problem.difficulty,
                                })}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Problem">
                              <IconButton
                                size="small"
                                onClick={() => onDeleteProblem(problem._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onClose={() => setEditingItem(null)}>
        <DialogTitle>Edit {editingItem?.type}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem({ ...editingItem!, name: e.target.value })}
          />
          {editingItem?.type === 'problem' && (
            <>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={editingItem.data?.description || ''}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  data: { ...editingItem.data, description: e.target.value },
                })}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={editingItem.data?.difficulty || 'easy'}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, difficulty: e.target.value as 'easy' | 'medium' | 'hard' },
                  })}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingItem(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add New Dialog */}
      <Dialog open={!!newItemDialog} onClose={() => setNewItemDialog(null)}>
        <DialogTitle>Add New {newItemDialog?.type}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            onChange={(e) => {
              if (newItemDialog?.type === 'problem') {
                setNewItemDialog({
                  ...newItemDialog,
                  data: { ...newItemDialog.data, title: e.target.value },
                });
              } else {
                setNewItemDialog({
                  ...newItemDialog!,
                  name: e.target.value,
                });
              }
            }}
          />
          {newItemDialog?.type === 'problem' && (
            <>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                onChange={(e) => setNewItemDialog({
                  ...newItemDialog,
                  data: { ...newItemDialog.data, description: e.target.value },
                })}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  onChange={(e) => setNewItemDialog({
                    ...newItemDialog,
                    data: { ...newItemDialog.data, difficulty: e.target.value as 'easy' | 'medium' | 'hard' },
                  })}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewItemDialog(null)}>Cancel</Button>
          <Button onClick={() => handleAddNew(
            newItemDialog?.type === 'problem' ? newItemDialog.data?.title || '' : newItemDialog?.name || '',
            newItemDialog?.type === 'problem' ? newItemDialog.data : undefined
          )}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Problem/Recap Dialog */}
      {viewingItem && (
        <MarkdownEditor
          title={viewingItem.title}
          content={viewingItem.content}
          open={true}
          onClose={() => setViewingItem(null)}
          onSave={(content) => {
            if (viewingItem.type === 'recap') {
              onEditTopicRecap(viewingItem.id, content);
            } else {
              onEditProblem(viewingItem.id, { description: content });
            }
            setViewingItem(null);
          }}
        />
      )}
    </Box>
  );
};

export default TreeView; 