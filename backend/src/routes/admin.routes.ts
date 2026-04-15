import { Router } from 'express';
import { getAdminStats, getAdminPayments, approvePayment, rejectPayment } from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/payments', getAdminPayments);
router.put('/payments/:id/approve', approvePayment);
router.put('/payments/:id/reject', rejectPayment);

export default router;
