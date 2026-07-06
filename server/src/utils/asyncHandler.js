// Wraps an async controller function so we don't have to write
// try/catch in every single controller. If the promise rejects,
// the error is passed to Express's error-handling middleware.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
