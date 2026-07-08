import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constants/enums.js';

// Payment model - tracks Razorpay payment attempts for bookings and rentals.
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Only one of these two will be set, depending on what is being paid for.
    bookingId: mongoose.Schema.Types.ObjectId,
    rentalId: mongoose.Schema.Types.ObjectId,
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: String,
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
