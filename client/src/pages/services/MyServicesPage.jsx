import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, Pencil, Trash2, PackageSearch } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Skeleton } from '../../components/ui/Skeleton'
import { serviceApi } from '../../api/serviceApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { STATUS_BADGE_VARIANT } from '../../constants/enums'

export function MyServicesPage() {
  const queryClient = useQueryClient()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['myServices'],
    queryFn: () => serviceApi.getMyServices(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceApi.deleteService(id),
    onSuccess: () => {
      toast.success('Service deleted')
      queryClient.invalidateQueries({ queryKey: ['myServices'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Could not delete service'),
  })

  const services = data?.data?.data || []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">My Services</h1>
        <Link to="/services/new">
          <Button size="sm">
            <Plus size={16} /> New Service
          </Button>
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}

        {!isLoading && services.length === 0 && (
          <EmptyState icon={PackageSearch} title="No services yet" description="Create your first listing to start earning." />
        )}

        {services.map((service) => (
          <Card key={service._id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-text-primary">{service.title}</h3>
                <Badge variant={STATUS_BADGE_VARIANT[service.status]}>{service.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{formatCurrency(service.price)}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/services/${service._id}/edit`}>
                <Button size="sm" variant="outline" aria-label={`Edit ${service.title}`}>
                  <Pencil size={14} />
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => setDeleteTarget(service._id)} aria-label={`Delete ${service.title}`}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        message="This will remove the listing from the marketplace. This can't be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
