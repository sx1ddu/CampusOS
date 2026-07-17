import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { Spinner } from '../components/ui/Spinner'
import { lazyImport } from '../utils/lazyImport'

const LandingPage = lazyImport(() => import('../pages/public/LandingPage'), 'LandingPage')
const AboutPage = lazyImport(() => import('../pages/public/AboutPage'), 'AboutPage')
const NotFoundPage = lazyImport(() => import('../pages/public/NotFoundPage'), 'NotFoundPage')

const LoginPage = lazyImport(() => import('../pages/auth/LoginPage'), 'LoginPage')
const RegisterPage = lazyImport(() => import('../pages/auth/RegisterPage'), 'RegisterPage')
const ForgotPasswordPage = lazyImport(() => import('../pages/auth/ForgotPasswordPage'), 'ForgotPasswordPage')
const ResetPasswordPage = lazyImport(() => import('../pages/auth/ResetPasswordPage'), 'ResetPasswordPage')
const VerifyEmailPage = lazyImport(() => import('../pages/auth/VerifyEmailPage'), 'VerifyEmailPage')
const CheckEmailPage = lazyImport(() => import('../pages/auth/CheckEmailPage'), 'CheckEmailPage')

const BrowseServicesPage = lazyImport(() => import('../pages/services/BrowseServicesPage'), 'BrowseServicesPage')
const ServiceDetailsPage = lazyImport(() => import('../pages/services/ServiceDetailsPage'), 'ServiceDetailsPage')
const CreateServicePage = lazyImport(() => import('../pages/services/CreateServicePage'), 'CreateServicePage')
const EditServicePage = lazyImport(() => import('../pages/services/EditServicePage'), 'EditServicePage')
const MyServicesPage = lazyImport(() => import('../pages/services/MyServicesPage'), 'MyServicesPage')

const BrowseResourcesPage = lazyImport(() => import('../pages/resources/BrowseResourcesPage'), 'BrowseResourcesPage')
const ResourceDetailsPage = lazyImport(() => import('../pages/resources/ResourceDetailsPage'), 'ResourceDetailsPage')
const CreateResourcePage = lazyImport(() => import('../pages/resources/CreateResourcePage'), 'CreateResourcePage')
const EditResourcePage = lazyImport(() => import('../pages/resources/EditResourcePage'), 'EditResourcePage')

const MyBookingsPage = lazyImport(() => import('../pages/bookings/MyBookingsPage'), 'MyBookingsPage')
const MyRentalsPage = lazyImport(() => import('../pages/bookings/MyRentalsPage'), 'MyRentalsPage')
const DashboardOverviewPage = lazyImport(() => import('../pages/dashboard/DashboardOverviewPage'), 'DashboardOverviewPage')
const FavoritesPage = lazyImport(() => import('../pages/favorites/FavoritesPage'), 'FavoritesPage')
const NotificationsPage = lazyImport(() => import('../pages/notifications/NotificationsPage'), 'NotificationsPage')
const SettingsPage = lazyImport(() => import('../pages/settings/SettingsPage'), 'SettingsPage')

const ViewProfilePage = lazyImport(() => import('../pages/profile/ViewProfilePage'), 'ViewProfilePage')
const EditProfilePage = lazyImport(() => import('../pages/profile/EditProfilePage'), 'EditProfilePage')

const AdminDashboardPage = lazyImport(() => import('../pages/admin/AdminDashboardPage'), 'AdminDashboardPage')
const AdminReportsPage = lazyImport(() => import('../pages/admin/AdminReportsPage'), 'AdminReportsPage')

// Shown briefly while a lazy-loaded page's code is being fetched.
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={28} />
    </div>
  )
}

// All routes for the app live in this one file, so it's easy to see
// the entire site map at a glance instead of hunting through folders.
// Each page is lazy-loaded so the initial bundle only ships the code
// for the page the user actually lands on.
export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public pages - navbar + footer via MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<BrowseServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/resources" element={<BrowseResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/profile/:id" element={<ViewProfilePage />} />

          {/* These need login, but still show the public navbar/footer,
              so they're nested inside MainLayout, wrapped in ProtectedRoute. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/services/new" element={<CreateServicePage />} />
            <Route path="/services/:id/edit" element={<EditServicePage />} />
            <Route path="/resources/new" element={<CreateResourcePage />} />
            <Route path="/resources/:id/edit" element={<EditResourcePage />} />
            <Route path="/profile/me/edit" element={<EditProfilePage />} />
          </Route>
        </Route>

        {/* Login/Register use their own full-page split-screen layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Lighter-weight auth pages - centered card layout, no navbar/footer */}
        <Route element={<AuthLayout />}>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
        </Route>

        {/* Dashboard - sidebar layout, all routes require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/dashboard/my-services" element={<MyServicesPage />} />
            <Route path="/dashboard/bookings" element={<MyBookingsPage />} />
            <Route path="/dashboard/rentals" element={<MyRentalsPage />} />
            <Route path="/dashboard/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Admin - requires login AND the admin role */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
