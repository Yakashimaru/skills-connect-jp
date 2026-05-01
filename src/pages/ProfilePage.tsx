import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../lib/profiles'
import { getReviews } from '../lib/reviews'
import { getOrCreateConversation } from '../lib/messages'

const SESSION_ICONS: Record<string, string> = {
  '1-on-1 Session': '👤',
  'Group Meetup': '👥',
  'Online Call': '💻',
  'Social Experience': '🌸',
}

const SESSION_DESCS: Record<string, string> = {
  '1-on-1 Session': 'Private coaching or tutoring, online or in-person',
  'Group Meetup': 'Small group sessions (3–6 people)',
  'Online Call': 'Video or voice call via Zoom or Google Meet',
  'Social Experience': 'Casual meetup — café, walk, or cultural outing',
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [messageSending, setMessageSending] = useState(false)

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
            {profile.location && <span>📍 {profile.location}</span>}
            {pp && <span>⭐ {Number(pp.rating).toFixed(1)} ({pp.review_count} {t('profile.reviews')})</span>}
            {pp?.hourly_rate && <span className="font-semibold" style={{ color: '#5C0A1E' }}>¥{pp.hourly_rate.toLocaleString()}/hr</span>}
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

            {pp?.skills?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.skills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {pp.skills.map((skill: string) => (
                    <span key={skill} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {profile.experience?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.experience')}</h2>
                <div className="flex flex-col gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {profile.experience.map((exp: any) => (
                    <div key={exp.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#B8860B' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{exp.role}</p>
                        <p className="text-xs" style={{ color: '#aaa' }}>{exp.company}{exp.years ? ` · ${exp.years}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.education?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('profile.education')}</h2>
                <div className="flex flex-col gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {profile.education.map((edu: any) => (
                    <div key={edu.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#B8860B' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{edu.degree}</p>
                        <p className="text-xs" style={{ color: '#aaa' }}>{edu.school}{edu.year ? ` · ${edu.year}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

          {/* Right column — session options */}
          {pp?.session_types?.length > 0 && (
            <div className="col-span-1">
              <div className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>{t('profile.session_options')}</h2>
                <div className="flex flex-col gap-3">
                  {pp.session_types.map((type: string) => (
                    <div key={type}
                      className="rounded-2xl p-4 transition-all cursor-pointer hover:-translate-y-0.5"
                      style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8DDD5')}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{SESSION_ICONS[type] ?? '📌'}</span>
                        <span className="text-sm font-semibold" style={{ color: '#1A0208' }}>{type}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#7A6060' }}>{SESSION_DESCS[type] ?? ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar — only for other users' profiles */}
      {!isOwnProfile && pp && (
        <div className="fixed bottom-0 left-0 right-0 z-20" style={{ backgroundColor: '#fff', borderTop: '0.5px solid #E8DDD5', boxShadow: '0 -2px 12px rgba(92,10,30,0.08)' }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{profile.name}</p>
              {pp.hourly_rate && <p className="text-xs" style={{ color: '#aaa' }}>¥{pp.hourly_rate.toLocaleString()}/hr</p>}
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
