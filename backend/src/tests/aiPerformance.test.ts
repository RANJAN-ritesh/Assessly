import { generateProblems, gradeSubmission } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock Gemini API with performance testing capabilities
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockImplementation(async () => {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          response: {
            text: jest.fn().mockReturnValue(JSON.stringify({
              problems: [
                {
                  title: "Test Problem",
                  description: "Test Description",
                  difficulty: "easy",
                  expectedTime: 20,
                  testCases: [],
                  solution: {}
                }
              ]
            }))
          }
        };
      })
    })
  }))
}));

describe('AI Service Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateProblems', () => {
    it('should handle concurrent requests', async () => {
      const startTime = Date.now();
      const requests = Array(10).fill(null).map(() => 
        generateProblems('Data Structures', 'Linked Lists', 1)
      );

      const results = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Each request should take ~100ms, but concurrent requests should complete faster
      expect(totalTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it('should handle large problem sets', async () => {
      const startTime = Date.now();
      const result = await generateProblems('Data Structures', 'Linked Lists', 50);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(result.length).toBe(50);
      expect(totalTime).toBeLessThan(5000); // Should complete in less than 5 seconds
    });
  });

  describe('gradeSubmission', () => {
    it('should handle concurrent grading requests', async () => {
      const submission = {
        problem: {
          id: 'test123',
          title: 'Test Problem',
          description: 'Test Description',
          difficulty: 'easy'
        },
        code: 'function test() { return true; }',
        language: 'javascript'
      };

      const startTime = Date.now();
      const requests = Array(10).fill(null).map(() => 
        gradeSubmission(submission)
      );

      const results = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.score).toBeDefined();
        expect(result.feedback).toBeDefined();
      });
    });

    it('should handle large code submissions', async () => {
      const largeCode = Array(1000).fill('function test() { return true; }').join('\n');
      const submission = {
        problem: {
          id: 'test123',
          title: 'Test Problem',
          description: 'Test Description',
          difficulty: 'easy'
        },
        code: largeCode,
        language: 'javascript'
      };

      const startTime = Date.now();
      const result = await gradeSubmission(submission);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(totalTime).toBeLessThan(2000); // Should complete in less than 2 seconds
    });
  });
}); 