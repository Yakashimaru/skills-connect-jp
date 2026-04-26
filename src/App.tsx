import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    } else {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView()
    }
  }, [pathname, hash])
  return null
}
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Discover from './pages/Discover'
import ProfilePage from './pages/ProfilePage'
import Chat from './pages/Chat'
import Meetups from './pages/Meetups'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import HowItWorksPage from './pages/HowItWorks'
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
