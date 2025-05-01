import express from 'express';
import { Problem } from '../models/Problem';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

const router = express.Router();

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

    // Randomly select problems (you can adjust the number based on your requirements)
    const selectedProblems = problems
      .sort(() => 0.5 - Math.random())
      .slice(0, 5); // Select 5 random problems

    res.json({
      problems: selectedProblems.map(problem => ({
        _id: problem._id,
        title: problem.title,
        description: problem.description,
        languages: problem.languages
      })),
      duration,
      startTime: new Date().toISOString()
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

    // Here you can store the assessment data in a database if needed
    // For now, we'll just return the completed assessment data
    res.json({
      message: 'Assessment completed successfully',
      assessment: completedAssessment
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

// Helper function to format duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export default router; 