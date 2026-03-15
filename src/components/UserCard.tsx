interface User {
  id: number
  name: string
  verified: boolean
  title: string
  skills: string[]
  rating: number
  reviews: number
  location: string
  price: string
  image: string
}

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Photo */}
      <div className="relative h-52 bg-gray-100">
        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
          {user.price}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-gray-900">{user.name}</span>
          {user.verified && (
            <span className="text-blue-500 text-sm">✔</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-3">{user.title}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {user.skills.map((skill) => (
            <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>

        {/* Rating + Location */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>⭐ {user.rating} ({user.reviews})</span>
          <span>📍 {user.location}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Connect
          </button>
          <button className="flex-1 bg-black text-white text-sm font-medium py-2 rounded-xl hover:bg-gray-900 transition-colors">
            Book Session
          </button>
        </div>
      </div>
    </div>
  )
}
