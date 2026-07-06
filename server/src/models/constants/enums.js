

export const USER_ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN: 'admin',
});

export const AUTH_PROVIDERS = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
});

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  DELETED: 'deleted',
});

export const REPUTATION_TIERS = Object.freeze({
  NEW: 'new',
  TRUSTED: 'trusted',
  TOP_RATED: 'top_rated',
});

export const SERVICE_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  PAUSED: 'paused',
  REJECTED: 'rejected',
  DELETED: 'deleted',
});

export const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
});

export const RESOURCE_STATUS = Object.freeze({
  ACTIVE: 'active',
  PAUSED: 'paused',
  REMOVED: 'removed',
});

export const RENTAL_STATUS = Object.freeze({
  REQUESTED: 'requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  RETURNED: 'returned',
  COMPLETED: 'completed',
  LATE: 'late',
  DISPUTED: 'disputed',
});

export const PAYEE_TYPES = Object.freeze({
  BOOKING: 'booking',
  RENTAL: 'rental',
});

export const PAYMENT_STATUS = Object.freeze({
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
});

export const TRANSACTION_TYPES = Object.freeze({
  BOOKING: 'booking',
  RENTAL: 'rental',
});

export const REVIEW_ROLES = Object.freeze({
  CLIENT_TO_PROVIDER: 'client_to_provider',
  PROVIDER_TO_CLIENT: 'provider_to_client',
});

export const NOTIFICATION_TYPES = Object.freeze({
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_COMPLETED: 'booking_completed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  REVIEW_RECEIVED: 'review_received',
  RENTAL_APPROVED: 'rental_approved',
  RENTAL_DUE_SOON: 'rental_due_soon',
  RENTAL_LATE: 'rental_late',
  REPORT_RESOLVED: 'report_resolved',
});

export const FAVORITE_ITEM_TYPES = Object.freeze({
  SERVICE: 'service',
  RESOURCE: 'resource',
  USER: 'user',
});

export const REPORT_TARGET_TYPES = Object.freeze({
  SERVICE: 'service',
  RESOURCE: 'resource',
  USER: 'user',
  REVIEW: 'review',
});

export const REPORT_STATUS = Object.freeze({
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
});

export const REPUTATION_ACTIONS = Object.freeze({
  PROFILE_COMPLETE: 'profile_complete',
  EMAIL_VERIFIED: 'email_verified',
  SERVICE_COMPLETED: 'service_completed',
  FIVE_STAR_REVIEW: 'five_star_review',
  RENTAL_COMPLETED: 'rental_completed',
  CANCELLATION: 'cancellation',
  LATE_RETURN: 'late_return',
  // FIX: seed data / admin tooling had no way to award/deduct points outside
  // the fixed catalog above. This action allows an explicit `points` value
  // to be supplied by the caller instead of being auto-filled.
  MANUAL_ADJUSTMENT: 'manual_adjustment',
});

// Fixed point values per reputation action — kept alongside the enum so the
// scoring rules live in exactly one place. MANUAL_ADJUSTMENT intentionally
// has no fixed value here; callers must supply `points` explicitly for it.
export const REPUTATION_POINTS = Object.freeze({
  [REPUTATION_ACTIONS.PROFILE_COMPLETE]: 10,
  [REPUTATION_ACTIONS.EMAIL_VERIFIED]: 10,
  [REPUTATION_ACTIONS.SERVICE_COMPLETED]: 10,
  [REPUTATION_ACTIONS.FIVE_STAR_REVIEW]: 5,
  [REPUTATION_ACTIONS.RENTAL_COMPLETED]: 5,
  [REPUTATION_ACTIONS.CANCELLATION]: -5,
  [REPUTATION_ACTIONS.LATE_RETURN]: -10,
});

// FIX: model names referenced by refPath-style polymorphic fields
// (Review.transactionModel, Payment.payeeModel, Favorite.itemModel,
// Report.targetModel) were previously hardcoded as raw string arrays
// separately in each model file. Centralizing them here means a model
// rename can't silently desync from a refPath enum in some other file.
export const MODEL_NAMES = Object.freeze({
  USER: 'User',
  PROFILE: 'Profile',
  CATEGORY: 'Category',
  SERVICE: 'Service',
  BOOKING: 'Booking',
  RESOURCE: 'Resource',
  RENTAL_BOOKING: 'RentalBooking',
  REVIEW: 'Review',
  NOTIFICATION: 'Notification',
  PAYMENT: 'Payment',
  FAVORITE: 'Favorite',
  REPORT: 'Report',
  REPUTATION_LOG: 'ReputationLog',
});
