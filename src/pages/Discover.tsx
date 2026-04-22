// Discover page — maroon #5C0A1E, antique gold #B8860B, white + cream surfaces

import { useNavigate } from 'react-router-dom'

const profiles = [
  { id: 1, name: 'Yuki Tanaka', verified: true, title: 'Life Coach & English Tutor', skills: ['Coaching', 'English', 'Mindfulness'], rating: 4.9, reviews: 128, location: 'Tokyo', price: '¥8,000/hr', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Kenji Mori', verified: true, title: 'Golf Instructor & Business Advisor', skills: ['Golf', 'Business', 'Networking'], rating: 4.8, reviews: 95, location: 'Osaka', price: '¥10,000/hr', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Rin Sato', verified: true, title: 'Language Partner & Travel Guide', skills: ['Japanese', 'Travel', 'Culture'], rating: 4.7, reviews: 61, location: 'Kyoto', price: '¥5,000/hr', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 4, name: 'Takeshi Yamada', verified: false, title: 'Fitness Coach & Nutritionist', skills: ['Fitness', 'Nutrition', 'Wellness'], rating: 4.6, reviews: 44, location: 'Tokyo', price: '¥7,000/hr', image: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { id: 5, name: 'Aoi Nakamura', verified: true, title: 'Piano Teacher & Musician', skills: ['Music', 'Piano', 'Performance'], rating: 4.9, reviews: 83, location: 'Tokyo', price: '¥6,000/hr', image: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 6, name: 'Ryu Hashimoto', verified: true, title: 'Startup Mentor & Investor', skills: ['Business', 'Startups', 'Finance'], rating: 5.0, reviews: 37, location: 'Osaka', price: '¥15,000/hr', image: 'https://randomuser.me/api/portraits/men/41.jpg' },
  { id: 7, name: 'Mei Lin', verified: false, title: 'Yoga & Mindfulness Coach', skills: ['Yoga', 'Mindfulness', 'Wellness'], rating: 4.5, reviews: 29, location: 'Kyoto', price: '¥4,500/hr', image: 'https://randomuser.me/api/portraits/women/57.jpg' },
  { id: 8, name: 'Daiki Fujiwara', verified: true, title: 'Chef & Cooking Instructor', skills: ['Cooking', 'Japanese cuisine', 'Nutrition'], rating: 4.8, reviews: 72, location: 'Tokyo', price: '¥9,000/hr', image: 'https://randomuser.me/api/portraits/men/18.jpg' },
]

export default function Discover() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        <p className="text-sm mb-6" style={{ color: '#7A6060' }}>{profiles.length} profiles found</p>

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
              <div className="relative overflow-hidden" style={{ height: '280px' }}>
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {profile.verified && (
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
                    >
                      ✔
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }}
                  >
                    {profile.price}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-bold" style={{ color: '#1A0208' }}>{profile.name}</p>
                  <span className="text-xs" style={{ color: '#aaa' }}>⭐ {profile.rating}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#7A6060' }}>{profile.title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {profile.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: '#aaa' }}>📍 {profile.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
