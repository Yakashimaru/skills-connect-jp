// HowItWorksPage — full page at /how-it-works
// maroon #5C0A1E, antique gold #B8860B, white + cream surfaces

const steps = [
  {
    number: '01',
    title: 'Create your profile',
    description: 'Sign up and build your profile. Add your skills, personality traits, interests, and what you are looking for. Choose whether you want to offer services, find someone, or both.',
    details: ['Add skills and qualifications', 'Set your personality traits and interests', 'Choose your session types and pricing', 'Select your privacy settings'],
  },
  {
    number: '02',
    title: 'Browse & discover',
    description: 'Search and filter profiles by skill, location, price, gender, and personality. Use our matching algorithm to find people who complement your skills and interests.',
    details: ['Filter by skill, location, and price', 'Browse verified profiles', 'See personality traits and interests', 'AI-powered match suggestions'],
  },
  {
    number: '03',
    title: 'Connect & chat',
    description: 'Send a message to someone you want to connect with. Get to know them before committing to a session. Ask questions, share your goals, and find the right fit.',
    details: ['Text, voice, and video messaging', 'Safe and verified profiles', 'No pressure — connect at your own pace', 'Book a session directly from chat'],
  },
  {
    number: '04',
    title: 'Meet & grow',
    description: 'Schedule a session — online or in person. Learn a new skill, make a real connection, attend a group meetup, or just enjoy a shared experience. Leave a review after.',
    details: ['Online or in-person sessions', 'Group meetups and events', '1-on-1 coaching and companionship', 'Rate and review after each session'],
  },
]

const faqs = [
  { q: 'Is this a dating app?', a: 'No. SkillConnect is a skills and social matching platform. Connections are based on personality, skills, and shared interests — not just appearance or financial status.' },
  { q: 'How much does it cost?', a: 'Creating an account is free. Seekers can upgrade to Standard (¥5,000/mo), Premium (¥10,000/mo), or Elite (¥50,000/mo) for more features. Providers set their own hourly rates.' },
  { q: 'How are profiles verified?', a: "Users can verify their email, phone number, and ID. Verified profiles display a badge so you know who you're connecting with." },
  { q: 'Can I be both a provider and a seeker?', a: 'Yes. Your profile has two layers — a social layer and a skills layer. You can offer services and seek connections at the same time.' },
  { q: 'Is it available outside Japan?', a: 'The platform is currently focused on Japan but available in English and Japanese. International expansion is planned.' },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <div className="py-16 text-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>Simple process</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1A0208' }}>How it works</h1>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#7A6060' }}>
          From creating your profile to building real connections — here's how SkillConnect works.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
        {steps.map((step, i) => (
          <div key={step.number} className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            {/* Number */}
            <div className="flex-shrink-0">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
              >
                {step.number}
              </div>
            </div>
            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A0208' }}>{step.title}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6060' }}>{step.description}</p>
              <ul className="flex flex-col gap-2">
                {step.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2 text-sm" style={{ color: '#1A0208' }}>
                    <span className="text-xs" style={{ color: '#B8860B' }}>✔</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="py-16" style={{ backgroundColor: '#FDF8F2' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A0208' }}>Frequently asked questions</h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl p-6"
                style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
              >
                <p className="font-semibold mb-2" style={{ color: '#1A0208' }}>{faq.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6060' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

