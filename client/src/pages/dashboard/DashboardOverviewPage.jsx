import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck, PackageCheck, Wrench, Star, Award } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { userApi } from '../../api/userApi'
import { bookingApi } from '../../api/bookingApi'
import { rentalApi } from '../../api/rentalApi'
import { serviceApi } from '../../api/serviceApi'

// Small stat widget - just a number and a label, reused four times below.
function StatWidget({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-lg bg-sage/15 p-3 text-sage-dark">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-heading text-xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </div>
    </Card>
  )
}

export function DashboardOverviewPage() {
  const { user } = useAuth()

  const { data: profileData } = useQuery({ queryKey: ['myProfile'], queryFn: () => userApi.getMyProfile() })
  const { data: bookingsData } = useQuery({ queryKey: ['myBookings', 'client'], queryFn: () => bookingApi.getMyBookings('client') })
  const { data: rentalsData } = useQuery({ queryKey: ['myRentals', 'renter'], queryFn: () => rentalApi.getMyRentals('renter') })
  const { data: servicesData } = useQuery({ queryKey: ['myServices'], queryFn: () => serviceApi.getMyServices() })

  const profile = profileData?.data?.data

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-text-primary">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-text-secondary">Here&apos;s what&apos;s happening with your CampusOS account.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget icon={Wrench} label="Active Services" value={servicesData?.data?.data?.length || 0} />
        <StatWidget icon={CalendarCheck} label="My Bookings" value={bookingsData?.data?.data?.length || 0} />
        <StatWidget icon={PackageCheck} label="My Rentals" value={rentalsData?.data?.data?.length || 0} />
        <StatWidget icon={Award} label="Reputation" value={profile?.reputationScore || 0} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="font-heading text-sm font-semibold text-text-primary">Your rating</h3>
          <div className="mt-3 flex items-center gap-2">
            <Star size={18} className="fill-warning text-warning" />
            <span className="font-heading text-lg font-bold text-text-primary">{profile?.avgRating?.toFixed(1) || '0.0'}</span>
            <span className="text-sm text-text-secondary">average across all reviews</span>
          </div>
        </Card>
        <Card>
          <h3 className="font-heading text-sm font-semibold text-text-primary">Quick actions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/services/new" className="text-sm font-medium text-sage-dark hover:underline">List a service</Link>
            <span className="text-text-secondary">·</span>
            <Link to="/resources/new" className="text-sm font-medium text-sage-dark hover:underline">List a resource</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
