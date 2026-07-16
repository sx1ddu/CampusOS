import User from '../models/User.js';
import Profile from '../models/Profile.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// @desc    Get the logged-in user's own profile
// @route   GET /api/users/me
export const getMyProfile = asyncHandler(async (req, res) => {
  // populate() pulls in basic User fields alongside the Profile document.
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email avatar role');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Profile fetched', profile));
});

// @desc    Get any user's public profile
// @route   GET /api/users/:id
export const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.id }).populate('user', 'name avatar');
  if (!profile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Profile fetched', profile));
});

// @desc    Update the logged-in user's profile
// @route   PUT /api/users/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { bio, college, department, year, skills, portfolioLinks } = req.body;

  // Update the profile fields sent in the request body.
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { bio, college, department, year, skills, portfolioLinks } },
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Profile updated', profile));
});

// @desc    Upload/change avatar
// @route   PUT /api/users/me/avatar
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please upload an image');
  }

  // multer-storage-cloudinary already uploaded the file to Cloudinary -
  // req.file.path is the returned image URL, so we just save it on the user.
  const user = await User.findByIdAndUpdate(req.user._id, { $set: { avatar: req.file.path } }, { new: true });

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Avatar updated', { avatar: user.avatar }));
});
