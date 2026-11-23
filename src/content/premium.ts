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

const ja: PremiumContent = {
  nav: {
    philosophy: '理念',
    services: 'サービス',
    membership: 'メンバーシップ',
    coaches: 'コーチ',
    experiences: '体験',
    apply: 'お申し込み',
    login: 'メンバーログイン',
    menu: 'メニュー',
    close: '閉じる',
  },

  hero: {
    eyebrow: '審査制メンバーシップ',
    title: '英語で、あなたの世界を広げる。',
    subtitle:
      '経営者・起業家・リーダーのための、審査制の国際育成メンバーシップ。プライベートコーチング、ライフガイダンス、厳選された海外体験、そしてグローバルなネットワーキングを、ひとつの旅として。',
    primary: 'カウンセリングを予約',
    secondary: 'メンバーシップを見る',
    tagline: '世界と話す · 国際的に考える · 意味あるつながり · 国境を越えて成長する',
  },

  statement: {
    eyebrow: '私たちの目的',
    quote: '目的は、英語を上達させることだけではありません。より大きな世界への扉を開くことです。',
    body:
      'Kaiyuiは英会話スクールでも、旅行会社でもありません。国際的な志を持つ方が、学び、体験し、つながるためのプライベートなプラットフォームです。英語を土台に、世界を目的地として。',
  },

  pillarsIntro: {
    eyebrow: '4つの柱',
    title: 'ひとつのメンバーシップ。4つの成長。',
    body: '一人ひとりの目標・業界・ライフスタイルに合わせて、4つのサービスを組み合わせた成長の旅をご提供します。',
  },

  pillars: [
    {
      number: '01',
      title: 'エリート英語コーチング',
      summary: '厳選されたコーチによるマンツーマンコーチング。実際のお仕事に即した内容で進めます。',
      points: [
        '厳選されたエリートコーチによるプライベートコーチング',
        'ビジネス英語とエグゼクティブコミュニケーション',
        'プレゼンテーション・交渉スキル',
        '異文化コミュニケーション',
        '国際的な場で発揮できる自信',
      ],
    },
    {
      number: '02',
      title: 'ライフ＆パーソナルガイダンス',
      summary: '進むべき方向、リーダーシップ、次のステージ。大きな問いに向き合う信頼のパートナー。',
      points: [
        '自己成長',
        'リーダーシップとマインドセット',
        '目標設定と継続のサポート',
        'キャリア・事業の方向性',
        '国際経験を通じた視野の拡大',
      ],
    },
    {
      number: '03',
      title: '海外体験',
      summary: '言葉を「生きた経験」に変える、厳選された海外への旅。',
      points: [
        '厳選された海外トリップ',
        '文化体験・イマージョン',
        '国際的なライフスタイルに触れる機会',
        '実体験を通じた学び',
        '新たな市場を探る機会',
      ],
    },
    {
      number: '04',
      title: 'ビジネス＆グローバルネットワーキング',
      summary: '本物の国際的な機会につながる、紹介と出会いの場。',
      points: [
        '国際ビジネスカンファレンス',
        '厳選されたネットワーキングの機会',
        '起業家・プロフェッショナルとのご紹介',
        'ビジネス交流とコラボレーション',
        '厳選された国際コミュニティへのアクセス',
      ],
    },
  ],

  audience: {
    eyebrow: '対象となる方',
    title: 'すでに成功を収め、さらに世界を舞台にしたい方へ。',
    body:
      'メンバーの多くは、それぞれの分野で多忙かつ実績のある方々です。国際的な場で自信を持って話し、新たな視点を得て、意味のあるグローバルなつながりを築くために参加されています。',
    groups: [
      '経営者',
      '起業家・創業者',
      '起業を目指す方',
      '著名人・公人',
      'プロフェッショナル・役員',
      'リーダー・意思決定者',
    ],
  },

  journeyIntro: {
    eyebrow: 'メンバーシップの流れ',
    title: '厳選された、一人ひとりのための歩み。',
  },

  journey: [
    {
      step: '01',
      title: '個別カウンセリング',
      price: '¥10,000',
      body: '目標、経歴、英語レベル、ライフスタイル、そして国際的な志をお伺いします。',
    },
    {
      step: '02',
      title: 'プログラムの選択',
      body: 'ご予定と目標に合わせて、3ヶ月・6ヶ月・12ヶ月のプログラムからお選びいただきます。',
    },
    {
      step: '03',
      title: 'コーチのマッチング',
      body: '性格、目標、業界、学習スタイルに合ったコーチをご紹介します。',
    },
    {
      step: '04',
      title: '毎週のプライベートコーチング',
      body: '週1回60分。オンラインで、世界中どこからでも受講いただけます。',
    },
    {
      step: '05',
      title: '海外体験',
      body: '厳選された海外トリップ、カンファレンス、ネットワーキングイベントへのご招待。',
    },
  ],

  membershipIntro: {
    eyebrow: 'メンバーシップ',
    title: 'あなただけの、国際的な成長の旅。',
    body:
      '3つのプログラム、ひとつの理念。すべてのプログラムに、毎週のプライベートコーチング、パーソナルガイダンス、国際ネットワークへのアクセスが含まれます。',
    perMonth: '月額換算',
    perMonthSuffix: '',
    recommended: 'おすすめ',
    cta: 'このプログラムに申し込む',
  },

  programmes: [
    {
      id: '3m',
      tier: '01 · エグゼクティブ',
      name: 'エグゼクティブ',
      duration: '3ヶ月プログラム',
      price: '¥600,000',
      monthly: '¥200,000',
      sessions: 'プライベートセッション12回',
      features: [
        'プライベートコーチング12回（毎週60分）',
        'パーソナル育成プラン',
        '専任コーチのマッチング',
        'ビジネス英語とコミュニケーション',
        'パーソナルガイダンス',
        '厳選されたネットワーキングへのご招待',
      ],
    },
    {
      id: '6m',
      tier: '02 · グローバル・ディベロップメント',
      name: 'グローバル・ディベロップメント',
      duration: '6ヶ月プログラム',
      price: '¥1,000,000',
      monthly: '¥166,667',
      sessions: 'プライベートセッション24回',
      recommended: true,
      features: [
        'プライベートコーチング24回（毎週60分）',
        'エリートコーチのマッチング',
        'オーダーメイドの国際育成ロードマップ',
        'エグゼクティブコミュニケーションと交渉',
        'パーソナル＆ビジネスガイダンス',
        'ネットワーキングへの優先ご招待',
        '厳選された海外体験',
        '四半期ごとの進捗レビュー',
      ],
    },
    {
      id: '12m',
      tier: '03 · グローバル・エリート',
      name: 'グローバル・エリート',
      duration: '12ヶ月プログラム',
      price: '¥1,800,000',
      monthly: '¥150,000',
      sessions: 'プライベートセッション48回',
      features: [
        'プライベートコーチング48回（毎週60分）',
        'エリートコーチへの優先アクセス',
        '総合的なパーソナル育成プログラム',
        '継続的なビジネス＆ライフガイダンス',
        '国際ネットワーキングの機会',
        '海外体験への優先ご招待',
        'パーソナル年間育成戦略',
        'メンバー限定コミュニティ',
      ],
    },
  ],

  addOns: {
    eyebrow: '追加サービス',
    title: 'あなたに合わせて',
    note: '海外トリップ、カンファレンス、航空券、宿泊は別途手配となり、ご入会前に内容を確認させていただきます。',
    rows: [
      ['初回カウンセリング', '¥10,000'],
      ['追加コーチング', '¥30,000 / 時間'],
      ['プライベート集中コーチング', '個別お見積もり'],
      ['海外トリップ', '別途パッケージ'],
      ['ビジネスカンファレンス', '別途料金'],
    ],
  },

  philosophy: {
    eyebrow: '私たちの理念',
    title: '言葉を超えて。国境を越えて。',
    intro:
      '多忙なリーダーに必要なのは、もうひとつの英会話レッスンではありません。世界のどんな場にも臆せず臨める自信と、その旅を価値あるものにする人とのつながりです。',
    principles: [
      {
        title: 'レッスンではなく、変化を',
        body:
          '成果は、あなたの人生と事業に起きた変化で測ります。交渉できるようになった相手、立てるようになった舞台、踏み出せるようになった市場。',
      },
      {
        title: '厳選された、審査制',
        body:
          'ご入会はお申し込みとカウンセリングを経て決定します。それがコーチングの質と、メンバーが属するコミュニティの品格を守ります。',
      },
      {
        title: '経験こそが教師',
        body:
          '英語は使ってこそ本物になります。厳選された旅、カンファレンス、ご紹介が、毎週のコーチングを生きた国際経験へと変えます。',
      },
      {
        title: 'いつでも、どこでも',
        body: '週に一度、集中した60分を、オンラインでどこからでも。プログラムはあなたの予定に合わせて組み立てます。',
      },
    ],
  },

  coaches: {
    eyebrow: 'コーチ紹介',
    title: '卓越性で選び、あなたに合わせて。',
    body:
      'Kaiyuiのコーチは、職歴、コミュニケーションの専門性、そして実績ある方々を導く力を基準に選ばれています。カウンセリング後、一人ひとりに合わせてマッチングいたします。',
    criteria: [
      '国際ビジネスまたは経営層での経験',
      '実証されたコーチング・コミュニケーションの専門性',
      '日本と海外の双方に通じた文化理解',
      '著名なクライアントにも対応できる守秘性とプロ意識',
    ],
    profiles: [
      { role: 'エグゼクティブコミュニケーション', focus: 'プレゼンテーション、経営層向け英語、パブリックスピーキング' },
      { role: '交渉＆ビジネス', focus: '商談、海外パートナーシップ、投資家ミーティング' },
      { role: 'リーダーシップ＆ライフガイダンス', focus: 'マインドセット、目標設定、キャリアと事業の方向性' },
    ],
    placeholder: 'コーチプロフィール',
    comingSoon: 'コーチの詳しいプロフィールは近日公開予定です。',
  },

  experiences: {
    eyebrow: '体験',
    title: '世界を、あなたの教室に。',
    body: 'メンバーは、英語とご自身の志を実践に移すために企画された、厳選のトリップ、カンファレンス、交流の場へご招待されます。',
    note: '掲載内容はイメージです。旅程はシーズンごとに企画し、別途料金となります。',
    items: [
      {
        kind: 'ビジネストリップ',
        title: 'シンガポール・リーダーズウィーク',
        body: '企業訪問、創業者とのディナー、そして東南アジアのビジネスハブへのご案内。',
      },
      {
        kind: 'カンファレンス',
        title: '国際ビジネスフォーラム',
        body: '事前準備セッションを経て、代表団として主要な国際カンファレンスに参加します。',
      },
      {
        kind: '文化体験',
        title: 'ロンドン＆ヨーロッパ・イマージョン',
        body: '文化、食、会話。あなたの業界に合わせたミーティングもご用意します。',
      },
      {
        kind: 'ネットワーキング',
        title: '東京メンバーズイブニング',
        body: 'メンバーと海外からのゲストが集う、英語で過ごす少人数の集まり。',
      },
    ],
  },

  apply: {
    eyebrow: 'お申し込み',
    title: 'まずは個別カウンセリングから。',
    body:
      'ご入会は審査制です。簡単なご経歴をお聞かせください。個別カウンセリングを設定し、目標をお伺いしたうえで最適なプログラムをご提案いたします。',
    consultation: 'カウンセリング料金',
    consultationPrice: '¥10,000',
    steps: [
      'お申し込みフォームの送信',
      '2営業日以内にご連絡',
      '個別カウンセリング（¥10,000）',
      'プログラムのご提案とコーチのマッチング',
    ],
    form: {
      name: 'お名前',
      email: 'メールアドレス',
      phone: '電話番号（任意）',
      role: '役職・ご所属',
      profile: 'ご職業',
      profileOptions: ['経営者', '起業家・創業者', '起業を目指している', '著名人・公人', 'プロフェッショナル・役員', 'その他'],
      programme: 'ご希望のプログラム',
      undecided: '未定',
      level: '現在の英語レベル',
      levelOptions: ['初級', '中級', '上級', 'ネイティブレベル'],
      goals: '達成したいこと',
      submit: '申し込む',
      submitting: '送信中…',
      required: 'お名前、メールアドレス、達成したいことをご入力ください。',
      error: '送信に失敗しました。もう一度お試しいただくか、直接お問い合わせください。',
      successTitle: 'ありがとうございます。',
      successBody: 'お申し込みを受け付けました。2営業日以内に担当者より、個別カウンセリングの日程についてご連絡いたします。',
      privacy: 'いただいた情報は厳重に管理いたします。',
    },
  },

  cta: {
    title: 'より大きな世界への扉。',
    body: 'コミュニティの質を保つため、定員を設けています。まずは個別カウンセリングから。',
    button: 'メンバーシップに申し込む',
  },

  footer: {
    tagline: '英語で、あなたの世界を広げる。',
    explore: 'メニュー',
    contact: 'お問い合わせ',
    contactLink: 'お問い合わせ',
    rights: 'All rights reserved.',
  },
}

const content: Record<string, PremiumContent> = { en, ja }

export const PREMIUM_LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
] as const

export function usePremiumContent(): PremiumContent {
  const { i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? 'en').slice(0, 2)
  return content[lang] ?? en
}
