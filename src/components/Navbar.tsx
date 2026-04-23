// Navbar — persistent top bar across all pages
// On /discover, renders a full filter bar with multi-select checkbox dropdowns
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/meetups', label: 'Meetups' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/contact', label: 'Contact' },
]

// ─── Filter data ──────────────────────────────────────────────────────────────

const categories = ['Coaching', 'English', 'Japanese', 'Golf', 'Business', 'Fitness',
  'Nutrition', 'Music', 'Piano', 'Cooking', 'Travel', 'Mindfulness',
  'Yoga', 'Startups', 'Finance', 'Mentorship', 'Social', 'Online']

const ageGroups = ['20s', '30s', '40s', '50+']

const genders = ['Male', 'Female', 'Non-binary', 'Any']

const priceRanges = ['Under ¥3,000/hr', '¥3,000 – ¥5,000/hr', '¥5,000 – ¥10,000/hr', '¥10,000 – ¥20,000/hr', 'Over ¥20,000/hr']

const japanRegions = [
  {
    region: 'Online',
    cities: ['Online only'],
  },
  {
    region: 'Hokkaido',
    cities: ['Sapporo', 'Asahikawa', 'Hakodate', 'Kushiro', 'Obihiro', 'Kitami',
      'Tomakomai', 'Otaru', 'Muroran', 'Iwamizawa', 'Abashiri', 'Wakkanai',
      'Nemuro', 'Rumoi', 'Nayoro', 'Bibai', 'Ebetsu', 'Chitose'],
  },
  {
    region: 'Tohoku',
    cities: ['Aomori', 'Hirosaki', 'Hachinohe', 'Misawa',
      'Morioka', 'Ichinoseki', 'Oshu', 'Hanamaki', 'Kitakami',
      'Sendai', 'Ishinomaki', 'Osaki', 'Shiogama', 'Natori',
      'Akita', 'Yokote', 'Odate', 'Noshiro', 'Yuzawa',
      'Yamagata', 'Tsuruoka', 'Sakata', 'Yonezawa', 'Tendo',
      'Fukushima', 'Koriyama', 'Iwaki', 'Aizuwakamatsu', 'Sukagawa'],
  },
  {
    region: 'Kanto',
    cities: ['Tokyo (Shinjuku)', 'Tokyo (Shibuya)', 'Tokyo (Ginza)', 'Tokyo (Akihabara)',
      'Tokyo (Asakusa)', 'Tokyo (Ikebukuro)', 'Tokyo (Roppongi)', 'Tokyo (Ueno)',
      'Tokyo (Harajuku)', 'Tokyo (Shimokitazawa)', 'Hachioji', 'Tachikawa',
      'Yokohama', 'Kawasaki', 'Sagamihara', 'Yokosuka', 'Hiratsuka',
      'Fujisawa', 'Odawara', 'Kamakura', 'Atsugi', 'Machida',
      'Saitama', 'Kawaguchi', 'Kawagoe', 'Tokorozawa', 'Kumagaya', 'Konosu',
      'Chiba', 'Funabashi', 'Ichikawa', 'Matsudo', 'Narita', 'Kashiwa', 'Urayasu',
      'Mito', 'Tsukuba', 'Hitachi', 'Toride', 'Koga',
      'Utsunomiya', 'Oyama', 'Tochigi', 'Nikko', 'Sano',
      'Maebashi', 'Takasaki', 'Kiryu', 'Isesaki', 'Ota'],
  },
  {
    region: 'Chubu — Koshinetsu',
    cities: ['Niigata', 'Nagaoka', 'Joetsu', 'Sanjo', 'Kashiwazaki',
      'Nagano', 'Matsumoto', 'Ueda', 'Iida', 'Suwa', 'Karuizawa',
      'Kofu', 'Fujiyoshida', 'Minami-Alps'],
  },
  {
    region: 'Chubu — Hokuriku',
    cities: ['Toyama', 'Takaoka', 'Imizu', 'Namerikawa',
      'Kanazawa', 'Komatsu', 'Hakusan', 'Nanao',
      'Fukui', 'Sabae', 'Echizen', 'Obama'],
  },
  {
    region: 'Chubu — Tokai',
    cities: ['Nagoya', 'Toyota', 'Okazaki', 'Ichinomiya', 'Kasugai',
      'Toyohashi', 'Anjo', 'Komaki', 'Inuyama', 'Hekinan',
      'Shizuoka', 'Hamamatsu', 'Numazu', 'Fuji', 'Mishima',
      'Atami', 'Ito', 'Fujinomiya',
      'Gifu', 'Ogaki', 'Takayama', 'Kakamigahara', 'Gujo',
      'Tsu', 'Yokkaichi', 'Suzuka', 'Matsusaka', 'Kuwana', 'Ise'],
  },
  {
    region: 'Kansai',
    cities: ['Osaka (Umeda)', 'Osaka (Namba)', 'Osaka (Tennoji)',
      'Osaka (Shinsaibashi)', 'Osaka (Honmachi)',
      'Sakai', 'Higashiosaka', 'Toyonaka', 'Suita', 'Takatsuki',
      'Hirakata', 'Yao', 'Neyagawa',
      'Kyoto', 'Uji', 'Maizuru', 'Kyotango', 'Fukuchiyama',
      'Kobe', 'Himeji', 'Amagasaki', 'Nishinomiya', 'Akashi',
      'Itami', 'Takarazuka', 'Kakogawa', 'Ashiya', 'Nishiwaki',
      'Sanda', 'Toyooka', 'Awaji',
      'Nara', 'Kashihara', 'Yamatokoriyama', 'Tenri', 'Sakurai',
      'Otsu', 'Kusatsu', 'Hikone', 'Nagahama', 'Moriyama',
      'Wakayama', 'Kainan', 'Hashimoto', 'Arida', 'Shingu'],
  },
  {
    region: 'Chugoku',
    cities: ['Hiroshima', 'Fukuyama', 'Kure', 'Higashihiroshima', 'Onomichi', 'Mihara',
      'Okayama', 'Kurashiki', 'Tsuyama', 'Tamano', 'Kasaoka',
      'Yamaguchi', 'Ube', 'Shimonoseki', 'Shunan', 'Hofu', 'Iwakuni',
      'Tottori', 'Yonago', 'Kurayoshi', 'Sakaiminato',
      'Matsue', 'Izumo', 'Hamada', 'Masuda'],
  },
  {
    region: 'Shikoku',
    cities: ['Takamatsu', 'Marugame', 'Sakaide', 'Sanuki',
      'Matsuyama', 'Imabari', 'Uwajima', 'Niihama', 'Saijo',
      'Kochi', 'Nankoku', 'Susaki', 'Shimanto',
      'Tokushima', 'Naruto', 'Anan', 'Yoshinogawa'],
  },
  {
    region: 'Kyushu',
    cities: ['Fukuoka', 'Kitakyushu', 'Kurume', 'Omuta', 'Iizuka',
      'Kasuga', 'Chikushino', 'Dazaifu',
      'Saga', 'Karatsu', 'Tosu', 'Imari', 'Takeo',
      'Nagasaki', 'Sasebo', 'Isahaya', 'Omura', 'Goto',
      'Kumamoto', 'Yatsushiro', 'Hitoyoshi', 'Arao', 'Aso',
      'Oita', 'Beppu', 'Nakatsu', 'Hita', 'Yufu',
      'Miyazaki', 'Miyakonojo', 'Nobeoka', 'Hyuga', 'Nichinan',
      'Kagoshima', 'Kirishima', 'Kokubu', 'Satsumasendai', 'Amami'],
  },
  {
    region: 'Okinawa',
    cities: ['Naha', 'Okinawa City', 'Uruma', 'Urasoe', 'Ginowan',
      'Nago', 'Itoman', 'Nanjo', 'Ishigaki', 'Miyakojima'],
  },
]

// ─── MultiSelect dropdown component ─────────────────────────────────────────

interface MultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
  grouped?: { region: string; cities: string[] }[]
  wide?: boolean
}

function MultiSelect({ label, options, selected, onChange, grouped, wide }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = useCallback((val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }, [selected, onChange])

  const clearAll = () => onChange([])

  const displayLabel = selected.length === 0
    ? label
    : selected.length === 1
    ? selected[0]
    : `${label} (${selected.length})`

  // Render grouped or flat list
  const renderOptions = () => {
    if (grouped) {
      return grouped.map(group => {
        const filteredCities = group.cities.filter(c =>
          search === '' || c.toLowerCase().includes(search.toLowerCase())
        )
        if (filteredCities.length === 0) return null
        return (
          <div key={group.region}>
            <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
              {group.region}
            </div>
            {filteredCities.map(city => (
              <label key={city} className="flex items-center gap-2.5 px-3 py-2 hover:bg-teal-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selected.includes(city)}
                  onChange={() => toggle(city)}
                  className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
        )
      })
    }
    const filtered = options.filter(o => search === '' || o.toLowerCase().includes(search.toLowerCase()))
    return filtered.map(opt => (
      <label key={opt} className="flex items-center gap-2.5 px-3 py-2 hover:bg-teal-50 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={selected.includes(opt)}
          onChange={() => toggle(opt)}
          className="accent-teal-500 w-3.5 h-3.5 flex-shrink-0"
        />
        <span className="text-sm text-gray-700">{opt}</span>
      </label>
    ))
  }

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-sm border rounded-full px-4 py-2 transition-colors cursor-pointer whitespace-nowrap
          ${selected.length > 0
            ? 'bg-teal-500 text-white border-teal-500'
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
      >
        <span>{displayLabel}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden
          ${wide ? 'w-72' : 'w-52'}`}
          style={{ maxHeight: '340px' }}
        >
          {/* Header */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">{label}</span>
              {selected.length > 0 && (
                <button onClick={clearAll} className="text-xs text-teal-500 hover:underline">
                  Clear all
                </button>
              )}
            </div>
            {/* Search inside dropdown */}
            {(grouped || options.length > 8) && (
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full text-xs bg-gray-100 rounded-lg px-3 py-1.5 outline-none text-gray-700 placeholder-gray-400"
              />
            )}
          </div>

          {/* Options list */}
          <div className="overflow-y-auto" style={{ maxHeight: '248px' }}>
            {renderOptions()}
          </div>

          {/* Footer — selected count */}
          {selected.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-teal-600 font-medium">{selected.length} selected</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const isDiscover = pathname === '/discover'
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter state — all multi-select
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocations.length > 0 ||
    selectedAges.length > 0 || selectedPrices.length > 0 || selectedGenders.length > 0 || verifiedOnly

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedLocations([])
    setSelectedAges([])
    setSelectedPrices([])
    setSelectedGenders([])
    setVerifiedOnly(false)
  }

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

        <div className="flex items-center gap-3">
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
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Log in</NavLink>
              <NavLink to="/signup" className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full transition-colors">Sign up</NavLink>
            </div>
          )}

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
          {!isLoggedIn && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500">Log in</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)} className="text-sm bg-teal-500 text-white px-4 py-1.5 rounded-full">Sign up</NavLink>
            </div>
          )}
        </div>
      )}

      {/* Filter bar — only on /discover */}
      {isDiscover && (
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2.5 flex-wrap">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
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

            {/* Category multi-select */}
            <MultiSelect
              label="Category"
              options={categories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />

            {/* Location multi-select (grouped) */}
            <MultiSelect
              label="Location"
              options={[]}
              selected={selectedLocations}
              onChange={setSelectedLocations}
              grouped={japanRegions}
              wide
            />

            {/* Age multi-select */}
            <MultiSelect
              label="Age"
              options={ageGroups}
              selected={selectedAges}
              onChange={setSelectedAges}
            />

            {/* Price multi-select */}
            <MultiSelect
              label="Price"
              options={priceRanges}
              selected={selectedPrices}
              onChange={setSelectedPrices}
            />

            {/* Gender multi-select */}
            <MultiSelect
              label="Gender"
              options={genders}
              selected={selectedGenders}
              onChange={setSelectedGenders}
            />

            {/* Verified only toggle */}
            <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full border transition-colors
              ${verifiedOnly ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="accent-white w-3.5 h-3.5"
              />
              <span className="text-sm whitespace-nowrap">Verified only</span>
            </label>

            {/* Clear all — only shown when filters active */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2 ml-1 whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="max-w-6xl mx-auto px-6 pb-2.5 flex items-center gap-2 flex-wrap">
              {[...selectedCategories, ...selectedLocations, ...selectedAges, ...selectedPrices, ...selectedGenders].map(chip => (
                <span key={chip} className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  {chip}
                  <button
                    onClick={() => {
                      setSelectedCategories(p => p.filter(v => v !== chip))
                      setSelectedLocations(p => p.filter(v => v !== chip))
                      setSelectedAges(p => p.filter(v => v !== chip))
                      setSelectedPrices(p => p.filter(v => v !== chip))
                      setSelectedGenders(p => p.filter(v => v !== chip))
                    }}
                    className="text-teal-400 hover:text-teal-700 transition-colors leading-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  Verified only
                  <button onClick={() => setVerifiedOnly(false)} className="text-teal-400 hover:text-teal-700 transition-colors leading-none">✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
