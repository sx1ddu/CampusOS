import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { Spinner } from '../../components/ui/Spinner'

// Runs the verification call automatically as soon as this page loads -
// the user just clicked the link from their email, no button needed.
export function VerifyEmailPage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const hasVerified = useRef(false)

  useEffect(() => {
    // Verification tokens are single-use on the backend. React's Strict
    // Mode runs effects twice in development, which would burn the token
    // on the first call and fail on the second without this guard.
    if (hasVerified.current) return
    hasVerified.current = true

    authApi
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center py-6">
        <Spinner size={28} />
        <p className="mt-3 text-sm text-text-secondary">Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-success" size={40} />
        <h1 className="mt-3 font-heading text-xl font-semibold tracking-tight text-text-primary">Email verified!</h1>
        <p className="mt-1 text-sm text-text-secondary">You can now log in to your account.</p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-sage-dark hover:underline">
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <XCircle className="mx-auto text-error" size={40} />
      <h1 className="mt-3 font-heading text-xl font-semibold tracking-tight text-text-primary">Verification failed</h1>
      <p className="mt-1 text-sm text-text-secondary">This link may be invalid or expired.</p>
    </div>
  )
}
