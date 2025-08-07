//userRoutes
import express from 'express';
import { registerUser, submitAnswer, getCurrentQuestion } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/submit', submitAnswer);
router.get('/current-question', getCurrentQuestion);
export default router;