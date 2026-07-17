// Gray placeholder block shown while React Query is loading data.
// Pages compose several of these into the same shape as the real card,
// so the layout doesn't "jump" once the real content arrives.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-surface-alt ${className}`} />
}
