import mongoose from 'mongoose';
import { Problem } from './models/Problem';

// Register Topic model
const topicSchema = new mongoose.Schema({
  name: String,
  subjectId: mongoose.Schema.Types.ObjectId,
  recap: String
});
const Topic = mongoose.model('Topic', topicSchema);

const checkDifficulties = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/assessment');
    console.log('Connected to MongoDB');

    const problems = await Problem.find().populate('topicId');
    const distribution: Record<string, { easy: number; medium: number; hard: number }> = {};

    problems.forEach(problem => {
      const topicName = (problem.topicId as any).name;
      if (!distribution[topicName]) {
        distribution[topicName] = { easy: 0, medium: 0, hard: 0 };
      }
      distribution[topicName][problem.difficulty]++;
    });

    console.log('\nDifficulty Distribution by Topic:');
    console.log(JSON.stringify(distribution, null, 2));

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

checkDifficulties(); 