import { useLocation } from 'react-router-dom'

// Wraps a layout's <Outlet /> so every page fades and rises gently into
// place on route change, instead of just snapping into view. Keying the
// div on the pathname forces React to remount it on navigation, which
// restarts the CSS animation each time.
export function PageTransition({ children }) {
  const location = useLocation()

  return (
    <div key={location.pathname} className="animate-[fadeSlideUp_0.35s_ease-out]">
      {children}
    </div>
  )
}
