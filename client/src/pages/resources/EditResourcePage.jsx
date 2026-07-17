import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { resourceApi } from '../../api/resourceApi'
import { resourceSchema } from '../../utils/validators'

export function EditResourcePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceApi.getResourceById(id),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resourceSchema) })

  useEffect(() => {
    if (data?.data?.data) {
      const resource = data.data.data
      reset({
        title: resource.title,
        description: resource.description,
        category: resource.category?._id,
        rentPerDay: resource.rentPerDay,
        depositAmount: resource.depositAmount,
      })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (values) => resourceApi.updateResource(id, values),
    onSuccess: () => {
      toast.success('Resource updated!')
      queryClient.invalidateQueries({ queryKey: ['resource', id] })
      navigate('/resources')
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update resource'),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Edit Resource</h1>
      <form onSubmit={handleSubmit(mutation.mutate)} className="mt-6 space-y-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Textarea label="Description" {...register('description')} error={errors.description?.message} />
        <Input label="Rent per day (₹)" type="number" {...register('rentPerDay')} error={errors.rentPerDay?.message} />
        <Input label="Deposit amount (₹)" type="number" {...register('depositAmount')} error={errors.depositAmount?.message} />
        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
