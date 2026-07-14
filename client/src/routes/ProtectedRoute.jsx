import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'

// Wraps routes that require a logged-in user. If the auth check is
// still running (page just refreshed), we show a spinner instead of
// redirecting too early and kicking out an actually-logged-in user.
// requireAdmin also checks the user's role, mirroring the backend's
// authorize('admin') middleware.
export function ProtectedRoute({ requireAdmin = false }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
