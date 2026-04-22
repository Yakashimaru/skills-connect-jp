// FeaturedProfiles — white bg, maroon price, gold verified badge, warm gold tags

const profiles = [
  { id: 1, name: 'Yuki Tanaka', verified: true, title: 'Life Coach & English Tutor', skills: ['Coaching', 'English', 'Mindfulness'], rating: 4.9, reviews: 128, location: 'Tokyo', price: '¥8,000/hr', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Kenji Mori', verified: true, title: 'Golf Instructor & Business Advisor', skills: ['Golf', 'Business', 'Networking'], rating: 4.8, reviews: 95, location: 'Osaka', price: '¥10,000/hr', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Rin Sato', verified: true, title: 'Language Partner & Travel Guide', skills: ['Japanese', 'Travel', 'Culture'], rating: 4.7, reviews: 61, location: 'Kyoto', price: '¥5,000/hr', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 4, name: 'Takeshi Yamada', verified: false, title: 'Fitness Coach & Nutritionist', skills: ['Fitness', 'Nutrition', 'Wellness'], rating: 4.6, reviews: 44, location: 'Tokyo', price: '¥7,000/hr', image: 'https://randomuser.me/api/portraits/men/55.jpg' },
]

export default function FeaturedProfiles() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>Meet the community</p>
            <h2 className="text-3xl font-bold" style={{ color: '#1A0208' }}>Featured profiles</h2>
          </div>
          <button className="text-sm hover:opacity-70 transition-opacity underline underline-offset-2" style={{ color: '#5C0A1E' }}>
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5', boxShadow: '0 1px 4px rgba(92,10,30,0.06)' }}
            >
              <div className="relative h-60 bg-gray-100">
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }}>
                    📍 {profile.location}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-semibold text-sm" style={{ color: '#1A0208' }}>{profile.name}</span>
                  {profile.verified && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ backgroundColor: 'rgba(184,134,11,0.15)', color: '#7A5000', fontSize: '10px' }}>✔</span>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: '#7A6060' }}>{profile.title}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 2 && (
                    <span className="text-xs" style={{ color: '#aaa' }}>+{profile.skills.length - 2}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: '#aaa' }}>
                  <span>⭐ {profile.rating} ({profile.reviews})</span>
                  <span className="font-medium" style={{ color: '#5C0A1E' }}>{profile.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
