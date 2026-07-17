import { Loader2 } from 'lucide-react'

// One Button component used everywhere, so every button in the app
// shares the same padding, radius, and hover behavior automatically.
// variant controls color, size controls padding.
const variantStyles = {
  primary: 'bg-charcoal text-white hover:bg-charcoal-dark active:scale-[0.98]',
  outline: 'border border-border bg-surface text-text-primary hover:border-text-secondary/40 hover:bg-surface-alt active:scale-[0.98]',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-alt active:scale-[0.98]',
  danger: 'bg-error text-white hover:bg-error/90 active:scale-[0.98]',
}

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
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
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium
        transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
