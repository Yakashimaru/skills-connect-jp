// Navbar — matches exact project dark maroon color scheme
// On /discover renders a filter bar with custom checkbox dropdown panels
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

// ─── Project palette (matches rest of app exactly) ────────────────────────────
const C = {
  brand:    '#5C0A1E',   // deep maroon — primary brand
  brandDk:  '#3A0612',   // darkest maroon — hover states
  brandMd:  '#7A1030',   // mid maroon
  text:     '#1A0208',   // near-black maroon — headings / body text
  muted:    '#7A6060',   // muted text
  gold:     '#B8860B',   // gold accent
  goldDk:   '#9A6F09',   // gold hover
  cream:    '#FDF0E0',   // warm cream background
  border:   '#E8DDD5',   // warm border
  soft:     '#FDF8F2',   // softest bg for hover
}

const links = [
  { path: '/', label: 'nav.home' },
  { path: '/discover', label: 'nav.discover' },
  { path: '/meetups', label: 'nav.meetups' },
]

const howItWorksItems = [
  { hash: '#how-it-works', label: 'nav.how_it_works' },
  { hash: '#fees', label: 'nav.fees' },
  { hash: '#faq', label: 'nav.faq' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type OptionGroup = { group: string; items: { value: string; label: string }[] }
type FilterState = Record<string, boolean>

// ─── Filter data ──────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: OptionGroup[] = [
  { group: '🌐 Language', items: [
    { value: 'english', label: 'English' }, { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' }, { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' }, { value: 'korean', label: 'Korean' },
    { value: 'language-other', label: 'Other language' },
  ]},
  { group: '💬 Social', items: [
    { value: 'conversation', label: 'Conversation' }, { value: 'companionship', label: 'Companionship' },
    { value: 'event', label: 'Event' }, { value: 'travel-social', label: 'Travel' },
  ]},
  { group: '💼 Business', items: [
    { value: 'coaching', label: 'Coaching' }, { value: 'presentation', label: 'Presentation' },
    { value: 'advisory', label: 'Advisory' }, { value: 'assistance', label: 'Assistance' },
  ]},
  { group: '🏋️ Fitness', items: [
    { value: 'personal-training', label: 'Personal training' }, { value: 'instructor', label: 'Instructor' },
  ]},
  { group: '📚 Education', items: [
    { value: 'tutoring', label: 'Tutoring' }, { value: 'mentorship', label: 'Mentorship' },
  ]},
  { group: '✈️ Travel', items: [
    { value: 'tour-guide', label: 'Tour guide' }, { value: 'local-guide', label: 'Local guide' },
    { value: 'communication-support', label: 'Communication support' },
  ]},
  { group: '💻 Online', items: [{ value: 'online', label: 'Online' }] },
  { group: '➕ Other', items: [{ value: 'others', label: 'Others' }] },
]

const LOCATION_OPTIONS: OptionGroup[] = [
  { group: '🌐', items: [{ value: 'online', label: '🌐 Online' }] },
  { group: 'Hokkaido', items: [
    { value: 'sapporo', label: 'Sapporo' }, { value: 'asahikawa', label: 'Asahikawa' },
    { value: 'hakodate', label: 'Hakodate' }, { value: 'kushiro', label: 'Kushiro' },
    { value: 'obihiro', label: 'Obihiro' }, { value: 'kitami', label: 'Kitami' },
    { value: 'tomakomai', label: 'Tomakomai' }, { value: 'otaru', label: 'Otaru' },
    { value: 'ebetsu', label: 'Ebetsu' }, { value: 'chitose', label: 'Chitose' },
    { value: 'wakkanai', label: 'Wakkanai' }, { value: 'nemuro', label: 'Nemuro' },
    { value: 'furano', label: 'Furano' }, { value: 'noboribetsu', label: 'Noboribetsu' },
    { value: 'abashiri', label: 'Abashiri' }, { value: 'yubari', label: 'Yubari' },
  ]},
  { group: 'Aomori', items: [
    { value: 'aomori', label: 'Aomori' }, { value: 'hachinohe', label: 'Hachinohe' },
    { value: 'hirosaki', label: 'Hirosaki' }, { value: 'towada', label: 'Towada' },
    { value: 'mutsu', label: 'Mutsu' }, { value: 'misawa', label: 'Misawa' },
  ]},
  { group: 'Iwate', items: [
    { value: 'morioka', label: 'Morioka' }, { value: 'ichinoseki', label: 'Ichinoseki' },
    { value: 'hanamaki', label: 'Hanamaki' }, { value: 'kamaishi', label: 'Kamaishi' },
    { value: 'miyako', label: 'Miyako' }, { value: 'kuji', label: 'Kuji' },
  ]},
  { group: 'Miyagi', items: [
    { value: 'sendai', label: 'Sendai' }, { value: 'ishinomaki', label: 'Ishinomaki' },
    { value: 'natori', label: 'Natori' }, { value: 'shiogama', label: 'Shiogama' },
    { value: 'kesennuma', label: 'Kesennuma' },
  ]},
  { group: 'Akita', items: [
    { value: 'akita', label: 'Akita' }, { value: 'yokote', label: 'Yokote' },
    { value: 'noshiro', label: 'Noshiro' }, { value: 'kazuno', label: 'Kazuno' },
  ]},
  { group: 'Yamagata', items: [
    { value: 'yamagata', label: 'Yamagata' }, { value: 'yonezawa', label: 'Yonezawa' },
    { value: 'tsuruoka', label: 'Tsuruoka' }, { value: 'sakata', label: 'Sakata' },
  ]},
  { group: 'Fukushima', items: [
    { value: 'fukushima', label: 'Fukushima' }, { value: 'koriyama', label: 'Koriyama' },
    { value: 'iwaki', label: 'Iwaki' }, { value: 'aizuwakamatsu', label: 'Aizuwakamatsu' },
    { value: 'shirakawa', label: 'Shirakawa' },
  ]},
  { group: 'Ibaraki', items: [
    { value: 'mito', label: 'Mito' }, { value: 'tsukuba', label: 'Tsukuba' },
    { value: 'hitachi', label: 'Hitachi' }, { value: 'tsuchiura', label: 'Tsuchiura' },
    { value: 'toride', label: 'Toride' },
  ]},
  { group: 'Tochigi', items: [
    { value: 'utsunomiya', label: 'Utsunomiya' }, { value: 'ashikaga', label: 'Ashikaga' },
    { value: 'sano', label: 'Sano' }, { value: 'nikko', label: 'Nikko' },
  ]},
  { group: 'Gunma', items: [
    { value: 'maebashi', label: 'Maebashi' }, { value: 'takasaki', label: 'Takasaki' },
    { value: 'isesaki', label: 'Isesaki' }, { value: 'kiryu', label: 'Kiryu' },
  ]},
  { group: 'Saitama', items: [
    { value: 'saitama', label: 'Saitama' }, { value: 'kawaguchi', label: 'Kawaguchi' },
    { value: 'kawagoe', label: 'Kawagoe' }, { value: 'koshigaya', label: 'Koshigaya' },
    { value: 'tokorozawa', label: 'Tokorozawa' }, { value: 'kumagaya', label: 'Kumagaya' },
    { value: 'iruma', label: 'Iruma' }, { value: 'kuki', label: 'Kuki' },
  ]},
  { group: 'Chiba', items: [
    { value: 'chiba', label: 'Chiba' }, { value: 'funabashi', label: 'Funabashi' },
    { value: 'matsudo', label: 'Matsudo' }, { value: 'kashiwa', label: 'Kashiwa' },
    { value: 'ichikawa', label: 'Ichikawa' }, { value: 'urayasu', label: 'Urayasu' },
    { value: 'narita', label: 'Narita' }, { value: 'tateyama', label: 'Tateyama' },
  ]},
  { group: 'Tokyo (Wards)', items: [
    { value: 'shinjuku', label: 'Shinjuku' }, { value: 'shibuya', label: 'Shibuya' },
    { value: 'minato', label: 'Minato' }, { value: 'chiyoda', label: 'Chiyoda' },
    { value: 'chuo', label: 'Chuo' }, { value: 'bunkyo', label: 'Bunkyo' },
    { value: 'toshima', label: 'Toshima' }, { value: 'sumida', label: 'Sumida' },
    { value: 'koto', label: 'Koto' }, { value: 'taito', label: 'Taito' },
    { value: 'nerima', label: 'Nerima' }, { value: 'nakano', label: 'Nakano' },
    { value: 'suginami', label: 'Suginami' }, { value: 'setagaya', label: 'Setagaya' },
    { value: 'shinagawa', label: 'Shinagawa' }, { value: 'adachi', label: 'Adachi' },
    { value: 'edogawa', label: 'Edogawa' },
  ]},
  { group: 'Tokyo (Cities)', items: [
    { value: 'hachioji', label: 'Hachioji' }, { value: 'machida', label: 'Machida' },
    { value: 'tachikawa', label: 'Tachikawa' }, { value: 'fuchu', label: 'Fuchu' },
    { value: 'musashino', label: 'Musashino' }, { value: 'mitaka', label: 'Mitaka' },
    { value: 'ome', label: 'Ome' },
  ]},
  { group: 'Kanagawa', items: [
    { value: 'yokohama', label: 'Yokohama' }, { value: 'kawasaki', label: 'Kawasaki' },
    { value: 'sagamihara', label: 'Sagamihara' }, { value: 'fujisawa', label: 'Fujisawa' },
    { value: 'yokosuka', label: 'Yokosuka' }, { value: 'hiratsuka', label: 'Hiratsuka' },
    { value: 'odawara', label: 'Odawara' }, { value: 'kamakura', label: 'Kamakura' },
    { value: 'ebina', label: 'Ebina' }, { value: 'zushi', label: 'Zushi' },
  ]},
  { group: 'Niigata', items: [
    { value: 'niigata', label: 'Niigata' }, { value: 'nagaoka', label: 'Nagaoka' },
    { value: 'joetsu', label: 'Joetsu' }, { value: 'sanjo', label: 'Sanjo' },
  ]},
  { group: 'Toyama', items: [
    { value: 'toyama', label: 'Toyama' }, { value: 'takaoka', label: 'Takaoka' },
    { value: 'himi', label: 'Himi' }, { value: 'kurobe', label: 'Kurobe' },
  ]},
  { group: 'Ishikawa', items: [
    { value: 'kanazawa', label: 'Kanazawa' }, { value: 'komatsu', label: 'Komatsu' },
    { value: 'nanao', label: 'Nanao' }, { value: 'wajima', label: 'Wajima' },
  ]},
  { group: 'Fukui', items: [
    { value: 'fukui', label: 'Fukui' }, { value: 'sabae', label: 'Sabae' },
    { value: 'tsuruga', label: 'Tsuruga' }, { value: 'obama', label: 'Obama' },
  ]},
  { group: 'Yamanashi', items: [
    { value: 'kofu', label: 'Kofu' }, { value: 'fujiyoshida', label: 'Fujiyoshida' },
  ]},
  { group: 'Nagano', items: [
    { value: 'nagano', label: 'Nagano' }, { value: 'matsumoto', label: 'Matsumoto' },
    { value: 'ueda', label: 'Ueda' }, { value: 'iida', label: 'Iida' },
    { value: 'suwa', label: 'Suwa' }, { value: 'saku', label: 'Saku' },
    { value: 'azumino', label: 'Azumino' }, { value: 'shiojiri', label: 'Shiojiri' },
  ]},
  { group: 'Gifu', items: [
    { value: 'gifu', label: 'Gifu' }, { value: 'ogaki', label: 'Ogaki' },
    { value: 'tajimi', label: 'Tajimi' }, { value: 'takayama', label: 'Takayama' },
    { value: 'seki', label: 'Seki' },
  ]},
  { group: 'Shizuoka', items: [
    { value: 'shizuoka', label: 'Shizuoka' }, { value: 'hamamatsu', label: 'Hamamatsu' },
    { value: 'numazu', label: 'Numazu' }, { value: 'fuji', label: 'Fuji' },
    { value: 'mishima', label: 'Mishima' }, { value: 'atami', label: 'Atami' },
    { value: 'kakegawa', label: 'Kakegawa' },
  ]},
  { group: 'Aichi', items: [
    { value: 'nagoya', label: 'Nagoya' }, { value: 'toyota', label: 'Toyota' },
    { value: 'okazaki', label: 'Okazaki' }, { value: 'toyohashi', label: 'Toyohashi' },
    { value: 'ichinomiya', label: 'Ichinomiya' }, { value: 'kasugai', label: 'Kasugai' },
    { value: 'anjo', label: 'Anjo' }, { value: 'seto', label: 'Seto' },
    { value: 'gamagori', label: 'Gamagori' },
  ]},
  { group: 'Mie', items: [
    { value: 'tsu', label: 'Tsu' }, { value: 'yokkaichi', label: 'Yokkaichi' },
    { value: 'ise', label: 'Ise' }, { value: 'suzuka', label: 'Suzuka' },
  ]},
  { group: 'Shiga', items: [
    { value: 'otsu', label: 'Otsu' }, { value: 'kusatsu', label: 'Kusatsu' },
    { value: 'nagahama', label: 'Nagahama' }, { value: 'moriyama', label: 'Moriyama' },
  ]},
  { group: 'Kyoto', items: [
    { value: 'kyoto', label: 'Kyoto' }, { value: 'uji', label: 'Uji' },
    { value: 'maizuru', label: 'Maizuru' }, { value: 'kameoka', label: 'Kameoka' },
    { value: 'fukuchiyama', label: 'Fukuchiyama' },
  ]},
  { group: 'Osaka', items: [
    { value: 'osaka', label: 'Osaka' }, { value: 'sakai', label: 'Sakai' },
    { value: 'higashiosaka', label: 'Higashiosaka' }, { value: 'hirakata', label: 'Hirakata' },
    { value: 'toyonaka', label: 'Toyonaka' }, { value: 'suita', label: 'Suita' },
    { value: 'takatsuki', label: 'Takatsuki' }, { value: 'neyagawa', label: 'Neyagawa' },
    { value: 'kishiwada', label: 'Kishiwada' },
  ]},
  { group: 'Hyogo', items: [
    { value: 'kobe', label: 'Kobe' }, { value: 'amagasaki', label: 'Amagasaki' },
    { value: 'nishinomiya', label: 'Nishinomiya' }, { value: 'himeji', label: 'Himeji' },
    { value: 'akashi', label: 'Akashi' }, { value: 'takarazuka', label: 'Takarazuka' },
    { value: 'itami', label: 'Itami' }, { value: 'ashiya', label: 'Ashiya' },
    { value: 'awaji', label: 'Awaji' }, { value: 'toyooka', label: 'Toyooka' },
  ]},
  { group: 'Nara', items: [
    { value: 'nara', label: 'Nara' }, { value: 'kashihara', label: 'Kashihara' },
    { value: 'ikoma', label: 'Ikoma' }, { value: 'tenri', label: 'Tenri' },
  ]},
  { group: 'Wakayama', items: [
    { value: 'wakayama', label: 'Wakayama' }, { value: 'shingu', label: 'Shingu' },
    { value: 'tanabe', label: 'Tanabe' },
  ]},
  { group: 'Tottori', items: [
    { value: 'tottori', label: 'Tottori' }, { value: 'yonago', label: 'Yonago' },
  ]},
  { group: 'Shimane', items: [
    { value: 'matsue', label: 'Matsue' }, { value: 'izumo', label: 'Izumo' },
    { value: 'hamada', label: 'Hamada' },
  ]},
  { group: 'Okayama', items: [
    { value: 'okayama', label: 'Okayama' }, { value: 'kurashiki', label: 'Kurashiki' },
    { value: 'tsuyama', label: 'Tsuyama' },
  ]},
  { group: 'Hiroshima', items: [
    { value: 'hiroshima', label: 'Hiroshima' }, { value: 'fukuyama', label: 'Fukuyama' },
    { value: 'kure', label: 'Kure' }, { value: 'onomichi', label: 'Onomichi' },
    { value: 'hatsukaichi', label: 'Hatsukaichi' },
  ]},
  { group: 'Yamaguchi', items: [
    { value: 'yamaguchi', label: 'Yamaguchi' }, { value: 'shimonoseki', label: 'Shimonoseki' },
    { value: 'ube', label: 'Ube' }, { value: 'iwakuni', label: 'Iwakuni' },
    { value: 'hagi', label: 'Hagi' },
  ]},
  { group: 'Tokushima', items: [
    { value: 'tokushima', label: 'Tokushima' }, { value: 'naruto', label: 'Naruto' },
    { value: 'anan', label: 'Anan' },
  ]},
  { group: 'Kagawa', items: [
    { value: 'takamatsu', label: 'Takamatsu' }, { value: 'marugame', label: 'Marugame' },
    { value: 'kanonji', label: 'Kanonji' },
  ]},
  { group: 'Ehime', items: [
    { value: 'matsuyama', label: 'Matsuyama' }, { value: 'imabari', label: 'Imabari' },
    { value: 'niihama', label: 'Niihama' }, { value: 'uwajima', label: 'Uwajima' },
  ]},
  { group: 'Kochi', items: [
    { value: 'kochi', label: 'Kochi' }, { value: 'nankoku', label: 'Nankoku' },
    { value: 'shimanto', label: 'Shimanto' },
  ]},
  { group: 'Fukuoka', items: [
    { value: 'fukuoka', label: 'Fukuoka' }, { value: 'kitakyushu', label: 'Kitakyushu' },
    { value: 'kurume', label: 'Kurume' }, { value: 'dazaifu', label: 'Dazaifu' },
    { value: 'onojo', label: 'Onojo' }, { value: 'yanagawa', label: 'Yanagawa' },
  ]},
  { group: 'Saga', items: [
    { value: 'saga', label: 'Saga' }, { value: 'karatsu', label: 'Karatsu' },
    { value: 'tosu', label: 'Tosu' },
  ]},
  { group: 'Nagasaki', items: [
    { value: 'nagasaki', label: 'Nagasaki' }, { value: 'sasebo', label: 'Sasebo' },
    { value: 'isahaya', label: 'Isahaya' }, { value: 'goto', label: 'Goto' },
    { value: 'tsushima-ng', label: 'Tsushima' },
  ]},
  { group: 'Kumamoto', items: [
    { value: 'kumamoto', label: 'Kumamoto' }, { value: 'yatsushiro', label: 'Yatsushiro' },
    { value: 'aso', label: 'Aso' }, { value: 'yamaga', label: 'Yamaga' },
  ]},
  { group: 'Oita', items: [
    { value: 'oita', label: 'Oita' }, { value: 'beppu', label: 'Beppu' },
    { value: 'nakatsu', label: 'Nakatsu' }, { value: 'yufu', label: 'Yufu' },
  ]},
  { group: 'Miyazaki', items: [
    { value: 'miyazaki', label: 'Miyazaki' }, { value: 'miyakonojo', label: 'Miyakonojo' },
    { value: 'nobeoka', label: 'Nobeoka' }, { value: 'hyuga', label: 'Hyuga' },
  ]},
  { group: 'Kagoshima', items: [
    { value: 'kagoshima', label: 'Kagoshima' }, { value: 'kirishima', label: 'Kirishima' },
    { value: 'kanoya', label: 'Kanoya' }, { value: 'amami', label: 'Amami' },
    { value: 'yakushima', label: 'Yakushima' }, { value: 'ibusuki', label: 'Ibusuki' },
  ]},
  { group: 'Okinawa', items: [
    { value: 'naha', label: 'Naha' }, { value: 'okinawa-city', label: 'Okinawa City' },
    { value: 'urasoe', label: 'Urasoe' }, { value: 'ginowan', label: 'Ginowan' },
    { value: 'nago', label: 'Nago' }, { value: 'miyakojima', label: 'Miyakojima' },
    { value: 'ishigaki', label: 'Ishigaki' }, { value: 'yonaguni', label: 'Yonaguni' },
    { value: 'chatan', label: 'Chatan' },
  ]},
]

const AGE_OPTIONS    = [{ value: '20s', label: '20s' }, { value: '30s', label: '30s' }, { value: '40s', label: '40s' }, { value: '50plus', label: '50+' }]
const PRICE_OPTIONS  = [{ value: 'under5k', label: 'Under ¥5,000/hr' }, { value: '5k-10k', label: '¥5,000 – ¥10,000/hr' }, { value: 'over10k', label: 'Over ¥10,000/hr' }]
const GENDER_OPTIONS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'any', label: 'Any' }]

// ─── FilterDropdown ───────────────────────────────────────────────────────────
interface FilterDropdownProps {
  label: string
  options?: OptionGroup[]
  flatOptions?: { value: string; label: string }[]
  selected: FilterState
  onChange: (val: string) => void
  onClear: () => void
  searchable?: boolean
  wide?: boolean
}

function FilterDropdown({ label, options, flatOptions, selected, onChange, onClear, searchable, wide }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const count = Object.values(selected).filter(Boolean).length

  const filteredGroups = options
    ? options.map(g => ({ ...g, items: query ? g.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : g.items })).filter(g => g.items.length > 0)
    : []
  const filteredFlat = flatOptions
    ? (query ? flatOptions.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : flatOptions)
    : []

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm border rounded-full px-4 py-2 transition-all cursor-pointer whitespace-nowrap"
        style={count > 0
          ? { backgroundColor: C.brand, borderColor: C.brand, color: '#fff', fontWeight: 600 }
          : { backgroundColor: '#fff', borderColor: C.border, color: C.muted }
        }
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold"
            style={{ backgroundColor: C.gold, color: '#fff' }}>
            {count}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col ${wide ? 'w-72' : 'w-56'}`}
          style={{ maxHeight: '360px', border: `0.5px solid ${C.border}`, boxShadow: `0 8px 24px rgba(92,10,30,0.12)` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: C.brand, borderBottom: `1px solid ${C.brandDk}` }}>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">{label}</span>
            {count > 0 && (
              <button onClick={(e) => { e.stopPropagation(); onClear() }}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors">
                Clear all
              </button>
            )}
          </div>

          {/* Search */}
          {searchable && (
            <div className="px-3 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm rounded-lg px-3 py-1.5 outline-none"
                style={{ backgroundColor: C.cream, color: C.text }}
              />
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {options && filteredGroups.map(group =>
              group.group === '🌐' ? (
                <div key="online" style={{ borderBottom: `1px solid ${C.border}` }}>
                  {group.items.map(item => (
                    <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
                  ))}
                </div>
              ) : (
                <div key={group.group}>
                  <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider sticky top-0"
                    style={{ backgroundColor: C.cream, color: C.brand }}>
                    {group.group}
                  </div>
                  {group.items.map(item => (
                    <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
                  ))}
                </div>
              )
            )}
            {flatOptions && filteredFlat.map(item => (
              <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
            ))}
            {((options && filteredGroups.length === 0) || (flatOptions && filteredFlat.length === 0)) && (
              <div className="px-4 py-6 text-center text-sm" style={{ color: C.muted }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function OptionRow({ item, checked, onChange }: { item: { value: string; label: string }; checked: boolean; onChange: (v: string) => void }) {
  return (
    <label
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ backgroundColor: checked ? C.cream : undefined }}
      onMouseOver={e => { if (!checked) (e.currentTarget as HTMLElement).style.backgroundColor = C.soft }}
      onMouseOut={e => { if (!checked) (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
    >
      <input type="checkbox" checked={checked} onChange={() => onChange(item.value)}
        className="w-4 h-4 rounded flex-shrink-0" style={{ accentColor: C.brand }} />
      <span className="text-sm" style={{ color: checked ? C.brand : C.text, fontWeight: checked ? 600 : 400 }}>
        {item.label}
      </span>
    </label>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const isDiscover = pathname === '/discover'

  const [search, setSearch] = useState('')
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const [categoryFilter, setCategoryFilter] = useState<FilterState>({})
  const [locationFilter, setLocationFilter] = useState<FilterState>({})
  const [ageFilter, setAgeFilter] = useState<FilterState>({})
  const [priceFilter, setPriceFilter] = useState<FilterState>({})
  const [genderFilter, setGenderFilter] = useState<FilterState>({})
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const toggle = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => (val: string) => {
    setter(prev => ({ ...prev, [val]: !prev[val] }))
  }, [])
  const clear = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => () => setter({}), [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white sticky top-0 z-20" style={{ borderBottom: `0.5px solid ${C.border}`, boxShadow: '0 1px 8px rgba(92,10,30,0.08)' }}>

      {/* Main nav row */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="text-xl font-semibold tracking-tight" style={{ color: C.brand }}>
          skillconnect
        </NavLink>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              className={({ isActive }) => `text-sm transition-colors ${isActive ? 'font-semibold' : 'hover:opacity-80'}`}
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
            >
              {t(link.label)}
            </NavLink>
          ))}

          {/* How it works hover dropdown */}
          <div ref={howItWorksRef} className="relative"
            onMouseEnter={() => setHowItWorksOpen(true)}
            onMouseLeave={() => setHowItWorksOpen(false)}
          >
            <NavLink to="/how-it-works"
              className={({ isActive }) => `text-sm transition-colors flex items-center gap-1 ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
            >
              {t('nav.how_it_works')}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: howItWorksOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavLink>
            {howItWorksOpen && (
              <div className="absolute left-0 top-full pt-2 z-30">
                <div className="bg-white rounded-2xl shadow-lg py-2 min-w-[160px]" style={{ border: `0.5px solid ${C.border}` }}>
                  {howItWorksItems.map(item => (
                    <a key={item.hash} href={`/how-it-works${item.hash}`}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: C.muted }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.soft; (e.currentTarget as HTMLElement).style.color = C.text }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = C.muted }}
                      onClick={() => setHowItWorksOpen(false)}
                    >
                      {t(item.label)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/contact"
            className={({ isActive }) => `text-sm transition-colors ${isActive ? 'font-semibold' : ''}`}
            style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
          >
            {t('nav.contact')}
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja')}
            className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
            style={{ border: `1px solid ${C.border}`, color: C.muted }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = C.brand; (e.currentTarget as HTMLElement).style.color = C.brand }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted }}
          >
            {i18n.language === 'ja' ? 'EN' : 'JA'}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={avatarRef}>
              <button onClick={() => setAvatarOpen(!avatarOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: `2px solid ${C.border}` }} />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg py-2 z-30"
                  style={{ border: `0.5px solid ${C.border}`, boxShadow: `0 4px 16px rgba(92,10,30,0.1)` }}>
                  {[
                    { to: '/dashboard', label: t('nav.dashboard') },
                    { to: '/profile/1', label: t('nav.my_profile') },
                    { to: '/chat', label: t('nav.messages') },
                  ].map(item => (
                    <NavLink key={item.to} to={item.to} onClick={() => setAvatarOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: C.text }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.soft}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}>
                      {item.label}
                    </NavLink>
                  ))}
                  <hr className="my-1" style={{ borderColor: C.border }} />
                  <button onClick={() => { logout(); setAvatarOpen(false); navigate('/') }}
                    className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{ color: C.brand }}
                    onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.soft}
                    onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/login" className="text-sm transition-colors" style={{ color: C.muted }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.color = C.text}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.color = C.muted}>
                {t('nav.login')}
              </NavLink>
              <NavLink to="/signup"
                className="text-sm text-white font-medium px-5 py-2 rounded-full transition-colors"
                style={{ backgroundColor: C.brand }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.brandDk}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.brand}>
                {t('nav.signup')}
              </NavLink>
            </div>
          )}

          <button className="md:hidden text-xl transition-colors" style={{ color: C.muted }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4 bg-white" style={{ borderTop: `0.5px solid ${C.border}` }}>
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
              className="text-sm transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted, fontWeight: isActive ? 600 : 400 })}>
              {t(link.label)}
            </NavLink>
          ))}
          <div className="flex flex-col gap-1 pl-3" style={{ borderLeft: `2px solid ${C.border}` }}>
            {howItWorksItems.map(item => (
              <a key={item.hash} href={`/how-it-works${item.hash}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm" style={{ color: C.muted }}>
                {t(item.label)}
              </a>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="flex gap-3 pt-2" style={{ borderTop: `0.5px solid ${C.border}` }}>
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm" style={{ color: C.muted }}>{t('nav.login')}</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)}
                className="text-sm text-white px-4 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: C.brand }}>
                {t('nav.signup')}
              </NavLink>
            </div>
          )}
        </div>
      )}

      {/* Filter bar — only on /discover */}
      {isDiscover && (
        <div style={{ borderTop: `0.5px solid ${C.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.muted }}>🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full outline-none transition-colors"
                style={{ backgroundColor: C.cream, color: C.text }}
              />
            </div>

            <div className="h-5 w-px mx-1" style={{ backgroundColor: C.border }} />

            <FilterDropdown label={t('nav.filter_category')} options={CATEGORY_OPTIONS} selected={categoryFilter} onChange={toggle(setCategoryFilter)} onClear={clear(setCategoryFilter)} searchable />
            <FilterDropdown label={t('nav.filter_location')} options={LOCATION_OPTIONS} selected={locationFilter} onChange={toggle(setLocationFilter)} onClear={clear(setLocationFilter)} searchable wide />
            <FilterDropdown label="Age" flatOptions={AGE_OPTIONS} selected={ageFilter} onChange={toggle(setAgeFilter)} onClear={clear(setAgeFilter)} />
            <FilterDropdown label={t('nav.filter_price')} flatOptions={PRICE_OPTIONS} selected={priceFilter} onChange={toggle(setPriceFilter)} onClear={clear(setPriceFilter)} />
            <FilterDropdown label={t('nav.filter_gender')} flatOptions={GENDER_OPTIONS} selected={genderFilter} onChange={toggle(setGenderFilter)} onClear={clear(setGenderFilter)} />

            <label className="flex items-center gap-2 cursor-pointer ml-1">
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4" style={{ accentColor: C.brand }} />
              <span className="text-sm whitespace-nowrap" style={{ color: C.muted }}>
                {t('nav.verified_only')}
              </span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
}
