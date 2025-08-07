// routes/adminRoutes.js
import express from 'express';
import {
  createQuestion, getQuestions, getAnswers, getUsers, createSet, getQuestionsBySet, getSets
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/set', createSet);
router.get('/sets', getSets); // New route to get all sets
router.post('/question', createQuestion);
router.get('/questions', getQuestions);
router.get('/questions/set/:setId', getQuestionsBySet);
router.get('/answers/:questionId', getAnswers);
router.get('/users', getUsers);
export default router;