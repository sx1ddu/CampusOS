import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ProfileCard } from '../../components/feature/ProfileCard'
import { ReviewCard } from '../../components/feature/ReviewCard'
import { Spinner } from '../../components/ui/Spinner'
import { userApi } from '../../api/userApi'
import { reviewApi } from '../../api/reviewApi'

export function ViewProfilePage() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => userApi.getUserProfile(id),
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.getUserReviews(id),
  })

  if (isLoading) return <Spinner className="py-24" size={32} />

  const profile = data?.data?.data
  const reviews = reviewsData?.data?.data || []

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <ProfileCard user={profile?.user} profile={profile} />

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-text-primary">Reviews</h2>
        <div className="mt-4 space-y-3">
          {reviews.length === 0 && <p className="text-sm text-text-secondary">No reviews yet.</p>}
          {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
        </div>
      </div>
    </div>
  )
}
