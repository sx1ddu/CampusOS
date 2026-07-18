import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tag, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { RoleTabs } from '../../components/ui/RoleTabs'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { categoryApi } from '../../api/categoryApi'
import { adminApi } from '../../api/adminApi'
import { AdminTabs } from '../../components/layout/AdminTabs'

const typeTabs = [
  { key: 'service', label: 'Service categories' },
  { key: 'resource', label: 'Resource categories' },
]

// Lets an admin add/remove the categories that populate the dropdowns
// on Create Service and Create Resource forms across the app.
export function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('service')
  const [name, setName] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', type],
    queryFn: () => categoryApi.getCategories(type),
  })

  const createMutation = useMutation({
    mutationFn: () => categoryApi.createCategory({ name, type }),
    onSuccess: () => {
      toast.success('Category added')
      setName('')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not add category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category removed')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: () => toast.error('Could not remove category'),
  })

  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    createMutation.mutate()
  }

  const categories = data?.data?.data || []

  return (
    <>
      <AdminTabs />
      <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Categories</h1>
      <p className="mt-1 text-sm text-text-secondary">Organize the marketplace into browsable categories.</p>

      <div className="mt-6">
        <RoleTabs tabs={typeTabs} active={type} onChange={setType} />
      </div>

      <form onSubmit={handleCreate} className="mt-6 flex gap-3">
        <Input
          placeholder={`New ${type} category name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={createMutation.isPending}>
          <Plus size={16} />
          Add
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}

        {!isLoading && categories.length === 0 && (
          <EmptyState icon={Tag} title="No categories yet" description={`Add the first ${type} category above.`} />
        )}

        {categories.map((category) => (
          <Card key={category._id} className="flex items-center justify-between !p-4">
            <span className="text-sm font-medium text-text-primary">{category.name}</span>
            <button
              onClick={() => deleteMutation.mutate(category._id)}
              disabled={deleteMutation.isPending}
              className="rounded-full p-2 text-text-secondary transition-colors hover:bg-error/10 hover:text-error"
              aria-label={`Delete ${category.name}`}
            >
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>
    </div>
    </>
  )
}
