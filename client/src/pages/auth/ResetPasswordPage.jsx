import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { authApi } from '../../api/authApi'
import { resetPasswordSchema } from '../../utils/validators'

export function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(values) {
    try {
      await authApi.resetPassword(token, values.password)
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset link is invalid or has expired')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Set a new password</h1>
      <p className="mt-1 text-sm text-text-secondary">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input label="New password" type="password" {...register('password')} error={errors.password?.message} />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset password
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
