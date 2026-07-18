import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/reports', label: 'Reports' },
]

// Sits at the top of every admin page so an admin can jump between
// sections without going back to the dashboard first.
export function AdminTabs() {
  return (
    <div className="mx-auto flex max-w-3xl gap-6 border-b border-border px-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `relative py-3 text-sm font-medium transition-colors ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {tab.label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-px bg-charcoal" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
