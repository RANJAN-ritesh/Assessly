import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { loginAdmin } from './middleware/auth';
import subjectRoutes from './routes/subjectRoutes';
import topicRoutes from './routes/topicRoutes';
import problemRoutes from './routes/problemRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import recapRoutes from './routes/recapRoutes';
import codeRunRoutes from './routes/codeRunRoutes';
import aiRoutes from './routes/aiRoutes';
import { monitorPerformance, monitorErrors, metricsEndpoint } from './middleware/monitoring';
import path from 'path';
import dotenv from 'dotenv';

// Always load .env from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });
console.log('Gemini API Key (from root .env):', process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Monitoring middleware
app.use(monitorPerformance);
app.use(monitorErrors);

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/admin/login', loginAdmin);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recap', recapRoutes);
app.use('/api/recaps', recapRoutes);
app.use('/api/run', codeRunRoutes);
app.use('/api/ai', aiRoutes);

// Metrics endpoint
app.get('/api/metrics', metricsEndpoint);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 