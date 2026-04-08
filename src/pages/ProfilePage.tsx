// ProfilePage — public profile for a service provider
// Accessed by clicking a card on the Discover page (/profile/:id)
// Sticky bottom bar always visible: Book Session + Send Message

const profile = {
  name: 'Yuki Tanaka',
  verified: true,
  title: 'Life Coach & English Tutor',
  location: 'Tokyo',
  price: '¥8,000/hr',
  rating: 4.9,
  reviews: 128,
  image: 'https://randomuser.me/api/portraits/women/44.jpg',
  cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop',
  bio: 'Certified life coach and English tutor with over 8 years of experience helping people build confidence, navigate career transitions, and improve their communication skills. Fluent in English and Japanese. Available online and in-person in Tokyo.',
  skills: ['Life Coaching', 'English Tutoring', 'Mindfulness', 'Career Guidance', 'Public Speaking'],
  education: [
    { degree: 'BA Psychology', school: 'Waseda University', year: '2012' },
    { degree: 'Certified Life Coach', school: 'ICF Accredited Program', year: '2015' },
  ],
  experience: [
    { role: 'Senior Life Coach', company: 'Tokyo Wellness Center', years: '2018 – Present' },
    { role: 'English Instructor', company: 'ECC Language School', years: '2013 – 2018' },
  ],
  sessionTypes: [
    { type: '1-on-1 Session', icon: '👤', desc: 'Private coaching or tutoring, online or in-person' },
    { type: 'Group Meetup', icon: '👥', desc: 'Small group sessions (3–6 people)' },
    { type: 'Online Call', icon: '💻', desc: 'Video or voice call via Zoom or Google Meet' },
    { type: 'Social Experience', icon: '🌸', desc: 'Casual meetup — café, walk, or cultural outing' },
  ],
  testimonials: [
    { name: 'James R.', location: 'Tokyo', image: 'https://randomuser.me/api/portraits/men/11.jpg', text: 'Yuki helped me find clarity on my career direction. Her approach is warm, insightful, and practical.' },
    { name: 'Sophie M.', location: 'Osaka', image: 'https://randomuser.me/api/portraits/women/29.jpg', text: 'My English improved dramatically after just 3 sessions. Highly recommend for anyone serious about communication.' },
    { name: 'Hiroshi T.', location: 'Tokyo', image: 'https://randomuser.me/api/portraits/men/63.jpg', text: 'Very professional and easy to talk to. She listens deeply and gives really useful feedback.' },
  ],
}

export default function ProfilePage() {
  return (
    <div className="pb-24">

      {/* Cover photo */}
      <div className="relative w-full h-72 bg-gray-200">
        <img src={profile.cover} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* Avatar — overlaps cover photo */}
        <div className="relative -mt-14 mb-4">
          <img src={profile.image} alt={profile.name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md" />
        </div>

        {/* Name + info — fully below cover */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            {profile.verified && (
              <span className="bg-teal-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">✔ Verified</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-1">{profile.title}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>📍 {profile.location}</span>
            <span>⭐ {profile.rating} ({profile.reviews} reviews)</span>
            <span className="text-teal-500 font-semibold">{profile.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Bio */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{profile.bio}</p>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
              <div className="flex flex-col gap-3">
                {profile.experience.map((exp) => (
                  <div key={exp.role} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{exp.role}</p>
                      <p className="text-xs text-gray-400">{exp.company} · {exp.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
              <div className="flex flex-col gap-3">
                {profile.education.map((edu) => (
                  <div key={edu.degree} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{edu.degree}</p>
                      <p className="text-xs text-gray-400">{edu.school} · {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="flex flex-col gap-4">
                {profile.testimonials.map((t) => (
                  <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">"{t.text}"</p>
                    <div className="flex items-center gap-2">
                      <img src={t.image} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right column — session options */}
          <div className="col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Session options</h2>
              <div className="flex flex-col gap-3">
                {profile.sessionTypes.map((s) => (
                  <div key={s.type} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{s.type}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
            <p className="text-xs text-gray-400">{profile.price}</p>
          </div>
          <div className="flex gap-3">
            <button className="border border-gray-200 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Send Message
            </button>
            <button className="bg-black text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
              Book Session
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
