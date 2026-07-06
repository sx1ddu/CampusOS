import mongoose from 'mongoose';
import { SERVICE_STATUS } from '../constants/enums.js';

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ provider: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;