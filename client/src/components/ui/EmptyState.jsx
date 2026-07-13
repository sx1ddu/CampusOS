// Shown instead of a list when there's genuinely no data yet -
// e.g. "You haven't booked anything." Takes any Lucide icon as a prop.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      {Icon && <Icon size={36} className="mb-3 text-text-secondary" />}
      <h3 className="font-heading text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
