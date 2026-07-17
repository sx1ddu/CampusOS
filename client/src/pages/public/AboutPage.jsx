import { GraduationCap, HandCoins, ShieldCheck } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-secondary">About</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-text-primary">About CampusOS</h1>
      <p className="mt-6 text-lg leading-relaxed text-text-secondary">
        CampusOS is a marketplace built only for college students. Instead of relying on scattered WhatsApp
        groups or Facebook posts to find help or rent items on campus, students can use one trusted platform
        to offer skills, rent out spare items, book from each other, and build a reputation along the way.
      </p>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt">
            <GraduationCap className="text-text-primary" size={20} />
          </div>
          <h3 className="mt-4 font-heading text-sm font-semibold text-text-primary">Built for students</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">Every account belongs to a real student on campus.</p>
        </div>
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt">
            <HandCoins className="text-text-primary" size={20} />
          </div>
          <h3 className="mt-4 font-heading text-sm font-semibold text-text-primary">Earn or save money</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">Offer a skill, rent an item, or find one for less.</p>
        </div>
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt">
            <ShieldCheck className="text-text-primary" size={20} />
          </div>
          <h3 className="mt-4 font-heading text-sm font-semibold text-text-primary">Built on trust</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">Reviews and reputation keep the community accountable.</p>
        </div>
      </div>
    </div>
  )
}
