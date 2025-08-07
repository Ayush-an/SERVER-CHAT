//Answer.js
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  text: String,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Answer', answerSchema);