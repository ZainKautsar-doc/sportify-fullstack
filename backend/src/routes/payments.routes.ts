import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadPayment, getPayment } from '../controllers/payments.controller';

import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadPayment);
// router.post('/', upload.single('proof'), uploadPayment);
router.get('/:booking_id', authMiddleware, getPayment);

export default router;
