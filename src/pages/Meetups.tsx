import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getEvents, rsvpToEvent, cancelRsvp, getUserRsvps } from '../lib/events'
import type { EventCategory } from '../lib/types'

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function Meetups() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [view, setView] = useState<'list' | 'map'>('list')
  const [activeCategory, setActiveCategory] = useState<'All' | EventCategory>('All')
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set())

  useEffect(() => {
    getEvents({}).then(({ data }) => { setAllEvents(data ?? []); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!user) return
    getUserRsvps(user.id).then(({ data }) => {
      if (data) setRsvpd(new Set(data.map((r: any) => r.event_id)))
    })
  }, [user])

  const events = useMemo(() => {
    if (activeCategory === 'All') return allEvents
    return allEvents.filter(ev => ev.category === activeCategory)
  }, [allEvents, activeCategory])

  const categories: { key: 'All' | EventCategory; label: string }[] = [
    { key: 'All', label: t('meetups.cat_all') },
    { key: 'social', label: t('meetups.cat_social') },
    { key: 'sports', label: t('meetups.cat_sports') },
    { key: 'culture', label: t('meetups.cat_culture') },
    { key: 'business', label: t('meetups.cat_business') },
    { key: 'wellness', label: t('meetups.cat_wellness') },
    { key: 'food', label: t('meetups.cat_food') },
  ]

  const handleRsvp = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (rsvpd.has(eventId)) {
      const { error } = await cancelRsvp(eventId, user.id)
      if (error) { console.error('Cancel RSVP failed:', error.message); return }
      setRsvpd(prev => { const next = new Set(prev); next.delete(eventId); return next })
      setAllEvents(prev => prev.map(ev =>
        ev.id === eventId ? { ...ev, participant_count: Math.max(0, (ev.participant_count ?? 0) - 1) } : ev
      ))
      return
    }
    const { error } = await rsvpToEvent(eventId, user.id)
    if (error) { console.error('RSVP failed:', error.message); return }
    setRsvpd(prev => new Set([...prev, eventId]))
    setAllEvents(prev => prev.map(ev =>
      ev.id === eventId ? { ...ev, participant_count: (ev.participant_count ?? 0) + 1 } : ev
    ))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F2' }}>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>{t('meetups.eyebrow')}</p>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('meetups.heading')}</h1>
          </div>
          <div className="flex items-center p-1 rounded-full" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            {([['list', t('meetups.view_list')], ['map', t('meetups.view_map')]] as const).map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className="text-sm px-4 py-1.5 rounded-full transition-colors font-medium"
                style={view === v ? { backgroundColor: '#5C0A1E', color: '#fff' } : { color: '#aaa' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveCategory(key)}
              className="text-sm px-4 py-1.5 rounded-full transition-colors"
              style={activeCategory === key
                ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
                : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
                  <div className="h-44" style={{ backgroundColor: '#F0E8E0' }} />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: '#F0E8E0' }} />
                    <div className="h-3 rounded-full w-full" style={{ backgroundColor: '#F0E8E0' }} />
                    <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: '#F0E8E0' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-lg font-semibold" style={{ color: '#1A0208' }}>{t('meetups.no_events_found')}</p>
              <p className="text-sm" style={{ color: '#aaa' }}>{t('meetups.try_different_category')}</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: '#aaa' }}>{t('meetups.events_found', { count: events.length })}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => {
                  const host = event.host
                  const spotsLeft = event.max_participants ? event.max_participants - (event.participant_count ?? 0) : null
                  const isFull = spotsLeft !== null && spotsLeft <= 0
                  const hasRsvpd = rsvpd.has(event.id)

                  return (
                    <div key={event.id}
                      className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                      style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>

                      {/* Image */}
                      <div className="relative h-44 overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: '#FDF0E0' }}>
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <span className="text-4xl">🎉</span>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={event.price === 0
                              ? { backgroundColor: '#B8860B', color: '#3A2400' }
                              : { backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }}>
                            {event.price === 0 ? 'Free' : `¥${event.price.toLocaleString()}`}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold mb-1" style={{ color: '#1A0208' }}>{event.title}</h3>
                        {event.description && (
                          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#7A6060' }}>{event.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs" style={{ color: '#aaa' }}>📅 {formatEventDate(event.start_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-xs" style={{ color: '#aaa' }}>📍 {event.location}</span>
                        </div>

                        {/* Host */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: '#FDF0E0', color: '#B8860B' }}>
                            {host?.avatar_url
                              ? <img src={host.avatar_url} alt={host.name} className="w-full h-full object-cover" />
                              : host?.name?.[0]?.toUpperCase() ?? '?'
                            }
                          </div>
                          <span className="text-xs" style={{ color: '#7A6060' }}>
                            {t('meetups.hosted_by')}{' '}
                            <span className="font-medium" style={{ color: '#1A0208' }}>{host?.name ?? '—'}</span>
                          </span>
                          {host?.verified && <span className="text-xs" style={{ color: '#B8860B' }}>✔</span>}
                        </div>

                        {/* Capacity + RSVP */}
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '0.5px solid #E8DDD5' }}>
                          <div>
                            {event.max_participants && (
                              <>
                                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8DDD5' }}>
                                  <div className="h-full rounded-full" style={{
                                    width: `${Math.min(100, ((event.participant_count ?? 0) / event.max_participants) * 100)}%`,
                                    backgroundColor: '#B8860B',
                                  }} />
                                </div>
                                <p className="text-xs mt-1" style={{ color: '#aaa' }}>
                                  {event.participant_count ?? 0}/{event.max_participants} {t('meetups.joined')}
                                </p>
                              </>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleRsvp(e, event.id)}
                            disabled={isFull && !hasRsvpd}
                            className="text-xs font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60 group"
                            style={hasRsvpd
                              ? { backgroundColor: '#FDF0E0', color: '#7A4A00' }
                              : { backgroundColor: '#5C0A1E', color: '#fff' }}
                            onMouseEnter={e => {
                              if (hasRsvpd) { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#991B1B'; e.currentTarget.textContent = '✕ Cancel' }
                              else if (!isFull) e.currentTarget.style.backgroundColor = '#3A0612'
                            }}
                            onMouseLeave={e => {
                              if (hasRsvpd) { e.currentTarget.style.backgroundColor = '#FDF0E0'; e.currentTarget.style.color = '#7A4A00'; e.currentTarget.textContent = '✓ Going' }
                              else if (!isFull) e.currentTarget.style.backgroundColor = '#5C0A1E'
                            }}>
                            {hasRsvpd ? '✓ Going' : isFull ? 'Full' : t('meetups.rsvp')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="w-full h-[500px] rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            <div className="text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-medium" style={{ color: '#1A0208' }}>{t('meetups.map_coming_soon')}</p>
              <p className="text-sm mt-1" style={{ color: '#aaa' }}>{t('meetups.map_pending')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
