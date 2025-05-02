import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  languages: {
    type: [String],
    enum: ['HTML', 'JavaScript', 'Python', 'C++', 'SQL', 'NoSQL'],
    required: true
  }
}, {
  timestamps: true
});

export const Problem = mongoose.model('Problem', problemSchema); 