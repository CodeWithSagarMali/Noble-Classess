import { Router } from 'express';
import { uploadStudyMaterial, getStudyMaterials } from '../controllers/studyMaterialController';
import { protect, restrictTo } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

router.post('/upload', protect, restrictTo('TEACHER', 'ADMIN'), upload.single('file'), uploadStudyMaterial);
router.get('/list', protect, getStudyMaterials);

export default router;
