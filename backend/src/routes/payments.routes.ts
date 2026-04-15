import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadPayment, getPayment } from '../controllers/payments.controller';

const router = Router();

router.post("/upload", upload.single("file"), uploadPayment);
// router.post('/', upload.single('proof'), uploadPayment);
router.get('/:booking_id', getPayment);

export default router;
