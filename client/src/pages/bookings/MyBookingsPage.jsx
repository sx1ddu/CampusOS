import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { BookingCard } from '../../components/feature/BookingCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { RoleTabs } from '../../components/ui/RoleTabs'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { openRazorpayCheckout } from '../../utils/razorpay'
import { useAuth } from '../../hooks/useAuth'

const tabs = [
  { key: 'client', label: 'As Client' },
  { key: 'provider', label: 'As Provider' },
]

export function MyBookingsPage() {
  const [role, setRole] = useState('client')
  const [payingId, setPayingId] = useState(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings', role],
    queryFn: () => bookingApi.getMyBookings(role),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingApi.updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success('Booking updated')
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update booking'),
  })

  async function handlePay(booking) {
    setPayingId(booking._id)
    try {
      const { data: orderRes } = await paymentApi.createOrder({ bookingId: booking._id })
      const { order } = orderRes.data

      const paymentResult = await openRazorpayCheckout({
        order,
        name: 'CampusOS',
        description: booking.service?.title,
        prefill: { name: user?.name, email: user?.email },
      })

      await paymentApi.verifyPayment({
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      })

      toast.success('Payment successful')
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment failed')
    } finally {
      setPayingId(null)
    }
  }

  const bookings = data?.data?.data || []

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-text-primary">My Bookings</h1>

      <div className="mt-4">
        <RoleTabs tabs={tabs} active={role} onChange={setRole} />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}

        {!isLoading && bookings.length === 0 && (
          <EmptyState icon={CalendarCheck} title="No bookings yet" description="Bookings you make or receive will show up here." />
        )}

        {bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            viewAs={role}
            onUpdateStatus={(id, status) => statusMutation.mutate({ id, status })}
            isUpdating={statusMutation.isPending}
            onPay={() => handlePay(booking)}
            isPaying={payingId === booking._id}
          />
        ))}
      </div>
    </div>
  )
}
