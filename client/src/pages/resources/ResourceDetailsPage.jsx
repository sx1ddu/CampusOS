import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, Flag, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner } from '../../components/ui/Spinner'
import { resourceApi } from '../../api/resourceApi'
import { rentalApi } from '../../api/rentalApi'
import { favoriteApi } from '../../api/favoriteApi'
import { reportApi } from '../../api/reportApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAuth } from '../../hooks/useAuth'

export function ResourceDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rentalOpen, setRentalOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reportReason, setReportReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceApi.getResourceById(id),
  })

  const rentalMutation = useMutation({
    mutationFn: () => rentalApi.createRental({ resourceId: id, fromDate, toDate }),
    onSuccess: () => {
      toast.success('Rental requested!')
      setRentalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['myRentals'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create rental'),
  })

  const favoriteMutation = useMutation({
    mutationFn: () => favoriteApi.addFavorite('resource', id),
    onSuccess: () => toast.success('Added to favorites'),
    onError: (error) => toast.error(error.response?.data?.message || 'Could not add favorite'),
  })

  const reportMutation = useMutation({
    mutationFn: () => reportApi.createReport({ targetType: 'resource', targetId: id, reason: reportReason }),
    onSuccess: () => {
      toast.success('Report submitted')
      setReportOpen(false)
    },
    onError: () => toast.error('Could not submit report'),
  })

  // No dedicated "My Resources" list exists on the backend, so owners
  // manage their listing directly from this page instead.
  const deleteMutation = useMutation({
    mutationFn: () => resourceApi.deleteResource(id),
    onSuccess: () => {
      toast.success('Resource deleted')
      navigate('/resources')
    },
    onError: () => toast.error('Could not delete resource'),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  const resource = data?.data?.data
  if (!resource) return null

  const isOwner = user?._id === resource.owner?._id

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="aspect-video overflow-hidden rounded-2xl bg-surface-alt">
        {resource.images?.[0] && <img src={resource.images[0]} alt={resource.title} className="h-full w-full object-cover" />}
      </div>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">{resource.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
            <Avatar src={resource.owner?.avatar} name={resource.owner?.name} size={22} />
            {resource.owner?.name}
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

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{resource.description}</p>

      {resource.depositAmount > 0 && (
        <p className="mt-2 text-sm text-text-secondary">Refundable deposit: {formatCurrency(resource.depositAmount)}</p>
      )}

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
        <span className="font-heading text-3xl font-semibold tracking-tight text-text-primary">
          {formatCurrency(resource.rentPerDay)}
          <span className="text-sm font-normal text-text-secondary"> / day</span>
        </span>
        {user?._id !== resource.owner?._id && <Button onClick={() => setRentalOpen(true)}>Rent Now</Button>}
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/resources/${id}/edit`}>
              <Button variant="outline">
                <Pencil size={15} /> Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        message="This will remove the listing from the marketplace. This can't be undone."
        isLoading={deleteMutation.isPending}
      />

      <Modal isOpen={rentalOpen} onClose={() => setRentalOpen(false)} title="Rent this item">
        <div className="space-y-4">
          <Input label="From date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input label="To date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <Button className="mt-4 w-full" onClick={() => rentalMutation.mutate()} isLoading={rentalMutation.isPending}>
          Confirm Rental
        </Button>
      </Modal>

      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report this resource">
        <Textarea label="Reason" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
        <Button className="mt-4 w-full" variant="danger" onClick={() => reportMutation.mutate()} isLoading={reportMutation.isPending}>
          Submit Report
        </Button>
      </Modal>
    </div>
  )
}
