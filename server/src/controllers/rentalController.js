import RentalBooking from '../models/RentalBooking.js';
import Resource from '../models/Resource.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { notifyUser } from '../services/notificationService.js';
import { RENTAL_STATUS, NOTIFICATION_TYPES } from '../constants/enums.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Request to rent a resource for a date range
// @route   POST /api/rentals
export const createRental = asyncHandler(async (req, res) => {
  const { resourceId, fromDate, toDate } = req.body;

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (to <= from) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'toDate must be after fromDate');
  }

  const resource = await Resource.findOne({ _id: resourceId, isDeleted: false });
  if (!resource) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Resource not found');
  }

  if (resource.owner.toString() === req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot rent your own resource');
  }

  // Make sure no one else already has this resource booked for these dates.
  const hasConflict = await RentalBooking.hasDateConflict(resourceId, from, to);
  if (hasConflict) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'This resource is already booked for those dates');
  }

  // Work out the total rent based on number of days.
  const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  const amount = days * resource.rentPerDay;

  const rental = await RentalBooking.create({
    resource: resource._id,
    renter: req.user._id,
    owner: resource.owner,
    fromDate: from,
    toDate: to,
    amount,
    depositAmount: resource.depositAmount,
  });

  await notifyUser(resource.owner, NOTIFICATION_TYPES.RENTAL_UPDATE, `New rental request for "${resource.title}"`);

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Rental requested', rental));
});

// @desc    Get rentals for the logged-in user (as renter or owner)
// @route   GET /api/rentals/my?role=renter|owner
export const getMyRentals = asyncHandler(async (req, res) => {
  const role = req.query.role === 'owner' ? 'owner' : 'renter';

  const rentals = await RentalBooking.find({ [role]: req.user._id })
    .populate('resource', 'title rentPerDay')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Rentals fetched', rentals));
});

// @desc    Update rental status (approve, reject, mark returned)
// @route   PUT /api/rentals/:id/status
export const updateRentalStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const rental = await RentalBooking.findById(req.params.id);

  if (!rental) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Rental not found');
  }

  // Only the resource owner can approve, reject, or mark a rental returned.
  const isOwner = rental.owner.toString() === req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Only the resource owner can update this');
  }

  rental.status = status;
  await rental.save();

  // Once the item is returned, make it available for the next renter again.
  if (status === RENTAL_STATUS.RETURNED) {
    await Resource.findByIdAndUpdate(rental.resource, { $set: { isAvailable: true } });
  }

  await notifyUser(rental.renter, NOTIFICATION_TYPES.RENTAL_UPDATE, `Your rental status changed to "${status}"`);

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Rental updated', rental));
});
