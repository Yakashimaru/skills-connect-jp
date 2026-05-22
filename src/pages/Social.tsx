import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchProfiles, saveProfile, unsaveProfile, getSavedProfiles } from '../lib/profiles'
import { useAuth } from '../context/AuthContext'
import ProviderCard from '../components/ProviderCard'
import { SOCIAL_SKILLS } from '../lib/constants'

const toLabel = (value: string): string => {
  if (value === 'online') return 'online only'
  return value.replace(/-/g, ' ')
}

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  'under5k': { max: 4999 },
  '5k-10k': { min: 5000, max: 10000 },
  'over10k': { min: 10001 },
}

export default function Social() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => { document.title = t('social.heading') }, [t])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    searchProfiles({}).then(({ data, error: err }) => {
      if (err) setError(err.message)
      else setAllProfiles(data ?? [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    getSavedProfiles(user.id).then(({ data }) => {
      if (data) setSavedIds(new Set(data.map((r: any) => r.saved_profile_id)))
    })
  }, [user])

  const handleSaveToggle = useCallback(async (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (savedIds.has(profileId)) {
      await unsaveProfile(user.id, profileId)
      setSavedIds(prev => { const next = new Set(prev); next.delete(profileId); return next })
    } else {
      await saveProfile(user.id, profileId)
      setSavedIds(prev => new Set([...prev, profileId]))
    }
  }, [user, savedIds, navigate])

  const query = searchParams.get('q') ?? ''
  const locationParam = searchParams.get('location') ?? ''
  const skillsParam = searchParams.get('skills') ?? ''
  const priceParam = searchParams.get('price') ?? ''
  const ageParam = searchParams.get('age') ?? ''
  const genderParam = searchParams.get('gender') ?? ''
  const verifiedOnly = searchParams.get('verified') === '1'

  const profiles = useMemo(() => {
    let result = allProfiles.filter(p => !p.vacation_mode)

    // Pre-filter: only profiles with at least one social skill
    result = result.filter(p => {
      const skills: string[] = (p.provider_profile?.skills ?? []).map((s: string) => s.toLowerCase())
      return skills.some(s => SOCIAL_SKILLS.has(s))
    })

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.provider_profile?.title?.toLowerCase().includes(q)
      )
    }

    if (locationParam) {
      const wanted = locationParam.split(',').map(toLabel)
      result = result.filter(p => {
        const loc = (p.location ?? '').toLowerCase()
        return wanted.some(l => loc.includes(l))
      })
    }

    if (skillsParam) {
      const wanted = skillsParam.split(',').map(toLabel)
      result = result.filter(p => {
        const skills: string[] = (p.provider_profile?.skills ?? []).map((s: string) => s.toLowerCase())
        return wanted.some(w => skills.some(s => s.includes(w)))
      })
    }

    if (priceParam) {
      const ranges = priceParam.split(',').map(k => PRICE_RANGES[k]).filter(Boolean)
      result = result.filter(p => {
        const rate: number = p.provider_profile?.hourly_rate ?? 0
        return ranges.some(r => (!r.min || rate >= r.min) && (!r.max || rate <= r.max))
      })
    }

    if (ageParam) {
      const year = new Date().getFullYear()
      const ranges = ageParam.split(',').map(a => {
        if (a === '20s')    return { min: year - 29, max: year - 20 }
        if (a === '30s')    return { min: year - 39, max: year - 30 }
        if (a === '40s')    return { min: year - 49, max: year - 40 }
        if (a === '50plus') return { min: 0, max: year - 50 }
        return null
      }).filter(Boolean) as { min: number; max: number }[]
      result = result.filter(p =>
        p.birth_year && ranges.some((r: { min: number; max: number }) => p.birth_year >= r.min && p.birth_year <= r.max)
      )
    }

    if (genderParam) {
      const wanted = genderParam.split(',').filter(g => g !== 'any')
      if (wanted.length) result = result.filter(p => wanted.includes(p.gender))
    }

    if (verifiedOnly) result = result.filter(p => p.verified)

    return result
  }, [allProfiles, query, locationParam, skillsParam, priceParam, ageParam, genderParam, verifiedOnly])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>{t('social.eyebrow')}</p>
        </div>

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
              {t('social.profiles_found', { count: profiles.length })}
            </p>

            {profiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-lg font-semibold" style={{ color: '#1A0208' }}>{t('social.no_results')}</p>
                <p className="text-sm" style={{ color: '#aaa' }}>{t('social.no_results_hint')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <ProviderCard
                    key={profile.id}
                    profile={profile}
                    isSaved={savedIds.has(profile.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
