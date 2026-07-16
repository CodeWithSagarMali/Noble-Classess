import { Router } from 'express';
import {
  registerStudent,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';

const router = Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
