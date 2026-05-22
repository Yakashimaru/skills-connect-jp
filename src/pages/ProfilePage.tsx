import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../lib/profiles'
import { getReviews } from '../lib/reviews'
import { getOrCreateConversation } from '../lib/messages'
import { createBooking } from '../lib/bookings'
import type { Profile, ProviderProfile } from '../lib/types'
import { TRAIT_JA, INTEREST_JA, SKILL_JA, SOCIAL_SKILL_JA, STAR_SIGN_JA, JA_CITY } from '../lib/constants'

const SESSION_ICONS: Record<string, string> = {
  '1-on-1 Session': '👤',
  'Group Meetup': '👥',
  'Online Call': '💻',
  'Social Experience': '🌸',
}

const SESSION_DESC_KEYS: Record<string, string> = {
  '1-on-1 Session': 'dashboard.session_desc_1on1',
  'Group Meetup': 'dashboard.session_desc_group',
  'Online Call': 'dashboard.session_desc_online',
  'Social Experience': 'dashboard.session_desc_social',
}

const SESSION_TYPE_KEYS: Record<string, string> = {
  '1-on-1 Session': 'profile.session_type_1on1',
  'Group Meetup': 'profile.session_type_group',
  'Online Call': 'profile.session_type_online',
  'Social Experience': 'profile.session_type_social',
}

const DURATIONS = [30, 60, 90, 120]

function BookSessionModal({ provider, providerProfile, seekerId, onClose }: {
  provider: Profile; providerProfile: ProviderProfile; seekerId: string; onClose: () => void
}) {
  const { t } = useTranslation()
  const sessionTypes: string[] = providerProfile.session_types ?? []
  const onlineRate: number   = providerProfile.online_rate   ?? providerProfile.hourly_rate ?? 0
  const inpersonRate: number = providerProfile.inperson_rate ?? providerProfile.hourly_rate ?? 0
  const trialRate: number    = providerProfile.trial_rate    ?? 0

  const isOnlineType = (type: string) => type === 'Online Call'
  const resolveRate  = (type: string) => isOnlineType(type) ? onlineRate : inpersonRate

  const [sessionType, setSessionType] = useState(sessionTypes[0] ?? '')
  const [isTrial,     setIsTrial]     = useState(false)
  const [date,  setDate]  = useState('')
  const [time,  setTime]  = useState('')
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,  setDone]  = useState(false)
  const [error, setError] = useState('')

  const hourlyRate = resolveRate(sessionType)
  const total = isTrial && trialRate ? trialRate : Math.round((duration / 60) * hourlyRate)

  const handleSubmit = async () => {
    if (!sessionType || !date || !time) { setError(t('profile.book_modal.error_required')); return }
    setError('')
    setSubmitting(true)
    const scheduledAt = new Date(`${date}T${time}`).toISOString()
    const { error: err } = await createBooking({
      provider_id: provider.id,
      seeker_id: seekerId,
      session_type: sessionType,
      scheduled_at: scheduledAt,
      duration_minutes: duration,
      rate: total,
      notes: notes || null,
    })
    setSubmitting(false)
    if (err) { setError(t('profile.book_modal.error_generic')); return }
    setDone(true)
  }

  const input = {
    width: '100%', border: '0.5px solid #E8DDD5', borderRadius: '10px',
    padding: '9px 14px', fontSize: '14px', outline: 'none',
    color: '#1A0208', backgroundColor: '#fff',
  }

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(20,2,6,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-8 text-center" style={{ backgroundColor: '#fff' }}>
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#1A0208' }}>{t('profile.book_modal.success_title')}</h2>
        <p className="text-sm mb-6" style={{ color: '#7A6060' }}>
          {t('profile.book_modal.success_body', { name: provider.name })}
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>
          {t('profile.book_modal.done')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: 'rgba(20,2,6,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-y-auto"
        style={{ backgroundColor: '#FDF8F2', maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '0.5px solid #E8DDD5' }}>
          <div>
            <h2 className="font-bold text-base" style={{ color: '#1A0208' }}>{t('profile.book_modal.title')}</h2>
            <p className="text-xs mt-0.5" style={{ color: '#7A6060' }}>{t('profile.book_modal.with', { name: provider.name })}</p>
          </div>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: '#aaa' }}>✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Session type */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.session_type')}</p>
            <div className="flex flex-wrap gap-2">
              {sessionTypes.map(type => (
                <button key={type} type="button" onClick={() => setSessionType(type)}
                  className="text-sm px-4 py-2 rounded-xl transition-colors"
                  style={sessionType === type
                    ? { backgroundColor: '#5C0A1E', color: '#fff', border: '1px solid #5C0A1E' }
                    : { backgroundColor: '#fff', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {SESSION_ICONS[type] ?? '📌'} {SESSION_TYPE_KEYS[type] ? t(SESSION_TYPE_KEYS[type]) : type}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.date')}</p>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} style={input} />
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.time')}</p>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={input} />
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.duration')}</p>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button key={d} type="button" onClick={() => setDuration(d)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={duration === d
                    ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
                    : { backgroundColor: '#fff', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {d < 60 ? `${d}m` : `${d / 60}h`}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.notes')} <span style={{ color: '#aaa', fontWeight: 400 }}>({t('edit_profile.optional')})</span></p>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder={t('profile.book_modal.notes_placeholder')}
              style={{ ...input, resize: 'none' }} />
          </div>

          {/* Trial toggle */}
          {trialRate > 0 && (
            <label className="flex items-center gap-3 cursor-pointer rounded-xl p-3" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8C88A' }}>
              <input type="checkbox" checked={isTrial} onChange={e => setIsTrial(e.target.checked)}
                className="w-4 h-4" style={{ accentColor: '#B8860B' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{t('profile.book_modal.trial_label')}</p>
                <p className="text-xs" style={{ color: '#7A6060' }}>{t('profile.book_modal.trial_hint', { price: trialRate.toLocaleString() })}</p>
              </div>
            </label>
          )}

          {/* Price summary */}
          {(hourlyRate > 0 || (isTrial && trialRate > 0)) && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
              <div className="flex justify-between text-sm mb-1">
                {isTrial && trialRate > 0 ? (
                  <span style={{ color: '#7A6060' }}>{t('profile.book_modal.trial_rate_label')}</span>
                ) : (
                  <span style={{ color: '#7A6060' }}>
                    {isOnlineType(sessionType) ? t('profile.book_modal.online') : t('profile.book_modal.inperson')} ¥{hourlyRate.toLocaleString()}{t('profile.per_hr')} × {duration} min
                  </span>
                )}
                <span className="font-semibold" style={{ color: '#1A0208' }}>¥{total.toLocaleString()}</span>
              </div>
              <p className="text-xs" style={{ color: '#aaa' }}>{t('profile.book_modal.payment_note')}</p>
            </div>
          )}

          {error && <p className="text-xs" style={{ color: '#C0392B' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#3A0612' }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#5C0A1E' }}>
            {submitting ? t('profile.book_modal.sending') : t('profile.book_modal.request')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isJa = i18n.language === 'ja'
  const { user } = useAuth()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [messageSending, setMessageSending] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    Promise.all([getProfile(id), getReviews(id)]).then(([p, { data: r }]) => {
      if (!p) { setNotFound(true) } else { setProfile(p); setReviews(r ?? []) }
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm" style={{ color: '#aaa' }}>Loading...</p>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-lg font-semibold" style={{ color: '#1A0208' }}>{t('profile.not_found')}</p>
        <button onClick={() => navigate('/discover')} className="text-sm font-medium hover:underline" style={{ color: '#B8860B' }}>
          {t('profile.browse_profiles')}
        </button>
      </div>
    )
  }

  const pp = profile.provider_profile
  const isOwnProfile = user?.id === profile.id

  const handleSendMessage = async () => {
    if (!user) { navigate('/login'); return }
    if (messageSending) return
    setMessageSending(true)
    await getOrCreateConversation(user.id, profile.id)
    setMessageSending(false)
    navigate('/chat')
  }

  return (
    <div className="pb-24 bg-white">

      {/* Cover photo */}
      <div className="relative w-full h-72" style={{ backgroundColor: '#1A0208' }}>
        {profile.cover_url && (
          <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(20,2,6,0.45)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* Avatar + edit button */}
        <div className="relative -mt-14 mb-4 flex items-end justify-between">
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center text-4xl font-bold"
            style={{ border: '3px solid #fff', boxShadow: '0 2px 12px rgba(92,10,30,0.15)', backgroundColor: '#FDF0E0', color: '#B8860B' }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              : profile.name?.[0]?.toUpperCase() ?? '?'
            }
          </div>
          {isOwnProfile && (
            <button onClick={() => navigate('/edit-profile')}
              className="text-sm font-medium px-4 py-2 rounded-xl mb-2 transition-colors"
              style={{ border: '0.5px solid #E8DDD5', color: '#5C0A1E' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              {t('profile.edit_profile')}
            </button>
          )}
        </div>

        {/* Name + info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-bold" style={{ color: '#1A0208' }}>{profile.name}</h1>
            {profile.verified && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>
                {t('profile.verified')}
              </span>
            )}
          </div>
          {pp?.title && <p className="text-sm mb-1" style={{ color: '#7A6060' }}>{pp.title}</p>}
          <div className="flex items-center gap-3 text-xs" style={{ color: '#aaa' }}>
            {profile.location && <span>📍 {isJa ? (JA_CITY[profile.location] ?? profile.location) : profile.location}</span>}
            {pp && <span>⭐ {Number(pp.rating).toFixed(1)} ({pp.review_count} {t('profile.reviews')})</span>}
            {pp?.trial_rate && <span className="font-semibold" style={{ color: '#B8860B' }}>{t('profile.trial')} ¥{pp.trial_rate.toLocaleString()}</span>}
            {pp?.online_rate && <span className="font-semibold" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.online')} ¥{pp.online_rate.toLocaleString()}{t('profile.per_hr')}</span>}
            {pp?.inperson_rate && <span className="font-semibold" style={{ color: '#5C0A1E' }}>{t('profile.book_modal.inperson')} ¥{pp.inperson_rate.toLocaleString()}{t('profile.per_hr')}</span>}
            {!pp?.online_rate && !pp?.inperson_rate && pp?.hourly_rate && <span className="font-semibold" style={{ color: '#5C0A1E' }}>¥{pp.hourly_rate.toLocaleString()}{t('profile.per_hr')}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {profile.bio && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.about')}</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#5A4040' }}>{profile.bio}</p>
              </section>
            )}

            {(profile.personality_traits?.length > 0 || profile.mbti || profile.star_sign || profile.personality_insights) && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.personality')}</h2>
                {(profile.mbti || profile.star_sign) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.mbti && (
                      <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#1A0208', color: '#FDF0E0' }}>
                        {profile.mbti}
                      </span>
                    )}
                    {profile.star_sign && (
                      <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00', border: '0.5px solid #E8C88A' }}>
                        ✨ {profile.star_sign[0].toUpperCase() + profile.star_sign.slice(1)}
                      </span>
                    )}
                  </div>
                )}
                {profile.top_traits?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.top_traits.map((trait: string) => (
                      <span key={trait} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>{isJa ? (TRAIT_JA[trait] ?? trait) : trait}</span>
                    ))}
                  </div>
                )}
                {profile.personality_traits?.filter((tr: string) => !profile.top_traits?.includes(tr)).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.personality_traits.filter((tr: string) => !profile.top_traits?.includes(tr)).map((trait: string) => (
                      <span key={trait} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{isJa ? (TRAIT_JA[trait] ?? trait) : trait}</span>
                    ))}
                  </div>
                )}
                {profile.personality_insights && (
                  <p className="text-sm italic mt-3 leading-relaxed" style={{ color: '#7A6060' }}>{profile.personality_insights}</p>
                )}
              </section>
            )}

            {(profile.mbti || profile.star_sign) && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.about_me')}</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.mbti && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#FDF0E0', border: '0.5px solid #E8DDD5' }}>
                      <span className="text-xs" style={{ color: '#aaa' }}>MBTI</span>
                      <span className="text-sm font-semibold" style={{ color: '#5C0A1E' }}>{profile.mbti}</span>
                    </div>
                  )}
                  {profile.star_sign && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#FDF0E0', border: '0.5px solid #E8DDD5' }}>
                      <span className="text-xs" style={{ color: '#aaa' }}>{isJa ? '星座' : 'Star sign'}</span>
                      <span className="text-sm font-semibold capitalize" style={{ color: '#5C0A1E' }}>
                        {isJa ? (STAR_SIGN_JA[profile.star_sign] ?? profile.star_sign) : profile.star_sign}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {profile.interests?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.interests')}</h2>
                {profile.top_interests?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.top_interests.map((interest: string) => (
                      <span key={interest} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>{isJa ? (INTEREST_JA[interest] ?? interest) : interest}</span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {profile.interests.filter((interest: string) => !profile.top_interests?.includes(interest)).map((interest: string) => (
                    <span key={interest} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{isJa ? (INTEREST_JA[interest] ?? interest) : interest}</span>
                  ))}
                </div>
              </section>
            )}

            {pp?.skills?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.skills')}</h2>
                {pp.top_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pp.top_skills.map((s: string) => (
                      <span key={s} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>{isJa ? (SKILL_JA[s] ?? SOCIAL_SKILL_JA[s] ?? s) : s}</span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {pp.skills.filter((s: string) => !pp.top_skills?.includes(s)).map((skill: string) => (
                    <span key={skill} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{isJa ? (SKILL_JA[skill] ?? SOCIAL_SKILL_JA[skill] ?? skill) : skill}</span>
                  ))}
                </div>
              </section>
            )}

            {profile.experience?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.experience')}</h2>
                <div className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {profile.experience.map((exp: any) => (
                    <div key={exp.id} className="rounded-xl p-3" style={{ backgroundColor: '#FAFAF8', border: '0.5px solid #F0E8E0' }}>
                      <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{exp.role}</p>
                      <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: '#7A6060' }}>
                        <span>{exp.company}</span>
                        {exp.years && (
                          <>
                            <span>·</span>
                            <span style={{ color: '#B8860B' }}>
                              {isNaN(Number(exp.years)) ? exp.years : `${exp.years} ${Number(exp.years) === 1 ? 'yr' : 'yrs'}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.education?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.education')}</h2>
                <div className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {profile.education.map((edu: any) => (
                    <div key={edu.id} className="rounded-xl p-3" style={{ backgroundColor: '#FAFAF8', border: '0.5px solid #F0E8E0' }}>
                      <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{edu.school}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#7A6060' }}>
                        {edu.degree}{edu.year ? <span style={{ color: '#aaa' }}> · Class of {edu.year}</span> : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.qualifications?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.qualifications')}</h2>
                <div className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {profile.qualifications.map((q: any, i: number) => (
                    <div key={i} className="rounded-xl p-3" style={{ backgroundColor: '#FAFAF8', border: '0.5px solid #F0E8E0' }}>
                      <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{q.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#7A6060' }}>
                        {q.issuer}{q.year ? <span style={{ color: '#aaa' }}> · {q.year}</span> : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.achievements?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.achievements')}</h2>
                <ul className="flex flex-col gap-2">
                  {profile.achievements.map((a: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: '#5A4040' }}>
                      <span style={{ color: '#B8860B' }}>·</span>{a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {reviews.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>{t('profile.reviews_section')}</h2>
                <div className="flex flex-col gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {reviews.map((review: any) => (
                    <div key={review.id} className="rounded-2xl p-4" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-xs">⭐</span>
                        ))}
                      </div>
                      {review.text && <p className="text-sm leading-relaxed mb-3" style={{ color: '#4A3030' }}>"{review.text}"</p>}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: '#FDF0E0', color: '#B8860B', border: '1px solid rgba(184,134,11,0.3)' }}>
                          {review.reviewer?.avatar_url
                            ? <img src={review.reviewer.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            : review.reviewer?.name?.[0]?.toUpperCase() ?? '?'
                          }
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: '#1A0208' }}>{review.reviewer?.name ?? 'Anonymous'}</p>
                          {review.reviewer?.location && <p className="text-xs" style={{ color: '#aaa' }}>{review.reviewer.location}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column — session options + availability */}
          {pp && (pp?.session_types?.length > 0 || pp?.availability?.days?.length > 0 || pp?.availability?.locations?.length > 0) && (
            <div className="col-span-1">
              <div className="sticky top-24 flex flex-col gap-6">

                {pp?.session_types?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>{t('profile.session_options')}</h2>
                    <div className="flex flex-col gap-3">
                      {pp.session_types.map((type: string) => {
                        const rateForType =
                          type === 'Online Call'       ? pp.online_rate :
                          type === '1-on-1 Session'    ? pp.inperson_rate :
                          type === 'Social Experience' ? pp.trial_rate :
                          null
                        const displayRate = rateForType ?? pp.hourly_rate
                        return (
                          <div key={type}
                            className="rounded-2xl p-4 transition-all cursor-pointer hover:-translate-y-0.5"
                            style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8DDD5')}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{SESSION_ICONS[type] ?? '📌'}</span>
                                <span className="text-sm font-semibold" style={{ color: '#1A0208' }}>{SESSION_TYPE_KEYS[type] ? t(SESSION_TYPE_KEYS[type]) : type}</span>
                              </div>
                              {displayRate && (
                                <span className="text-xs font-semibold" style={{ color: '#5C0A1E' }}>¥{displayRate.toLocaleString()}{t('profile.per_hr')}</span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: '#7A6060' }}>{SESSION_DESC_KEYS[type] ? t(SESSION_DESC_KEYS[type]) : ''}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {(pp?.availability?.day_schedule || pp?.availability?.days?.length > 0 || pp?.availability?.locations?.length > 0 || pp?.availability?.time_from) && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>{t('profile.availability')}</h2>
                    {(() => {
                      const ds = pp.availability?.day_schedule as Record<string, { from: string; to: string }[]> | undefined
                      const days: string[] = ds ? Object.keys(ds) : (pp.availability?.days ?? [])
                      if (!days.length) return null
                      return (
                        <div className="mb-3 flex flex-col gap-2">
                          {days.map((d: string) => {
                            const parseTime = (t: string) => {
                              const [time, period] = t.split(' ')
                              const [h, m] = time.split(':').map(Number)
                              return (period === 'PM' && h !== 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h) * 60 + m
                            }
                            const slots: { from: string; to: string }[] = [...(ds?.[d] ?? [])].sort((a, b) => parseTime(a.from) - parseTime(b.from))
                            return (
                              <div key={d} className="flex items-start gap-2">
                                <span className="text-xs font-semibold w-8 pt-0.5 flex-shrink-0" style={{ color: '#5C0A1E' }}>{d}</span>
                                <div className="flex flex-col gap-1">
                                  {slots.filter(s => s.from && s.to).length > 0
                                    ? slots.filter(s => s.from && s.to).map((s, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                                          {s.from} – {s.to}
                                        </span>
                                      ))
                                    : <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>{d}</span>
                                  }
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                    {[
                      [pp.availability?.time_from, pp.availability?.time_to],
                      [pp.availability?.time_from2, pp.availability?.time_to2],
                      [pp.availability?.time_from3, pp.availability?.time_to3],
                    ].some(([f, t]) => f || t) && (
                      <div className="mb-3">
                        <p className="text-xs mb-2" style={{ color: '#aaa' }}>Hours</p>
                        <div className="flex flex-col gap-1">
                          {[
                            [pp.availability?.time_from, pp.availability?.time_to],
                            [pp.availability?.time_from2, pp.availability?.time_to2],
                            [pp.availability?.time_from3, pp.availability?.time_to3],
                          ].filter(([f, t]) => f || t).map(([f, t], i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full w-fit" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                              {f ?? '—'} – {t ?? '—'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {pp.availability?.locations?.length > 0 && (
                      <div>
                        <p className="text-xs mb-2" style={{ color: '#aaa' }}>Locations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pp.availability.locations.map((l: string) => (
                            <span key={l} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{l}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

      {bookingOpen && pp && user && (
        <BookSessionModal
          provider={profile}
          providerProfile={pp}
          seekerId={user.id}
          onClose={() => setBookingOpen(false)}
        />
      )}

      {/* Sticky bottom bar — only for other users' profiles */}
      {!isOwnProfile && pp && (
        <div className="fixed bottom-0 left-0 right-0 z-20" style={{ backgroundColor: '#fff', borderTop: '0.5px solid #E8DDD5', boxShadow: '0 -2px 12px rgba(92,10,30,0.08)' }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{profile.name}</p>
              {(pp.online_rate || pp.inperson_rate || pp.trial_rate || pp.hourly_rate) && (
                <p className="text-xs" style={{ color: '#aaa' }}>
                  {pp.trial_rate ? `${t('profile.trial')} ¥${pp.trial_rate.toLocaleString()} · ` : ''}
                  {pp.online_rate ? `${t('profile.book_modal.online')} ¥${pp.online_rate.toLocaleString()}${t('profile.per_hr')}` : ''}
                  {pp.online_rate && pp.inperson_rate ? ' · ' : ''}
                  {pp.inperson_rate ? `${t('profile.book_modal.inperson')} ¥${pp.inperson_rate.toLocaleString()}${t('profile.per_hr')}` : ''}
                  {!pp.online_rate && !pp.inperson_rate && pp.hourly_rate ? `¥${pp.hourly_rate.toLocaleString()}${t('profile.per_hr')}` : ''}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSendMessage}
                disabled={messageSending}
                className="font-medium text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                style={{ border: '1px solid #B8860B', color: '#5C0A1E', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {t('profile.send_message')}
              </button>
              <button
                onClick={() => { if (!user) { navigate('/login'); return } setBookingOpen(true) }}
                className="font-medium text-sm px-6 py-2.5 rounded-xl transition-colors"
                style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}>
                {t('profile.book_session')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
