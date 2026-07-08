// Custom error class so we can throw an error with an HTTP status code
// attached. The error middleware reads statusCode to send the right response.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
