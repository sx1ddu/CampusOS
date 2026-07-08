import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../constants/enums.js';

// Booking model - a client's request to book a provider's service.
const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Copied from the service's price at booking time, so a later price
    // change by the provider doesn't affect bookings that already happened.
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    scheduledDate: Date,
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes to speed up "my bookings" queries for both clients and providers.
bookingSchema.index({ client: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
