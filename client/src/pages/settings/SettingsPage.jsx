import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { userApi } from '../../api/userApi'
import { authApi } from '../../api/authApi'

// Settings only covers what the backend actually supports: changing your
// avatar, and requesting a password reset email (there's no "change
// password while logged in" endpoint, so we reuse the forgot-password flow).
export function SettingsPage() {
  const { user, setUser } = useAuth()
  const [preview, setPreview] = useState(null)

  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return userApi.updateAvatar(formData)
    },
    onSuccess: (res) => {
      setUser((prev) => ({ ...prev, avatar: res.data.data.avatar }))
      toast.success('Avatar updated')
    },
    onError: () => toast.error('Could not update avatar'),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: () => authApi.forgotPassword(user.email),
    onSuccess: () => toast.success('Password reset email sent'),
    onError: () => toast.error('Could not send reset email'),
  })

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Settings</h1>

      <Card className="mt-6">
        <h3 className="font-heading text-sm font-semibold text-text-primary">Profile picture</h3>
        <div className="mt-3 flex items-center gap-4">
          <Avatar src={preview || user?.avatar} name={user?.name} size={56} />
          <label className="cursor-pointer text-sm font-medium text-sage-dark hover:underline">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="font-heading text-sm font-semibold text-text-primary">Password</h3>
        <p className="mt-1 text-sm text-text-secondary">We&apos;ll email you a link to reset your password.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => resetPasswordMutation.mutate()} isLoading={resetPasswordMutation.isPending}>
          Send reset email
        </Button>
      </Card>
    </div>
  )
}
