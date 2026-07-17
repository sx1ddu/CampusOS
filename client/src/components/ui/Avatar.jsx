// Shows the user's uploaded photo, or their initial letter on a soft
// background if they haven't uploaded one yet.
export function Avatar({ src, name = '?', size = 40 }) {
  const initial = name.charAt(0).toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full border border-border object-cover"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(size * 0.4, 12) }}
      className="flex items-center justify-center rounded-full bg-surface-alt font-heading font-semibold text-text-secondary"
    >
      {initial}
    </div>
  )
}
