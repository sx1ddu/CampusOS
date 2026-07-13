// Base wrapper every feature card (ServiceCard, BookingCard, etc.) builds
// on top of, so border/shadow/radius/padding stay identical everywhere.
export function Card({ children, className = '', hoverable = false, ...rest }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 shadow-sm
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
