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
import { serviceApi } from '../../api/serviceApi'
import { categoryApi } from '../../api/categoryApi'
import { serviceSchema } from '../../utils/validators'

export function CreateServicePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState([])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'service'],
    queryFn: () => categoryApi.getCategories('service'),
  })
  const categories = categoriesData?.data?.data || []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(serviceSchema) })

  const mutation = useMutation({
    mutationFn: (values) => {
      // multipart/form-data is required here because we're sending files -
      // a plain JSON body can't carry the uploaded images.
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => formData.append(key, value))
      images.forEach((file) => formData.append('images', file))
      return serviceApi.createService(formData)
    },
    onSuccess: () => {
      toast.success('Service created!')
      queryClient.invalidateQueries({ queryKey: ['myServices'] })
      navigate('/dashboard/my-services')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create service'),
  })

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-text-primary">List a New Service</h1>
      <form onSubmit={handleSubmit(mutation.mutate)} className="mt-6 space-y-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Textarea label="Description" {...register('description')} error={errors.description?.message} />
        <Select
          label="Category"
          {...register('category')}
          error={errors.category?.message}
          options={[{ value: '', label: 'Select a category' }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
        />
        <Input label="Price (₹)" type="number" {...register('price')} error={errors.price?.message} />
        <Input label="Delivery time (days)" type="number" {...register('deliveryTimeDays')} error={errors.deliveryTimeDays?.message} />

        <div>
          <label htmlFor="service-images" className="mb-1.5 block text-sm font-medium text-text-primary">
            Images (up to 5)
          </label>
          <input
            id="service-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-surface-alt file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Create Service
        </Button>
      </form>
    </div>
  )
}
