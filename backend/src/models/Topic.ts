import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  recap: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

export const Topic = mongoose.model('Topic', topicSchema); 