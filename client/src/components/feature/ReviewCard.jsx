import { Star } from 'lucide-react'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { formatDate } from '../../utils/formatDate'

export function ReviewCard({ review }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <Avatar src={review.reviewer?.avatar} name={review.reviewer?.name} size={32} />
        <div>
          <p className="text-sm font-medium text-text-primary">{review.reviewer?.name}</p>
          <p className="text-xs text-text-secondary">{formatDate(review.createdAt)}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < review.rating ? 'fill-warning text-warning' : 'text-border'} />
        ))}
      </div>

      {review.comment && <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>}
    </Card>
  )
}
