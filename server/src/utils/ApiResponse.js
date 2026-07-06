// Every successful response from our API follows the same shape:
// { success: true, message, data }
// This makes it predictable for the frontend to consume.
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
