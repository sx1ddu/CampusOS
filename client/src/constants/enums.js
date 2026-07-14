// These mirror the backend's src/constants/enums.js exactly.
// Keeping the same values on both sides means a booking status
// like "pending" always means the same thing everywhere.

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const RENTAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
  COMPLETED: 'completed',
}

export const PAYMENT_STATUS = {
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
}

export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
}

export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
}

// Maps a status value to a Badge color variant.
// Used by BookingCard, ResourceCard, etc. so status colors stay
// consistent everywhere a status is shown.
export const STATUS_BADGE_VARIANT = {
  pending: 'warning',
  accepted: 'success',
  approved: 'success',
  completed: 'success',
  returned: 'success',
  paid: 'success',
  rejected: 'error',
  cancelled: 'error',
  failed: 'error',
  created: 'warning',
  active: 'success',
  inactive: 'neutral',
}
