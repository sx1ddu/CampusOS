import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <img src={logo} alt="CampusOS" className="h-7 w-auto" />
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              A campus marketplace where students offer services, rent items, and build trust with each other.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">Explore</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/services" className="hover:text-text-primary">Services</Link></li>
              <li><Link to="/resources" className="hover:text-text-primary">Resources</Link></li>
              <li><Link to="/about" className="hover:text-text-primary">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">Account</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/login" className="hover:text-text-primary">Log in</Link></li>
              <li><Link to="/register" className="hover:text-text-primary">Sign up</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-text-secondary">
          © {new Date().getFullYear()} CampusOS. Built by a student, for students.
        </div>
      </div>
    </footer>
  )
}
