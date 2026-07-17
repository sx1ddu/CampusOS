import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-7xl font-semibold tracking-tight text-text-primary">404</p>
      <h1 className="mt-5 font-heading text-xl font-semibold text-text-primary">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/" className="mt-7">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
