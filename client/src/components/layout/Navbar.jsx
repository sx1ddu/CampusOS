import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { ConfirmDialog } from '../ui/ConfirmDialog'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
]

// The main navbar, used on every page. Apple-style: black, thin,
// fixed to the top, and gains a touch of blur/opacity once the page
// has been scrolled - never oversized, never in the way.
export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleConfirmLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
      setLogoutOpen(false)
      setMobileOpen(false)
      navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-charcoal text-white transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-charcoal/90 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-white" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop links - each gets a thin white underline that grows in
            from the center on hover/active, Apple-nav style. */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `group relative py-1 text-[13px] font-medium tracking-wide transition-colors hover:text-white ${
                  isActive ? 'text-white' : 'text-white/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-white transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard/notifications"
                className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2" aria-label="Dashboard">
                <Avatar src={user.avatar} name={user.name} size={30} />
              </Link>
              <Button variant="outline" size="sm" onClick={() => setLogoutOpen(true)} className="border-white/25 bg-transparent text-white hover:bg-white/10">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    Log in
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-white !text-charcoal hover:bg-surface-alt border border-white/20"
                  >
                    Sign up
                  </Button>
                </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-full p-1.5 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-charcoal px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/85"
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white/85">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={() => setLogoutOpen(true)} className="w-full border-white/25 bg-transparent text-white hover:bg-white/10">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-white/25 bg-transparent text-white hover:bg-white/10">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full bg-white text-charcoal hover:bg-white/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Log out"
        message={`Are you sure you want to logout from ${user?.name ? `${user.name}'s` : 'your'} account?`}
        isLoading={isLoggingOut}
      />
    </header>
  )
}
