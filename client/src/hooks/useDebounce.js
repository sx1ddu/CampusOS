import { useState, useEffect } from 'react'

// Delays updating a value until the user stops typing for `delay` ms.
// Used on search inputs so we don't fire an API request on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer) // cancel the previous timer if value changes again
  }, [value, delay])

  return debouncedValue
}
