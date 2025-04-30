import express from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Problem } from '../models/Problem';

const router = express.Router();

// Get all problems for a subject and topic
router.get('/:subjectId/:topicId', async (req, res) => {
  try {
    const problems = await Problem.find({
      subjectId: req.params.subjectId,
      topicId: req.params.topicId
    });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems' });
  }
});

// Get a specific problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem' });
  }
});

// Create a new problem (Admin only)
router.post('/:subjectId/:topicId', authenticateAdmin, async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      subjectId: req.params.subjectId,
      topicId: req.params.topicId
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating problem' });
  }
});

// Update a problem (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating problem' });
  }
});

// Delete a problem (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting problem' });
  }
});

export default router; 