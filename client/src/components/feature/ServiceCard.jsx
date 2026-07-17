import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { formatCurrency } from '../../utils/formatCurrency'

// One listing on the Browse Services page. Wrapped in Card so it
// automatically matches every other card's border/shadow/radius.
export function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service._id}`}>
      <Card hoverable className="flex h-full flex-col">
        <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-surface-alt">
          {service.images?.[0] && (
            <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover" />
          )}
        </div>

        <h3 className="font-heading text-base font-semibold text-text-primary line-clamp-1">{service.title}</h3>
        <p className="mt-1 flex-1 text-sm text-text-secondary line-clamp-2">{service.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={service.provider?.avatar} name={service.provider?.name} size={24} />
            <span className="text-xs text-text-secondary">{service.provider?.name}</span>
          </div>
          {service.avgRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Star size={13} className="fill-warning text-warning" />
              {service.avgRating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="mt-3 border-t border-border pt-3 font-heading text-xl font-semibold tracking-tight text-text-primary">
          {formatCurrency(service.price)}
        </div>
      </Card>
    </Link>
  )
}
