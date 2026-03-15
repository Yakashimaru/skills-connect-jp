// ProfileCard — profile card used in Discover grid
// Large photo top, clean info below, navigates to profile page on click
import { useNavigate } from 'react-router-dom'

export interface Profile {
  id: number; name: string; verified: boolean; title: string;
  skills: string[]; rating: number; reviews: number;
  location: string; price: string; image: string;
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/profile/${profile.id}`)} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
      {/* Large photo */}
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {profile.verified && (
          <div className="absolute top-3 right-3">
            <span className="bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">✔</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-teal-600 px-3 py-1 rounded-full">{profile.price}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <p className="font-bold text-gray-900">{profile.name}</p>
          <span className="text-xs text-gray-400">⭐ {profile.rating}</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">{profile.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {profile.skills.slice(0, 2).map((skill) => (
              <span key={skill} className="text-xs bg-teal-50 text-teal-600 px-2.5 py-0.5 rounded-full">{skill}</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">📍 {profile.location}</span>
        </div>
      </div>
    </div>
  )
}
