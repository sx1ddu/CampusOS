// A small custom error class so we can throw errors with a status code
// attached, and our error middleware knows what status to send back.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
