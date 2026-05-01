import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getBookingsForUser } from '../lib/bookings'
import { getSavedProfiles } from '../lib/profiles'
import { getActiveSubscription } from '../lib/subscriptions'
import { createReview } from '../lib/reviews'

const card = { backgroundColor: '#fff', borderRadius: '16px', border: '0.5px solid #E8DDD5', padding: '20px' }

const PLAN_LABELS: Record<string, { label: string; price: string; bg: string }> = {
  standard: { label: 'Standard', price: '¥5,000 / month', bg: '#F5F5F5' },
  premium:  { label: 'Premium',  price: '¥10,000 / month', bg: '#5C0A1E' },
  elite:    { label: 'Elite',    price: '¥50,000 / month', bg: '#1A0208' },
}

function avatarEl(profile: any, size = 'w-10 h-10') {
  if (profile?.avatar_url) return <img src={profile.avatar_url} alt={profile.name} className={`${size} rounded-full object-cover`} />
  return (
    <div className={`${size} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
      style={{ backgroundColor: '#FDF0E0', color: '#B8860B' }}>
      {profile?.name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── PastBookingItem ──────────────────────────────────────────────────────────

function PastBookingItem({ booking, role, userId }: { booking: any; role: 'provider' | 'seeker'; userId: string }) {
  const { t } = useTranslation()
  const other = role === 'provider' ? booking.seeker : booking.provider
  const canReview = role === 'seeker'

  const [showForm, setShowForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)

  const handleSubmit = async () => {
    if (!reviewText || !selectedStar) return
    await createReview({
      reviewer_id: userId,
      provider_id: booking.provider_id,
      booking_id: booking.id,
      rating: selectedStar,
      text: reviewText,
    })
    setSubmitted(true)
    setShowForm(false)
  }

  return (
    <div className="p-3 rounded-xl transition-colors" style={{ backgroundColor: 'transparent' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
      <div className="flex items-center gap-4">
        {avatarEl(other)}
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{other?.name ?? '—'}</p>
          <p className="text-xs" style={{ color: '#aaa' }}>{booking.session_type} · {formatDate(booking.scheduled_at)}</p>
        </div>
        <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>¥{booking.rate?.toLocaleString()}</span>
      </div>

      {submitted && (
        <p className="text-xs italic mt-2 ml-14" style={{ color: '#7A6060' }}>"{reviewText}" — {'⭐'.repeat(selectedStar)}</p>
      )}
      {canReview && !submitted && !showForm && (
        <button onClick={() => setShowForm(true)} className="ml-14 mt-2 text-xs hover:underline" style={{ color: '#B8860B' }}>
          {t('dashboard.leave_review')}
        </button>
      )}
      {showForm && (
        <div className="ml-14 mt-3 flex flex-col gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button"
                onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedStar(star)} className="text-xl">
                {star <= (hoveredStar || selectedStar) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
            placeholder={t('dashboard.review_placeholder')} rows={2}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
            style={{ border: '0.5px solid #E8DDD5', color: '#1A0208' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="text-xs px-4 py-1.5 rounded-lg" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>{t('dashboard.submit')}</button>
            <button onClick={() => setShowForm(false)} className="text-xs" style={{ color: '#aaa' }}>{t('dashboard.cancel')}</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ProviderDashboard ────────────────────────────────────────────────────────

function ProviderDashboard({ bookings, subscription, providerProfile, userId }: {
  bookings: any[]; subscription: any; providerProfile: any; userId: string
}) {
  const navigate = useNavigate()
  const { t: tr } = useTranslation()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const upcoming = bookings.filter(b => ['pending', 'confirmed'].includes(b.status) && new Date(b.scheduled_at) > now)
  const past = bookings.filter(b => b.status === 'completed')
  const completedThisMonth = past.filter(b => new Date(b.scheduled_at) >= startOfMonth)
  const earnings = completedThisMonth.reduce((sum: number, b: any) => sum + (b.rate ?? 0), 0)

  const plan = subscription ? PLAN_LABELS[subscription.plan] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: tr('dashboard.stat_earnings'), value: `¥${earnings.toLocaleString()}`, sub: tr('dashboard.stat_this_month') },
            { label: tr('dashboard.stat_sessions'), value: String(completedThisMonth.length), sub: tr('dashboard.stat_this_month') },
            { label: tr('dashboard.stat_rating'), value: providerProfile?.rating ? `${Number(providerProfile.rating).toFixed(1)} ⭐` : '—', sub: tr('dashboard.stat_all_time') },
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
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{tr('dashboard.upcoming_sessions')}</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>{tr('dashboard.no_upcoming')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((session: any) => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  {avatarEl(session.seeker)}
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{session.seeker?.name ?? '—'}</p>
                    <p className="text-xs" style={{ color: '#aaa' }}>{session.session_type} · {formatDate(session.scheduled_at)}</p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full"
                    style={session.status === 'confirmed'
                      ? { backgroundColor: '#FDF0E0', color: '#7A4A00' }
                      : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                    {session.status}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>¥{session.rate?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past bookings */}
        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{tr('dashboard.past_bookings')}</h3>
          {past.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>{tr('dashboard.no_past')}</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: '#E8DDD5' }}>
              {past.map((booking: any) => (
                <PastBookingItem key={booking.id} booking={booking} role="provider" userId={userId} />
              ))}
            </div>
          )}
        </div>
      </div>

      <RightColumn profile={null} providerProfile={providerProfile} plan={plan} navigate={navigate} tr={tr} role="provider" />
    </div>
  )
}

// ─── SeekerDashboard ──────────────────────────────────────────────────────────

function SeekerDashboard({ bookings, savedProfiles, subscription, userId }: {
  bookings: any[]; savedProfiles: any[]; subscription: any; userId: string
}) {
  const navigate = useNavigate()
  const { t: tr } = useTranslation()

  const now = new Date()
  const upcoming = bookings.filter(b => ['pending', 'confirmed'].includes(b.status) && new Date(b.scheduled_at) > now)
  const past = bookings.filter(b => b.status === 'completed')
  const plan = subscription ? PLAN_LABELS[subscription.plan] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{tr('dashboard.upcoming_sessions')}</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>{tr('dashboard.no_upcoming')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((session: any) => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  {avatarEl(session.provider)}
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{session.provider?.name ?? '—'}</p>
                    <p className="text-xs" style={{ color: '#aaa' }}>{session.session_type} · {formatDate(session.scheduled_at)}</p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full"
                    style={session.status === 'confirmed'
                      ? { backgroundColor: '#FDF0E0', color: '#7A4A00' }
                      : { backgroundColor: '#FEF9C3', color: '#854D0E' }}>
                    {session.status}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>¥{session.rate?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{tr('dashboard.past_bookings_seeker')}</h3>
          {past.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>{tr('dashboard.no_past')}</p>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: '#E8DDD5' }}>
              {past.map((booking: any) => (
                <PastBookingItem key={booking.id} booking={booking} role="seeker" userId={userId} />
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A0208' }}>{tr('dashboard.saved_profiles')}</h3>
          {savedProfiles.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>{tr('dashboard.no_saved')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {savedProfiles.map((entry: any) => {
                const p = entry.profile
                return (
                  <div key={entry.saved_profile_id} className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => navigate(`/profile/${entry.saved_profile_id}`)}>
                    {avatarEl(p)}
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{p?.name ?? '—'}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{p?.provider_profile?.title ?? ''}</p>
                    </div>
                    {p?.provider_profile?.hourly_rate && (
                      <span className="text-xs font-medium" style={{ color: '#B8860B' }}>¥{p.provider_profile.hourly_rate.toLocaleString()}/hr</span>
                    )}
                    <button className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
                      onClick={e => { e.stopPropagation(); navigate(`/profile/${entry.saved_profile_id}`) }}>
                      {tr('dashboard.book')}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <RightColumn profile={null} providerProfile={null} plan={plan} navigate={navigate} tr={tr} role="seeker" />
    </div>
  )
}

// ─── Shared right column ──────────────────────────────────────────────────────

function RightColumn({ plan, navigate, tr, role }: {
  profile: any; providerProfile: any; plan: typeof PLAN_LABELS[string] | null;
  navigate: ReturnType<typeof useNavigate>; tr: any; role: 'provider' | 'seeker'
}) {
  const { profile, signOut } = useAuth()
  const pp = (profile as any)?.provider_profile

  return (
    <div className="flex flex-col gap-6">

      {/* Profile summary */}
      <div style={{ ...card, textAlign: 'center' }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center text-xl font-bold"
          style={{ border: '2px solid #B8860B', backgroundColor: '#FDF0E0', color: '#B8860B' }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            : profile?.name?.[0]?.toUpperCase() ?? '?'
          }
        </div>
        <p className="font-semibold" style={{ color: '#1A0208' }}>{profile?.name ?? '—'}</p>
        <p className="text-xs mb-3" style={{ color: '#aaa' }}>
          {role === 'provider' && pp?.title ? pp.title : `${role.charAt(0).toUpperCase() + role.slice(1)} · ${profile?.location ?? ''}`}
        </p>
        {profile?.verified && (
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{tr('dashboard.verified')}</span>
        )}
        <button onClick={() => navigate('/edit-profile')}
          className="w-full mt-4 text-sm py-2 rounded-xl transition-colors"
          style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          {tr('dashboard.edit_profile')}
        </button>
      </div>

      {/* Subscription */}
      <div style={card}>
        <h3 className="font-semibold mb-1" style={{ color: '#1A0208' }}>{tr('dashboard.subscription')}</h3>
        <p className="text-xs mb-3" style={{ color: '#aaa' }}>{tr('dashboard.current_plan')}</p>
        {plan ? (
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: plan.bg, border: '1px solid #B8860B' }}>
            <p className="font-bold text-lg text-white">{plan.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#B8860B' }}>{plan.price}</p>
          </div>
        ) : (
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F5F5F5' }}>
            <p className="text-sm font-medium" style={{ color: '#aaa' }}>{tr('dashboard.no_plan')}</p>
          </div>
        )}
        <button className="w-full mt-3 text-sm py-2 rounded-xl transition-colors"
          style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E', backgroundColor: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF8F2')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          {tr('dashboard.manage_plan')}
        </button>
      </div>

      {/* Settings */}
      <div style={card}>
        <h3 className="font-semibold mb-3" style={{ color: '#1A0208' }}>{tr('dashboard.settings')}</h3>
        <div className="flex flex-col gap-2">
          {[
            { key: 'setting_notifications', label: tr('dashboard.setting_notifications'), action: undefined },
            { key: 'setting_privacy', label: tr('dashboard.setting_privacy'), action: undefined },
            { key: 'setting_payment', label: tr('dashboard.setting_payment'), action: undefined },
            { key: 'setting_help', label: tr('dashboard.setting_help'), action: undefined },
            { key: 'setting_logout', label: tr('dashboard.setting_logout'), action: () => { signOut(); navigate('/') } },
          ].map(({ key, label, action }) => (
            <button key={key} onClick={action} className="text-left text-sm py-1.5 transition-colors hover:opacity-70"
              style={{ color: key === 'setting_logout' ? '#DC2626' : '#5C0A1E' }}>
              {label} →
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()

  const defaultView = (profile?.user_type ?? 'seeker') as 'provider' | 'seeker'
  const [view, setView] = useState<'provider' | 'seeker'>(defaultView)

  const [providerBookings, setProviderBookings] = useState<any[]>([])
  const [seekerBookings, setSeekerBookings] = useState<any[]>([])
  const [saved, setSaved] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Update default view when profile loads
  useEffect(() => {
    if (profile?.user_type) setView(profile.user_type as 'provider' | 'seeker')
  }, [profile?.user_type])

  useEffect(() => {
    if (!user) return
    Promise.all([
      getBookingsForUser(user.id, 'provider'),
      getBookingsForUser(user.id, 'seeker'),
      getSavedProfiles(user.id),
      getActiveSubscription(user.id),
    ]).then(([{ data: pb }, { data: sb }, { data: sp }, { data: sub }]) => {
      setProviderBookings(pb ?? [])
      setSeekerBookings(sb ?? [])
      setSaved(sp ?? [])
      setSubscription(sub)
      setLoading(false)
    }).catch((err: Error) => {
      setLoadError(err.message ?? 'Failed to load dashboard')
      setLoading(false)
    })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm" style={{ color: '#aaa' }}>Loading...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm" style={{ color: '#f87171' }}>{loadError}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('dashboard.title')}</h1>
            <p className="text-sm mt-1" style={{ color: '#aaa' }}>{t('dashboard.welcome', { name: profile?.name ?? '…' })}</p>
          </div>
          <div className="flex items-center p-1 rounded-full" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            {([['provider', t('dashboard.tab_provider')], ['seeker', t('dashboard.tab_seeker')]] as const).map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className="text-sm px-5 py-2 rounded-full transition-colors font-medium"
                style={view === v ? { backgroundColor: '#5C0A1E', color: '#fff' } : { backgroundColor: 'transparent', color: '#aaa' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === 'provider' ? (
          <ProviderDashboard
            bookings={providerBookings}
            subscription={subscription}
            providerProfile={(profile as any)?.provider_profile}
            userId={user!.id}
          />
        ) : (
          <SeekerDashboard
            bookings={seekerBookings}
            savedProfiles={saved}
            subscription={subscription}
            userId={user!.id}
          />
        )}
      </div>
    </div>
  )
}
