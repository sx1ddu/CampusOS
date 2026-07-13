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
        className="rounded-full object-cover border border-border"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-sage/20 font-heading font-semibold text-sage-dark"
    >
      {initial}
    </div>
  )
}
