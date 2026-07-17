import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { userApi } from '../../api/userApi'
import { profileSchema } from '../../utils/validators'

export function EditProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => userApi.getMyProfile(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (data?.data?.data) {
      const profile = data.data.data
      reset({
        bio: profile.bio,
        college: profile.college,
        department: profile.department,
        year: profile.year,
      })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (values) => userApi.updateMyProfile(values),
    onSuccess: () => {
      toast.success('Profile updated!')
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      navigate('/dashboard')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update profile'),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Edit Profile</h1>
      <form onSubmit={handleSubmit(mutation.mutate)} className="mt-6 space-y-4">
        <Textarea label="Bio" {...register('bio')} error={errors.bio?.message} />
        <Input label="College" {...register('college')} error={errors.college?.message} />
        <Input label="Department" {...register('department')} error={errors.department?.message} />
        <Input label="Year" type="number" {...register('year')} error={errors.year?.message} />
        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
