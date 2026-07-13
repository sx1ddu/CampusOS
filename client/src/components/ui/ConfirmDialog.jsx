import { Modal } from './Modal'
import { Button } from './Button'

// A specific use of Modal for "are you sure?" actions like deleting a
// service or cancelling a booking - keeps that pattern consistent everywhere.
export function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-6 text-sm text-text-secondary">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}
