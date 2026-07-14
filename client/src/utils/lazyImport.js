import { lazy } from 'react'

// Our pages use named exports (e.g. `export function LandingPage`), but
// React.lazy expects a default export. This wraps the dynamic import so
// every page can be lazy-loaded without changing how each page file
// exports its component.
export function lazyImport(factory, name) {
  return lazy(() => factory().then((module) => ({ default: module[name] })))
}
