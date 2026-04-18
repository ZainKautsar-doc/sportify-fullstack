import { Router } from 'express';
import { getBookings, createBooking, updateBookingStatus, deleteBooking, getBookingSummary } from '../controllers/bookings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();

router.get('/summary', getBookingSummary);
router.get('/', getBookings);
router.post('/', authMiddleware, createBooking);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
