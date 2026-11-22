// Copy for the premium membership site.
// One object per language; add `ja` with the same shape and usePremiumContent()
// will pick it up automatically.
import { useTranslation } from 'react-i18next'

export type Programme = {
  id: '3m' | '6m' | '12m'
  tier: string
  name: string
  duration: string
  price: string
  monthly: string
  sessions: string
  recommended?: boolean
  features: string[]
}

export type Pillar = {
  number: string
  title: string
  summary: string
  points: string[]
}

const en = {
  nav: {
    philosophy: 'Philosophy',
    services: 'Services',
    membership: 'Membership',
    coaches: 'Coaches',
    experiences: 'Experiences',
    apply: 'Apply',
    login: 'Member login',
    menu: 'Menu',
    close: 'Close',
  },

  hero: {
    eyebrow: 'By application only',
    title: 'Broaden your world horizon through English.',
    subtitle:
      'An exclusive international development membership for business owners, entrepreneurs and leaders. Private coaching, life guidance, curated travel and global networking, all in one journey.',
    primary: 'Book a consultation',
    secondary: 'Explore membership',
    tagline: 'Speak globally · Think internationally · Connect meaningfully · Grow beyond borders',
  },

  statement: {
    eyebrow: 'Our purpose',
    quote: 'The goal isn’t simply to improve English. It’s to open doors to a bigger world.',
    body:
      'Kaiyui is not an English school, and not a travel agency. It is a private platform for internationally minded individuals to develop, experience and connect, with English as the foundation and the world as the destination.',
  },

  pillarsIntro: {
    eyebrow: 'Four pillars',
    title: 'One membership. Four ways to grow.',
    body:
      'Each member’s journey combines four complementary services, personalised to their goals, industry and lifestyle.',
  },

  pillars: [
    {
      number: '01',
      title: 'Elite English Coaching',
      summary: 'One-to-one coaching with carefully selected coaches, built around the way you actually work.',
      points: [
        'Private coaching with selected elite coaches',
        'Business English and executive communication',
        'Presentation and negotiation skills',
        'Cross-cultural communication',
        'Confidence in international environments',
      ],
    },
    {
      number: '02',
      title: 'Life & Personal Guidance',
      summary: 'A trusted partner for the bigger questions: direction, leadership and the next chapter.',
      points: [
        'Personal development',
        'Leadership and mindset',
        'Goal setting and accountability',
        'Career and business direction',
        'Broader perspectives through international exposure',
      ],
    },
    {
      number: '03',
      title: 'International Experiences',
      summary: 'Curated journeys abroad that turn language into lived experience.',
      points: [
        'Curated overseas trips',
        'Cultural immersion',
        'International lifestyle exposure',
        'Learning through real-world experiences',
        'Opportunities to explore new markets',
      ],
    },
    {
      number: '04',
      title: 'Business & Global Networking',
      summary: 'Introductions and gatherings that open genuine international opportunities.',
      points: [
        'International business conferences',
        'Curated networking opportunities',
        'Introductions to entrepreneurs and professionals',
        'Business exchange and collaboration',
        'Access to selected international communities',
      ],
    },
  ] as Pillar[],

  audience: {
    eyebrow: 'Who it is for',
    title: 'For people who are already successful, and want the world to be their stage.',
    body:
      'Our members are busy and accomplished in their own fields. They come to us to communicate with confidence internationally, gain new perspectives and build meaningful global connections.',
    groups: [
      'Business owners',
      'Entrepreneurs & founders',
      'Aspiring entrepreneurs',
      'Public figures',
      'Professionals & executives',
      'Leaders & decision-makers',
    ],
  },

  journeyIntro: {
    eyebrow: 'The membership journey',
    title: 'Selective by design. Personal at every step.',
  },

  journey: [
    {
      step: '01',
      title: 'Private consultation',
      price: '¥10,000',
      body: 'We get to know your goals, background, English level, lifestyle and international ambitions.',
    },
    {
      step: '02',
      title: 'Choose your programme',
      body: 'Commit to a 3, 6 or 12-month programme shaped around your schedule and objectives.',
    },
    {
      step: '03',
      title: 'Coach matching',
      body: 'We match you with a coach suited to your personality, goals, industry and learning style.',
    },
    {
      step: '04',
      title: 'Weekly private coaching',
      body: 'One 60-minute session every week, online, from anywhere in the world.',
    },
    {
      step: '05',
      title: 'International experiences',
      body: 'Invitations to selected overseas trips, conferences and networking gatherings.',
    },
  ],

  membershipIntro: {
    eyebrow: 'Membership',
    title: 'A personalised international development journey.',
    body:
      'Three programmes, one philosophy. Every programme includes weekly private coaching, personal guidance and access to our international network.',
    perMonth: 'Equivalent to',
    perMonthSuffix: '/ month',
    recommended: 'Recommended',
    cta: 'Apply for this programme',
  },

  programmes: [
    {
      id: '3m',
      tier: '01 · Executive',
      name: 'Executive',
      duration: '3-month programme',
      price: '¥600,000',
      monthly: '¥200,000',
      sessions: '12 private sessions',
      features: [
        '12 private coaching sessions, 60 minutes weekly',
        'Personalised development plan',
        'Dedicated coach matching',
        'Business English and communication',
        'Personal guidance',
        'Selected networking invitations',
      ],
    },
    {
      id: '6m',
      tier: '02 · Global Development',
      name: 'Global Development',
      duration: '6-month programme',
      price: '¥1,000,000',
      monthly: '¥166,667',
      sessions: '24 private sessions',
      recommended: true,
      features: [
        '24 private coaching sessions, 60 minutes weekly',
        'Elite coach matching',
        'Customised international development roadmap',
        'Executive communication and negotiation',
        'Personal and business guidance',
        'Priority networking invitations',
        'Curated international experiences',
        'Quarterly progress reviews',
      ],
    },
    {
      id: '12m',
      tier: '03 · Global Elite',
      name: 'Global Elite',
      duration: '12-month programme',
      price: '¥1,800,000',
      monthly: '¥150,000',
      sessions: '48 private sessions',
      features: [
        '48 private coaching sessions, 60 minutes weekly',
        'Priority access to elite coaches',
        'Comprehensive personal development programme',
        'Ongoing business and life guidance',
        'International networking opportunities',
        'Priority invitations to overseas experiences',
        'Personalised annual development strategy',
        'Exclusive member community',
      ],
    },
  ] as Programme[],

  addOns: {
    eyebrow: 'Additional services',
    title: 'Tailored to you',
    note:
      'International trips, conferences, flights and accommodation are arranged separately and confirmed with you before enrolment.',
    rows: [
      ['Initial consultation', '¥10,000'],
      ['Additional coaching', '¥30,000 / hour'],
      ['Private intensive coaching', 'Custom quotation'],
      ['International trips', 'Separate packages'],
      ['Business conferences', 'Separate fees'],
    ] as [string, string][],
  },

  philosophy: {
    eyebrow: 'Our philosophy',
    title: 'Beyond language. Beyond borders.',
    intro:
      'Busy leaders don’t need another English class. They need the confidence to walk into any room in the world, and the relationships that make the journey worthwhile.',
    principles: [
      {
        title: 'Transformation, not lessons',
        body:
          'We measure success by what changes in your life and business: the partner you can now negotiate with, the stage you can now stand on, the market you can now enter.',
      },
      {
        title: 'Selective by design',
        body:
          'Membership is by application and consultation. This protects the quality of coaching and the calibre of the community every member is part of.',
      },
      {
        title: 'Experience is the teacher',
        body:
          'English becomes real when it is used. Curated travel, conferences and introductions turn weekly coaching into lived international experience.',
      },
      {
        title: 'Anytime, anywhere',
        body:
          'One focused hour a week, online, wherever you are. The programme is built around your schedule, not the other way round.',
      },
    ],
  },

  coaches: {
    eyebrow: 'Our coaches',
    title: 'Selected for excellence. Matched for you.',
    body:
      'Every Kaiyui coach is chosen for their professional background, communication expertise and ability to guide accomplished people. We match each member personally after the consultation.',
    criteria: [
      'International business or executive experience',
      'Proven coaching and communication expertise',
      'Cultural fluency across Japan and abroad',
      'Discretion and professionalism with high-profile clients',
    ],
    profiles: [
      { role: 'Executive Communication', focus: 'Presentations, board-level English, public speaking' },
      { role: 'Negotiation & Business', focus: 'Deal-making, cross-border partnerships, investor meetings' },
      { role: 'Leadership & Life Guidance', focus: 'Mindset, goal-setting, career and business direction' },
    ],
    placeholder: 'Coach profile',
    comingSoon: 'Full coach profiles will be introduced shortly.',
  },

  experiences: {
    eyebrow: 'Experiences',
    title: 'The world, as your classroom.',
    body:
      'Members are invited to selected trips, conferences and gatherings designed to put their English, and their ambitions, into practice.',
    note: 'Illustrative examples. Itineraries are curated each season and charged separately.',
    items: [
      {
        kind: 'Business trip',
        title: 'Singapore Leaders’ Week',
        body: 'Company visits, founder dinners and an introduction to Southeast Asia’s business hub.',
      },
      {
        kind: 'Conference',
        title: 'International Business Forum',
        body: 'Attend a major global conference as a delegation, with preparation sessions beforehand.',
      },
      {
        kind: 'Cultural immersion',
        title: 'London & Europe Immersion',
        body: 'Culture, cuisine and conversation, with meetings arranged around your industry.',
      },
      {
        kind: 'Networking',
        title: 'Members’ Evenings in Tokyo',
        body: 'Intimate gatherings with fellow members and international guests, held in English.',
      },
    ],
  },

  apply: {
    eyebrow: 'Apply',
    title: 'Begin with a private consultation.',
    body:
      'Membership is by application. Tell us a little about yourself and we will arrange a private consultation to understand your goals and recommend the right programme.',
    consultation: 'Consultation fee',
    consultationPrice: '¥10,000',
    steps: [
      'Submit your application',
      'We contact you within 2 business days',
      'Private consultation (¥10,000)',
      'Programme recommendation and coach matching',
    ],
    form: {
      name: 'Full name',
      email: 'Email',
      phone: 'Phone (optional)',
      role: 'Title & organisation',
      profile: 'I am a…',
      profileOptions: [
        'Business owner',
        'Entrepreneur / founder',
        'Aspiring entrepreneur',
        'Public figure',
        'Professional / executive',
        'Other',
      ],
      programme: 'Programme of interest',
      undecided: 'Not sure yet',
      level: 'Current English level',
      levelOptions: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'],
      goals: 'What would you like to achieve?',
      submit: 'Submit application',
      submitting: 'Submitting…',
      required: 'Please fill in your name, email and goals.',
      error: 'Something went wrong. Please try again or contact us directly.',
      successTitle: 'Thank you.',
      successBody:
        'Your application has been received. A member of our team will contact you within two business days to arrange your private consultation.',
      privacy: 'Your information is kept strictly confidential.',
    },
  },

  cta: {
    title: 'Your gateway to a bigger world.',
    body: 'Places are limited to keep the community personal. Begin with a private consultation.',
    button: 'Apply for membership',
  },

  footer: {
    tagline: 'Broaden your world horizon through English.',
    explore: 'Explore',
    contact: 'Contact',
    contactLink: 'Get in touch',
    rights: 'All rights reserved.',
  },
}

export type PremiumContent = typeof en

const content: Record<string, PremiumContent> = { en }

export function usePremiumContent(): PremiumContent {
  const { i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? 'en').slice(0, 2)
  return content[lang] ?? en
}
