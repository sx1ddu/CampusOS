
// All fixed string values used across the app live here.
// Keeping them in one place avoids typos like "Pending" vs "pending"
// scattered across different files.

// Who can log in - a normal student or an admin.
export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// Lifecycle of a service booking request.
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Lifecycle of renting a physical resource.
export const RENTAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
  COMPLETED: 'completed',
};

// Status of a Razorpay payment attempt.
export const PAYMENT_STATUS = {
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
};

// Whether a service listing is visible in the marketplace.
export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Types of notifications a user can receive.
export const NOTIFICATION_TYPES = {
  BOOKING_UPDATE: 'booking_update',
  RENTAL_UPDATE: 'rental_update',
  PAYMENT_SUCCESS: 'payment_success',
  NEW_REVIEW: 'new_review',
  REPORT_UPDATE: 'report_update',
};

// What kind of item a user can add to favorites.
export const FAVORITE_TYPES = {
  SERVICE: 'service',
  RESOURCE: 'resource',
};

// What kind of item a report can be filed against.
export const REPORT_TYPES = {
  SERVICE: 'service',
  RESOURCE: 'resource',
  USER: 'user',
};

// Status of a moderation report.
export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
};
