import { Router } from 'express';
import {
  getDashboardStats,
  getAuditLogs,
  createCourse,
  getCourses,
  createBatch,
  getBatches,
  createTeacher,
  getTeachersList,
  triggerSystemBackup,
} from '../controllers/adminController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.get('/stats', protect, restrictTo('ADMIN'), getDashboardStats);
router.get('/logs', protect, restrictTo('ADMIN'), getAuditLogs);
router.get('/backup', protect, restrictTo('ADMIN'), triggerSystemBackup);

// Academic managers
router.post('/courses', protect, restrictTo('ADMIN'), createCourse);
router.get('/courses', protect, getCourses);

router.post('/batches', protect, restrictTo('ADMIN'), createBatch);
router.get('/batches', protect, getBatches);

router.post('/teachers', protect, restrictTo('ADMIN'), createTeacher);
router.get('/teachers', protect, getTeachersList);

export default router;
