import express from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Subject } from '../models/Subject';

const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});

// Get all subjects (Admin only)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});

// Create a new subject (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating subject' });
  }
});

// Update a subject (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: 'Error updating subject' });
  }
});

// Delete a subject (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting subject' });
  }
});

export default router; 