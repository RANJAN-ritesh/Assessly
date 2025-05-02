import mongoose from 'mongoose';
import { Problem } from './models/Problem';

// Register Topic model
const topicSchema = new mongoose.Schema({
  name: String,
  subjectId: mongoose.Schema.Types.ObjectId,
  recap: String
});
const Topic = mongoose.model('Topic', topicSchema);

const checkTopics = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/assessment');
    console.log('Connected to MongoDB');

    // Check specific topics
    const topics = await Topic.find({ name: { $in: ['Objects', 'HOFs', 'Searching'] } });
    console.log('\nFound Topics:');
    console.log(JSON.stringify(topics.map(t => ({ name: t.name, _id: t._id })), null, 2));

    // Check problems for these topics
    for (const topic of topics) {
      const problems = await Problem.find({ topicId: topic._id });
      console.log(`\nProblems for ${topic.name}:`);
      console.log(JSON.stringify(problems.map(p => ({ title: p.title, difficulty: p.difficulty })), null, 2));
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

checkTopics(); 