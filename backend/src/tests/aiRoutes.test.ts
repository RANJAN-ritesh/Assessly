import express from 'express';
import request from 'supertest';
import aiRoutes from '../routes/aiRoutes';
import { generateProblems, gradeSubmission } from '../services/aiService';

// Mock the AI service
jest.mock('../services/aiService', () => ({
  generateProblems: jest.fn(),
  gradeSubmission: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI Routes Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/generate-problems', () => {
    it('should generate problems successfully', async () => {
      const mockProblems = [
        {
          title: 'Test Problem',
          description: 'Test Description',
          difficulty: 'easy',
          expectedTime: 20,
          testCases: [],
          solution: {},
          createdAt: new Date(),
          status: 'pending',
          isValid: true,
          id: 'test123'
        }
      ];

      (generateProblems as jest.Mock).mockResolvedValue(mockProblems);

      const response = await request(app)
        .post('/api/ai/generate-problems')
        .send({
          subject: 'Data Structures',
          topic: 'Linked Lists',
          count: 1
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Problems generated successfully',
        problems: mockProblems
      });
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/ai/generate-problems')
        .send({
          subject: 'Data Structures'
          // Missing topic
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Subject and topic are required'
      });
    });

    it('should handle service errors', async () => {
      (generateProblems as jest.Mock).mockRejectedValue(new Error('Service Error'));

      const response = await request(app)
        .post('/api/ai/generate-problems')
        .send({
          subject: 'Data Structures',
          topic: 'Linked Lists'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Failed to generate problems',
        error: 'Service Error'
      });
    });
  });

  describe('POST /api/ai/grade-submission', () => {
    it('should grade submission successfully', async () => {
      const mockGrading = {
        score: {
          correctness: 90,
          codeQuality: 85,
          efficiency: 80,
          bestPractices: 95,
          overall: 87.5
        },
        feedback: {
          correctness: ['Good job!'],
          codeQuality: ['Well structured'],
          efficiency: ['Could be optimized'],
          bestPractices: ['Follows best practices'],
          suggestions: ['Consider edge cases']
        },
        analysis: {
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          improvements: ['Add comments']
        },
        timestamp: new Date(),
        submissionId: 'test123',
        validated: true
      };

      (gradeSubmission as jest.Mock).mockResolvedValue(mockGrading);

      const response = await request(app)
        .post('/api/ai/grade-submission')
        .send({
          problem: {
            id: 'test123',
            title: 'Test Problem',
            description: 'Test Description',
            difficulty: 'easy'
          },
          code: 'function test() { return true; }',
          language: 'javascript'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Submission graded successfully',
        grading: mockGrading
      });
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/ai/grade-submission')
        .send({
          problem: {},
          // Missing code and language
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Problem, code, and language are required'
      });
    });

    it('should handle service errors', async () => {
      (gradeSubmission as jest.Mock).mockRejectedValue(new Error('Service Error'));

      const response = await request(app)
        .post('/api/ai/grade-submission')
        .send({
          problem: { id: 'test' },
          code: 'test',
          language: 'javascript'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Failed to grade submission',
        error: 'Service Error'
      });
    });
  });
}); 