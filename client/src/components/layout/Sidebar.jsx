import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  PackageCheck,
  Heart,
  Bell,
  Settings,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export const dashboardLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/my-services', label: 'My Services', icon: Wrench },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/dashboard/rentals', label: 'My Rentals', icon: PackageCheck },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

// Left navigation for the logged-in dashboard area. A separate "Admin"
// link only shows up for admin accounts, mirroring the backend's
// role-based route protection.
export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border px-4 py-10 md:block">
      <nav className="flex flex-col gap-1">
        {dashboardLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-charcoal text-white'
                  : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `mt-4 flex items-center gap-3 rounded-xl border-t border-border px-3.5 pt-5 text-sm font-medium transition-colors duration-150 ${
                isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            <ShieldAlert size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
