import User from '../models/User.js';
import Service from '../models/Service.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import RentalBooking from '../models/RentalBooking.js';
import Report from '../models/Report.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ROLES, REPORT_STATUS } from '../constants/enums.js';

// @desc    High-level counts for the admin dashboard landing page
// @route   GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Run every count in parallel instead of one after another.
  const [totalUsers, totalServices, totalResources, totalBookings, totalRentals, openReports] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Service.countDocuments(),
    Resource.countDocuments(),
    Booking.countDocuments(),
    RentalBooking.countDocuments(),
    Report.countDocuments({ status: REPORT_STATUS.OPEN }),
  ]);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Stats fetched', {
      totalUsers,
      totalServices,
      totalResources,
      totalBookings,
      totalRentals,
      openReports,
    })
  );
});

// @desc    List users with search, role filter, and pagination
// @route   GET /api/admin/users?search=&role=&page=&limit=
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    // Match the search term against name or email, case-insensitive.
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Users fetched', {
      users,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
    })
  );
});

// @desc    Promote/demote a user between student and admin
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!Object.values(ROLES).includes(role)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid role');
  }

  // An admin can't accidentally demote themselves and get locked out.
  if (req.params.id === String(req.user._id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot change your own role');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true });
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Role updated', user));
});

// @desc    Suspend or reinstate a user account (soft delete via isDeleted)
// @route   PUT /api/admin/users/:id/status
export const toggleUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'You cannot suspend your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  user.isDeleted = !user.isDeleted;
  await user.save();

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, user.isDeleted ? 'User suspended' : 'User reinstated', user));
});

// @desc    Delete a category (admin only)
// @route   DELETE /api/admin/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Category deleted'));
});
