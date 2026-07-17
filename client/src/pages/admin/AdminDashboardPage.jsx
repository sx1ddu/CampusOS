import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'

// A simple landing spot for admin-only tools. The backend currently
// only exposes report moderation and category management as admin
// actions, so that's what's linked here - not inventing extra features.
export function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-2">
        <ShieldAlert className="text-sage-dark" size={22} />
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">Admin Panel</h1>
      </div>

      <Link to="/admin/reports" className="mt-6 block">
        <Card hoverable className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm font-semibold text-text-primary">Manage Reports</h3>
            <p className="mt-1 text-sm text-text-secondary">Review and resolve reports filed by students.</p>
          </div>
          <ArrowRight size={18} className="text-text-secondary" />
        </Card>
      </Link>
    </div>
  )
}
