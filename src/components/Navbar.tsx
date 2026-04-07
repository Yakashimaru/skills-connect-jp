// Navbar — persistent top bar across all pages
// On /discover, renders a filter bar directly underneath as one connected sticky unit
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/meetups', label: 'Meetups' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const isDiscover = pathname === '/discover'
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      {/* Main nav row */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-semibold text-teal-500 tracking-tight">
          skillconnect
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-teal-100" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-30">
                <NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Dashboard</NavLink>
                <NavLink to="/profile/1" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My profile</NavLink>
                <NavLink to="/chat" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Messages</NavLink>
                <hr className="my-1 border-gray-100" />
                <button onClick={() => { logout(); setDropdownOpen(false); navigate('/') }} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-50 transition-colors">
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Log in</NavLink>
            <NavLink to="/signup" className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full transition-colors">Sign up</NavLink>
          </div>
        )}
      </div>

      {/* Filter bar — only on /discover */}
      {isDiscover && (
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills or people..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full outline-none text-gray-700 placeholder-gray-400 focus:bg-gray-200 transition-colors"
              />
            </div>

            <div className="h-5 w-px bg-gray-200" />

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>Category</option>
              <option>Skills</option>
              <option>Social</option>
              <option>Meetups</option>
              <option>Online</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>Location</option>
              <option>Tokyo</option>
              <option>Osaka</option>
              <option>Kyoto</option>
              <option>Online</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>Price</option>
              <option>Under ¥5,000/hr</option>
              <option>¥5,000 – ¥10,000/hr</option>
              <option>Over ¥10,000/hr</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Any</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer ml-1">
              <input type="checkbox" className="accent-teal-500 w-4 h-4" />
              <span className="text-sm text-gray-500 whitespace-nowrap">Verified only</span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
}
