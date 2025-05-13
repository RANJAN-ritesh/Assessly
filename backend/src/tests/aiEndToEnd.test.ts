import express from 'express';
import request from 'supertest';
import aiRoutes from '../routes/aiRoutes';
import { generateProblems, gradeSubmission } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock Gemini API with realistic responses
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockImplementation(async (prompt) => {
        if (prompt.includes('Generate')) {
          return {
            response: {
              text: jest.fn().mockReturnValue(JSON.stringify({
                problems: [
                  {
                    title: "Reverse Linked List",
                    description: "Given a singly linked list, reverse it in place.",
                    difficulty: "medium",
                    expectedTime: 30,
                    testCases: [
                      {
                        input: "1->2->3->4->5",
                        output: "5->4->3->2->1",
                        explanation: "The list should be reversed"
                      }
                    ],
                    solution: {
                      approach: "Use three pointers to reverse the list in place",
                      timeComplexity: "O(n)",
                      spaceComplexity: "O(1)",
                      keyConcepts: ["Linked Lists", "Pointers", "In-place Operations"]
                    }
                  }
                ]
              }))
            }
          };
        } else {
          return {
            response: {
              text: jest.fn().mockReturnValue(JSON.stringify({
                score: {
                  correctness: 90,
                  codeQuality: 85,
                  efficiency: 80,
                  bestPractices: 95,
                  overall: 87.5
                },
                feedback: {
                  correctness: ["Solution correctly reverses the list"],
                  codeQuality: ["Well structured code with good variable names"],
                  efficiency: ["Optimal O(n) time complexity"],
                  bestPractices: ["Follows coding standards"],
                  suggestions: ["Add comments for better readability"]
                },
                analysis: {
                  timeComplexity: "O(n)",
                  spaceComplexity: "O(1)",
                  improvements: ["Add error handling for edge cases"]
                }
              }))
            }
          };
        }
      })
    })
  }))
}));

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI Service End-to-End Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full problem generation and grading flow', async () => {
    // Step 1: Generate problems
    const generateResponse = await request(app)
      .post('/api/ai/generate-problems')
      .send({
        subject: 'Data Structures',
        topic: 'Linked Lists',
        count: 1
      });

    expect(generateResponse.status).toBe(200);
    const problem = generateResponse.body.problems[0];
    expect(problem.title).toBe('Reverse Linked List');
    expect(problem.difficulty).toBe('medium');

    // Step 2: Submit solution for grading
    const code = `
      function reverseList(head) {
        let prev = null;
        let current = head;
        while (current) {
          const next = current.next;
          current.next = prev;
          prev = current;
          current = next;
        }
        return prev;
      }
    `;

    const gradeResponse = await request(app)
      .post('/api/ai/grade-submission')
      .send({
        problem: problem,
        code: code,
        language: 'javascript'
      });

    expect(gradeResponse.status).toBe(200);
    const grading = gradeResponse.body.grading;
    expect(grading.score.overall).toBe(87.5);
    expect(grading.feedback.correctness[0]).toContain('correctly reverses');
    expect(grading.analysis.timeComplexity).toBe('O(n)');
  });

  it('should handle error cases gracefully', async () => {
    // Test invalid problem generation request
    const invalidGenerateResponse = await request(app)
      .post('/api/ai/generate-problems')
      .send({
        subject: 'Data Structures'
        // Missing topic
      });

    expect(invalidGenerateResponse.status).toBe(400);

    // Test invalid grading request
    const invalidGradeResponse = await request(app)
      .post('/api/ai/grade-submission')
      .send({
        problem: {},
        // Missing code and language
      });

    expect(invalidGradeResponse.status).toBe(400);
  });

  it('should maintain consistent response formats', async () => {
    // Generate problems
    const generateResponse = await request(app)
      .post('/api/ai/generate-problems')
      .send({
        subject: 'Data Structures',
        topic: 'Linked Lists',
        count: 1
      });

    const problem = generateResponse.body.problems[0];
    expect(problem).toHaveProperty('title');
    expect(problem).toHaveProperty('description');
    expect(problem).toHaveProperty('difficulty');
    expect(problem).toHaveProperty('expectedTime');
    expect(problem).toHaveProperty('testCases');
    expect(problem).toHaveProperty('solution');
    expect(problem).toHaveProperty('createdAt');
    expect(problem).toHaveProperty('status');
    expect(problem).toHaveProperty('isValid');
    expect(problem).toHaveProperty('id');

    // Grade submission
    const gradeResponse = await request(app)
      .post('/api/ai/grade-submission')
      .send({
        problem: problem,
        code: 'function test() { return true; }',
        language: 'javascript'
      });

    const grading = gradeResponse.body.grading;
    expect(grading).toHaveProperty('score');
    expect(grading.score).toHaveProperty('correctness');
    expect(grading.score).toHaveProperty('codeQuality');
    expect(grading.score).toHaveProperty('efficiency');
    expect(grading.score).toHaveProperty('bestPractices');
    expect(grading.score).toHaveProperty('overall');
    expect(grading).toHaveProperty('feedback');
    expect(grading).toHaveProperty('analysis');
    expect(grading).toHaveProperty('timestamp');
    expect(grading).toHaveProperty('submissionId');
    expect(grading).toHaveProperty('validated');
  });
}); 