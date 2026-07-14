import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { NotificationCard } from '../../components/feature/NotificationCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { notificationApi } from '../../api/notificationApi'

export function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['myNotifications'],
    queryFn: () => notificationApi.getMyNotifications(),
  })

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myNotifications'] }),
    onError: () => toast.error('Could not mark notification as read'),
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myNotifications'] }),
    onError: () => toast.error('Could not mark notifications as read'),
  })

  const notifications = data?.data?.data || []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-text-primary">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button size="sm" variant="outline" onClick={() => markAllReadMutation.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}

        {!isLoading && notifications.length === 0 && (
          <EmptyState icon={Bell} title="No notifications yet" description="Updates about your bookings and rentals will show up here." />
        )}

        {notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onMarkAsRead={(id) => markReadMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  )
}
