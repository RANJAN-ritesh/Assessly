import express from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Topic } from '../models/Topic';

const router = express.Router();

// Get all topics for a subject
router.get('/:subjectId', async (req, res) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// Create a new topic (Admin only)
router.post('/:subjectId', authenticateAdmin, async (req, res) => {
  try {
    const topic = new Topic({
      ...req.body,
      subjectId: req.params.subjectId
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: 'Error creating topic' });
  }
});

// Update a topic (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: 'Error updating topic' });
  }
});

// Delete a topic (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting topic' });
  }
});

export default router; 