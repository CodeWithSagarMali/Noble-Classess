import { Router } from 'express';
import authRoutes from './authRoutes';
import admissionRoutes from './admissionRoutes';
import attendanceRoutes from './attendanceRoutes';
import feeRoutes from './feeRoutes';
import examRoutes from './examRoutes';
import cmsRoutes from './cmsRoutes';
import ticketRoutes from './ticketRoutes';
import adminRoutes from './adminRoutes';
import studyMaterialRoutes from './studyMaterialRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admissions', admissionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/fees', feeRoutes);
router.use('/exams', examRoutes);
router.use('/cms', cmsRoutes);
router.use('/tickets', ticketRoutes);
router.use('/admin', adminRoutes);
router.use('/study-materials', studyMaterialRoutes);

export default router;
