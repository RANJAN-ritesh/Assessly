# Assessment Platform

A modern, feature-rich assessment platform for conducting coding evaluations with real-time analytics and comprehensive reporting.

## 🌟 Features

### Core Functionality
- **Multi-language Support**: Code editor supporting multiple programming languages
- **Subject & Topic Selection**: Organized assessment structure by subjects and topics
- **Problem Navigation**: Intuitive interface for moving between problems
- **Smart Problem Selection**: Adaptive algorithm for optimal problem distribution based on:
  - Assessment duration
  - Problem difficulty
  - Topic coverage
  - Time constraints
  - Candidate skill level

### Enhanced UI/UX
- **Modern Dark Theme**: Sleek design with glassmorphism effects
- **Animated Elements**: 
  - Smooth transitions between components
  - Dynamic comet effects (top-right to bottom-left)
  - Responsive interactions
- **Typography**: Enhanced readability with carefully selected fonts
- **Navigation**: Improved problem navigation chips
- **Analytics Dashboard**: Comprehensive view of problem statistics with:
  - Subject/Topic/Difficulty filters
  - Success rate visualization
  - Attempt tracking
  - Time analysis

### Assessment Management
- **Comprehensive Timer System**
  - Global assessment countdown
  - Per-problem time tracking
  - Automatic submission on timeout
  - Smart time allocation based on problem difficulty
- **Problem State Tracking**
  - Time spent per problem
  - Attempt status monitoring
  - Code execution attempts
  - Language selection history
- **Adaptive Problem Selection**
  - Duration-based problem count
  - Balanced difficulty distribution
  - Topic coverage optimization
  - Time-constrained selection

### Analytics & Reporting
- **Detailed Summary Page**
  - Time allocation overview
  - Problem attempt statistics
  - Code execution metrics
  - Problem-wise breakdown
- **PDF Report Generation**
  - Complete problem descriptions
  - Time analytics visualization
  - Code solutions documentation
  - Performance metrics analysis
- **Admin Analytics**
  - Problem difficulty distribution
  - Success rate analysis
  - Topic coverage metrics
  - Time utilization patterns

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/assessment-platform.git
cd assessment-platform
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 🛠 Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Dependencies**:
  - `date-fns`: Time manipulation and formatting
  - `react-markdown`: Problem description rendering
  - `pdfkit`: PDF report generation
  - Additional type declarations for enhanced TypeScript support

## 📝 Project Structure

```
assessment-platform/
├── src/
│   ├── components/
│   │   ├── Assessment/
│   │   ├── CodeEditor/
│   │   ├── Navigation/
│   │   └── Summary/
│   ├── types/
│   ├── utils/
│   └── pages/
├── public/
└── config/
```

## 🔜 Future Enhancements

1. **Authentication & User Management**
   - User profiles
   - Progress tracking
   - Assessment history

2. **Advanced Analytics**
   - Performance trends
   - Code quality metrics
   - Comparative analysis

3. **Collaboration Features**
   - Real-time code sharing
   - Mentor feedback system
   - Peer review capabilities

4. **Extended Platform Features**
   - Custom assessment creation
   - Template management
   - Batch assessment processing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this platform
- Special thanks to the open-source community for the tools and libraries used

## Environment Variables

- **Root `.env` (for backend):** Place in the project root (assessment-go/.env). Required for backend secrets and Judge0 integration.
  - `MONGODB_URI=...`
  - `PORT=3001`
  - `GEMINI_API_KEY=...`
  - `JUDGE0_URL=...`
  - `JUDGE0_HOST=...`
  - `JUDGE0_KEY=...`
- **Frontend `.env` (for Vite):** Place in `frontend/.env`. Only variables prefixed with `VITE_` are exposed to the frontend.
  - `VITE_API_BASE_URL=http://localhost:3001`
  - `VITE_GEMINI_API_KEY=...`

## Recent Features & UI Updates

- **Admin Dashboard:**
  - Bulk upload with improved button UI (fixed size, animated close, consistent child button sizes)
  - Consistent padding and spacing for all admin actions
- **Landing Page:**
  - Animated gradient for the ASSESSLY title (blue, purple, maroon, green, river-like flow)
- **Assessment Page:**
  - Judge0 code execution output box: adjustable height (now 150px), smaller font size for output, improved scrollability

## Troubleshooting

- **Judge0 API Key Error:**
  - If you see `Invalid API key` in backend logs, double-check your `JUDGE0_KEY` in the root `.env` and restart the backend.
- **Environment Variables Not Loading:**
  - Ensure the backend loads the root `.env` (see `src/index.ts` for explicit dotenv config).
  - For frontend, only `VITE_` variables are available in code.
- **CORS Issues:**
  - Make sure the backend CORS config allows your frontend's port (default: 5173).

## Usage

- **Start Backend:**
  ```sh
  cd backend
  npm install
  npm run dev
  ```
- **Start Frontend:**
  ```sh
  cd frontend
  npm install
  npm run dev
  ```

## 🔧 Smart Problem Selection Logic

The platform uses an intelligent algorithm to select problems for assessments. Here's a detailed breakdown:

### 1. Time Estimation Constants
```typescript
const PROBLEM_TIME_ESTIMATES = {
  easy: { min: 15, max: 20 },    // 15-20 minutes per easy problem
  medium: { min: 20, max: 25 },  // 20-25 minutes per medium problem
  hard: { min: 25, max: 30 }     // 25-30 minutes per hard problem
};
```

### 2. Algorithm Steps

#### A. Duration Analysis
1. Convert assessment duration to minutes
2. Calculate average time per difficulty level
3. Determine maximum possible problems based on duration
4. Cap maximum problems at 10 to prevent overwhelming

#### B. Special Cases Handling
1. **Very Short Duration (< 45 minutes)**
   - Select only 1 easy problem
   - Focus on core concept assessment
   - Time utilization: ~58%

2. **Short Duration (< 90 minutes)**
   - Select 1 easy + 1 medium problem
   - Balance between challenge and completion
   - Time utilization: ~67%

3. **Normal Duration (≥ 90 minutes)**
   - Apply standard distribution algorithm
   - Ensure at least one problem of each difficulty
   - Time utilization: 90-95%

#### C. Problem Distribution Calculation
1. Calculate initial distribution:
   - 40% easy problems
   - 40% medium problems
   - 20% hard problems (minimum 1)

2. Time-based adjustment:
   ```typescript
   let totalTime = (
     easyCount * avgTimePerDifficulty.easy +
     mediumCount * avgTimePerDifficulty.medium +
     hardCount * avgTimePerDifficulty.hard
   );
   ```

3. Iterative optimization:
   - While totalTime > duration:
     - Reduce hard problems first
     - Then medium problems
     - Finally easy problems
   - Maintain minimum of 3 problems if possible

#### D. Topic Coverage
1. Track used topics to avoid repetition
2. Prioritize unique topics for each difficulty
3. Allow topic repetition only if necessary
4. Ensure subject diversity

### 3. Selection Process

#### A. Problem Filtering
1. Filter by difficulty level
2. Filter by available topics
3. Sort by topic coverage priority
4. Randomize selection within constraints

#### B. Time Validation
1. Calculate total estimated time
2. Verify against duration limit
3. Adjust selection if needed
4. Ensure buffer time for review

### 4. Output Structure
```typescript
{
  problems: [
    {
      difficulty: 'easy' | 'medium' | 'hard',
      topicId: string,
      estimatedTime: { min: number, max: number }
    }
  ],
  totalEstimatedTime: number,
  timeUtilization: number
}
```

### 5. Optimization Factors

#### A. Time Management
- Buffer time for review
- Progressive difficulty increase
- Time allocation per difficulty
- Total duration constraints

#### B. Topic Coverage
- Subject diversity
- Topic progression
- Learning objectives
- Skill requirements

#### C. Difficulty Balance
- Skill-appropriate challenges
- Progressive complexity
- Balanced problem mix
- Assessment goals

### 6. Example Distributions

#### A. 30-Minute Assessment
```typescript
{
  easyCount: 1,
  mediumCount: 0,
  hardCount: 0,
  totalTime: 18 minutes,
  utilization: 58%
}
```

#### B. 1-Hour Assessment
```typescript
{
  easyCount: 1,
  mediumCount: 1,
  hardCount: 0,
  totalTime: 40 minutes,
  utilization: 67%
}
```

#### C. 2-Hour Assessment
```typescript
{
  easyCount: 2,
  mediumCount: 2,
  hardCount: 1,
  totalTime: 108 minutes,
  utilization: 90%
}
```

#### D. 3-Hour Assessment
```typescript
{
  easyCount: 4,
  mediumCount: 3,
  hardCount: 1,
  totalTime: 165 minutes,
  utilization: 92%
}
```

### 7. Error Handling
1. Insufficient problems:
   - Log warning
   - Adjust distribution
   - Allow topic repetition

2. Time overflow:
   - Reduce problem count
   - Prioritize core topics
   - Maintain difficulty balance

3. Topic exhaustion:
   - Allow topic repetition
   - Log selection details
   - Maintain difficulty distribution

For more information or support, please open an issue in the repository. 