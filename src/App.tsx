import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import PremiumLayout from './components/premium/PremiumLayout'

// Premium membership site
const PremiumHome  = lazy(() => import('./pages/premium/Home'))
const Philosophy   = lazy(() => import('./pages/premium/Philosophy'))
const Services     = lazy(() => import('./pages/premium/Services'))
const Coaches      = lazy(() => import('./pages/premium/Coaches'))
const Apply        = lazy(() => import('./pages/premium/Apply'))

// Legacy skills marketplace
const Skills       = lazy(() => import('./pages/Skills'))
const Social       = lazy(() => import('./pages/Social'))
const ProfilePage  = lazy(() => import('./pages/ProfilePage'))
const Chat         = lazy(() => import('./pages/Chat'))
const Meetups      = lazy(() => import('./pages/Meetups'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Contact      = lazy(() => import('./pages/Contact'))
const HowItWorks   = lazy(() => import('./pages/HowItWorks'))
const EditProfile  = lazy(() => import('./pages/EditProfile'))
const Login        = lazy(() => import('./pages/Login'))
const Signup       = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword  = lazy(() => import('./pages/ResetPassword'))
const AuthCallback   = lazy(() => import('./pages/AuthCallback'))
const Subscribe      = lazy(() => import('./pages/Subscribe'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    } else {
      try {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView()
      } catch {}
    }
  }, [pathname, hash])
  return null
}

function LegacyLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<PremiumLayout />}>
            <Route path="/" element={<PremiumHome />} />
            <Route path="/philosophy" element={<Philosophy />} />
            <Route path="/services" element={<Services />} />
            {/* Membership and Experiences pages are hidden for now; restore the
                routes and nav links to bring them back */}
            <Route path="/membership" element={<Navigate to="/" replace />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/experiences" element={<Navigate to="/" replace />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/consultation" element={<Navigate to="/apply" replace />} />
          </Route>

          <Route element={<LegacyLayout />}>
            <Route path="/discover" element={<Navigate to="/skills" replace />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/social" element={<Social />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/meetups" element={<Meetups />} />
            <Route path="/events" element={<Meetups />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/subscribe" element={<Subscribe />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
