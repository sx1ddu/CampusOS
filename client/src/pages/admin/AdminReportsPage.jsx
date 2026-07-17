import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { reportApi } from '../../api/reportApi'
import { formatDate } from '../../utils/formatDate'
import { REPORT_STATUS } from '../../constants/enums'

export function AdminReportsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportApi.getReports(),
  })

  const resolveMutation = useMutation({
    mutationFn: (id) => reportApi.resolveReport(id),
    onSuccess: () => {
      toast.success('Report resolved')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: () => toast.error('Could not resolve report'),
  })

  const reports = data?.data?.data || []

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Reports</h1>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}

        {!isLoading && reports.length === 0 && (
          <EmptyState icon={ShieldAlert} title="No reports" description="Nothing has been reported yet." />
        )}

        {reports.map((report) => (
          <Card key={report._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium capitalize text-text-primary">
                  {report.targetType} reported by {report.reporter?.name}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{report.reason}</p>
                <p className="mt-1 text-xs text-text-secondary">{formatDate(report.createdAt)}</p>
              </div>
              <Badge variant={report.status === REPORT_STATUS.OPEN ? 'warning' : 'success'}>{report.status}</Badge>
            </div>
            {report.status === REPORT_STATUS.OPEN && (
              <Button size="sm" className="mt-3" onClick={() => resolveMutation.mutate(report._id)} isLoading={resolveMutation.isPending}>
                Mark Resolved
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
