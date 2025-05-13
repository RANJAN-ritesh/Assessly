import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Rate limiter to prevent API overload
const rateLimiter = {
  lastCall: 0,
  minInterval: 1000, // 1 second between calls
  
  async wait() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    this.lastCall = Date.now();
  }
};

// Problem generation service
export const generateProblems = async (
  subject: string,
  topic: string,
  count: number = 5
) => {
  try {
    await rateLimiter.wait();
    
    const prompt = `
      Generate ${count} coding problems for:
      Subject: ${subject}
      Topic: ${topic}
      
      For each problem, provide:
      1. Title
      2. Description
      3. Difficulty level (easy/medium/hard)
      4. Expected time (15-30 minutes)
      5. Test cases
      6. Solution approach
      7. Key concepts tested
      
      Format the response as JSON with this structure:
      {
        problems: [
          {
            title: string,
            description: string,
            difficulty: 'easy' | 'medium' | 'hard',
            expectedTime: number,
            testCases: [
              {
                input: string,
                output: string,
                explanation: string
              }
            ],
            solution: {
              approach: string,
              timeComplexity: string,
              spaceComplexity: string,
              keyConcepts: string[]
            }
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const problems = JSON.parse(text);
      return validateGeneratedProblems(problems);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating problems:', error);
    throw new Error('Failed to generate problems');
  }
};

// Grading service
export const gradeSubmission = async (submission: {
  problem: any,
  code: string,
  language: string
}) => {
  try {
    await rateLimiter.wait();
    
    const prompt = `
      Grade this code submission:
      
      Problem:
      ${JSON.stringify(submission.problem)}
      
      Submitted Code:
      ${submission.code}
      
      Language: ${submission.language}
      
      Evaluate based on:
      1. Correctness (0-100%)
      2. Code Quality (0-100%)
      3. Efficiency (0-100%)
      4. Best Practices (0-100%)
      
      Provide detailed feedback for each aspect.
      
      Format response as JSON:
      {
        score: {
          correctness: number,
          codeQuality: number,
          efficiency: number,
          bestPractices: number,
          overall: number
        },
        feedback: {
          correctness: string[],
          codeQuality: string[],
          efficiency: string[],
          bestPractices: string[],
          suggestions: string[]
        },
        analysis: {
          timeComplexity: string,
          spaceComplexity: string,
          improvements: string[]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const grading = JSON.parse(text);
      return {
        ...grading,
        timestamp: new Date(),
        submissionId: submission.problem.id,
        validated: validateGrading(grading)
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error grading submission:', error);
    throw new Error('Failed to grade submission');
  }
};

// Helper functions
const validateGeneratedProblems = (problems: any) => {
  if (!problems || !Array.isArray(problems.problems)) {
    throw new Error('Invalid problem structure');
  }

  return problems.problems.map((problem: any) => ({
    ...problem,
    createdAt: new Date(),
    status: 'pending',
    isValid: validateProblemStructure(problem),
    id: generateUniqueId()
  }));
};

const validateProblemStructure = (problem: any) => {
  const requiredFields = [
    'title',
    'description',
    'difficulty',
    'expectedTime',
    'testCases',
    'solution'
  ];

  return requiredFields.every(field => problem[field] !== undefined);
};

const validateGrading = (grading: any) => {
  if (!grading || !grading.score || !grading.feedback) {
    return false;
  }

  const scoresValid = Object.values(grading.score).every(
    (score: any) => typeof score === 'number' && score >= 0 && score <= 100
  );

  const feedbackValid = Object.keys(grading.feedback).every(
    key => Array.isArray(grading.feedback[key])
  );

  return scoresValid && feedbackValid;
};

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}; 