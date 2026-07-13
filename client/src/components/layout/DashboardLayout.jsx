import { NavLink, Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar, dashboardLinks } from './Sidebar'

// The full Sidebar is hidden below md, so this horizontal, scrollable
// strip is the only way to reach dashboard sub-pages on mobile.
function MobileDashboardNav() {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-border px-6 py-3 md:hidden">
      {dashboardLinks.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `shrink-0 text-sm font-medium ${isActive ? 'text-sage-dark' : 'text-text-secondary'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}

// Shared shell for every /dashboard/* page: navbar on top, sidebar on
// the left, and the actual page content rendered via <Outlet />.
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <MobileDashboardNav />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
