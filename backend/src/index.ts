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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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