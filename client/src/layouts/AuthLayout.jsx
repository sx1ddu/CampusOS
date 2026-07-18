import { Link, Outlet } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { PageTransition } from '../components/layout/PageTransition'

// Centered card layout used for the lighter-weight auth screens -
// Forgot/Reset Password and Verify Email. Login and Register use their
// own full-page split-screen layout instead (see LoginPage/RegisterPage).
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-10 flex justify-center text-text-primary">
          <Logo size="lg" />
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-card)]">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  )
}
