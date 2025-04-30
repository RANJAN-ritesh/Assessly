import mongoose from 'mongoose';

const recapSchema = new mongoose.Schema({
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
  recap: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Recap = mongoose.model('Recap', recapSchema); 