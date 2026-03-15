// FeaturedProfiles — curated profile card grid on the home page
// Shows a sample of community members to give visitors a feel for the platform
// Mock data only — replace with API call when backend is ready
const profiles = [
  {
    id: 1,
    name: 'Yuki Tanaka',
    verified: true,
    title: 'Life Coach & English Tutor',
    skills: ['Coaching', 'English', 'Mindfulness'],
    rating: 4.9,
    reviews: 128,
    location: 'Tokyo',
    price: '¥8,000/hr',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Kenji Mori',
    verified: true,
    title: 'Golf Instructor & Business Advisor',
    skills: ['Golf', 'Business', 'Networking'],
    rating: 4.8,
    reviews: 95,
    location: 'Osaka',
    price: '¥10,000/hr',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    name: 'Rin Sato',
    verified: true,
    title: 'Language Partner & Travel Guide',
    skills: ['Japanese', 'Travel', 'Culture'],
    rating: 4.7,
    reviews: 61,
    location: 'Kyoto',
    price: '¥5,000/hr',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 4,
    name: 'Takeshi Yamada',
    verified: false,
    title: 'Fitness Coach & Nutritionist',
    skills: ['Fitness', 'Nutrition', 'Wellness'],
    rating: 4.6,
    reviews: 44,
    location: 'Tokyo',
    price: '¥7,000/hr',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
]

export default function FeaturedProfiles() {
  return (
    <section className="bg-white py-16">
    <div className="max-w-6xl mx-auto px-6">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-2">Meet the community</p>
          <h2 className="text-3xl font-bold text-gray-900">Featured profiles</h2>
        </div>
        <button className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2">
          View all
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden">
            {/* Photo */}
            <div className="relative h-60 bg-gray-100">
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">📍 {profile.location}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="font-semibold text-gray-900 text-sm">{profile.name}</span>
                {profile.verified && <span className="text-teal-500 text-xs">✔</span>}
              </div>
              <p className="text-xs text-gray-400 mb-2">{profile.title}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.skills.slice(0, 2).map((skill) => (
                  <span key={skill} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 2 && (
                  <span className="text-xs text-gray-400">+{profile.skills.length - 2}</span>
                )}
              </div>

              {/* Rating + price */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>⭐ {profile.rating} ({profile.reviews} reviews)</span>
                <span className="text-teal-500 font-medium">{profile.price}</span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  )
}
