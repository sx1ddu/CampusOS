import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PackageCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { RoleTabs } from '../../components/ui/RoleTabs'
import { rentalApi } from '../../api/rentalApi'
import { paymentApi } from '../../api/paymentApi'
import { openRazorpayCheckout } from '../../utils/razorpay'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { RENTAL_STATUS, STATUS_BADGE_VARIANT } from '../../constants/enums'

const tabs = [
  { key: 'renter', label: 'As Renter' },
  { key: 'owner', label: 'As Owner' },
]

export function MyRentalsPage() {
  const [role, setRole] = useState('renter')
  const [payingId, setPayingId] = useState(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['myRentals', role],
    queryFn: () => rentalApi.getMyRentals(role),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => rentalApi.updateRentalStatus(id, status),
    onSuccess: () => {
      toast.success('Rental updated')
      queryClient.invalidateQueries({ queryKey: ['myRentals'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update rental'),
  })

  async function handlePay(rental) {
    setPayingId(rental._id)
    try {
      const { data: orderRes } = await paymentApi.createOrder({ rentalId: rental._id })
      const { order } = orderRes.data

      const paymentResult = await openRazorpayCheckout({
        order,
        name: 'CampusOS',
        description: rental.resource?.title,
        prefill: { name: user?.name, email: user?.email },
      })

      await paymentApi.verifyPayment({
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      })

      toast.success('Payment successful')
      queryClient.invalidateQueries({ queryKey: ['myRentals'] })
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment failed')
    } finally {
      setPayingId(null)
    }
  }

  const rentals = data?.data?.data || []

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-text-primary">My Rentals</h1>

      <div className="mt-4">
        <RoleTabs tabs={tabs} active={role} onChange={setRole} />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}

        {!isLoading && rentals.length === 0 && (
          <EmptyState icon={PackageCheck} title="No rentals yet" description="Rentals you make or receive will show up here." />
        )}

        {rentals.map((rental) => (
          <Card key={rental._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-sm font-semibold text-text-primary">{rental.resource?.title}</h3>
                <p className="mt-1 text-xs text-text-secondary">
                  {formatDate(rental.fromDate)} - {formatDate(rental.toDate)}
                </p>
              </div>
              <Badge variant={STATUS_BADGE_VARIANT[rental.status]}>{rental.status}</Badge>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-heading text-base font-bold text-text-primary">{formatCurrency(rental.amount)}</span>

              {role === 'owner' && rental.status === RENTAL_STATUS.PENDING && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: rental._id, status: RENTAL_STATUS.REJECTED })}>
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => statusMutation.mutate({ id: rental._id, status: RENTAL_STATUS.APPROVED })}>
                    Approve
                  </Button>
                </div>
              )}
              {role === 'owner' && rental.status === RENTAL_STATUS.APPROVED && (
                <Button size="sm" onClick={() => statusMutation.mutate({ id: rental._id, status: RENTAL_STATUS.RETURNED })}>
                  Mark Returned
                </Button>
              )}
              {role === 'renter' && rental.status === RENTAL_STATUS.APPROVED && !rental.isPaid && (
                <Button size="sm" onClick={() => handlePay(rental)} isLoading={payingId === rental._id}>
                  Pay Now
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
