//userController.js
import User from '../models/User.js';
import Answer from '../models/Answer.js';

export const registerUser = async (req, res) => {
  const { name, class: className, mobile } = req.body;
  const user = await User.create({ name, class: className, mobile });
  res.json(user);
};

export const submitAnswer = async (req, res) => {
  const { userId, questionId, text } = req.body;
  const answer = await Answer.create({ user: userId, question: questionId, text });
  res.json(answer);
};

// Example: userController.js
import Question from '../models/Question.js';

export const getCurrentQuestion = async (req, res) => {
  try {
    const latest = await Question.findOne().sort({ createdAt: -1 }).limit(1);
    if (!latest) return res.status(404).json({ message: 'No active question found' });
    res.status(200).json(latest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
