// Copy for the premium membership site.
// One object per language; add `ja` with the same shape and usePremiumContent()
// will pick it up automatically.
import { useTranslation } from 'react-i18next'

export type Programme = {
  id: '3m' | '6m' | '12m'
  tier: string
  name: string
  duration: string
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
    title: 'Grow beyond borders.',
    // Not shown on the page; used for the meta description only
    metaDescription:
      'A private international development membership: elite English coaching, life guidance, international experiences and global business networking.',
    primary: 'Book a consultation',
    secondary: 'Explore membership',
  },

  statement: {
    eyebrow: 'Our purpose',
    title: 'A gateway to a bigger world, not another English school.',
    body:
      'We empower ambitious individuals to expand their horizons through English: to speak globally, think internationally and connect meaningfully.',
  },

  pillarsIntro: {
    eyebrow: 'Services',
    title: 'The four pillars',
    metaDescription:
      'Elite language coaching, life guidance, international experiences and global business networking.',
  },

  pillars: [
    {
      number: '01',
      title: 'Elite Language Coaching',
      summary: 'One-to-one coaching with carefully selected elite coaches and personalised programmes.',
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
      title: 'Life Guidance',
      summary:
        'A trusted confidant to share thoughts, navigate life’s challenges, gain perspective and find clarity through meaningful conversations and personal guidance.',
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
      title: 'International Experience',
      summary:
        'Curated journeys abroad that bring language to life through immersive experiences, with personalised concierge planning and thoughtfully designed itineraries.',
      points: [
        'Curated overseas trips',
        'Personalised concierge planning',
        'Cultural immersion',
        'International lifestyle exposure',
        'Learning through real-world experiences',
        'Opportunities to explore new markets',
      ],
    },
    {
      number: '04',
      title: 'Global Business Networking',
      summary:
        'Access to international business conferences, networking events and global connections, with opportunities to meet industry professionals and expand your business.',
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
    title: 'Our community',
    body:
      'Designed for busy, ambitious individuals who value personal growth and global exposure to connect with the world. Our members include business owners, entrepreneurs, executives, public figures and future leaders.',
  },

  journeyIntro: {
    title: 'The membership journey',
  },

  journey: [
    {
      step: '01',
      title: 'Private consultation',
      price: '¥10,000',
      body: 'An initial assessment to understand your background, objectives and eligibility for membership.',
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
      title: 'Weekly English coaching',
      body:
        'One 60-minute session per week, scheduled around your availability, with flexible in-person or online options from anywhere in the world.',
    },
    {
      step: '05',
      title: 'Exclusive community',
      body:
        'Connect with like-minded individuals and access curated overseas trips, international conferences and networking events.',
    },
  ],

  membershipIntro: {
    eyebrow: 'Membership',
    title: 'Our programmes',
    // Exact programme fees are not published; only this range is shown
    range: '¥150,000 – ¥200,000',
    rangeSuffix: 'per month',
    rangeNote: '3, 6 and 12-month programmes. Full details are shared at your private consultation.',
    viewProgrammes: 'View programmes',
    heroBody:
      'From ¥150,000 to ¥200,000 per month. 3, 6 and 12-month programmes, with full details shared at your private consultation.',
    metaDescription: 'Membership programmes of 3, 6 or 12 months, from ¥150,000 to ¥200,000 per month.',
    recommended: 'Recommended',
    cta: 'Apply for this programme',
  },

  programmes: [
    {
      id: '3m',
      tier: '01 · Executive',
      name: 'Executive',
      duration: '3-month programme',
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
    quote: 'The goal isn’t simply to improve English. It’s to open doors to a bigger world.',
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
          'One focused hour a week, in person or online, wherever you are. The programme is built around your schedule, not the other way round.',
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
    title: 'Exclusively by selection.',
    body: 'Begin with a private consultation.',
    button: 'Apply for membership',
  },

  footer: {
    tagline: 'Grow beyond borders.',
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
    title: '国境を越えて、成長する。',
    metaDescription:
      'エリート英語コーチング、ライフガイダンス、海外体験、グローバルなビジネスネットワーキングを提供する、審査制の国際育成メンバーシップ。',
    primary: 'カウンセリングを予約',
    secondary: 'メンバーシップを見る',
  },

  statement: {
    eyebrow: '私たちの目的',
    title: 'より大きな世界への扉。ただの英会話スクールではありません。',
    body: '志ある方が英語を通じて視野を広げ、世界と話し、国際的に考え、意味あるつながりを築けるよう支えます。',
  },

  pillarsIntro: {
    eyebrow: 'サービス',
    title: '4つの柱',
    metaDescription: 'エリート語学コーチング、ライフガイダンス、海外体験、グローバルビジネスネットワーキング。',
  },

  pillars: [
    {
      number: '01',
      title: 'エリート語学コーチング',
      summary: '厳選されたエリートコーチによるマンツーマンコーチングと、一人ひとりに合わせたプログラム。',
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
      title: 'ライフガイダンス',
      summary:
        '信頼できる相談相手として、思いを分かち合い、人生の課題に向き合い、意味ある対話と個別のガイダンスを通じて、新たな視点と明確な答えを見つけるお手伝いをします。',
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
      summary:
        '没入型の体験を通じて言葉に命を吹き込む、厳選された海外への旅。専属コンシェルジュによるプランニングと、丁寧に設計された旅程とともに。',
      points: [
        '厳選された海外トリップ',
        '専属コンシェルジュによるプランニング',
        '文化体験・イマージョン',
        '国際的なライフスタイルに触れる機会',
        '実体験を通じた学び',
        '新たな市場を探る機会',
      ],
    },
    {
      number: '04',
      title: 'グローバルビジネスネットワーキング',
      summary:
        '国際ビジネスカンファレンス、ネットワーキングイベント、グローバルなつながりへのアクセス。業界のプロフェッショナルと出会い、事業を広げる機会を。',
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
    title: 'コミュニティ',
    body:
      '自己成長と世界への視野を大切にし、世界とつながりたいと願う、多忙で志の高い方のために。メンバーには、経営者、起業家、役員、著名人、そして次世代のリーダーが名を連ねます。',
  },

  journeyIntro: {
    title: 'メンバーシップの流れ',
  },

  journey: [
    {
      step: '01',
      title: '個別カウンセリング',
      price: '¥10,000',
      body: 'ご経歴、目標、ご入会の適性を把握するための初回アセスメントです。',
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
      title: '毎週の英語コーチング',
      body: '週1回60分。ご都合に合わせて日程を調整し、対面またはオンラインで、世界中どこからでも受講いただけます。',
    },
    {
      step: '05',
      title: '限定コミュニティ',
      body: '志を同じくする方々とつながり、厳選された海外トリップ、国際カンファレンス、ネットワーキングイベントにご参加いただけます。',
    },
  ],

  membershipIntro: {
    eyebrow: 'メンバーシップ',
    title: 'プログラム',
    range: '¥150,000〜¥200,000',
    rangeSuffix: '／月',
    rangeNote: '3ヶ月・6ヶ月・12ヶ月のプログラム。詳細は個別カウンセリングにてご案内いたします。',
    viewProgrammes: 'プログラムを見る',
    heroBody: '月額¥150,000〜¥200,000。3ヶ月・6ヶ月・12ヶ月のプログラムをご用意しています。詳細は個別カウンセリングにてご案内いたします。',
    metaDescription: '3ヶ月・6ヶ月・12ヶ月のメンバーシッププログラム。月額¥150,000〜¥200,000。',
    recommended: 'おすすめ',
    cta: 'このプログラムに申し込む',
  },

  programmes: [
    {
      id: '3m',
      tier: '01 · エグゼクティブ',
      name: 'エグゼクティブ',
      duration: '3ヶ月プログラム',
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
    quote: '目的は、英語を上達させることだけではありません。より大きな世界への扉を開くことです。',
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
        body: '週に一度、集中した60分を、対面またはオンラインでどこからでも。プログラムはあなたの予定に合わせて組み立てます。',
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
    title: '厳選された方のためのメンバーシップ。',
    body: 'まずは個別カウンセリングから。',
    button: 'メンバーシップに申し込む',
  },

  footer: {
    tagline: '国境を越えて、成長する。',
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
