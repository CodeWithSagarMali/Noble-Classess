import { Router } from 'express';
import { createPaymentOrder, verifyPayment, addOfflinePayment, getPaymentsList } from '../controllers/feeController';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.post('/order', protect, restrictTo('STUDENT'), createPaymentOrder);
router.post('/verify', protect, restrictTo('STUDENT'), verifyPayment);
router.post('/offline', protect, restrictTo('ADMIN'), addOfflinePayment);
router.get('/list', protect, getPaymentsList);

export default router;
