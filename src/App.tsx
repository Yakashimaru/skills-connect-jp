import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Skills from './pages/Skills'
import Social from './pages/Social'
import ProfilePage from './pages/ProfilePage'
import Chat from './pages/Chat'
import Meetups from './pages/Meetups'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import HowItWorksPage from './pages/HowItWorks'
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthCallback from './pages/AuthCallback'
import Subscribe from './pages/Subscribe'

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
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/subscribe" element={<Subscribe />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
