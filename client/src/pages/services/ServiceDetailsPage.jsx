import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Heart, Flag, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { ReviewCard } from '../../components/feature/ReviewCard'
import { Spinner } from '../../components/ui/Spinner'
import { serviceApi } from '../../api/serviceApi'
import { bookingApi } from '../../api/bookingApi'
import { reviewApi } from '../../api/reviewApi'
import { favoriteApi } from '../../api/favoriteApi'
import { reportApi } from '../../api/reportApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAuth } from '../../hooks/useAuth'

export function ServiceDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [reportReason, setReportReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceApi.getServiceById(id),
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', data?.data?.data?.provider?._id],
    queryFn: () => reviewApi.getUserReviews(data.data.data.provider._id),
    enabled: !!data?.data?.data?.provider?._id,
  })

  const bookingMutation = useMutation({
    mutationFn: () => bookingApi.createBooking({ serviceId: id, scheduledDate }),
    onSuccess: () => {
      toast.success('Booking requested!')
      setBookingOpen(false)
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create booking'),
  })

  const favoriteMutation = useMutation({
    mutationFn: () => favoriteApi.addFavorite('service', id),
    onSuccess: () => toast.success('Added to favorites'),
    onError: (error) => toast.error(error.response?.data?.message || 'Could not add favorite'),
  })

  const reportMutation = useMutation({
    mutationFn: () => reportApi.createReport({ targetType: 'service', targetId: id, reason: reportReason }),
    onSuccess: () => {
      toast.success('Report submitted')
      setReportOpen(false)
    },
    onError: () => toast.error('Could not submit report'),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  const service = data?.data?.data
  if (!service) return null

  const reviews = reviewsData?.data?.data || []

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="aspect-video overflow-hidden rounded-xl bg-surface-alt">
        {service.images?.[0] && <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover" />}
      </div>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">{service.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
            <Avatar src={service.provider?.avatar} name={service.provider?.name} size={22} />
            {service.provider?.name}
            {service.avgRating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-warning text-warning" /> {service.avgRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => favoriteMutation.mutate()} className="rounded-lg border border-border p-2 text-text-secondary hover:text-error" aria-label="Add to favorites">
            <Heart size={18} />
          </button>
          <button onClick={() => setReportOpen(true)} className="rounded-lg border border-border p-2 text-text-secondary hover:text-error" aria-label="Report this listing">
            <Flag size={18} />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{service.description}</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
        <Clock size={15} /> Delivery in {service.deliveryTimeDays} day{service.deliveryTimeDays > 1 ? 's' : ''}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface p-5">
        <span className="font-heading text-2xl font-bold text-text-primary">{formatCurrency(service.price)}</span>
        {user?._id !== service.provider?._id && <Button onClick={() => setBookingOpen(true)}>Book Now</Button>}
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-text-primary">Reviews</h2>
        <div className="mt-4 space-y-3">
          {reviews.length === 0 && <p className="text-sm text-text-secondary">No reviews yet.</p>}
          {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
        </div>
      </div>

      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="Book this service">
        <Input
          label="Preferred date"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />
        <Button className="mt-4 w-full" onClick={() => bookingMutation.mutate()} isLoading={bookingMutation.isPending}>
          Confirm Booking
        </Button>
      </Modal>

      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report this service">
        <Textarea
          label="Reason"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Explain what's wrong with this listing..."
        />
        <Button className="mt-4 w-full" variant="danger" onClick={() => reportMutation.mutate()} isLoading={reportMutation.isPending}>
          Submit Report
        </Button>
      </Modal>
    </div>
  )
}
