import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Runs after express-validator's check() rules on a route.
// If any rule failed, this stops the request with a clear message.
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstError);
  }
  next();
};
