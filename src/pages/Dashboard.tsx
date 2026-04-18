import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const upcomingSessions = [
  { id: 1, name: 'James R.', image: 'https://randomuser.me/api/portraits/men/11.jpg', type: '1-on-1 Session', date: 'Sat 29 Mar · 10:00 AM', price: '¥8,000', status: 'confirmed' },
  { id: 2, name: 'Sophie M.', image: 'https://randomuser.me/api/portraits/women/29.jpg', type: 'Online Call', date: 'Sun 30 Mar · 2:00 PM', price: '¥8,000', status: 'pending' },
]

const pastBookings = [
  { id: 1, name: 'Hiroshi T.', image: 'https://randomuser.me/api/portraits/men/63.jpg', type: '1-on-1 Session', date: 'Sat 22 Mar', price: '¥8,000', rating: 5, review: 'Very insightful session. Yuki really helped me gain clarity on my next steps.' },
  { id: 2, name: 'Emma L.', image: 'https://randomuser.me/api/portraits/women/35.jpg', type: 'Online Call', date: 'Thu 20 Mar', price: '¥8,000', rating: 4, review: 'Great conversation, very warm and easy to talk to.' },
  { id: 3, name: 'Kenji S.', image: 'https://randomuser.me/api/portraits/men/22.jpg', type: '1-on-1 Session', date: 'Sat 15 Mar', price: '¥8,000', rating: 5, review: null },
]

const savedProfiles = [
  { id: 1, name: 'Kenji Mori', title: 'Golf Instructor', image: 'https://randomuser.me/api/portraits/men/32.jpg', price: '¥10,000/hr' },
  { id: 2, name: 'Rin Sato', title: 'Language Partner', image: 'https://randomuser.me/api/portraits/women/68.jpg', price: '¥5,000/hr' },
]

const card = { backgroundColor: '#fff', borderRadius: '16px', border: '0.5px solid #E8DDD5', padding: '20px' }

function PastBookingItem({ booking }: { booking: typeof pastBookings[0] }) {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)

  const handleSubmit = () => {
    if (!reviewText || !selectedStar) return
    setSubmitted(true)
    setShowForm(false)
  }

  return (
    <div className="p-3 rounded-xl transition-colors" style={{ backgroundColor: 'transparent' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="flex items-center gap-4">
        <img src={booking.image} alt={booking.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{booking.name}</p>
          <p className="text-xs" style={{ color: '#aaa' }}>{booking.type} · {booking.date}</p>
        </div>
        <span className="text-xs text-yellow-500">{'⭐'.repeat(booking.rating)}</span>
        <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>{booking.price}</span>
      </div>
      {booking.review && !submitted && (
        <p className="text-xs italic mt-2 ml-14" style={{ color: '#7A6060' }}>"{booking.review}"</p>
      )}
      {submitted && (
        <p className="text-xs italic mt-2 ml-14" style={{ color: '#7A6060' }}>"{reviewText}" — {'⭐'.repeat(selectedStar)}</p>
      )}
      {!booking.review && !submitted && !showForm && (
        <button onClick={() => setShowForm(true)} className="ml-14 mt-2 text-xs hover:underline" style={{ color: '#B8860B' }}>
          {t('dashboard.leave_review')}
        </button>
      )}
      {showForm && (
        <div className="ml-14 mt-3 flex flex-col gap-2">
          <div className="flex gap-1">
            {[1,2,3,4,5].map((star) => (
              <button key={star} type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedStar(star)}
                className="text-xl"
              >
                {star <= (hoveredStar || selectedStar) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
            placeholder={t('dashboard.review_placeholder')}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
            style={{ border: '0.5px solid #E8DDD5', color: '#1A0208' }}
            rows={2}
            onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
          />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="text-xs px-4 py-1.5 rounded-lg transition-colors" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>{t('dashboard.submit')}</button>
            <button onClick={() => setShowForm(false)} className="text-xs transition-colors" style={{ color: '#aaa' }}>{t('dashboard.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProviderDashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t('dashboard.stat_earnings'), value: '¥248,000', sub: t('dashboard.stat_this_month') },
            { label: t('dashboard.stat_sessions'), value: '31', sub: t('dashboard.stat_this_month') },
            { label: t('dashboard.stat_rating'), value: '4.9 ⭐', sub: t('dashboard.stat_all_time') },
          ].map((stat) => (
            <div key={stat.label} style={card}>
              <p className="text-xs mb-1" style={{ color: '#aaa' }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: '#1A0208' }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: '#B8860B' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Upcoming sessions */}
        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{t('dashboard.upcoming_sessions')}</h3>
          <div className="flex flex-col gap-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img src={session.image} alt={session.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{session.name}</p>
                  <p className="text-xs" style={{ color: '#aaa' }}>{session.type} · {session.date}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                  style={session.status === 'confirmed'
                    ? { backgroundColor: '#FDF0E0', color: '#7A4A00' }
                    : { backgroundColor: '#FEF9C3', color: '#854D0E' }
                  }>
                  {session.status}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>{session.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Past bookings */}
        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{t('dashboard.past_bookings')}</h3>
          <div className="flex flex-col divide-y" style={{ borderColor: '#E8DDD5' }}>
            {pastBookings.map((booking) => (
              <PastBookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">

        {/* Profile summary */}
        <div style={{ ...card, textAlign: 'center' }}>
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" style={{ border: '2px solid #B8860B' }} />
          <p className="font-semibold" style={{ color: '#1A0208' }}>Yuki Tanaka</p>
          <p className="text-xs mb-3" style={{ color: '#aaa' }}>Life Coach & English Tutor</p>
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{t('dashboard.verified')}</span>
          <button onClick={() => navigate('/edit-profile')}
            className="w-full mt-4 text-sm py-2 rounded-xl transition-colors"
            style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {t('dashboard.edit_profile')}
          </button>
        </div>

        {/* Verification */}
        <div style={card}>
          <h3 className="font-semibold mb-3" style={{ color: '#1A0208' }}>{t('dashboard.verification')}</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: t('dashboard.verify_email'), done: true },
              { label: t('dashboard.verify_phone'), done: true },
              { label: t('dashboard.verify_id'), done: true },
              { label: t('dashboard.verify_bg'), done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#1A0208' }}>{item.label}</span>
                <span className="text-xs font-medium" style={{ color: item.done ? '#B8860B' : '#ccc' }}>
                  {item.done ? t('dashboard.done') : t('dashboard.pending')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div style={card}>
          <h3 className="font-semibold mb-1" style={{ color: '#1A0208' }}>{t('dashboard.subscription')}</h3>
          <p className="text-xs mb-3" style={{ color: '#aaa' }}>{t('dashboard.current_plan')}</p>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#5C0A1E', border: '1px solid #B8860B' }}>
            <p className="font-bold text-lg text-white">Premium</p>
            <p className="text-xs mt-0.5" style={{ color: '#B8860B' }}>¥10,000 / month</p>
          </div>
          <button className="w-full mt-3 text-sm py-2 rounded-xl transition-colors"
            style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {t('dashboard.manage_plan')}
          </button>
        </div>

        {/* Settings */}
        <div style={card}>
          <h3 className="font-semibold mb-3" style={{ color: '#1A0208' }}>{t('dashboard.settings')}</h3>
          <div className="flex flex-col gap-2">
            {[
              { key: 'setting_notifications', label: t('dashboard.setting_notifications') },
              { key: 'setting_privacy', label: t('dashboard.setting_privacy') },
              { key: 'setting_payment', label: t('dashboard.setting_payment') },
              { key: 'setting_help', label: t('dashboard.setting_help') },
              { key: 'setting_logout', label: t('dashboard.setting_logout') },
            ].map(({ key, label }) => (
              <button key={key} className="text-left text-sm py-1.5 transition-colors"
                style={{ color: key === 'setting_logout' ? '#DC2626' : '#5C0A1E' }}>
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SeekerDashboard() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{t('dashboard.upcoming_sessions')}</h3>
          <div className="flex flex-col gap-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img src={session.image} alt={session.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{session.name}</p>
                  <p className="text-xs" style={{ color: '#aaa' }}>{session.type} · {session.date}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                  style={session.status === 'confirmed'
                    ? { backgroundColor: '#FDF0E0', color: '#7A4A00' }
                    : { backgroundColor: '#FEF9C3', color: '#854D0E' }
                  }>
                  {session.status}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>{session.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{t('dashboard.past_bookings_seeker')}</h3>
          <div className="flex flex-col gap-3">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img src={booking.image} alt={booking.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{booking.name}</p>
                  <p className="text-xs" style={{ color: '#aaa' }}>{booking.type} · {booking.date}</p>
                </div>
                <span className="text-xs text-yellow-500">{'⭐'.repeat(booking.rating)}</span>
                <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>{booking.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{t('dashboard.saved_profiles')}</h3>
          <div className="flex flex-col gap-3">
            {savedProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img src={profile.image} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{profile.name}</p>
                  <p className="text-xs" style={{ color: '#aaa' }}>{profile.title}</p>
                </div>
                <span className="text-xs font-medium" style={{ color: '#B8860B' }}>{profile.price}</span>
                <button className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
                >{t('dashboard.book')}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div style={{ ...card, textAlign: 'center' }}>
          <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" style={{ border: '2px solid #B8860B' }} />
          <p className="font-semibold" style={{ color: '#1A0208' }}>James R.</p>
          <p className="text-xs mb-3" style={{ color: '#aaa' }}>Seeker · Tokyo</p>
          <button className="w-full text-sm py-2 rounded-xl transition-colors"
            style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >{t('dashboard.edit_profile')}</button>
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-1" style={{ color: '#1A0208' }}>{t('dashboard.subscription')}</h3>
          <p className="text-xs mb-3" style={{ color: '#aaa' }}>{t('dashboard.current_plan')}</p>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1A0208', border: '0.5px solid rgba(184,134,11,0.3)' }}>
            <p className="font-bold text-lg text-white">Elite</p>
            <p className="text-xs mt-0.5" style={{ color: '#B8860B' }}>¥50,000 / month</p>
          </div>
          <button className="w-full mt-3 text-sm py-2 rounded-xl transition-colors"
            style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >{t('dashboard.manage_plan')}</button>
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-3" style={{ color: '#1A0208' }}>{t('dashboard.settings')}</h3>
          <div className="flex flex-col gap-2">
            {[
              { key: 'setting_notifications', label: t('dashboard.setting_notifications') },
              { key: 'setting_privacy', label: t('dashboard.setting_privacy') },
              { key: 'setting_payment', label: t('dashboard.setting_payment') },
              { key: 'setting_help', label: t('dashboard.setting_help') },
              { key: 'setting_logout', label: t('dashboard.setting_logout') },
            ].map(({ key, label }) => (
              <button key={key} className="text-left text-sm py-1.5 transition-colors"
                style={{ color: key === 'setting_logout' ? '#DC2626' : '#5C0A1E' }}>
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const [view, setView] = useState<'provider' | 'seeker'>('provider')

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('dashboard.title')}</h1>
            <p className="text-sm mt-1" style={{ color: '#aaa' }}>{t('dashboard.welcome')}</p>
          </div>
          <div className="flex items-center p-1 rounded-full" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            {([['provider', t('dashboard.tab_provider')], ['seeker', t('dashboard.tab_seeker')]] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="text-sm px-5 py-2 rounded-full transition-colors font-medium"
                style={view === v
                  ? { backgroundColor: '#5C0A1E', color: '#fff' }
                  : { backgroundColor: 'transparent', color: '#aaa' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {view === 'provider' ? <ProviderDashboard /> : <SeekerDashboard />}
      </div>
    </div>
  )
}
