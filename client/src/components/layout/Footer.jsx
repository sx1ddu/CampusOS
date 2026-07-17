import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Logo className="text-text-primary" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              A campus marketplace where students offer services, rent items, and build trust with each other.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Explore</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/services" className="transition-colors hover:text-text-primary">Services</Link></li>
              <li><Link to="/resources" className="transition-colors hover:text-text-primary">Resources</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-text-primary">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Account</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/login" className="transition-colors hover:text-text-primary">Log in</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-text-primary">Sign up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} CampusOS. Built by a student, for students.</span>
          <span>Made with care for campus communities.</span>
        </div>
      </div>
    </footer>
  )
}
