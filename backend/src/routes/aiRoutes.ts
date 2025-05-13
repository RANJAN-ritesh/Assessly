import express from 'express';
import { generateProblems, gradeSubmission } from '../services/aiService';

const router = express.Router();

// Generate problems using AI
router.post('/generate-problems', async (req, res) => {
  try {
    const { subject, topic, count } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({
        message: 'Subject and topic are required'
      });
    }

    const problems = await generateProblems(
      subject,
      topic,
      count || 5
    );

    res.json({
      message: 'Problems generated successfully',
      problems
    });
  } catch (error: any) {
    console.error('Error in generate-problems:', error);
    res.status(500).json({
      message: 'Failed to generate problems',
      error: error?.message || 'Unknown error occurred'
    });
  }
});

// Grade submission using AI
router.post('/grade-submission', async (req, res) => {
  try {
    const { problem, code, language } = req.body;

    if (!problem || !code || !language) {
      return res.status(400).json({
        message: 'Problem, code, and language are required'
      });
    }

    const grading = await gradeSubmission({
      problem,
      code,
      language
    });

    res.json({
      message: 'Submission graded successfully',
      grading
    });
  } catch (error: any) {
    console.error('Error in grade-submission:', error);
    res.status(500).json({
      message: 'Failed to grade submission',
      error: error?.message || 'Unknown error occurred'
    });
  }
});

export default router; 