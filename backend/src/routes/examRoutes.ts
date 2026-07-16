import { Router } from 'express';
import { createExam, getExams, getExamQuestions, submitExamAnswers, getLeaderboard } from '../controllers/examController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.post('/create', protect, restrictTo('TEACHER', 'ADMIN'), createExam);
router.get('/list', protect, getExams);
router.get('/:id/questions', protect, getExamQuestions);
router.post('/:id/submit', protect, restrictTo('STUDENT'), submitExamAnswers);
router.get('/:id/leaderboard', protect, getLeaderboard);

export default router;
