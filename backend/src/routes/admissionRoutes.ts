import { Router } from 'express';
import { submitAdmissionForm, getApplications, updateApplicationStatus } from '../controllers/admissionController';
import { protect, restrictTo } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

// Student portals
router.post(
  '/submit',
  protect,
  restrictTo('STUDENT'),
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
  ]),
  submitAdmissionForm
);

// Admin portals
router.get('/applications', protect, restrictTo('ADMIN', 'TEACHER'), getApplications);
router.patch('/applications/:id/status', protect, restrictTo('ADMIN'), updateApplicationStatus);

export default router;
