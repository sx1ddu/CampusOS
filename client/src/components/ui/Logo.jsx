// Simple wordmark used in the navbar, footer, and auth screens.
// Built from text rather than an image so it always matches the
// surrounding text color (white on the dark navbar, dark everywhere else)
// with zero contrast issues.
export function Logo({ size = 'md', className = '' }) {
  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }
  const textSizes = {
    sm: 'text-sm',
    md: 'text-[15px]',
    lg: 'text-lg',
  }

  return (
    <span className={`inline-flex items-center gap-2 font-heading font-semibold ${className}`}>
      <span className={`rounded-full bg-current ${dotSizes[size]}`} aria-hidden="true" />
      <span className={`${textSizes[size]} tracking-tight`}>CampusOS</span>
    </span>
  )
}
