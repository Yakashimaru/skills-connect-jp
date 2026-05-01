import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchProfiles } from '../lib/profiles'

export default function FeaturedProfiles() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchProfiles({ limit: 8 }).then(({ data }) => {
      const sorted = (data ?? [])
        .filter(p => p.provider_profile)
        .sort((a, b) => (b.provider_profile?.rating ?? 0) - (a.provider_profile?.rating ?? 0))
        .slice(0, 4)
      setProfiles(sorted)
      setLoading(false)
    })
  }, [])

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>{t('featured.eyebrow')}</p>
            <h2 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('featured.heading')}</h2>
          </div>
          <button onClick={() => navigate('/discover')}
            className="text-sm hover:opacity-70 transition-opacity underline underline-offset-2"
            style={{ color: '#5C0A1E' }}>
            {t('featured.view_all')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
                <div className="h-60" style={{ backgroundColor: '#F0E8E0' }} />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: '#F0E8E0' }} />
                  <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: '#F0E8E0' }} />
                </div>
              </div>
            ))
          ) : profiles.length === 0 ? (
            <div className="col-span-4 py-12 text-center">
              <p className="text-sm" style={{ color: '#aaa' }}>{t('featured.no_providers')}</p>
            </div>
          ) : profiles.map((profile) => {
            const pp = profile.provider_profile
            const skills: string[] = pp?.skills ?? []
            return (
              <div
                key={profile.id}
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5', boxShadow: '0 1px 4px rgba(92,10,30,0.06)' }}
              >
                <div className="relative h-60 flex items-center justify-center text-4xl font-bold"
                  style={{ backgroundColor: '#FDF0E0', color: '#B8860B' }}>
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                    : profile.name?.[0]?.toUpperCase() ?? '?'
                  }
                  {profile.location && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }}>
                        📍 {profile.location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: '#1A0208' }}>{profile.name}</span>
                    {profile.verified && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full ml-1"
                        style={{ backgroundColor: 'rgba(184,134,11,0.15)', color: '#7A5000', fontSize: '10px' }}>✔</span>
                    )}
                  </div>
                  {pp?.title && <p className="text-xs mb-2" style={{ color: '#7A6060' }}>{pp.title}</p>}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                        {skill}
                      </span>
                    ))}
                    {skills.length > 2 && (
                      <span className="text-xs" style={{ color: '#aaa' }}>+{skills.length - 2}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs" style={{ color: '#aaa' }}>
                    <span>⭐ {Number(pp?.rating ?? 0).toFixed(1)} ({pp?.review_count ?? 0})</span>
                    {pp?.hourly_rate && (
                      <span className="font-medium" style={{ color: '#5C0A1E' }}>¥{pp.hourly_rate.toLocaleString()}/hr</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
