//adminController.js
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';
import Set from '../models/Set.js';

// Create a new question set
export const createSet = async (req, res) => {
  try {
    const { title } = req.body;
    const newSet = await Set.create({ title });
    res.status(201).json(newSet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating set' });
  }
};
// Create a question and link it to a set
export const createQuestion = async (req, res) => {
  try {
    const { setText, ...questionData } = req.body;
    const question = await Question.create(questionData);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question' });
  }
};
export const getQuestionsBySet = async (req, res) => {
  try {
    const questions = await Question.find({ set: req.params.setId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions for set' });
  }
};
export const getQuestions = async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
};

export const getAnswers = async (req, res) => {
  const answers = await Answer.find({ question: req.params.questionId }).populate('user');
  res.json(answers);
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Get all sets
export const getSets = async (req, res) => {
  try {
    const sets = await Set.find().sort({ createdAt: -1 });
    res.status(200).json(sets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sets' });
  }
};