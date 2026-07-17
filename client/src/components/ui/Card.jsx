// Base wrapper every feature card (ServiceCard, BookingCard, etc.) builds
// on top of, so border/shadow/radius/padding stay identical everywhere.
export function Card({ children, className = '', hoverable = false, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-subtle)]
        ${hoverable ? 'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
