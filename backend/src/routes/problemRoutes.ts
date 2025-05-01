import express from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Problem } from '../models/Problem';

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Error fetching problems' });
  }
});

// Get problems by topic
router.get('/topic/:topicId', async (req, res) => {
  try {
    const problems = await Problem.find({ topicId: req.params.topicId });
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems by topic:', error);
    res.status(500).json({ message: 'Error fetching problems' });
  }
});

// Create a new problem
router.post('/', async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(400).json({ message: 'Error creating problem' });
  }
});

// Update a problem
router.put('/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(400).json({ message: 'Error updating problem' });
  }
});

// Delete a problem
router.delete('/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(400).json({ message: 'Error deleting problem' });
  }
});

export default router; 