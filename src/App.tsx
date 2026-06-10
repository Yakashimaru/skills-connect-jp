import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

const Home         = lazy(() => import('./pages/Home'))
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
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
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
