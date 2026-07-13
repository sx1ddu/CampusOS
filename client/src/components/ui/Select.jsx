import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'

// options is an array of { value, label }
export const Select = forwardRef(function Select({ label, error, options = [], className = '', ...rest }, ref) {
  const generatedId = useId()
  const inputId = rest.id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          ref={ref}
          className={`w-full appearance-none rounded-lg border bg-surface px-3.5 py-2.5 pr-9 text-sm text-text-primary
            focus:outline-none focus:ring-2 focus:ring-sage/40
            ${error ? 'border-error' : 'border-border'} ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
})
