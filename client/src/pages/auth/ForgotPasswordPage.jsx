import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { authApi } from '../../api/authApi'
import { forgotPasswordSchema } from '../../utils/validators'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values) {
    // The backend always responds with the same message whether or not
    // the email exists, so we just show that message either way.
    await authApi.forgotPassword(values.email)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Check your email</h1>
        <p className="mt-2 text-sm text-text-secondary">
          If an account exists for that email, we&apos;ve sent a password reset link.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Forgot your password?</h1>
      <p className="mt-1 text-sm text-text-secondary">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link to="/login" className="font-medium text-sage-dark hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
