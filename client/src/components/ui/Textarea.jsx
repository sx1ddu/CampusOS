import { forwardRef, useId } from 'react'

export const Textarea = forwardRef(function Textarea({ label, error, className = '', ...rest }, ref) {
  const generatedId = useId()
  const inputId = rest.id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={4}
        className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-text-primary
          placeholder:text-text-secondary/60 transition-shadow duration-150
          focus:outline-none focus:ring-4 focus:ring-text-primary/[0.06] focus:border-text-primary/40
          ${error ? 'border-error' : 'border-border'} ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
})
