import { Bell } from 'lucide-react'
import { timeAgo } from '../../utils/formatDate'

// A single row in the notifications list. Unread ones get a subtle
// sage-tinted background and a small dot, read ones look plain.
export function NotificationCard({ notification, onMarkAsRead }) {
  return (
    <button
      onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
      className={`flex w-full items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors
        ${notification.isRead ? 'bg-surface' : 'bg-sage/5'}`}
    >
      <div className="mt-0.5 rounded-full bg-sage/15 p-2 text-sage-dark">
        <Bell size={14} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-primary">{notification.message}</p>
        <p className="mt-1 text-xs text-text-secondary">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sage-dark" />}
    </button>
  )
}
