import express from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Topic } from '../models/Topic';

const router = express.Router();

// Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// Get topics by subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics by subject:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// Create a new topic
router.post('/', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(400).json({ message: 'Error creating topic' });
  }
});

// Update a topic
router.put('/:id', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(400).json({ message: 'Error updating topic' });
  }
});

// Delete a topic
router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(400).json({ message: 'Error deleting topic' });
  }
});

export default router; 