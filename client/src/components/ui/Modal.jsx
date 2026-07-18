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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-[scaleIn_0.2s_ease-out] rounded-2xl border border-border bg-surface p-7 shadow-[var(--shadow-lifted)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 id={titleId} className="font-heading text-xl font-semibold tracking-tight text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
