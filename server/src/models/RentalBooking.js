import mongoose from 'mongoose';
import { RENTAL_STATUS } from '../constants/enums.js';

const rentalBookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(RENTAL_STATUS),
      default: RENTAL_STATUS.PENDING,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// A quick check so a resource can't be double-booked for overlapping dates.
rentalBookingSchema.statics.hasDateConflict = async function (resourceId, fromDate, toDate) {
  const conflict = await this.findOne({
    resource: resourceId,
    status: { $in: ['pending', 'approved'] },
    fromDate: { $lt: toDate },
    toDate: { $gt: fromDate },
  });
  return Boolean(conflict);
};

rentalBookingSchema.index({ resource: 1, status: 1 });
rentalBookingSchema.index({ renter: 1 });
rentalBookingSchema.index({ owner: 1 });

const RentalBooking = mongoose.model('RentalBooking', rentalBookingSchema);
export default RentalBooking;
