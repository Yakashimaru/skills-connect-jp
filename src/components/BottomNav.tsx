import { NavLink } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/discover', label: 'Discover', icon: '🔍' },
  { path: '/chat', label: 'Chat', icon: '💬' },
  { path: '/meetups', label: 'Meetups', icon: '📍' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
              isActive ? 'text-black font-semibold' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
