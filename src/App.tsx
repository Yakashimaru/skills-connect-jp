import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Discover from './pages/Discover'
import ProfilePage from './pages/ProfilePage'
import Chat from './pages/Chat'
import Meetups from './pages/Meetups'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/meetups" element={<Meetups />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
