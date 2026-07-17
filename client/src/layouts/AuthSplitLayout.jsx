import { Link } from 'react-router-dom'
import { ShieldCheck, Wrench, PackageSearch, Star } from 'lucide-react'
import { Logo } from '../components/ui/Logo'

const highlights = [
  { icon: Wrench, text: 'Offer a skill and get booked by students on your campus.' },
  { icon: PackageSearch, text: 'Rent out spare items, or find what you need for less.' },
  { icon: ShieldCheck, text: 'Every account is a verified student - reviews keep it honest.' },
]

// Full-page, 50/50 split layout used by Login and Register. The left
// half is always the form (passed as children); the right half is a
// calm, abstract informational panel describing CampusOS - built with
// plain shapes and type instead of a stock illustration.
export function AuthSplitLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
        <Link to="/" className="mb-12 inline-flex w-fit items-center text-text-primary">
          <Logo size="lg" />
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Info side */}
      <div className="relative hidden overflow-hidden bg-charcoal px-16 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Abstract, subtle geometric backdrop - no stock illustration */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full border border-white" />
          <div className="absolute -right-16 top-1/3 h-64 w-64 rounded-full border border-white" />
          <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full border border-white" />
        </div>

        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">Campus Marketplace</p>
          <h2 className="mt-5 max-w-md font-heading text-4xl font-semibold leading-tight tracking-tight">
            Everything your campus needs, in one calm place.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
            CampusOS brings services, rentals, and bookings together in a single trusted space -
            built exclusively for verified students.
          </p>
        </div>

        <div className="relative space-y-6">
          {highlights.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon size={16} />
              </div>
              <p className="pt-1.5 text-sm leading-relaxed text-white/75">{text}</p>
            </div>
          ))}
        </div>

        <div className="relative flex items-center gap-2 border-t border-white/10 pt-6 text-sm text-white/50">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className="fill-white/60 text-white/60" />
            ))}
          </div>
          Trusted across dozens of campus communities
        </div>
      </div>
    </div>
  )
}
