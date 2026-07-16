import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { notifyUser } from '../services/notificationService.js';
import { addReputationPoints } from '../services/reputationService.js';
import { BOOKING_STATUS, SERVICE_STATUS, NOTIFICATION_TYPES } from '../constants/enums.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Request a booking for a service
// @route   POST /api/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, scheduledDate } = req.body;

  const service = await Service.findOne({ _id: serviceId, isDeleted: false, status: SERVICE_STATUS.ACTIVE });
  if (!service) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Service not found or not available for booking');
  }

  if (service.provider.toString() === req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot book your own service');
  }

  // Create a new booking request, copying the current price so it stays
  // fixed even if the provider changes it later.
  const booking = await Booking.create({
    service: service._id,
    client: req.user._id,
    provider: service.provider,
    amount: service.price, // snapshot the price at booking time
    scheduledDate,
  });

  await notifyUser(service.provider, NOTIFICATION_TYPES.BOOKING_UPDATE, `New booking request for "${service.title}"`);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Booking requested', booking));
});

// @desc    Get bookings for the logged-in user (as client or provider)
// @route   GET /api/bookings/my?role=client|provider
export const getMyBookings = asyncHandler(async (req, res) => {
  // Same user can be either the client or the provider - the ?role query
  // param decides which side of the booking we're looking up.
  const role = req.query.role === 'provider' ? 'provider' : 'client';

  const bookings = await Booking.find({ [role]: req.user._id })
    .populate('service', 'title price')
    .populate('client', 'name avatar')
    .populate('provider', 'name avatar')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Bookings fetched', bookings));
});

// @desc    Update booking status (accept, reject, complete, cancel)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found');
  }

  // Check the logged-in user is actually part of this booking.
  const isProvider = booking.provider.toString() === req.user._id.toString();
  const isClient = booking.client.toString() === req.user._id.toString();

  if (!isProvider && !isClient) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You are not part of this booking');
  }

  // Only the provider can accept/reject/complete. Either side can cancel.
  if ([BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.COMPLETED].includes(status) && !isProvider) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Only the provider can do this');
  }

  booking.status = status;
  await booking.save();

  // Reward the provider with reputation points once a booking is completed.
  if (status === BOOKING_STATUS.COMPLETED) {
    await Service.findByIdAndUpdate(booking.service, { $inc: { totalBookings: 1 } });
    await addReputationPoints(booking.provider, 10, 'Completed a booking');
  }

  const notifyTarget = isProvider ? booking.client : booking.provider;
  await notifyUser(notifyTarget, NOTIFICATION_TYPES.BOOKING_UPDATE, `Your booking status changed to "${status}"`);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Booking updated', booking));
});
