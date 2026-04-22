// ProfilePage — maroon #5C0A1E, antique gold #B8860B, white surfaces

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
    <div className="pb-24 bg-white">

      {/* Cover photo */}
      <div className="relative w-full h-72 bg-gray-200">
        <img src={profile.cover} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(20,2,6,0.45)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* Avatar */}
        <div className="relative -mt-14 mb-4">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-28 h-28 rounded-2xl object-cover"
            style={{ border: '3px solid #fff', boxShadow: '0 2px 12px rgba(92,10,30,0.15)' }}
          />
        </div>

        {/* Name + info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-bold" style={{ color: '#1A0208' }}>{profile.name}</h1>
            {profile.verified && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>✔ Verified</span>
            )}
          </div>
          <p className="text-sm mb-1" style={{ color: '#7A6060' }}>{profile.title}</p>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#aaa' }}>
            <span>📍 {profile.location}</span>
            <span>⭐ {profile.rating} ({profile.reviews} reviews)</span>
            <span className="font-semibold" style={{ color: '#5C0A1E' }}>{profile.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>About</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5A4040' }}>{profile.bio}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>{skill}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>Experience</h2>
              <div className="flex flex-col gap-3">
                {profile.experience.map((exp) => (
                  <div key={exp.role} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#B8860B' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{exp.role}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{exp.company} · {exp.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>Education</h2>
              <div className="flex flex-col gap-3">
                {profile.education.map((edu) => (
                  <div key={edu.degree} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#B8860B' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{edu.degree}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{edu.school} · {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>Reviews</h2>
              <div className="flex flex-col gap-4">
                {profile.testimonials.map((t) => (
                  <div key={t.name} className="rounded-2xl p-4" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#4A3030' }}>"{t.text}"</p>
                    <div className="flex items-center gap-2">
                      <img src={t.image} alt={t.name} className="w-8 h-8 rounded-full object-cover" style={{ border: '1px solid rgba(184,134,11,0.3)' }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#1A0208' }}>{t.name}</p>
                        <p className="text-xs" style={{ color: '#aaa' }}>{t.location}</p>
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
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A0208' }}>Session options</h2>
              <div className="flex flex-col gap-3">
                {profile.sessionTypes.map((s) => (
                  <div
                    key={s.type}
                    className="rounded-2xl p-4 transition-all cursor-pointer hover:-translate-y-0.5"
                    style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-sm font-semibold" style={{ color: '#1A0208' }}>{s.type}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#7A6060' }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ backgroundColor: '#fff', borderTop: '0.5px solid #E8DDD5', boxShadow: '0 -2px 12px rgba(92,10,30,0.08)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1A0208' }}>{profile.name}</p>
            <p className="text-xs" style={{ color: '#aaa' }}>{profile.price}</p>
          </div>
          <div className="flex gap-3">
            <button
              className="font-medium text-sm px-6 py-2.5 rounded-xl transition-colors"
              style={{ border: '1px solid #B8860B', color: '#5C0A1E', backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Send Message
            </button>
            <button
              className="font-medium text-sm px-6 py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
