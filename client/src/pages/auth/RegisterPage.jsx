import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { GoogleButton } from '../../components/ui/GoogleButton'
import { PasswordStrength } from '../../components/ui/PasswordStrength'
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout'
import { authApi } from '../../api/authApi'
import { userApi } from '../../api/userApi'
import { useAuth } from '../../hooks/useAuth'
import { registerSchema } from '../../utils/validators'

export function RegisterPage() {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const password = watch('password')

  async function onSubmit(values) {
    try {
      await authApi.register(values)
      // Verification is required before login, so send them to a page that
      // explains that and lets them resend the email if it doesn't arrive.
      navigate('/check-email', { state: { email: values.email } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  async function handleGoogleSuccess(idToken) {
    try {
      // Google sign-up skips email verification entirely (Google already
      // verified the address), so this goes straight into the app - new
      // accounts land on profile setup, returning ones go to the dashboard.
      await loginWithGoogle(idToken)
      toast.success('Account created!')
      try {
        const { data } = await userApi.getMyProfile()
        navigate(data.data.isProfileComplete ? '/dashboard' : '/profile-setup')
      } catch {
        navigate('/dashboard')
      }
    } catch {
      toast.error('Could not sign up with Google. Please try again.')
    }
  }

  return (
    <AuthSplitLayout>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Create your account</h1>
      <p className="mt-2 text-[15px] text-text-secondary">Join your campus marketplace in a minute.</p>

      <div className="mt-8">
        <GoogleButton onSuccess={handleGoogleSuccess} text="signup_with" />
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-text-secondary">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Full name" autoComplete="name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Input label="College" autoComplete="organization" {...register('college')} error={errors.college?.message} />

        <div>
          <Input label="Password" type="password" autoComplete="new-password" {...register('password')} error={errors.password?.message} />
          <PasswordStrength password={password} />
        </div>

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Sign up
        </Button>
      </form>

      <p className="mt-8 text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
