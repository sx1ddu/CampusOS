// Wraps every successful response in the same shape:
// { success, statusCode, message, data }. Keeps API responses consistent.
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
