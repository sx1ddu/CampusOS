import { X } from 'lucide-react'
import { useEffect, useId } from 'react'

// Generic modal - just handles the overlay, centering, and close button.
// Anything that needs a popup (forms, confirmations) renders inside it.
export function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId()

  // Close on Escape key, and stop the background page from scrolling
  // while the modal is open.
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-xl bg-surface p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 id={titleId} className="font-heading text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
