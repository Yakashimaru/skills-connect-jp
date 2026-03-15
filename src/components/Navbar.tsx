// Navbar — persistent top bar across all pages
// Logo left, nav links center, auth buttons right
// Active link is highlighted; hidden on mobile (md:flex)
import { NavLink } from 'react-router-dom'

const links = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/meetups', label: 'Meetups' },
  { path: '/how-it-works', label: 'How it works' },
]

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="text-xl font-semibold text-teal-500 tracking-tight">
          skillconnect
        </NavLink>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Log in
          </button>
          <button className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full transition-colors">
            Sign up
          </button>
        </div>

      </div>
    </header>
  )
}
