import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { serviceApi } from '../../api/serviceApi'
import { serviceSchema } from '../../utils/validators'
import { SERVICE_STATUS } from '../../constants/enums'

export function EditServicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceApi.getServiceById(id),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(serviceSchema) })

  // Once the service loads, fill the form with its current values.
  useEffect(() => {
    if (data?.data?.data) {
      const service = data.data.data
      reset({
        title: service.title,
        description: service.description,
        category: service.category?._id,
        price: service.price,
        deliveryTimeDays: service.deliveryTimeDays,
        status: service.status,
      })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (values) => serviceApi.updateService(id, values),
    onSuccess: () => {
      toast.success('Service updated!')
      queryClient.invalidateQueries({ queryKey: ['service', id] })
      navigate('/dashboard/my-services')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update service'),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Edit Service</h1>
      <form onSubmit={handleSubmit(mutation.mutate)} className="mt-6 space-y-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Textarea label="Description" {...register('description')} error={errors.description?.message} />
        <Input label="Price (₹)" type="number" {...register('price')} error={errors.price?.message} />
        <Input label="Delivery time (days)" type="number" {...register('deliveryTimeDays')} error={errors.deliveryTimeDays?.message} />
        <Select
          label="Status"
          {...register('status')}
          options={Object.values(SERVICE_STATUS).map((s) => ({ value: s, label: s }))}
        />
        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
