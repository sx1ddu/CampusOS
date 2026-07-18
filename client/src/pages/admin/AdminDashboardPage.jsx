import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldAlert, ArrowRight, Users, Tag, Flag, Wrench, PackageCheck, CalendarCheck } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { AdminTabs } from '../../components/layout/AdminTabs'
import { adminApi } from '../../api/adminApi'

const links = [
  { to: '/admin/users', label: 'Users', description: 'View, promote, and suspend accounts.', icon: Users },
  { to: '/admin/categories', label: 'Categories', description: 'Manage service and resource categories.', icon: Tag },
  { to: '/admin/reports', label: 'Reports', description: 'Review and resolve moderation reports.', icon: Flag },
]

function StatCard({ icon: Icon, label, value, isLoading }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-6 w-10">
            <Skeleton className="h-6 w-10" />
          </div>
        ) : (
          <p className="font-heading text-xl font-semibold text-text-primary">{value ?? 0}</p>
        )}
      </div>
    </Card>
  )
}

// Admin landing page - a quick snapshot of the marketplace plus links
// into the deeper management tools (users, categories, reports).
export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  })

  const stats = data?.data?.data

  return (
    <>
      <AdminTabs />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-2">
        <ShieldAlert className="text-sage-dark" size={22} />
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Admin Panel</h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Users" value={stats?.totalUsers} isLoading={isLoading} />
        <StatCard icon={Wrench} label="Services" value={stats?.totalServices} isLoading={isLoading} />
        <StatCard icon={PackageCheck} label="Resources" value={stats?.totalResources} isLoading={isLoading} />
        <StatCard icon={CalendarCheck} label="Bookings" value={stats?.totalBookings} isLoading={isLoading} />
        <StatCard icon={PackageCheck} label="Rentals" value={stats?.totalRentals} isLoading={isLoading} />
        <StatCard icon={Flag} label="Open reports" value={stats?.openReports} isLoading={isLoading} />
      </div>

      <div className="mt-8 space-y-3">
        {links.map(({ to, label, description, icon: Icon }) => (
          <Link key={to} to={to} className="block">
            <Card hoverable className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-primary">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-text-primary">{label}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-text-secondary" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
    </>
  )
}
