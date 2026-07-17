import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { favoriteApi } from '../../api/favoriteApi'

export function FavoritesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: () => favoriteApi.getMyFavorites(),
  })

  const removeMutation = useMutation({
    mutationFn: (id) => favoriteApi.removeFavorite(id),
    onSuccess: () => {
      toast.success('Removed from favorites')
      queryClient.invalidateQueries({ queryKey: ['myFavorites'] })
    },
    onError: () => toast.error('Could not remove favorite'),
  })

  const favorites = data?.data?.data || []

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Favorites</h1>

      <div className="mt-6 space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}

        {!isLoading && favorites.length === 0 && (
          <EmptyState icon={Heart} title="No favorites yet" description="Items and services you save will appear here." />
        )}

        {favorites.map((favorite) => (
          <Card key={favorite._id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium capitalize text-text-primary">{favorite.itemType}</p>
              <p className="text-xs text-text-secondary">Saved item</p>
            </div>
            <button onClick={() => removeMutation.mutate(favorite._id)} className="text-text-secondary hover:text-error" aria-label="Remove from favorites">
              <X size={18} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
