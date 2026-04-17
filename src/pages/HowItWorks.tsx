// HowItWorksPage — full page at /how-it-works
// Sections: #how-it-works · #fees · #faq
// maroon #5C0A1E, antique gold #B8860B, white + cream surfaces

import SubscriptionPlans from '../components/SubscriptionPlans'

const steps = [
  {
    number: '01',
    title: 'Create your profile',
    description: 'Sign up and build your profile by adding your skills, personality traits, interests, education, and experience. You can also verify your profile for added trust.',
    details: [
      'Add basic profile information',
      'List your skills and qualifications',
      'Set your personality traits and interests',
      'Choose your session types and pricing',
    ],
    special: null,
  },
  {
    number: '02',
    title: 'Choose your role',
    description: 'Select whether you would like to participate as a provider, a seeker, or both.',
    details: [],
    special: 'role',
  },
  {
    number: '03',
    title: 'Browse and discover',
    description: 'Find the right match using smart filters and recommendations. Use our matching algorithm to find people who complement your skills and interests.',
    details: [
      'Filter by skill, location, age, gender, and price',
      'View verified profiles',
      'Match based on personality traits and interests',
      'AI-powered suggestions',
    ],
    special: null,
  },
  {
    number: '04',
    title: 'Chat and connect',
    description: 'Send a message or book a session directly. Ask questions, share your goals, find the right match and start connecting.',
    details: [
      'Text, voice, and video messaging',
      'Schedule online or in-person sessions',
      'Book sessions directly from profiles',
      'Rate and review after each session',
    ],
    special: null,
  },
  {
    number: '05',
    title: 'Meet & grow',
    description: 'Learn new skills, build meaningful connections, join group meetups and events, or simply share an experience.',
    details: [
      'All members can participate in community events',
      'Premium members can create their own events',
      'Elite members receive invitations to exclusive VIP networking events',
    ],
    special: null,
  },
]

const seekerPoints = [
  'Option to stay anonymous',
  'Add basic profile details',
  'Include skills, interests, and personality traits',
  'Select a subscription plan (cancel anytime)',
]

const providerPoints = [
  'Create a detailed profile',
  'Set your own pricing and session types',
  'Promote your profile for more visibility (optional)',
]

const faqs = [
  {
    q: 'What is SkillConnect?',
    a: 'SkillConnect is a skills and social matching platform. Connections are based on personality, skills, and shared interests, helping users to build both professional and social connections.',
  },
  {
    q: "Why can't I chat or connect?",
    a: 'To connect with providers, seekers need to upgrade to a paid plan (Standard, Premium, or Elite). Subscriptions can be canceled anytime.',
  },
  {
    q: 'What if I do not have adequate skills, experience, or education?',
    a: 'No problem — you can still connect based on personality and shared interests, whether for social companionship or making friends.',
  },
  {
    q: 'Can I be both a provider and a seeker?',
    a: 'Yes. Your profile has two layers — a social layer and a skills layer. You can offer services and seek connections at the same time.',
  },
  {
    q: 'How are profiles verified?',
    a: 'Users can verify their email, phone number, identity, and more. Verified profiles display a badge.',
  },
  {
    q: 'Is it safe?',
    a: 'You may choose verified profiles for enhanced safety and connect with real, active users.',
  },
  {
    q: 'Why am I blacklisted?',
    a: 'Users may be blacklisted after repeated complaints such as no-shows, lack of responsiveness, or inappropriate behavior. Warnings are given before blacklisting to protect the community.',
  },
  {
    q: 'Is it available outside Japan?',
    a: 'The platform is currently focused on Japan but available in English and Japanese. International expansion is planned.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* ── SECTION: How it works ── */}
      <div id="how-it-works">
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
            <div key={step.number}>
              {step.special === 'role' ? (
                /* Choose Your Role — full-width special layout */
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A0208' }}>{step.title}</h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A6060' }}>{step.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl p-5" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>For Seekers</p>
                        <ul className="flex flex-col gap-2">
                          {seekerPoints.map((point) => (
                            <li key={point} className="flex items-start gap-2 text-sm" style={{ color: '#1A0208' }}>
                              <span className="text-xs mt-0.5" style={{ color: '#B8860B' }}>✔</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl p-5" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>For Providers</p>
                        <ul className="flex flex-col gap-2">
                          {providerPoints.map((point) => (
                            <li key={point} className="flex items-start gap-2 text-sm" style={{ color: '#1A0208' }}>
                              <span className="text-xs mt-0.5" style={{ color: '#B8860B' }}>✔</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard alternating step layout */
                <div className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
                    >
                      {step.number}
                    </div>
                  </div>
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION: Fees ── */}
      <div id="fees">
        <SubscriptionPlans />
      </div>

      {/* ── SECTION: FAQ ── */}
      <div id="faq" className="py-16" style={{ backgroundColor: '#FDF8F2' }}>
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

          {/* Contact CTA */}
          <div
            className="mt-6 rounded-2xl p-6 text-center"
            style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
          >
            <p className="font-semibold mb-2" style={{ color: '#1A0208' }}>Questions not listed?</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6060' }}>
              If you have any additional questions or run into issues, feel free to contact us. Our team typically responds within 1–2 business days.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
            >
              Contact us
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
