import { Router } from 'express';
import { getBookings, createBooking, updateBookingStatus, deleteBooking, getBookingSummary } from '../controllers/bookings.controller';

const router = Router();

router.get('/summary', getBookingSummary);
router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
