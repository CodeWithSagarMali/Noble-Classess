import { Router } from 'express';
import { uploadAttendanceExcel, downloadTemplate, getAttendanceReport } from '../controllers/attendanceController';
import { protect, restrictTo } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

router.post(
  '/upload',
  protect,
  restrictTo('TEACHER', 'ADMIN'),
  upload.single('file'),
  uploadAttendanceExcel
);

router.get('/template', protect, restrictTo('TEACHER', 'ADMIN'), downloadTemplate);
router.get('/report', protect, getAttendanceReport);

export default router;
