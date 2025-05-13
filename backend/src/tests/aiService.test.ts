import { generateProblems, gradeSubmission } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify({
            problems: [
              {
                title: "Test Problem",
                description: "Test Description",
                difficulty: "easy",
                expectedTime: 20,
                testCases: [
                  {
                    input: "test input",
                    output: "test output",
                    explanation: "test explanation"
                  }
                ],
                solution: {
                  approach: "test approach",
                  timeComplexity: "O(n)",
                  spaceComplexity: "O(1)",
                  keyConcepts: ["test concept"]
                }
              }
            ]
          }))
        }
      })
    })
  }))
}));

describe('AI Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateProblems', () => {
    it('should generate problems with valid input', async () => {
      const subject = 'Data Structures';
      const topic = 'Linked Lists';
      const count = 2;

      const result = await generateProblems(subject, topic, count);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('difficulty');
      expect(result[0]).toHaveProperty('expectedTime');
      expect(result[0]).toHaveProperty('testCases');
      expect(result[0]).toHaveProperty('solution');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('isValid');
      expect(result[0]).toHaveProperty('id');
    });

    it('should handle invalid AI response', async () => {
      const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Error'));
      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent
        })
      }));

      await expect(generateProblems('test', 'test')).rejects.toThrow('Failed to generate problems');
    });

    it('should handle invalid JSON response', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('invalid json')
        }
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent
        })
      }));

      await expect(generateProblems('test', 'test')).rejects.toThrow('Failed to parse AI response');
    });
  });

  describe('gradeSubmission', () => {
    it('should grade submission with valid input', async () => {
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

      const result = await gradeSubmission(submission);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('score');
      expect(result.score).toHaveProperty('correctness');
      expect(result.score).toHaveProperty('codeQuality');
      expect(result.score).toHaveProperty('efficiency');
      expect(result.score).toHaveProperty('bestPractices');
      expect(result.score).toHaveProperty('overall');
      expect(result).toHaveProperty('feedback');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('submissionId');
      expect(result).toHaveProperty('validated');
    });

    it('should handle invalid submission data', async () => {
      const invalidSubmission = {
        problem: {},
        code: '',
        language: ''
      };

      await expect(gradeSubmission(invalidSubmission)).rejects.toThrow();
    });

    it('should validate grading scores', async () => {
      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify({
            score: {
              correctness: 150, // Invalid score
              codeQuality: 80,
              efficiency: 70,
              bestPractices: 90,
              overall: 85
            },
            feedback: {
              correctness: ['test'],
              codeQuality: ['test'],
              efficiency: ['test'],
              bestPractices: ['test'],
              suggestions: ['test']
            },
            analysis: {
              timeComplexity: 'O(n)',
              spaceComplexity: 'O(1)',
              improvements: ['test']
            }
          }))
        }
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: mockGenerateContent
        })
      }));

      const result = await gradeSubmission({
        problem: { id: 'test' },
        code: 'test',
        language: 'javascript'
      });

      expect(result.validated).toBe(false);
    });
  });
}); 