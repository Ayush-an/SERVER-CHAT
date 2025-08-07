//adminAuthRouters
import express from 'express';
import { adminSignup, adminSignin } from '../controllers/adminAuthController.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/signin', adminSignin);
export default router;