// The backend stores money as plain rupee numbers (see Booking.amount,
// Service.price). This just adds the ₹ symbol and comma formatting
// so prices look right everywhere they're shown.
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return ''
  return `₹${Number(amount).toLocaleString('en-IN')}`
}
