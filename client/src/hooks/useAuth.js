import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Shortcut so components can write `const { user } = useAuth()`
// instead of importing useContext and AuthContext every time.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
