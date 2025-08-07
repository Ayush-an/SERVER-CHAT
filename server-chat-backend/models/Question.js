// models/Question.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  set: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Set', 
    required: true,
  },
  type: { 
    type: String, 
    enum: ['MCQ', 'QA'], 
    required: true 
  },
  text: String, 
  options: [String], 
  timeLimit: Number,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('Question', questionSchema);