import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/logo.png'

// Centered card layout used for Login, Register, Forgot/Reset Password,
// and Verify Email - keeps all the auth pages visually consistent.
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex justify-center">
          <img src={logo} alt="CampusOS" className="h-9 w-auto" />
        </Link>
        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
