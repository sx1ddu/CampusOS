import { Link, useLocation } from 'react-router-dom'
import { Wrench, PackageSearch, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/ui/Logo'

const highlights = [
  { icon: Wrench, text: 'Offer a skill and get booked by students on your campus.' },
  { icon: PackageSearch, text: 'Rent out spare items, or find what you need for less.' },
  { icon: ShieldCheck, text: 'Every account is a verified student - reviews keep it honest.' },
]

// Full-page layout used by Login and Register. Left side is plain
// marketing copy sitting directly on the page background (no card, no
// dark panel) - right side is a floating white card that holds the
// actual form, passed in as children. Mobile only shows the card.
export function AuthSplitLayout({ children }) {
  const location = useLocation()

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[55%_45%]">
      {/* Marketing side - hidden below lg, no box or border, just type and space */}
      <div className="hidden flex-col justify-center bg-surface-alt/60 px-16 py-14 lg:flex xl:px-24">
        <Link to="/" className="mb-14 inline-flex w-fit items-center text-text-primary">
          <Logo size="lg" />
        </Link>

        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-secondary">Campus Marketplace</p>
        <h1 className="mt-5 max-w-lg font-heading text-5xl font-semibold leading-[1.1] tracking-tight text-text-primary">
          Everything your campus needs, in one calm place.
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-text-secondary">
          CampusOS brings services, rentals, and bookings together in a single trusted space -
          built exclusively for verified students.
        </p>

        <div className="mt-14 space-y-6">
          {highlights.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-subtle)]">
                <Icon size={16} className="text-text-primary" />
              </div>
              <p className="pt-1.5 text-[15px] leading-relaxed text-text-secondary">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form side - the only thing visible on mobile, a floating card on desktop */}
      <div className="flex flex-col items-center justify-center px-6 py-14 sm:px-12 lg:items-start lg:px-16">
        <Link to="/" className="mb-8 inline-flex w-fit items-center text-text-primary lg:hidden">
          <Logo size="lg" />
        </Link>

        <div
          key={location.pathname}
          className="w-full max-w-[460px] animate-[fadeSlideUp_0.35s_ease-out] rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-lifted)] sm:p-10 lg:mx-auto"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
