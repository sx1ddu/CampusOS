import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { userApi } from '../../api/userApi'
import { useAuth } from '../../hooks/useAuth'
import { profileSchema } from '../../utils/validators'

// One-time onboarding screen shown right after a new account's first
// login. Everything here is optional (Skip always works) - it just
// gives new users a fast way to fill in the details their profile
// page will show to other students.
export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema) })

  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return userApi.updateAvatar(formData)
    },
    onSuccess: (res) => {
      setUser((prev) => ({ ...prev, avatar: res.data.data.avatar }))
    },
    onError: () => toast.error('Could not upload photo'),
  })

  const profileMutation = useMutation({
    mutationFn: ({ skillsInput, ...values }) =>
      userApi.updateMyProfile({
        ...values,
        skills: skillsInput
          ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      }),
    onSuccess: () => {
      toast.success('Profile set up!')
      navigate('/dashboard')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not save profile'),
  })

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Set up your profile</h1>
      <p className="mt-2 text-[15px] text-text-secondary">
        A quick intro helps other students know who they're booking or renting from. You can always change this later.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Avatar src={preview || user?.avatar} name={user?.name} size={64} />
        <label className="cursor-pointer text-sm font-medium text-sage-dark hover:underline">
          {avatarMutation.isPending ? 'Uploading...' : 'Add a photo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <form onSubmit={handleSubmit(profileMutation.mutate)} className="mt-8 space-y-4">
        <Textarea
          label="Bio"
          placeholder="A sentence or two about you"
          {...register('bio')}
          error={errors.bio?.message}
        />
        <Input label="College" {...register('college')} error={errors.college?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Department" {...register('department')} error={errors.department?.message} />
          <Input label="Year" type="number" min={1} max={5} {...register('year')} error={errors.year?.message} />
        </div>
        <Input
          label="Skills"
          placeholder="React, Figma, Excel"
          {...register('skillsInput')}
          error={errors.skillsInput?.message}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
            Skip for now
          </Button>
          <Button type="submit" className="flex-1" isLoading={profileMutation.isPending}>
            Save and continue
          </Button>
        </div>
      </form>
    </div>
  )
}
