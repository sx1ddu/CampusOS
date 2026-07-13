import { Loader2 } from 'lucide-react'

// One Button component used everywhere, so every button in the app
// shares the same padding, radius, and hover behavior automatically.
// variant controls color, size controls padding.
const variantStyles = {
  primary: 'bg-charcoal text-white hover:bg-charcoal-dark',
  outline: 'border border-border bg-transparent text-text-primary hover:bg-surface-alt',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-alt',
  danger: 'bg-error text-white hover:bg-error/90',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
