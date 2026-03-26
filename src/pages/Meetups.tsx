// Meetups page — browse upcoming events and meetups
// Toggle between list view and map view (map is placeholder until Google Maps / Mapbox is integrated)
// Event cards: photo, title, host, date, participants, RSVP

import { useState } from 'react'

const events = [
  {
    id: 1,
    title: 'English Conversation Night',
    description: 'A casual evening for English learners and native speakers to connect over drinks.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop',
    host: { name: 'Yuki Tanaka', image: 'https://randomuser.me/api/portraits/women/44.jpg', verified: true },
    date: 'Sat 29 Mar · 7:00 PM',
    location: 'Shibuya, Tokyo',
    participants: 14,
    maxParticipants: 20,
    price: 'Free',
    category: 'Social',
  },
  {
    id: 2,
    title: 'Golf & Networking Morning',
    description: 'Play 9 holes with other professionals and expand your network in a relaxed setting.',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop',
    host: { name: 'Kenji Mori', image: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true },
    date: 'Sun 30 Mar · 8:00 AM',
    location: 'Odaiba Golf Club, Tokyo',
    participants: 8,
    maxParticipants: 12,
    price: '¥3,000',
    category: 'Sports',
  },
  {
    id: 3,
    title: 'Japanese Culture & Tea Ceremony',
    description: 'Experience an authentic tea ceremony hosted by a Kyoto local. Limited spots.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop',
    host: { name: 'Rin Sato', image: 'https://randomuser.me/api/portraits/women/68.jpg', verified: true },
    date: 'Sat 5 Apr · 2:00 PM',
    location: 'Gion, Kyoto',
    participants: 5,
    maxParticipants: 8,
    price: '¥2,500',
    category: 'Culture',
  },
  {
    id: 4,
    title: 'Startup Founders Dinner',
    description: 'Monthly dinner for early-stage founders. Share challenges, get feedback, build connections.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop',
    host: { name: 'Ryu Hashimoto', image: 'https://randomuser.me/api/portraits/men/41.jpg', verified: true },
    date: 'Thu 3 Apr · 7:30 PM',
    location: 'Namba, Osaka',
    participants: 11,
    maxParticipants: 15,
    price: '¥5,000',
    category: 'Business',
  },
  {
    id: 5,
    title: 'Morning Yoga in the Park',
    description: 'Start your weekend with a guided outdoor yoga session. All levels welcome.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
    host: { name: 'Mei Lin', image: 'https://randomuser.me/api/portraits/women/57.jpg', verified: false },
    date: 'Sat 29 Mar · 7:30 AM',
    location: 'Maruyama Park, Kyoto',
    participants: 9,
    maxParticipants: 25,
    price: 'Free',
    category: 'Wellness',
  },
  {
    id: 6,
    title: 'Japanese Cooking Class',
    description: 'Learn to make ramen from scratch with a professional chef. Hands-on and delicious.',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop',
    host: { name: 'Daiki Fujiwara', image: 'https://randomuser.me/api/portraits/men/18.jpg', verified: true },
    date: 'Sun 6 Apr · 11:00 AM',
    location: 'Shinjuku, Tokyo',
    participants: 6,
    maxParticipants: 10,
    price: '¥4,000',
    category: 'Food',
  },
]

const categories = ['All', 'Social', 'Sports', 'Culture', 'Business', 'Wellness', 'Food']

export default function Meetups() {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? events : events.filter(e => e.category === activeCategory)

  return (
    <div className="bg-white min-h-screen">

      {/* Page header */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-2">Upcoming</p>
            <h1 className="text-3xl font-bold text-gray-900">Meetups & Events</h1>
          </div>

          {/* Map / List toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setView('list')}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors font-medium ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors font-medium ${view === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Map
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-sm text-gray-400 mb-6">{filtered.length} events found</p>
          <div className="grid grid-cols-3 gap-6">
            {filtered.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden">
                {/* Event photo */}
                <div className="relative h-44 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      event.price === 'Free' ? 'bg-teal-500 text-white' : 'bg-white/90 text-gray-700'
                    }`}>{event.price}</span>
                  </div>
                </div>

                {/* Event info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{event.description}</p>

                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs text-gray-400">📅 {event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs text-gray-400">📍 {event.location}</span>
                  </div>

                  {/* Host */}
                  <div className="flex items-center gap-2 mb-4">
                    <img src={event.host.image} alt={event.host.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-gray-500">Hosted by <span className="font-medium text-gray-700">{event.host.name}</span></span>
                    {event.host.verified && <span className="text-teal-500 text-xs">✔</span>}
                  </div>

                  {/* Participants + RSVP */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{event.participants}/{event.maxParticipants} joined</p>
                    </div>
                    <button className="bg-black text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                      RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Map placeholder */
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="text-gray-500 font-medium">Map view coming soon</p>
              <p className="text-gray-400 text-sm mt-1">Google Maps / Mapbox integration pending</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
