// All the fixed string values used in the app live here.
// Keeping them in one place avoids typos like "Pending" vs "pending"
// scattered across different files.

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const RENTAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
  COMPLETED: 'completed',
};

export const PAYMENT_STATUS = {
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
};

export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const NOTIFICATION_TYPES = {
  BOOKING_UPDATE: 'booking_update',
  RENTAL_UPDATE: 'rental_update',
  PAYMENT_SUCCESS: 'payment_success',
  NEW_REVIEW: 'new_review',
  REPORT_UPDATE: 'report_update',
};

export const FAVORITE_TYPES = {
  SERVICE: 'service',
  RESOURCE: 'resource',
};

export const REPORT_TYPES = {
  SERVICE: 'service',
  RESOURCE: 'resource',
  USER: 'user',
};

export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
};
