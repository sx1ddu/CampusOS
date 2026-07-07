import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import RentalBooking from '../models/RentalBooking.js';
import Service from '../models/Service.js';
import Profile from '../models/Profile.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { notifyUser } from '../services/notificationService.js';
import { NOTIFICATION_TYPES } from '../constants/enums.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Leave a review after a completed booking or rental
// @route   POST /api/reviews
export const createReview = asyncHandler(async (req, res) => {
  const { reviewType, bookingId, rating, comment } = req.body;

  const Model = reviewType === 'rental' ? RentalBooking : Booking;
  const transaction = await Model.findById(bookingId);

  if (!transaction) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  }

  const isCompleted = ['completed', 'returned'].includes(transaction.status);
  if (!isCompleted) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You can only review completed bookings');
  }

  // Figure out who the reviewer is reviewing (the "other side").
  const reviewerId = req.user._id.toString();
  const receiver =
    reviewType === 'rental'
      ? transaction.renter.toString() === reviewerId
        ? transaction.owner
        : transaction.renter
      : transaction.client.toString() === reviewerId
      ? transaction.provider
      : transaction.client;

  const review = await Review.create({
    reviewType,
    bookingId,
    reviewer: req.user._id,
    receiver,
    rating,
    comment,
  });

  // Update the receiver's average rating on their profile.
  const profile = await Profile.findOne({ user: receiver });
  if (profile) {
    const reviewCount = await Review.countDocuments({ receiver });
    const allReviews = await Review.find({ receiver });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
    profile.avgRating = Math.round(avg * 10) / 10;
    await profile.save();
  }

  // If this was a service booking, also update the service's rating.
  if (reviewType !== 'rental') {
    const service = await Service.findById(transaction.service);
    if (service) {
      const newTotal = service.totalReviews + 1;
      const newAvg = (service.avgRating * service.totalReviews + rating) / newTotal;
      service.avgRating = Math.round(newAvg * 10) / 10;
      service.totalReviews = newTotal;
      await service.save();
    }
  }

  await notifyUser(receiver, NOTIFICATION_TYPES.NEW_REVIEW, 'You received a new review');

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Review submitted', review));
});

// @desc    Get all reviews received by a user
// @route   GET /api/reviews/user/:id
export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ receiver: req.params.id })
    .populate('reviewer', 'name avatar')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Reviews fetched', reviews));
});
