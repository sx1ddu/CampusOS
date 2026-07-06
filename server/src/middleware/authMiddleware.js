import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import User from '../models/User.js';

// Checks that the request has a valid access token and attaches
// the logged-in user to req.user so later controllers can use it.
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'You must be logged in to do this');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Session expired, please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.isDeleted) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
  }

  req.user = user;
  next();
});

// Restricts a route to specific roles, e.g. authorize('admin').
// Must be used after `protect`, since it needs req.user.
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You are not allowed to perform this action');
    }
    next();
  };
};
