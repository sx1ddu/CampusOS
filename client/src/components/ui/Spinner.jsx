import { Loader2 } from 'lucide-react'

// Full-area loading spinner, used for whole-page loading states
// (as opposed to Skeleton, which is used for card-shaped placeholders).
export function Spinner({ size = 24, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-text-secondary" />
    </div>
  )
}
