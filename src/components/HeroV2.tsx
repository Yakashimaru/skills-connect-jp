import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}K+`
  if (n > 0) return `${n}+`
  return '—'
}

export default function HeroV2() {
  const { t } = useTranslation()

  const [stats, setStats] = useState({
    hosts:       '—',
    prefectures: '—',
    sessions:    '—',
    rating:      '—',
  })

  useEffect(() => {
    async function fetchStats() {
      const [hostsRes, locRes, sessionsRes, ratingsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('verified', true)
          .in('user_type', ['provider', 'both']),
        supabase
          .from('profiles')
          .select('location')
          .in('user_type', ['provider', 'both'])
          .not('location', 'is', null),
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        supabase
          .from('reviews')
          .select('rating'),
      ])

      const hostCount = hostsRes.count ?? 0
      const prefCount = new Set((locRes.data ?? []).map((p: any) => p.location)).size
      const sessionCount = sessionsRes.count ?? 0
      const ratings = (ratingsRes.data ?? []) as { rating: number }[]
      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : null

      setStats({
        hosts:       fmt(hostCount),
        prefectures: prefCount > 0 ? String(prefCount) : '47',
        sessions:    fmt(sessionCount),
        rating:      avgRating ? `${avgRating}★` : '—',
      })
    }
    fetchStats()
  }, [])

  return (
    <section className="relative w-full h-[92vh] overflow-hidden">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&auto=format&fit=crop"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Directional overlay — dark on left, fades right so photo shows through */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(105deg, rgba(26,2,8,0.92) 0%, rgba(26,2,8,0.78) 45%, rgba(26,2,8,0.38) 100%)',
      }} />

      {/* Bottom fade so stats don't float on raw image */}
      <div className="absolute inset-x-0 bottom-0 h-48" style={{
        background: 'linear-gradient(to top, rgba(26,2,8,0.75) 0%, transparent 100%)',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <p className="text-xs font-bold tracking-widest uppercase mb-7" style={{ color: '#B8860B' }}>
            {t('hero.eyebrow')}
          </p>

          {/* Headline */}
          <h1
            className="text-white leading-[1.15] mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
              fontWeight: 700,
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
              letterSpacing: '0.01em',
            }}
          >
            <span style={{ color: '#E8C458' }}>{t('hero.headline_1')}</span><br />
            {t('hero.headline_2')}<br />
            {t('hero.headline_3')}
          </h1>

          {/* Subtext */}
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
            {t('hero.subtext')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <NavLink
              to="/signup"
              className="px-8 py-3.5 rounded-full font-bold text-sm transition-all"
              style={{ backgroundColor: '#B8860B', color: '#1A0208' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#9A6F09'}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#B8860B'}
            >
              {t('hero.cta_start')}
            </NavLink>
            <NavLink
              to="/discover"
              className="px-8 py-3.5 rounded-full font-medium text-sm text-white transition-all"
              style={{ border: '1.5px solid rgba(255,255,255,0.38)' }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.10)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.60)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.38)'
              }}
            >
              {t('hero.cta_browse')}
            </NavLink>
          </div>

          {/* Stats — live from Supabase */}
          <div className="flex flex-wrap gap-8 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              { value: stats.hosts,       label: t('hero.stat_hosts') },
              { value: stats.prefectures, label: t('hero.stat_prefectures') },
              { value: stats.sessions,    label: t('hero.stat_sessions') },
              { value: stats.rating,      label: t('hero.stat_rating') },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-bold text-white text-xl leading-none">{stat.value}</span>
                <span className="text-xs leading-none mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
