import { forwardRef, useId } from 'react'

export const Input = forwardRef(function Input({ label, error, className = '', ...rest }, ref) {
  const generatedId = useId()
  const inputId = rest.id || generatedId
  const errorId = `${inputId}-error`

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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-text-primary
          placeholder:text-text-secondary/60 transition-shadow duration-150
          focus:outline-none focus:ring-4 focus:ring-text-primary/[0.06] focus:border-text-primary/40
          ${error ? 'border-error' : 'border-border'} ${className}`}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 animate-[fadeSlideUp_0.15s_ease-out] text-xs text-error">
          {error}
        </p>
      )}
    </div>
  )
})
