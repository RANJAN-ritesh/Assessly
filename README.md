# Assessment Platform

A modern, feature-rich assessment platform for conducting coding evaluations with real-time analytics and comprehensive reporting.

## 🌟 Features

### Core Functionality
- **Multi-language Support**: Code editor supporting multiple programming languages
- **Subject & Topic Selection**: Organized assessment structure by subjects and topics
- **Problem Navigation**: Intuitive interface for moving between problems

### Enhanced UI/UX
- **Modern Dark Theme**: Sleek design with glassmorphism effects
- **Animated Elements**: 
  - Smooth transitions between components
  - Dynamic comet effects (top-right to bottom-left)
  - Responsive interactions
- **Typography**: Enhanced readability with carefully selected fonts
- **Navigation**: Improved problem navigation chips

### Assessment Management
- **Comprehensive Timer System**
  - Global assessment countdown
  - Per-problem time tracking
  - Automatic submission on timeout
- **Problem State Tracking**
  - Time spent per problem
  - Attempt status monitoring
  - Code execution attempts
  - Language selection history

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

---
For more details, see comments in the code or ask the maintainer.

For more information or support, please open an issue in the repository. 