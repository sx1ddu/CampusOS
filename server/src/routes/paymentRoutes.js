import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes require login - you must be signed in to pay for anything.
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
