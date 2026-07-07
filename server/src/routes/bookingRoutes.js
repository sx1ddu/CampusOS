import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
