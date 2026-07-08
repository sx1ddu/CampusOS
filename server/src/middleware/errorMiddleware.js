import { HTTP_STATUS } from '../constants/httpStatus.js';

// Runs when a route doesn't match anything — converts it into
// a normal error instead of Express's default HTML error page.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};


// Central error handler - every thrown error or next(error) call in the
// app ends up here. Converts common Mongoose errors into clean messages.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  let message = err.message || 'Something went wrong';

  // Mongoose "invalid ObjectId" error
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only send the stack trace in development, not in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
