import express from 'express';
import { createRental, getMyRentals, updateRentalStatus } from '../controllers/rentalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRental);
router.get('/my', protect, getMyRentals);
router.put('/:id/status', protect, updateRentalStatus);

export default router;
