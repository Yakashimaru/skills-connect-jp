import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const events = [
  { id: 1, title: 'English Conversation Night', description: 'A casual evening for English learners and native speakers to connect over drinks.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop', host: { name: 'Yuki Tanaka', image: 'https://randomuser.me/api/portraits/women/44.jpg', verified: true }, date: 'Sat 29 Mar · 7:00 PM', location: 'Shibuya, Tokyo', participants: 14, maxParticipants: 20, price: 'Free', category: 'Social' },
  { id: 2, title: 'Golf & Networking Morning', description: 'Play 9 holes with other professionals and expand your network in a relaxed setting.', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop', host: { name: 'Kenji Mori', image: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true }, date: 'Sun 30 Mar · 8:00 AM', location: 'Odaiba Golf Club, Tokyo', participants: 8, maxParticipants: 12, price: '¥3,000', category: 'Sports' },
  { id: 3, title: 'Japanese Culture & Tea Ceremony', description: 'Experience an authentic tea ceremony hosted by a Kyoto local. Limited spots.', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop', host: { name: 'Rin Sato', image: 'https://randomuser.me/api/portraits/women/68.jpg', verified: true }, date: 'Sat 5 Apr · 2:00 PM', location: 'Gion, Kyoto', participants: 5, maxParticipants: 8, price: '¥2,500', category: 'Culture' },
  { id: 4, title: 'Startup Founders Dinner', description: 'Monthly dinner for early-stage founders. Share challenges, get feedback, build connections.', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop', host: { name: 'Ryu Hashimoto', image: 'https://randomuser.me/api/portraits/men/41.jpg', verified: true }, date: 'Thu 3 Apr · 7:30 PM', location: 'Namba, Osaka', participants: 11, maxParticipants: 15, price: '¥5,000', category: 'Business' },
  { id: 5, title: 'Morning Yoga in the Park', description: 'Start your weekend with a guided outdoor yoga session. All levels welcome.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop', host: { name: 'Mei Lin', image: 'https://randomuser.me/api/portraits/women/57.jpg', verified: false }, date: 'Sat 29 Mar · 7:30 AM', location: 'Maruyama Park, Kyoto', participants: 9, maxParticipants: 25, price: 'Free', category: 'Wellness' },
  { id: 6, title: 'Japanese Cooking Class', description: 'Learn to make ramen from scratch with a professional chef. Hands-on and delicious.', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop', host: { name: 'Daiki Fujiwara', image: 'https://randomuser.me/api/portraits/men/18.jpg', verified: true }, date: 'Sun 6 Apr · 11:00 AM', location: 'Shinjuku, Tokyo', participants: 6, maxParticipants: 10, price: '¥4,000', category: 'Food' },
]

export default function Meetups() {
  const { t } = useTranslation()
  const [view, setView] = useState<'list' | 'map'>('list')

  const categories = [
    { key: 'All', label: t('meetups.cat_all') },
    { key: 'Social', label: t('meetups.cat_social') },
    { key: 'Sports', label: t('meetups.cat_sports') },
    { key: 'Culture', label: t('meetups.cat_culture') },
    { key: 'Business', label: t('meetups.cat_business') },
    { key: 'Wellness', label: t('meetups.cat_wellness') },
    { key: 'Food', label: t('meetups.cat_food') },
  ]
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All' ? events : events.filter(e => e.category === activeCategory)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F2' }}>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>{t('meetups.eyebrow')}</p>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('meetups.heading')}</h1>
          </div>
          <div className="flex items-center p-1 rounded-full" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            {([['list', t('meetups.view_list')], ['map', t('meetups.view_map')]] as const).map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className="text-sm px-4 py-1.5 rounded-full transition-colors font-medium"
                style={view === v ? { backgroundColor: '#5C0A1E', color: '#fff' } : { color: '#aaa' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveCategory(key)}
              className="text-sm px-4 py-1.5 rounded-full transition-colors"
              style={activeCategory === key
                ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
                : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-sm mb-6" style={{ color: '#aaa' }}>{t('meetups.events_found', { count: filtered.length })}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <div key={event.id} className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={event.price === 'Free'
                        ? { backgroundColor: '#B8860B', color: '#3A2400' }
                        : { backgroundColor: 'rgba(255,255,255,0.92)', color: '#5C0A1E' }
                      }>
                      {event.price}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1" style={{ color: '#1A0208' }}>{event.title}</h3>
                  <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#7A6060' }}>{event.description}</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs" style={{ color: '#aaa' }}>📅 {event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs" style={{ color: '#aaa' }}>📍 {event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <img src={event.host.image} alt={event.host.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs" style={{ color: '#7A6060' }}>
                      {t('meetups.hosted_by')} <span className="font-medium" style={{ color: '#1A0208' }}>{event.host.name}</span>
                    </span>
                    {event.host.verified && <span className="text-xs" style={{ color: '#B8860B' }}>✔</span>}
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '0.5px solid #E8DDD5' }}>
                    <div>
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8DDD5' }}>
                        <div className="h-full rounded-full" style={{ width: `${(event.participants / event.maxParticipants) * 100}%`, backgroundColor: '#B8860B' }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#aaa' }}>{event.participants}/{event.maxParticipants} {t('meetups.joined')}</p>
                    </div>
                    <button className="text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                      style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
                    >
                      {t('meetups.rsvp')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="w-full h-[500px] rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
            <div className="text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-medium" style={{ color: '#1A0208' }}>{t('meetups.map_coming_soon')}</p>
              <p className="text-sm mt-1" style={{ color: '#aaa' }}>{t('meetups.map_pending')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
