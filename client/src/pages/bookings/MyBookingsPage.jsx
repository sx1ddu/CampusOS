import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { BookingCard } from '../../components/feature/BookingCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { RoleTabs } from '../../components/ui/RoleTabs'
import { bookingApi } from '../../api/bookingApi'

const tabs = [
  { key: 'client', label: 'As Client' },
  { key: 'provider', label: 'As Provider' },
]

export function MyBookingsPage() {
  const [role, setRole] = useState('client')
  const queryClient = useQueryClient()

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
          />
        ))}
      </div>
    </div>
  )
}
