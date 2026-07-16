import Report from '../models/Report.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { REPORT_STATUS } from '../constants/enums.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    File a report against a service, resource, or user
// @route   POST /api/reports
export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason } = req.body;

  const report = await Report.create({
    reporter: req.user._id,
    targetType,
    targetId,
    reason,
  });

  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'Report submitted', report));
});

// @desc    Get all open reports (admin only)
// @route   GET /api/reports
// Note: the admin-only check happens in the route file via the authorize middleware.
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('reporter', 'name email').sort('-createdAt');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Reports fetched', reports));
});

// @desc    Mark a report as resolved (admin only)
// @route   PUT /api/reports/:id/resolve
export const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { $set: { status: REPORT_STATUS.RESOLVED } }, { new: true });

  if (!report) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Report not found');
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Report resolved', report));
});
