
// Catch async errors automatically so we don't repeat try/catch in every controller.
// If the controller's promise rejects, the error goes straight to next().
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
