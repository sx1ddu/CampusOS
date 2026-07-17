// Shown instead of a list when there's genuinely no data yet -
// e.g. "You haven't booked anything." Takes any Lucide icon as a prop.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/50 py-20 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-secondary shadow-[var(--shadow-subtle)]">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-heading text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
