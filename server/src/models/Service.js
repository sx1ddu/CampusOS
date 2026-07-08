import mongoose from 'mongoose';
import { SERVICE_STATUS } from '../constants/enums.js';

// Service model - a skill/gig a student offers on the marketplace
// (e.g. "React tutoring", "resume review").
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    deliveryTimeDays: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: [String],
    images: [String],
    status: {
      type: String,
      enum: Object.values(SERVICE_STATUS),
      default: SERVICE_STATUS.ACTIVE,
    },
   
    // Updated whenever a booking/review happens, so we don't have to
    // recalculate the average rating from every review on each page load.
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    // Soft delete - hide the service instead of removing it, since old
    // bookings still need to reference it.
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes to make search, category browsing, and "my services" queries faster.
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ provider: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
