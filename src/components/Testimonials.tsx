// Testimonials — social proof section with user quotes
// Mock data only — replace with real testimonials from Amanda/client
const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Tokyo',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: 'I found an amazing English conversation partner through SkillConnect. We meet weekly and my confidence has improved so much.',
  },
  {
    name: 'Hiroshi K.',
    location: 'Osaka',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    text: 'As a golf instructor, this platform helped me connect with serious learners. Bookings are smooth and the quality of clients is great.',
  },
  {
    name: 'Emma L.',
    location: 'Kyoto',
    image: 'https://randomuser.me/api/portraits/women/35.jpg',
    text: 'I wanted to learn about Japanese culture from a local. Found the perfect guide — we went to hidden spots tourists never see.',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-3">Real stories</p>
          <h2 className="text-4xl font-bold text-gray-900">What people are saying</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
