import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Avatar } from '../../components/ui/Avatar'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { Pagination } from '../../components/ui/Pagination'
import { adminApi } from '../../api/adminApi'
import { useAuth } from '../../hooks/useAuth'
import { AdminTabs } from '../../components/layout/AdminTabs'

const roleOptions = [
  { value: '', label: 'All roles' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
]

// Lets an admin search/filter every account, promote or demote roles,
// and suspend or reinstate accounts - all against the /admin/users API.
export function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, page],
    queryFn: () => adminApi.getUsers({ search: search || undefined, role: role || undefined, page, limit: 10 }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role: newRole }) => adminApi.updateUserRole(id, newRole),
    onSuccess: () => {
      toast.success('Role updated')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update role'),
  })

  const statusMutation = useMutation({
    mutationFn: (id) => adminApi.toggleUserStatus(id),
    onSuccess: (res) => {
      toast.success(res.data.message)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update status'),
  })

  const users = data?.data?.data?.users || []
  const totalPages = data?.data?.data?.totalPages || 1

  return (
    <>
      <AdminTabs />
      <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Users</h1>
      <p className="mt-1 text-sm text-text-secondary">Manage accounts, roles, and access.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-11"
          />
        </div>
        <Select
          options={roleOptions}
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            setPage(1)
          }}
          className="sm:w-48"
        />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}

        {!isLoading && users.length === 0 && (
          <EmptyState icon={Users} title="No users found" description="Try a different search or filter." />
        )}

        {users.map((u) => (
          <Card key={u._id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar src={u.avatar} name={u.name} size={40} />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {u.name}
                  {u._id === currentUser?.id && <span className="ml-2 text-xs text-text-secondary">(you)</span>}
                </p>
                <p className="text-sm text-text-secondary">{u.email}</p>
              </div>
              <Badge variant={u.role === 'admin' ? 'sage' : 'neutral'}>{u.role}</Badge>
              {u.isDeleted && <Badge variant="error">suspended</Badge>}
            </div>

            {u._id !== currentUser?.id && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => roleMutation.mutate({ id: u._id, role: u.role === 'admin' ? 'student' : 'admin' })}
                  isLoading={roleMutation.isPending && roleMutation.variables?.id === u._id}
                >
                  {u.role === 'admin' ? 'Make student' : 'Make admin'}
                </Button>
                <Button
                  variant={u.isDeleted ? 'primary' : 'danger'}
                  size="sm"
                  onClick={() => statusMutation.mutate(u._id)}
                  isLoading={statusMutation.isPending && statusMutation.variables === u._id}
                >
                  {u.isDeleted ? 'Reinstate' : 'Suspend'}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {!isLoading && users.length > 0 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
    </>
  )
}
