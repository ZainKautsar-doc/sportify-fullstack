import { Router } from 'express';
import { getAdminStats, getAdminPayments, approvePayment, rejectPayment } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';

const router = Router();

router.get('/stats', authMiddleware, isAdmin, getAdminStats);
router.get('/payments', authMiddleware, isAdmin, getAdminPayments);
router.put('/approve/:id', authMiddleware, isAdmin, approvePayment);
router.put('/reject/:id', authMiddleware, isAdmin, rejectPayment);

export default router;
