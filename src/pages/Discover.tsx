import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchProfiles } from '../lib/profiles'

// Convert Navbar filter value (e.g. 'okinawa-city', 'online') to a matchable label
const toLabel = (value: string): string => {
  if (value === 'online') return 'online only'
  return value.replace(/-/g, ' ')
}

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  'under5k': { max: 4999 },
  '5k-10k': { min: 5000, max: 10000 },
  'over10k': { min: 10001 },
}

export default function Discover() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all profiles once — every filter runs client-side after that
  useEffect(() => {
    searchProfiles({}).then(({ data, error: err }) => {
      if (err) setError(err.message)
      else setAllProfiles(data ?? [])
      setLoading(false)
    })
  }, [])

  const query = searchParams.get('q') ?? ''
  const locationParam = searchParams.get('location') ?? ''
  const skillsParam = searchParams.get('skills') ?? ''
  const priceParam = searchParams.get('price') ?? ''
  const ageParam = searchParams.get('age') ?? ''
  const genderParam = searchParams.get('gender') ?? ''
  const verifiedOnly = searchParams.get('verified') === '1'

  const profiles = useMemo(() => {
    let result = allProfiles

    // Name / title search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.provider_profile?.title?.toLowerCase().includes(q)
      )
    }

    // Location filter — substring match so 'shinjuku' matches 'Shinjuku, Tokyo' etc.
    if (locationParam) {
      const wanted = locationParam.split(',').map(toLabel)
      result = result.filter(p => {
        const loc = (p.location ?? '').toLowerCase()
        return wanted.some(l => loc.includes(l))
      })
    }

    // Skills / category filter — case-insensitive label match
    if (skillsParam) {
      const wanted = skillsParam.split(',').map(toLabel)
      result = result.filter(p => {
        const skills: string[] = (p.provider_profile?.skills ?? []).map((s: string) => s.toLowerCase())
        return wanted.some(w => skills.some(s => s.includes(w)))
      })
    }

    // Price filter
    if (priceParam) {
      const ranges = priceParam.split(',').map(k => PRICE_RANGES[k]).filter(Boolean)
      result = result.filter(p => {
        const rate: number = p.provider_profile?.hourly_rate ?? 0
        return ranges.some(r => (!r.min || rate >= r.min) && (!r.max || rate <= r.max))
      })
    }

    // Age range filter (uses birth_year)
    if (ageParam) {
      const year = new Date().getFullYear()
      const ranges = ageParam.split(',').map(a => {
        if (a === '20s')   return { min: year - 29, max: year - 20 }
        if (a === '30s')   return { min: year - 39, max: year - 30 }
        if (a === '40s')   return { min: year - 49, max: year - 40 }
        if (a === '50plus') return { min: 0, max: year - 50 }
        return null
      }).filter(Boolean) as { min: number; max: number }[]
      result = result.filter(p =>
        p.birth_year && ranges.some((r: { min: number; max: number }) => p.birth_year >= r.min && p.birth_year <= r.max)
      )
    }

    // Gender filter
    if (genderParam) {
      const wanted = genderParam.split(',').filter(g => g !== 'any')
      if (wanted.length) result = result.filter(p => wanted.includes(p.gender))
    }

    // Verified filter
    if (verifiedOnly) result = result.filter(p => p.verified)

    return result
  }, [allProfiles, query, locationParam, skillsParam, priceParam, ageParam, genderParam, verifiedOnly])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden animate-pulse" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
                <div style={{ height: '280px', backgroundColor: '#F0E8E0' }} />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: '#F0E8E0' }} />
                  <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: '#F0E8E0' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-center py-20" style={{ color: '#f87171' }}>{error}</p>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: '#7A6060' }}>
              {t('discover.profiles_found', { count: profiles.length })}
            </p>

            {profiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-lg font-semibold" style={{ color: '#1A0208' }}>{t('discover.no_results')}</p>
                <p className="text-sm" style={{ color: '#aaa' }}>{t('discover.no_results_hint')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => navigate(`/profile/${profile.id}`)}
                    className="rounded-3xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                    style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(92,10,30,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    {/* Photo */}
                    <div className="relative overflow-hidden flex items-center justify-center text-5xl font-bold" style={{ height: '280px', backgroundColor: '#FDF0E0', color: '#B8860B' }}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      ) : (
                        profile.name?.[0]?.toUpperCase() ?? '?'
                      )}
                      {profile.verified && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>✔</span>
                        </div>
                      )}
                      {profile.provider_profile?.hourly_rate && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }}>
                            ¥{profile.provider_profile.hourly_rate.toLocaleString()}/hr
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-bold" style={{ color: '#1A0208' }}>{profile.name}</p>
                        {profile.provider_profile?.rating > 0 && (
                          <span className="text-xs" style={{ color: '#aaa' }}>⭐ {Number(profile.provider_profile.rating).toFixed(1)}</span>
                        )}
                      </div>
                      {profile.provider_profile?.title && (
                        <p className="text-xs mb-3" style={{ color: '#7A6060' }}>{profile.provider_profile.title}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {(profile.provider_profile?.skills ?? []).slice(0, 2).map((skill: string) => (
                            <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                        {profile.location && (
                          <span className="text-xs" style={{ color: '#aaa' }}>📍 {profile.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
