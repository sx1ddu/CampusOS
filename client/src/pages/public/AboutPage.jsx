import { GraduationCap, HandCoins, ShieldCheck } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-heading text-3xl font-bold text-text-primary">About CampusOS</h1>
      <p className="mt-4 text-text-secondary">
        CampusOS is a marketplace built only for college students. Instead of relying on scattered WhatsApp
        groups or Facebook posts to find help or rent items on campus, students can use one trusted platform
        to offer skills, rent out spare items, book from each other, and build a reputation along the way.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div>
          <GraduationCap className="text-sage-dark" size={28} />
          <h3 className="mt-3 font-heading text-sm font-semibold text-text-primary">Built for students</h3>
          <p className="mt-1 text-sm text-text-secondary">Every account belongs to a real student on campus.</p>
        </div>
        <div>
          <HandCoins className="text-sage-dark" size={28} />
          <h3 className="mt-3 font-heading text-sm font-semibold text-text-primary">Earn or save money</h3>
          <p className="mt-1 text-sm text-text-secondary">Offer a skill, rent an item, or find one for less.</p>
        </div>
        <div>
          <ShieldCheck className="text-sage-dark" size={28} />
          <h3 className="mt-3 font-heading text-sm font-semibold text-text-primary">Built on trust</h3>
          <p className="mt-1 text-sm text-text-secondary">Reviews and reputation keep the community accountable.</p>
        </div>
      </div>
    </div>
  )
}
