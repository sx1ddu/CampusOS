import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { PageTransition } from '../components/layout/PageTransition'

// Used for all public pages (landing, about, browse services/resources).
// Every page rendered through this layout automatically gets the same
// navbar and footer, so we never have to repeat them per page.
export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
