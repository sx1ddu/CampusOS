import { useEffect, useId, useRef, useState } from 'react'

// Loads the Google Identity Services script once, no matter how many
// times this component mounts (Login and Register both use it).
let scriptPromise = null
function loadGoogleScript() {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return scriptPromise
}

// Renders Google's own "Continue with Google" button (required by
// Google's branding rules) sized to fill its container so it lines
// up with the rest of the form. On success it hands the ID token
// back to the caller, who sends it to POST /api/auth/google.
export function GoogleButton({ onSuccess, text = 'continue_with' }) {
  const containerRef = useRef(null)
  const domId = useId()
  const [failedToLoad, setFailedToLoad] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId) return

    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onSuccess(response.credential),
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          logo_alignment: 'center',
          width: containerRef.current.offsetWidth || 320,
        })
      })
      .catch(() => setFailedToLoad(true))

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  // No client ID configured (e.g. local dev without Google OAuth set up
  // yet) - show a disabled placeholder instead of a broken button.
  if (!clientId || failedToLoad) {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in is not configured yet"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface-alt px-5 py-3 text-[15px] font-medium text-text-secondary opacity-60"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    )
  }

  return <div ref={containerRef} className="w-full [&>div]:!w-full" id={`google-btn-${domId}`} />
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9C16.66 14.2 17.64 11.9 17.64 9.2z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  )
}
