import { useNavigate } from 'react-router-dom'

const C = {
  brand: '#5C0A1E',
  gold: '#B8860B',
  cream: '#FDF0E0',
  muted: '#7A6060',
  text: '#1A0208',
  border: '#E8DDD5',
}

function formatLastOnline(ts: string | null): { label: string; online: boolean } | null {
  if (!ts) return null
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 5) return { label: 'Online', online: true }
  if (mins < 60) return { label: `${mins}m ago`, online: false }
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return { label: `${hrs}h ago`, online: false }
  const days = Math.floor(hrs / 24)
  if (days < 30) return { label: `${days}d ago`, online: false }
  return null
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
  isSaved?: boolean
  onSaveToggle?: (id: string, e: React.MouseEvent) => void
}

export default function ProviderCard({ profile, isSaved, onSaveToggle }: Props) {
  const navigate = useNavigate()
  const online = formatLastOnline(profile.last_online ?? null)

  return (
    <div
      onClick={() => navigate(`/profile/${profile.id}`)}
      className="rounded-3xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: '#fff', border: `0.5px solid ${C.border}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(92,10,30,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Photo */}
      <div className="relative overflow-hidden flex items-center justify-center text-5xl font-bold"
        style={{ height: '280px', backgroundColor: C.cream, color: C.gold }}>
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        ) : (
          profile.name?.[0]?.toUpperCase() ?? '?'
        )}

        {/* Save button */}
        {onSaveToggle && (
          <button
            onClick={e => { e.stopPropagation(); onSaveToggle(profile.id, e) }}
            className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.88)', color: isSaved ? '#e53e3e' : '#aaa' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e53e3e')}
            onMouseLeave={e => (e.currentTarget.style.color = isSaved ? '#e53e3e' : '#aaa')}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        )}

        {/* Verified badge */}
        {profile.verified && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: C.gold, color: '#3A2400' }}>✔</span>
          </div>
        )}

        {/* Price */}
        {profile.provider_profile?.hourly_rate && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: C.brand }}>
              ¥{profile.provider_profile.hourly_rate.toLocaleString()}/hr
            </span>
          </div>
        )}

        {/* Last online */}
        {online && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.88)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: online.online ? '#22c55e' : '#aaa' }} />
            <span className="text-xs font-medium" style={{ color: online.online ? '#15803d' : '#999' }}>
              {online.label}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <p className="font-bold" style={{ color: C.text }}>{profile.name}</p>
          {profile.provider_profile?.rating > 0 && (
            <span className="text-xs" style={{ color: '#aaa' }}>⭐ {Number(profile.provider_profile.rating).toFixed(1)}</span>
          )}
        </div>
        {profile.provider_profile?.title && (
          <p className="text-xs mb-3" style={{ color: C.muted }}>{profile.provider_profile.title}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {(profile.provider_profile?.skills ?? []).slice(0, 2).map((skill: string) => (
              <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: C.cream, color: '#7A4A00' }}>
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
  )
}
