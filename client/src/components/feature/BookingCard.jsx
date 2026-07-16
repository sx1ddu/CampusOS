import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { BOOKING_STATUS, STATUS_BADGE_VARIANT } from '../../constants/enums'

// Shown on the My Bookings page. `viewAs` tells us whether the current
// user is the client or the provider, since that changes which action
// buttons make sense (only a provider can accept/reject/complete).
export function BookingCard({ booking, viewAs, onUpdateStatus, isUpdating, onPay, isPaying }) {
  const otherParty = viewAs === 'client' ? booking.provider : booking.client

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-sm font-semibold text-text-primary">{booking.service?.title}</h3>
          <p className="mt-1 text-xs text-text-secondary">
            {viewAs === 'client' ? 'Provider' : 'Client'}: {otherParty?.name}
          </p>
          {booking.scheduledDate && (
            <p className="mt-1 text-xs text-text-secondary">Scheduled: {formatDate(booking.scheduledDate)}</p>
          )}
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[booking.status]}>{booking.status}</Badge>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-heading text-base font-bold text-text-primary">{formatCurrency(booking.amount)}</span>

        {/* Only the provider sees action buttons for a pending booking */}
        {viewAs === 'provider' && booking.status === BOOKING_STATUS.PENDING && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(booking._id, BOOKING_STATUS.REJECTED)} isLoading={isUpdating}>
              Reject
            </Button>
            <Button size="sm" onClick={() => onUpdateStatus(booking._id, BOOKING_STATUS.ACCEPTED)} isLoading={isUpdating}>
              Accept
            </Button>
          </div>
        )}
        {viewAs === 'provider' && booking.status === BOOKING_STATUS.ACCEPTED && (
          <Button size="sm" onClick={() => onUpdateStatus(booking._id, BOOKING_STATUS.COMPLETED)} isLoading={isUpdating}>
            Mark Completed
          </Button>
        )}
        {viewAs === 'client' && booking.status === BOOKING_STATUS.ACCEPTED && !booking.isPaid && (
          <Button size="sm" onClick={onPay} isLoading={isPaying}>
            Pay Now
          </Button>
        )}
      </div>
    </Card>
  )
}
