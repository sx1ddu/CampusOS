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
          className={`w-full appearance-none rounded-xl border bg-surface px-4 py-3 pr-10 text-[15px] text-text-primary
            transition-shadow duration-150
            focus:outline-none focus:ring-4 focus:ring-text-primary/[0.06] focus:border-text-primary/40
            ${error ? 'border-error' : 'border-border'} ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary" />
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
})
