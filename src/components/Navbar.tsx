import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const isDiscover = pathname === '/discover'
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const links = [
    { path: '/', label: t('nav.home') },
    { path: '/discover', label: t('nav.discover') },
    { path: '/meetups', label: t('nav.meetups') },
  ]

  const howItWorksDropdown = [
    { hash: '#how-it-works', label: t('nav.how_it_works') },
    { hash: '#fees', label: t('nav.fees') },
    { hash: '#faq', label: t('nav.faq') },
  ]

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

          {/* How it works — hover dropdown */}
          <div
            ref={howItWorksRef}
            className="relative"
            onMouseEnter={() => setHowItWorksOpen(true)}
            onMouseLeave={() => setHowItWorksOpen(false)}
          >
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `text-sm transition-colors flex items-center gap-1 group ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-700'}`
              }
            >
              {t('nav.how_it_works')}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ transform: howItWorksOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s, opacity 0.2s' }}
              >
                <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NavLink>

            {howItWorksOpen && (
              <div className="absolute left-0 top-full pt-2 z-30">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[160px]">
                  {howItWorksDropdown.map((item) => (
                    <a
                      key={item.hash}
                      href={`/how-it-works${item.hash}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setHowItWorksOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-700'}`
            }
          >
            {t('nav.contact')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja')}
            className="text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            {i18n.language === 'ja' ? 'EN' : 'JA'}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-teal-100" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-30">
                  <NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{t('nav.dashboard')}</NavLink>
                  <NavLink to="/profile/1" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{t('nav.my_profile')}</NavLink>
                  <NavLink to="/chat" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{t('nav.messages')}</NavLink>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); setDropdownOpen(false); navigate('/') }} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-50 transition-colors">
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">{t('nav.login')}</NavLink>
              <NavLink to="/signup" className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full transition-colors">{t('nav.signup')}</NavLink>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-800 transition-colors text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {/* How it works sub-links on mobile */}
          <div className="flex flex-col gap-1 pl-3 border-l-2" style={{ borderColor: '#E8DDD5' }}>
            {howItWorksDropdown.map((item) => (
              <a
                key={item.hash}
                href={`/how-it-works${item.hash}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-400"
              >
                {item.label}
              </a>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500">{t('nav.login')}</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)} className="text-sm bg-teal-500 text-white px-4 py-1.5 rounded-full">{t('nav.signup')}</NavLink>
            </div>
          )}
        </div>
      )}

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
                placeholder={t('nav.search_placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full outline-none text-gray-700 placeholder-gray-400 focus:bg-gray-200 transition-colors"
              />
            </div>

            <div className="h-5 w-px bg-gray-200" />

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>{t('nav.filter_category')}</option>
              <option>{t('nav.filter_skills')}</option>
              <option>{t('nav.filter_social')}</option>
              <option>{t('nav.filter_meetups')}</option>
              <option>{t('nav.filter_online')}</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>{t('nav.filter_location')}</option>
              <option>{t('nav.filter_tokyo')}</option>
              <option>{t('nav.filter_osaka')}</option>
              <option>{t('nav.filter_kyoto')}</option>
              <option>{t('nav.filter_online')}</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>{t('nav.filter_price')}</option>
              <option>{t('nav.price_under')}</option>
              <option>{t('nav.price_mid')}</option>
              <option>{t('nav.price_over')}</option>
            </select>

            <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>{t('nav.filter_gender')}</option>
              <option>{t('nav.gender_male')}</option>
              <option>{t('nav.gender_female')}</option>
              <option>{t('nav.gender_any')}</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer ml-1">
              <input type="checkbox" className="accent-teal-500 w-4 h-4" />
              <span className="text-sm text-gray-500 whitespace-nowrap">{t('nav.verified_only')}</span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
}
