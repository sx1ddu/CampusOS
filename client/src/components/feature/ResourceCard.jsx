import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { formatCurrency } from '../../utils/formatCurrency'

export function ResourceCard({ resource }) {
  return (
    <Link to={`/resources/${resource._id}`}>
      <Card hoverable className="flex h-full flex-col">
        <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-surface-alt">
          {resource.images?.[0] && (
            <img src={resource.images[0]} alt={resource.title} className="h-full w-full object-cover" />
          )}
        </div>

        <h3 className="font-heading text-base font-semibold text-text-primary line-clamp-1">{resource.title}</h3>
        <p className="mt-1 flex-1 text-sm text-text-secondary line-clamp-2">{resource.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <Avatar src={resource.owner?.avatar} name={resource.owner?.name} size={24} />
          <span className="text-xs text-text-secondary">{resource.owner?.name}</span>
        </div>

        <div className="mt-3 border-t border-border pt-3 font-heading text-lg font-bold text-text-primary">
          {formatCurrency(resource.rentPerDay)}
          <span className="text-sm font-normal text-text-secondary"> / day</span>
        </div>
      </Card>
    </Link>
  )
}
