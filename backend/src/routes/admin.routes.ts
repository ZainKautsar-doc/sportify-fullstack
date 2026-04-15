import { Router } from 'express';
import { getAdminStats } from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);

export default router;
