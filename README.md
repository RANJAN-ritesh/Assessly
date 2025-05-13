# Assessment Platform

A modern, feature-rich assessment platform for conducting coding evaluations with real-time analytics and comprehensive reporting.

## 🚀 Quick Start Guide

1. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/assessment-platform.git
   cd assessment-platform
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment**
   ```bash
   # In the root directory (assessment-go/)
   cp .env.example .env
   
   # In the frontend directory (assessment-go/frontend/)
   cp .env.example .env
   ```

4. **Get Required API Keys**
   - [Gemini API Key](https://makersuite.google.com/app/apikey)
   - [Judge0 API Key](https://rapidapi.com/judge0-official/api/judge0-ce)
   - MongoDB URI (from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB)

5. **Update Environment Files**
   - Edit `assessment-go/.env` with your backend configuration
   - Edit `assessment-go/frontend/.env` with your frontend configuration

6. **Start the Application**
   ```bash
   # Start backend (from backend directory)
   cd backend
   npm run dev

   # In a new terminal, start frontend (from frontend directory)
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB (local or Atlas)
- Gemini API key
- Judge0 API key

## 🔐 Environment Configuration

### Backend (.env)
Create `assessment-go/.env` with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
JUDGE0_URL=your_judge0_url
JUDGE0_HOST=your_judge0_host
JUDGE0_KEY=your_judge0_api_key
```

### Frontend (.env)
Create `assessment-go/frontend/.env` with:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🛠️ Features

### Core Functionality
- **Multi-language Support**: Code editor supporting multiple programming languages
- **Subject & Topic Selection**: Organized assessment structure
- **Problem Navigation**: Intuitive interface for moving between problems
- **Smart Problem Selection**: Adaptive algorithm for optimal problem distribution

### Enhanced UI/UX
- **Modern Dark Theme**: Sleek design with glassmorphism effects
- **Animated Elements**: Smooth transitions and dynamic effects
- **Analytics Dashboard**: Comprehensive view of problem statistics

### Assessment Management
- **Timer System**: Global countdown and per-problem tracking
- **Problem State Tracking**: Time spent, attempts, and language history
- **Adaptive Selection**: Smart problem distribution based on duration and difficulty

### Analytics & Reporting
- **Summary Page**: Detailed assessment overview
- **PDF Reports**: Complete documentation of solutions
- **Admin Analytics**: Performance metrics and success rates

## 🔧 Troubleshooting

### Common Issues

1. **Judge0 API Key Error**
   - Check your `JUDGE0_KEY` in `.env`
   - Ensure you've subscribed to the Judge0 API
   - Restart the backend server

2. **Environment Variables Not Loading**
   - Verify both `.env` files exist
   - Check file permissions
   - Restart both servers

3. **CORS Issues**
   - Ensure frontend is running on port 5173
   - Check backend CORS configuration
   - Verify API base URL in frontend `.env`

4. **Database Connection**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure MongoDB is running

### Getting Help

- Check the [Issues](https://github.com/yourusername/assessment-platform/issues) page
- Create a new issue if you encounter a bug
- Join our [Discord community](link-to-discord) for support

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Frontend Guide](docs/frontend.md)
- [Backend Guide](docs/backend.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Special thanks to the open-source community 