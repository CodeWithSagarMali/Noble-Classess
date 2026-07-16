import { Router } from 'express';
import { createTicket, getTickets, replyToTicket, closeTicket } from '../controllers/ticketController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/create', protect, createTicket);
router.get('/list', protect, getTickets);
router.post('/:id/reply', protect, replyToTicket);
router.patch('/:id/close', protect, closeTicket);

export default router;
