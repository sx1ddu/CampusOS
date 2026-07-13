// Small status pill - color comes from `variant`, which pages usually
// derive from STATUS_BADGE_VARIANT in constants/enums.js.
const variantStyles = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  neutral: 'bg-surface-alt text-text-secondary',
  sage: 'bg-sage/10 text-sage-dark',
}

export function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize
        ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
