// Scores a password from 0-4 using a few simple rules and shows it as
// a small segmented bar under the field, Apple-settings-style.
function scorePassword(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  return score
}

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
const barColors = ['bg-error', 'bg-error', 'bg-warning', 'bg-sage-dark', 'bg-success']

export function PasswordStrength({ password }) {
  if (!password) return null

  const score = scorePassword(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              segment < score ? barColors[score] : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-text-secondary">{labels[score]}</p>
    </div>
  )
}
