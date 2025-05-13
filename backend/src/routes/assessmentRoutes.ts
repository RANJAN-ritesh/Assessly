import express from 'express';
import { Problem } from '../models/Problem';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

const router = express.Router();

// Problem time estimates (in minutes)
const PROBLEM_TIME_ESTIMATES = {
  easy: { min: 15, max: 20 },
  medium: { min: 20, max: 25 },
  hard: { min: 25, max: 30 }
};

// Calculate optimal problem distribution based on duration
const calculateProblemDistribution = (durationInHours: number) => {
  const totalMinutes = durationInHours * 60;
  
  // Calculate average time per difficulty
  const avgTimePerDifficulty = {
    easy: (PROBLEM_TIME_ESTIMATES.easy.min + PROBLEM_TIME_ESTIMATES.easy.max) / 2,
    medium: (PROBLEM_TIME_ESTIMATES.medium.min + PROBLEM_TIME_ESTIMATES.medium.max) / 2,
    hard: (PROBLEM_TIME_ESTIMATES.hard.min + PROBLEM_TIME_ESTIMATES.hard.max) / 2
  };

  // Special handling for very short durations (less than 45 minutes)
  if (totalMinutes < 45) {
    return {
      easyCount: 1,
      mediumCount: 0,
      hardCount: 0
    };
  }

  // Special handling for short durations (less than 90 minutes)
  if (totalMinutes < 90) {
    return {
      easyCount: 1,
      mediumCount: 1,
      hardCount: 0
    };
  }

  // Calculate max problems that can fit in the duration
  const maxProblemsBasedOnTime = Math.floor(totalMinutes / avgTimePerDifficulty.easy);
  const maxProblems = Math.min(maxProblemsBasedOnTime, 10); // Cap at 10 problems

  // Ensure we have at least one problem of each difficulty for normal durations
  if (maxProblems < 3) {
    return {
      easyCount: 1,
      mediumCount: 1,
      hardCount: 1
    };
  }

  // Calculate distribution ensuring total time fits within duration
  let easyCount = Math.floor(maxProblems * 0.4);
  let mediumCount = Math.floor(maxProblems * 0.4);
  let hardCount = Math.max(1, maxProblems - easyCount - mediumCount);

  // Calculate total time
  let totalTime = (
    easyCount * avgTimePerDifficulty.easy +
    mediumCount * avgTimePerDifficulty.medium +
    hardCount * avgTimePerDifficulty.hard
  );

  // Adjust counts if total time exceeds duration
  while (totalTime > totalMinutes && (easyCount + mediumCount + hardCount) > 3) {
    if (hardCount > 1) {
      hardCount--;
    } else if (mediumCount > 1) {
      mediumCount--;
    } else if (easyCount > 1) {
      easyCount--;
    }

    totalTime = (
      easyCount * avgTimePerDifficulty.easy +
      mediumCount * avgTimePerDifficulty.medium +
      hardCount * avgTimePerDifficulty.hard
    );
  }

  return { easyCount, mediumCount, hardCount };
};

// Start assessment
router.post('/start', async (req, res) => {
  try {
    const { subjectIds, topicIds, duration } = req.body;

    if (!subjectIds || !topicIds || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch problems based on selected subjects and topics
    const problems = await Problem.find({
      subjectId: { $in: subjectIds },
      topicId: { $in: topicIds }
    });

    if (problems.length === 0) {
      return res.status(404).json({ message: 'No problems found for the selected criteria' });
    }

    // Calculate optimal problem distribution
    const { easyCount, mediumCount, hardCount } = calculateProblemDistribution(duration);

    // Group problems by difficulty
    const problemsByDifficulty = {
      easy: problems.filter(p => p.difficulty === 'easy'),
      medium: problems.filter(p => p.difficulty === 'medium'),
      hard: problems.filter(p => p.difficulty === 'hard')
    };

    // Select problems ensuring topic coverage
    const selectedProblems = [];
    const usedTopics = new Set();
    const usedSubjects = new Set();

    // Helper function to select a problem
    const selectProblem = (difficulty: 'easy' | 'medium' | 'hard', count: number) => {
      const availableProblems = problemsByDifficulty[difficulty]
        .filter(p => !usedTopics.has(p.topicId.toString())); // Avoid topic repetition

      if (availableProblems.length === 0) {
        // If no unique topics left, allow repetition
        return problemsByDifficulty[difficulty]
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      }

      return availableProblems
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    };

    // Select problems for each difficulty level
    const easyProblems = selectProblem('easy', easyCount);
    const mediumProblems = selectProblem('medium', mediumCount);
    const hardProblems = selectProblem('hard', hardCount);

    // Combine and shuffle all selected problems
    const allProblems = [...easyProblems, ...mediumProblems, ...hardProblems]
      .sort(() => 0.5 - Math.random());

    // Calculate total estimated time
    const totalEstimatedTime = allProblems.reduce((total, problem) => {
      const estimates = PROBLEM_TIME_ESTIMATES[problem.difficulty];
      return total + (estimates.min + estimates.max) / 2;
    }, 0);

    // If total time exceeds duration, adjust the selection
    if (totalEstimatedTime > duration * 60) {
      // Remove problems starting from the end until we're within the time limit
      while (totalEstimatedTime > duration * 60 && allProblems.length > 0) {
        allProblems.pop();
      }
    }

    res.json({
      problems: allProblems.map(problem => ({
        _id: problem._id,
        title: problem.title,
        description: problem.description,
        languages: problem.languages,
        difficulty: problem.difficulty,
        estimatedTime: PROBLEM_TIME_ESTIMATES[problem.difficulty]
      })),
      duration,
      startTime: new Date().toISOString(),
      totalEstimatedTime
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    res.status(500).json({ message: 'Error starting assessment' });
  }
});

// End assessment
router.post('/end', async (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    if (!assessmentData) {
      return res.status(400).json({ message: 'Assessment data is required' });
    }

    // Validate required fields
    const requiredFields = ['startTime', 'endTime', 'duration', 'problems', 'answers'];
    for (const field of requiredFields) {
      if (!assessmentData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Calculate total time spent
    const startTime = new Date(assessmentData.startTime);
    const endTime = new Date(assessmentData.endTime);
    const totalTimeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // in seconds

    // Add total time spent to assessment data
    const completedAssessment = {
      ...assessmentData,
      totalTimeSpent,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };

    // --- Gemini Auto-Grading Integration ---
    const { problems, answers } = assessmentData;
    // answers: [{ problemId, code, language }]
    // problems: [{ _id, ... }]
    const { gradeSubmission } = require('../services/aiService');
    const gradingResults = [];
    for (const answer of answers) {
      const problem = problems.find((p: any) => p._id === answer.problemId);
      if (!problem) {
        gradingResults.push({ problemId: answer.problemId, error: 'Problem not found' });
        continue;
      }
      try {
        const grading = await gradeSubmission({ problem, code: answer.code, language: answer.language });
        gradingResults.push({ problemId: answer.problemId, grading });
      } catch (err) {
        gradingResults.push({ problemId: answer.problemId, error: 'Grading failed', details: (err as any).message });
      }
    }
    // --- End Gemini Auto-Grading ---

    // Return completed assessment and grading results
    res.json({
      message: 'Assessment completed and graded successfully',
      assessment: completedAssessment,
      gradingResults
    });
  } catch (error) {
    console.error('Error ending assessment:', error);
    res.status(500).json({ message: 'Error ending assessment' });
  }
});

// Download assessment as PDF
router.post('/download', async (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    if (!assessmentData) {
      return res.status(400).json({ message: 'Assessment data is required' });
    }

    // Create a new PDF document with proper configuration
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=assessment-${format(new Date(assessmentData.endTime), 'yyyy-MM-dd-HH-mm')}.pdf`
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add title
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Assessment Summary', { align: 'center' })
      .moveDown();

    // Add overview section
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Overview')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Start Time: ${format(new Date(assessmentData.startTime), 'PPp')}`)
      .text(`End Time: ${format(new Date(assessmentData.endTime), 'PPp')}`)
      .text(`Duration: ${Math.floor(assessmentData.duration)} hours`)
      .text(`Total Time Spent: ${formatDuration(assessmentData.totalTimeSpent)}`)
      .moveDown();

    // Add metrics section
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Performance Metrics')
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Total Problems: ${assessmentData.metrics.totalProblems}`)
      .text(`Problems Attempted: ${assessmentData.metrics.attemptedCount}`)
      .text(`Problems Skipped: ${assessmentData.metrics.skippedCount}`)
      .text(`Code Execution Attempts: ${assessmentData.metrics.ranCodeCount}`)
      .moveDown();

    // Add problems section
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Problems')
      .moveDown(0.5);

    assessmentData.problems.forEach((problem: any, index: number) => {
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
      }

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${problem.title}`)
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font('Helvetica')
        .text('Description:', { underline: true })
        .moveDown(0.2);

      doc
        .font('Helvetica')
        .text(problem.description, {
          width: 500,
          align: 'left'
        })
        .moveDown(0.5);

      doc
        .text('Statistics:', { underline: true })
        .moveDown(0.2)
        .text(`Time Spent: ${formatDuration(problem.state.timeSpent)}`)
        .text(`Status: ${problem.state.hasAttempted ? 'Attempted' : 'Not Attempted'}`)
        .text(`Code Runs: ${problem.state.hasRun ? 'Yes' : 'No'}`)
        .moveDown();

      if (problem.state.hasAttempted) {
        doc
          .text('Your Solution:', { underline: true })
          .moveDown(0.2)
          .font('Courier')
          .text(problem.state.code, {
            width: 500,
            align: 'left'
          })
          .moveDown();
      }

      // Add a separator between problems
      if (index < assessmentData.problems.length - 1) {
        doc
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown();
      }
    });

    // Finalize the PDF
    doc.end();

    // Handle PDF generation errors
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      res.status(500).json({ message: 'Error generating PDF' });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Test PDF generation
router.get('/test-download', async (req, res) => {
  try {
    // Create a new PDF document with proper configuration
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=test.pdf'
    );

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add some test content
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Test PDF', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .font('Helvetica')
      .text('This is a test PDF document.')
      .text('If you can see this, PDF generation is working correctly.');

    // Finalize the PDF
    doc.end();

    // Handle PDF generation errors
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      res.status(500).json({ message: 'Error generating PDF' });
    });
  } catch (error) {
    console.error('Error generating test PDF:', error);
    res.status(500).json({ message: 'Error generating test PDF' });
  }
});

// Test function to verify problem selection logic
const testProblemSelection = async () => {
  const results = [];
  try {
    const testCases = [
      { duration: 1, expectedMaxProblems: 4 }, // 1 hour
      { duration: 2, expectedMaxProblems: 8 }, // 2 hours
      { duration: 3, expectedMaxProblems: 10 }, // 3 hours (max 10 problems)
      { duration: 0.5, expectedMaxProblems: 2 } // 30 minutes
    ];

    results.push('\nTesting Problem Selection Logic:');
    results.push('--------------------------------');

    for (const testCase of testCases) {
      const { easyCount, mediumCount, hardCount } = calculateProblemDistribution(testCase.duration);
      const totalProblems = easyCount + mediumCount + hardCount;
      
      results.push(`\nDuration: ${testCase.duration} hour(s)`);
      results.push(`Expected max problems: ${testCase.expectedMaxProblems}`);
      results.push(`Calculated distribution:`);
      results.push(`- Easy problems: ${easyCount} (${Math.round((easyCount/totalProblems)*100)}%)`);
      results.push(`- Medium problems: ${mediumCount} (${Math.round((mediumCount/totalProblems)*100)}%)`);
      results.push(`- Hard problems: ${hardCount} (${Math.round((hardCount/totalProblems)*100)}%)`);
      
      // Calculate estimated time
      const estimatedTime = (
        easyCount * (PROBLEM_TIME_ESTIMATES.easy.min + PROBLEM_TIME_ESTIMATES.easy.max) / 2 +
        mediumCount * (PROBLEM_TIME_ESTIMATES.medium.min + PROBLEM_TIME_ESTIMATES.medium.max) / 2 +
        hardCount * (PROBLEM_TIME_ESTIMATES.hard.min + PROBLEM_TIME_ESTIMATES.hard.max) / 2
      );
      
      results.push(`Total estimated time: ${Math.round(estimatedTime)} minutes`);
      results.push(`Time limit: ${testCase.duration * 60} minutes`);
      results.push(`Time utilization: ${Math.round((estimatedTime/(testCase.duration * 60))*100)}%`);
    }

    // Test with actual problems
    const mockProblems = [
      { difficulty: 'easy', topicId: '1' },
      { difficulty: 'easy', topicId: '2' },
      { difficulty: 'medium', topicId: '3' },
      { difficulty: 'medium', topicId: '4' },
      { difficulty: 'hard', topicId: '5' },
      { difficulty: 'hard', topicId: '6' }
    ];

    results.push('\nTesting Topic Coverage:');
    const selectedProblems = [];
    const usedTopics = new Set();

    // Test topic coverage logic
    const selectProblem = (difficulty: 'easy' | 'medium' | 'hard', count: number) => {
      const availableProblems = mockProblems
        .filter(p => p.difficulty === difficulty && !usedTopics.has(p.topicId));

      if (availableProblems.length === 0) {
        return mockProblems
          .filter(p => p.difficulty === difficulty)
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      }

      const selected = availableProblems
        .sort(() => 0.5 - Math.random())
        .slice(0, count);

      selected.forEach(p => usedTopics.add(p.topicId));
      return selected;
    };

    const easyProblems = selectProblem('easy', 2);
    const mediumProblems = selectProblem('medium', 2);
    const hardProblems = selectProblem('hard', 2);

    results.push('\nSelected Problems:');
    results.push('Easy: ' + easyProblems.map(p => p.topicId).join(', '));
    results.push('Medium: ' + mediumProblems.map(p => p.topicId).join(', '));
    results.push('Hard: ' + hardProblems.map(p => p.topicId).join(', '));
    results.push('Used Topics: ' + Array.from(usedTopics).join(', '));

  } catch (error) {
    results.push('Error in test: ' + error);
  }
  
  return results;
};

// Add test route
router.get('/test-selection', async (req, res) => {
  try {
    const results = await testProblemSelection();
    res.json({ 
      message: 'Test completed successfully',
      results: results.join('\n')
    });
  } catch (error) {
    console.error('Error running test:', error);
    res.status(500).json({ message: 'Error running test' });
  }
});

// Helper function to format duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export default router; 