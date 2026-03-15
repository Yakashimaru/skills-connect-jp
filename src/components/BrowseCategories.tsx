const categories = [
  { label: 'Coaching', emoji: '🎯' },
  { label: 'Language', emoji: '💬' },
  { label: 'Golf', emoji: '⛳' },
  { label: 'Fitness', emoji: '💪' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Business', emoji: '💼' },
  { label: 'Cooking', emoji: '🍳' },
  { label: 'Mentorship', emoji: '🌱' },
  { label: 'Music', emoji: '🎵' },
  { label: 'Mindfulness', emoji: '🧘' },
]

export default function BrowseCategories() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-2">Explore</p>
            <h2 className="text-3xl font-bold text-gray-900">Browse by skill</h2>
          </div>
          <button className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2">
            View all
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-2 bg-gray-50 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
