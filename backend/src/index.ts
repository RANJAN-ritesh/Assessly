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
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 