import { forwardRef, useId } from 'react'

export const Input = forwardRef(function Input({ label, error, className = '', ...rest }, ref) {
  const generatedId = useId()
  const inputId = rest.id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary/70
          focus:outline-none focus:ring-2 focus:ring-sage/40
          ${error ? 'border-error' : 'border-border'} ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
})
