// Discover page — browse and filter all profiles
// Filter bar is rendered inside Navbar when on this route
import ProfileCard from '../components/ProfileCard'

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
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-400 mb-6">{profiles.length} profiles found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  )
}
