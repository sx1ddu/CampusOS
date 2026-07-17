import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { authApi } from '../../api/authApi'

const RESEND_COOLDOWN_SECONDS = 45

// Shown right after signup. The account exists but can't log in yet -
// this just explains that and gives a way to resend the email if it
// never shows up, without letting the user spam the resend button.
export function CheckEmailPage() {
  const location = useLocation()
  const email = location.state?.email
  const [cooldown, setCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function handleResend() {
    if (!email || cooldown > 0) return
    setIsResending(true)
    try {
      await authApi.resendVerification(email)
      toast.success('Verification email sent')
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch {
      toast.error('Could not resend the email. Please try again shortly.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="text-center">
      <MailCheck className="mx-auto text-sage-dark" size={40} />
      <h1 className="mt-3 font-heading text-xl font-semibold tracking-tight text-text-primary">Check your email</h1>
      <p className="mt-2 text-sm text-text-secondary">
        We sent a verification link to{' '}
        <span className="font-medium text-text-primary">{email || 'your email address'}</span>. Click it to
        activate your account.
      </p>

      <Button
        variant="outline"
        size="sm"
        className="mt-6"
        onClick={handleResend}
        isLoading={isResending}
        disabled={!email || cooldown > 0}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
      </Button>

      <p className="mt-6 text-sm text-text-secondary">
        Already verified?{' '}
        <Link to="/login" className="font-medium text-text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
