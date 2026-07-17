import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { GoogleButton } from '../../components/ui/GoogleButton'
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema } from '../../utils/validators'

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    try {
      await login(values.email, values.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password')
    }
  }

  async function handleGoogleSuccess(idToken) {
    try {
      await loginWithGoogle(idToken)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Could not sign in with Google. Please try again.')
    }
  }

  return (
    <AuthSplitLayout>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Log in</h1>
      <p className="mt-2 text-[15px] text-text-secondary">Welcome back. Enter your details below.</p>

      <div className="mt-8">
        <GoogleButton onSuccess={handleGoogleSuccess} text="signin_with" />
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-text-secondary">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" autoComplete="current-password" {...register('password')} error={errors.password?.message} />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-text-secondary hover:text-text-primary">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-8 text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthSplitLayout>
  )
}

