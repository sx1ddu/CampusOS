import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { resourceApi } from '../../api/resourceApi'
import { categoryApi } from '../../api/categoryApi'
import { resourceSchema } from '../../utils/validators'

export function CreateResourcePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState([])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'resource'],
    queryFn: () => categoryApi.getCategories('resource'),
  })
  const categories = categoriesData?.data?.data || []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resourceSchema) })

  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => formData.append(key, value))
      images.forEach((file) => formData.append('images', file))
      return resourceApi.createResource(formData)
    },
    onSuccess: () => {
      toast.success('Resource listed!')
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      navigate('/resources')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create resource'),
  })

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-text-primary">List a New Resource</h1>
      <form onSubmit={handleSubmit(mutation.mutate)} className="mt-6 space-y-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Textarea label="Description" {...register('description')} error={errors.description?.message} />
        <Select
          label="Category"
          {...register('category')}
          error={errors.category?.message}
          options={[{ value: '', label: 'Select a category' }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
        />
        <Input label="Rent per day (₹)" type="number" {...register('rentPerDay')} error={errors.rentPerDay?.message} />
        <Input label="Deposit amount (₹)" type="number" {...register('depositAmount')} error={errors.depositAmount?.message} />

        <div>
          <label htmlFor="resource-images" className="mb-1.5 block text-sm font-medium text-text-primary">
            Images (up to 5)
          </label>
          <input
            id="resource-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-surface-alt file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Create Resource
        </Button>
      </form>
    </div>
  )
}
