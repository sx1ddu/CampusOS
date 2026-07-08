import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../constants/enums.js';

// Notification model - short alerts shown to a user (e.g. "your booking was accepted").
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// TTL index - MongoDB automatically deletes notifications older than 30 days,
// so this collection doesn't grow forever.
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
// Speeds up "show my unread notifications, newest first".
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
