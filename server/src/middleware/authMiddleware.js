import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import User from '../models/User.js';


// Protect this route so only logged-in users with a valid access token can access it.
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'You must be logged in to do this');
  }

  const token = authHeader.split(' ')[1];

  // Verify the JWT is valid and not expired.
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Session expired, please log in again');
  }

  // Attach the logged-in user to the request so later controllers can use req.user.
  const user = await User.findById(decoded.id);
  if (!user || user.isDeleted) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
  }

  req.user = user;
  next();
});

// Restrict a route to specific roles, e.g. authorize('admin').
// Must run after `protect`, since it needs req.user to already be set.
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You are not allowed to perform this action');
    }
    next();
  };
};
