import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Wrench, PackageSearch, ShieldCheck, Star } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ServiceCard } from '../../components/feature/ServiceCard'
import { ResourceCard } from '../../components/feature/ResourceCard'
import { Skeleton } from '../../components/ui/Skeleton'
import { serviceApi } from '../../api/serviceApi'
import { resourceApi } from '../../api/resourceApi'

const steps = [
  { title: 'Create your profile', description: 'Sign up with your student email and set up your profile in minutes.' },
  { title: 'Offer or browse', description: 'List a service or item, or browse what other students are already offering.' },
  { title: 'Book and pay securely', description: 'Request a booking and pay safely through Razorpay, right in the app.' },
  { title: 'Review and build trust', description: 'Leave a review after a completed booking and grow your reputation.' },
]

const testimonials = [
  { name: 'Ananya R.', role: 'Design student', quote: 'I found a laptop to rent for my project week within an hour. So much easier than posting in five different groups.' },
  { name: 'Kabir S.', role: 'CSE student', quote: 'I offer React tutoring on weekends now. The booking and payment flow just works.' },
  { name: 'Meera T.', role: 'ECE student', quote: 'Reviews actually make you trust the person you are booking from. Feels safer than random group chats.' },
]

const stats = [
  { value: '1,200+', label: 'Active student accounts' },
  { value: '3,400+', label: 'Bookings completed' },
  { value: '850+', label: 'Items available to rent' },
  { value: '4.8/5', label: 'Average reviewer rating' },
]

// Fetches the first few active services/resources to show as "Popular"
// on the landing page - reuses the same API calls the Browse pages use.
export function LandingPage() {
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', { limit: 3 }],
    queryFn: () => serviceApi.getServices({ limit: 3 }),
  })
  const { data: resourcesData, isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources', { limit: 3 }],
    queryFn: () => resourceApi.getResources({ limit: 3 }),
  })

  const services = servicesData?.data?.data?.services || []
  const resources = resourcesData?.data?.data?.resources || []

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 text-center sm:pt-36">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-secondary">Built for students, by a student</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-5xl font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-6xl">
          Your campus, one marketplace away.
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">
          CampusOS is where students offer services, rent out spare items, and book from each other &mdash;
          built only for your college community.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/services">
            <Button size="lg" variant="outline">
              Browse Services
            </Button>
          </Link>
        </div>
      </section>

      {/* What is CampusOS / who it's for */}
      <section className="border-y border-border bg-surface-alt py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-3 sm:gap-10">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-subtle)]">
              <Wrench className="text-text-primary" size={20} />
            </div>
            <h3 className="mt-5 font-heading text-base font-semibold text-text-primary">Offer a service</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Tutoring, design, editing, resume help &mdash; turn your skills into income.</p>
          </div>
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-subtle)]">
              <PackageSearch className="text-text-primary" size={20} />
            </div>
            <h3 className="mt-5 font-heading text-base font-semibold text-text-primary">Rent an item</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Cameras, calculators, books &mdash; borrow what you need instead of buying it.</p>
          </div>
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-subtle)]">
              <ShieldCheck className="text-text-primary" size={20} />
            </div>
            <h3 className="mt-5 font-heading text-base font-semibold text-text-primary">Built on trust</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">Reviews and reputation scores keep the whole community accountable.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface-alt py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-text-primary">How it works</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal font-heading text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Popular Services</h2>
            <Link to="/services" className="text-sm font-medium text-text-primary hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72" />)
              : services.map((service) => <ServiceCard key={service._id} service={service} />)}
          </div>
        </div>
      </section>

      {/* Popular resources */}
      <section className="border-t border-border bg-surface-alt py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-text-primary">Popular Resources</h2>
            <Link to="/resources" className="text-sm font-medium text-text-primary hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resourcesLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72" />)
              : resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-text-primary">What students are saying</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-surface p-7 shadow-[var(--shadow-subtle)]">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">&quot;{t.quote}&quot;</p>
                <p className="mt-5 text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-charcoal py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Ready to join your campus marketplace?</h2>
          <p className="mt-4 text-[15px] text-white/60">It takes less than two minutes to create your account.</p>
          <Link to="/register" className="mt-9 inline-block">
            <Button size="lg" className="bg-white text-charcoal hover:bg-white/90">
              Create your account <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
