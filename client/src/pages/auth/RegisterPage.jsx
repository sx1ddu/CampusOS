import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthSplitLayout } from '../../layouts/AuthSplitLayout'
import { authApi } from '../../api/authApi'
import { registerSchema } from '../../utils/validators'

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values) {
    try {
      await authApi.register(values)
      toast.success('Account created! Check your email to verify it.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <AuthSplitLayout>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Create your account</h1>
      <p className="mt-2 text-[15px] text-text-secondary">Join your campus marketplace in a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5">
        <Input label="Full name" autoComplete="name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Input label="College" autoComplete="organization" {...register('college')} error={errors.college?.message} />
        <Input label="Password" type="password" autoComplete="new-password" {...register('password')} error={errors.password?.message} />

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
