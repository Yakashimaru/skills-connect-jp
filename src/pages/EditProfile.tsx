import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  updateProfile, updateProviderProfile,
  addEducation, updateEducation, removeEducation,
  addExperience, updateExperience, removeExperience,
} from '../lib/profiles'
import { TRAIT_ZH, INTEREST_ZH, ZH_CITY } from '../lib/constants'

const PERSONALITY_TRAITS = [
  'Adaptable', 'Adventurous', 'Ambitious', 'Ambivert', 'Analytical',
  'Calm', 'Caring', 'Cheerful', 'Compassionate', 'Confident', 'Considerate', 'Curious',
  'Detail-oriented', 'Diligent', 'Direct', 'Disciplined',
  'Easygoing', 'Emotional', 'Empathetic', 'Energetic', 'Extrovert',
  'Friendly',
  'Honest', 'Humble', 'Humorous',
  'Independent', 'Introvert',
  'Logical', 'Loyal',
  'Open-minded', 'Optimistic', 'Organised',
  'Passionate', 'Patient', 'Perfectionist', 'Persistent',
  'Reliable', 'Reserved', 'Responsible',
  'Sensitive', 'Spontaneous', 'Supportive',
  'Thoughtful',
]

const PERSONALITY_TRAITS_JA = [
  '適応力がある', '冒険好き', '向上心がある', '両向的', '分析的',
  '穏やか', '思いやり', '明るい', '慈悲深い', '自信がある', '気遣いができる', '好奇心旺盛',
  '細部重視', '勤勉', '率直', '自律している',
  'おおらか', '感情的', '共感力が高い', 'エネルギッシュ', '外向的',
  '友好的',
  '正直', '謙虚', 'ユーモアがある',
  '自立している', '内向的',
  '論理的', '誠実',
  'オープンマインド', '楽観的', '几帳面',
  '情熱的', '辛抱強い', '完璧主義', '粘り強い',
  '頼りになる', '控えめ', '責任感がある',
  '感受性豊か', '自発的', 'サポーティブ',
  '思慮深い',
]

const INTEREST_OPTIONS = [
  'Anime & Manga', 'Art',
  'Baking', 'Business',
  'Cooking', 'Cycling',
  'Dancing', 'Diving', 'DIY',
  'Economics',
  'Fashion', 'Finance', 'Fitness', 'Food',
  'Gaming', 'Gardening', 'Golf',
  'Hiking', 'History', 'Horse riding',
  'Investing',
  'Journaling',
  'Languages',
  'Martial arts', 'Meditation', 'Music',
  'Nature', 'Networking',
  'Painting', 'Pets', 'Philosophy', 'Photography', 'Poetry', 'Psychology',
  'Reading', 'Rock climbing', 'Running',
  'Science', 'Singing', 'Skiing', 'Socialising', 'Spirituality', 'Sports', 'Startups', 'Surfing', 'Swimming',
  'Tech', 'Tennis', 'Travel',
  'Volunteering',
  'Wellness', 'Wine & Dining', 'Writing',
  'Yoga',
]

const INTEREST_OPTIONS_JA = [
  'アニメ・マンガ', 'アート',
  'お菓子作り', 'ビジネス',
  '料理', 'サイクリング',
  'ダンス', 'ダイビング', 'DIY',
  '経済',
  'ファッション', 'ファイナンス', 'フィットネス', '食',
  'ゲーム', 'ガーデニング', 'ゴルフ',
  'ハイキング', '歴史', '乗馬',
  '投資',
  'ジャーナリング',
  '語学',
  '武道', '瞑想', '音楽',
  '自然', 'ネットワーキング',
  '絵画', 'ペット', '哲学', '写真', '詩', '心理学',
  '読書', 'ロッククライミング', 'ランニング',
  '科学', '歌', 'スキー', '社交', 'スピリチュアリティ', 'スポーツ', 'スタートアップ', 'サーフィン', '水泳',
  'テクノロジー', 'テニス', '旅行',
  'ボランティア',
  'ウェルネス', 'ワイン・グルメ', 'ライティング',
  'ヨガ',
]

const SKILL_OPTIONS = [
  'Advisory', 'App development', 'Assistance',
  'Business',
  'Coaching', 'Coder', 'Communication support', 'Cooking', 'Copywriting',
  'Data analysis', 'Designer', 'Dog Walker',
  'English', 'Event planning',
  'Finance', 'Fitness', 'French',
  'Golf', 'Graphic design',
  'Housekeeper',
  'Investing', 'Interpreter', 'IT support',
  'Japanese',
  'Korean',
  'Mandarin', 'Marketer', 'Marketing', 'Martial arts', 'Mentorship', 'Music instructor', 'Musician',
  'Personal Shopper', 'Personal training', 'Photographer', 'Presentation', 'Private Hire',
  'Spanish', 'Sports instructor',
  'Tour guide', 'Travel assistance', 'Tutor',
  'Video editing', 'Videographer',
  'Web development',
]

const SKILL_OPTIONS_JA = [
  'アドバイザリー', 'アプリ開発', 'アシスタンス',
  'ビジネス',
  'コーチング', 'コーダー', 'コミュニケーションサポート', '料理', 'コピーライティング',
  'データ分析', 'デザイナー', 'ドッグウォーカー',
  '英語', 'イベント企画',
  'ファイナンス', 'フィットネス', 'フランス語',
  'ゴルフ', 'グラフィックデザイン',
  'ハウスキーパー',
  '投資', '通訳', 'ITサポート',
  '日本語',
  '韓国語',
  '中国語', 'マーケター', 'マーケティング', '武道', 'メンタリング', '音楽インストラクター', 'ミュージシャン',
  'パーソナルショッパー', 'パーソナルトレーニング', 'フォトグラファー', 'プレゼンテーション', 'プライベートハイヤー',
  'スペイン語', 'スポーツインストラクター',
  'ツアーガイド', '旅行サポート', '個別指導',
  '動画編集', 'ビデオグラファー',
  'ウェブ開発',
]

const SOCIAL_SKILL_OPTIONS = [
  'Activity Partner', 'Companion', 'Conversation',
  'Dining', 'Event Date', 'Friendship', 'Study Partner', 'Travel Partner',
]

const SOCIAL_SKILL_OPTIONS_JA = [
  'アクティビティパートナー', 'コンパニオン', '会話',
  'ダイニング', 'イベントデート', 'フレンドシップ', 'スタディパートナー', 'トラベルパートナー',
]

const SKILL_OPTIONS_ZH = [
  '顾问', '应用开发', '协助',
  '商业',
  '辅导', '程序员', '沟通支持', '烹饪', '文案写作',
  '数据分析', '设计师', '遛狗',
  '英语', '活动策划',
  '金融', '健身', '法语',
  '高尔夫', '平面设计',
  '管家服务',
  '投资', '口译', 'IT支持',
  '日语',
  '韩语',
  '普通话', '营销人员', '营销', '武术', '导师辅导', '音乐老师', '音乐人',
  '私人买手', '私人训练', '摄影师', '演讲', '私人雇佣',
  '西班牙语', '运动教练',
  '导游', '旅行协助', '家教',
  '视频剪辑', '摄像师',
  '网页开发',
]

const SOCIAL_SKILL_OPTIONS_ZH = [
  '活动伙伴', '陪伴', '对话交流',
  '餐饮约伴', '活动约伴', '友谊', '学习伙伴', '旅行伙伴',
]

const LOCATION_GROUPS: { group: string; groupJa: string; items: { value: string; ja: string }[] }[] = [
  { group: '🌐 Online', groupJa: '🌐 オンライン', items: [
    { value: 'Online only', ja: 'オンラインのみ' },
  ]},
  { group: '⭐ Major Cities', groupJa: '⭐ 主要都市', items: [
    { value: 'Tokyo', ja: '東京' }, { value: 'Osaka', ja: '大阪' },
    { value: 'Kyoto', ja: '京都' }, { value: 'Nagoya', ja: '名古屋' },
    { value: 'Fukuoka', ja: '福岡' }, { value: 'Sapporo', ja: '札幌' },
    { value: 'Yokohama', ja: '横浜' }, { value: 'Sendai', ja: '仙台' },
    { value: 'Hiroshima', ja: '広島' }, { value: 'Kobe', ja: '神戸' },
  ]},
  { group: 'Hokkaido', groupJa: '北海道', items: [
    { value: 'Sapporo', ja: '札幌市' }, { value: 'Asahikawa', ja: '旭川市' },
    { value: 'Hakodate', ja: '函館市' }, { value: 'Kushiro', ja: '釧路市' },
    { value: 'Obihiro', ja: '帯広市' }, { value: 'Tomakomai', ja: '苫小牧市' },
  ]},
  { group: 'Tohoku', groupJa: '東北', items: [
    { value: 'Sendai', ja: '仙台市' }, { value: 'Aomori', ja: '青森市' },
    { value: 'Morioka', ja: '盛岡市' }, { value: 'Akita', ja: '秋田市' },
    { value: 'Yamagata', ja: '山形市' }, { value: 'Fukushima', ja: '福島市' },
    { value: 'Koriyama', ja: '郡山市' }, { value: 'Hachinohe', ja: '八戸市' },
  ]},
  { group: 'Kanto', groupJa: '関東', items: [
    { value: 'Tokyo', ja: '東京' }, { value: 'Shinjuku', ja: '新宿区' },
    { value: 'Shibuya', ja: '渋谷区' }, { value: 'Minato', ja: '港区' },
    { value: 'Setagaya', ja: '世田谷区' }, { value: 'Nerima', ja: '練馬区' },
    { value: 'Hachioji', ja: '八王子市' }, { value: 'Machida', ja: '町田市' },
    { value: 'Yokohama', ja: '横浜市' }, { value: 'Kawasaki', ja: '川崎市' },
    { value: 'Sagamihara', ja: '相模原市' }, { value: 'Kamakura', ja: '鎌倉市' },
    { value: 'Saitama', ja: 'さいたま市' }, { value: 'Kawagoe', ja: '川越市' },
    { value: 'Chiba', ja: '千葉市' }, { value: 'Funabashi', ja: '船橋市' },
    { value: 'Kashiwa', ja: '柏市' }, { value: 'Urayasu', ja: '浦安市' },
    { value: 'Mito', ja: '水戸市' }, { value: 'Tsukuba', ja: 'つくば市' },
    { value: 'Utsunomiya', ja: '宇都宮市' }, { value: 'Maebashi', ja: '前橋市' },
    { value: 'Takasaki', ja: '高崎市' }, { value: 'Narita', ja: '成田市' },
  ]},
  { group: 'Chubu', groupJa: '中部', items: [
    { value: 'Nagoya', ja: '名古屋市' }, { value: 'Toyota', ja: '豊田市' },
    { value: 'Okazaki', ja: '岡崎市' }, { value: 'Gifu', ja: '岐阜市' },
    { value: 'Shizuoka', ja: '静岡市' }, { value: 'Hamamatsu', ja: '浜松市' },
    { value: 'Niigata', ja: '新潟市' }, { value: 'Nagano', ja: '長野市' },
    { value: 'Matsumoto', ja: '松本市' }, { value: 'Kanazawa', ja: '金沢市' },
    { value: 'Toyama', ja: '富山市' }, { value: 'Fukui', ja: '福井市' },
  ]},
  { group: 'Kansai', groupJa: '関西', items: [
    { value: 'Osaka', ja: '大阪市' }, { value: 'Sakai', ja: '堺市' },
    { value: 'Kyoto', ja: '京都市' }, { value: 'Kobe', ja: '神戸市' },
    { value: 'Nara', ja: '奈良市' }, { value: 'Himeji', ja: '姫路市' },
    { value: 'Nishinomiya', ja: '西宮市' }, { value: 'Amagasaki', ja: '尼崎市' },
    { value: 'Wakayama', ja: '和歌山市' }, { value: 'Otsu', ja: '大津市' },
    { value: 'Takarazuka', ja: '宝塚市' }, { value: 'Ashiya', ja: '芦屋市' },
  ]},
  { group: 'Chugoku / Shikoku', groupJa: '中国・四国', items: [
    { value: 'Hiroshima', ja: '広島市' }, { value: 'Fukuyama', ja: '福山市' },
    { value: 'Okayama', ja: '岡山市' }, { value: 'Kurashiki', ja: '倉敷市' },
    { value: 'Matsue', ja: '松江市' }, { value: 'Yamaguchi', ja: '山口市' },
    { value: 'Matsuyama', ja: '松山市' }, { value: 'Takamatsu', ja: '高松市' },
    { value: 'Tokushima', ja: '徳島市' }, { value: 'Kochi', ja: '高知市' },
    { value: 'Tottori', ja: '鳥取市' },
  ]},
  { group: 'Kyushu / Okinawa', groupJa: '九州・沖縄', items: [
    { value: 'Fukuoka', ja: '福岡市' }, { value: 'Kitakyushu', ja: '北九州市' },
    { value: 'Kumamoto', ja: '熊本市' }, { value: 'Kagoshima', ja: '鹿児島市' },
    { value: 'Nagasaki', ja: '長崎市' }, { value: 'Oita', ja: '大分市' },
    { value: 'Miyazaki', ja: '宮崎市' }, { value: 'Saga', ja: '佐賀市' },
    { value: 'Beppu', ja: '別府市' }, { value: 'Naha', ja: '那覇市' },
    { value: 'Nago', ja: '名護市' }, { value: 'Ishigaki', ja: '石垣市' },
  ]},
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const FROM_TIMES = [
  '6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM',
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM',
  '9:00 PM','9:30 PM','10:00 PM',
]
const TO_TIMES = [
  '6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM',
  '9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM',
  '12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM',
  '3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM',
  '6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM',
  '9:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM','Midnight',
]

const inputStyle = {
  width: '100%', border: '0.5px solid #E8DDD5', borderRadius: '12px',
  padding: '10px 16px', fontSize: '14px', outline: 'none',
  color: '#1A0208', backgroundColor: '#fff',
}

const cardStyle = {
  backgroundColor: '#fff', borderRadius: '16px',
  border: '0.5px solid #E8DDD5', padding: '24px',
}

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 500, color: '#5C0A1E', display: 'block', marginBottom: '6px' }
const sectionTitle: React.CSSProperties = { fontWeight: 600, color: '#1A0208', marginBottom: '4px', fontSize: '15px' }
const sectionHint: React.CSSProperties = { fontSize: '12px', color: '#aaa', marginBottom: '16px' }

type EduEntry  = { id?: string; degree: string; school: string; year: string }
type ExpEntry  = { id?: string; role: string; company: string; years: string }
type QualEntry = { title: string; issuer: string; year: string }

type OptionalSection = 'schedule' | 'experience' | 'education' | 'qualifications' | 'achievements'
const OPTIONAL_SECTIONS: OptionalSection[] = ['schedule', 'experience', 'education', 'qualifications', 'achievements']

type SocialSection = 'personality' | 'insights' | 'interests'
const SOCIAL_SECTIONS: SocialSection[] = ['personality', 'insights', 'interests']

function ChipPicker({ options, selected, onToggle, labels }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; labels?: string[]
}) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [custom, setCustom] = useState('')

  const addCustom = () => {
    const val = custom.trim()
    if (!val) return
    onToggle(val)
    setCustom('')
  }

  const customChips = selected.filter(s => !options.includes(s))
  const q = search.toLowerCase()
  const unselected = options.filter(opt =>
    !selected.includes(opt) && (!q || opt.toLowerCase().includes(q))
  )

  return (
    <div className="flex flex-col gap-3">
      {(selected.length > 0 || customChips.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selected.filter(s => options.includes(s)).map(opt => {
            const idx = options.indexOf(opt)
            return (
              <button key={opt} type="button" onClick={() => onToggle(opt)}
                className="text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                style={{ backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }}>
                {labels ? labels[idx] : opt} <span className="opacity-60 text-xs">✕</span>
              </button>
            )
          })}
          {customChips.map(opt => (
            <button key={opt} type="button" onClick={() => onToggle(opt)}
              className="text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
              style={{ backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }}>
              {opt} <span className="opacity-60 text-xs">✕</span>
            </button>
          ))}
        </div>
      )}

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t('edit_profile.search_placeholder')}
        style={{ border: '0.5px solid #E8DDD5', borderRadius: '20px', padding: '7px 14px', fontSize: '13px', outline: 'none', color: '#1A0208', backgroundColor: '#fff' }}
        onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
        onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
      />

      <div className="flex flex-wrap gap-2 overflow-y-auto pr-1" style={{ maxHeight: '160px' }}>
        {unselected.length > 0
          ? unselected.map((opt) => {
              const idx = options.indexOf(opt)
              return (
                <button key={opt} type="button" onClick={() => onToggle(opt)}
                  className="text-sm px-3.5 py-1.5 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {labels ? labels[idx] : opt}
                </button>
              )
            })
          : <p className="text-xs" style={{ color: '#aaa' }}>{q ? t('edit_profile.no_matches') : t('edit_profile.no_matches')}</p>
        }
      </div>

      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          placeholder={t('edit_profile.add_custom')}
          style={{ flex: 1, border: '0.5px solid #E8DDD5', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', outline: 'none', color: '#1A0208', backgroundColor: '#fff' }}
          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
        <button type="button" onClick={addCustom}
          className="text-sm px-4 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>
          {t('edit_profile.add_custom_btn')}
        </button>
      </div>
    </div>
  )
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <p style={sectionTitle}>{title}</p>
      {hint && <p style={sectionHint}>{hint}</p>}
    </div>
  )
}

function CollapsibleSection({ title, summary, children, defaultOpen = false, onRemove }: {
  title: string
  summary: string
  children: React.ReactNode
  defaultOpen?: boolean
  onRemove?: () => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '0.5px solid #E8DDD5' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
      >
        <div>
          <p style={{ fontWeight: 600, color: '#1A0208', fontSize: '15px', marginBottom: open ? 0 : '2px' }}>{title}</p>
          {!open && <p className="text-xs" style={{ color: '#aaa' }}>{summary}</p>}
        </div>
        <span className="flex-shrink-0" style={{ color: '#5C0A1E', fontSize: '14px', display: 'inline-block', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1" style={{ borderTop: '0.5px solid #F0E8E0' }}>
          {children}
          {onRemove && (
            <div className="mt-5 pt-4" style={{ borderTop: '0.5px solid #F0E8E0' }}>
              <button type="button" onClick={onRemove}
                className="text-xs hover:opacity-60 transition-opacity"
                style={{ color: '#aaa' }}>
                {t('edit_profile.remove_section')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DeleteAccountSection() {
  const { t } = useTranslation()
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    if (user) {
      const { data: files } = await supabase.storage.from('avatars').list(user.id)
      if (files?.length) {
        await supabase.storage.from('avatars').remove(files.map(f => `${user.id}/${f.name}`))
      }
    }
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      setDeleting(false)
      alert(error.message)
      return
    }
    await signOut()
    navigate('/')
  }

  return (
    <div className="rounded-2xl p-5 mt-2" style={{ border: '0.5px solid #fca5a5', backgroundColor: '#fff9f9' }}>
      <p className="text-sm font-semibold mb-1" style={{ color: '#7f1d1d' }}>{t('edit_profile.danger_zone')}</p>
      <p className="text-xs mb-4" style={{ color: '#aaa' }}>{t('edit_profile.danger_zone_hint')}</p>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          style={{ border: '1px solid #fca5a5', color: '#dc2626', backgroundColor: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff5f5')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {t('edit_profile.delete_account')}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{t('edit_profile.delete_account_confirm')}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm px-4 py-2 rounded-xl font-medium disabled:opacity-60"
              style={{ backgroundColor: '#dc2626', color: '#fff' }}
            >
              {deleting ? 'Deleting...' : t('edit_profile.delete_account_confirm_yes')}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-sm px-4 py-2 rounded-xl"
              style={{ color: '#7A6060', border: '0.5px solid #E8DDD5' }}
            >
              {t('edit_profile.delete_account_confirm_cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EditProfile() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isJa = i18n.language.startsWith('ja')
  const isZh = i18n.language.startsWith('zh')
  const { user, profile: cachedProfile, refreshProfile, loading: authLoading } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = cachedProfile as any
  const pp = p?.provider_profile
  const [userType, setUserType] = useState<'seeker' | 'provider' | 'both'>(p?.user_type ?? 'seeker')
  const isProvider = userType === 'provider' || userType === 'both'

  const [activeTab, setActiveTab] = useState<'skills' | 'social'>('skills')

  const [form, setForm] = useState({
    name:            p?.name ?? '',
    title:           pp?.title ?? '',
    bio:             p?.bio ?? '',
    location:        p?.location ?? '',
    birthYear:       String(p?.birth_year ?? ''),
    gender:          p?.gender ?? '',
    price:           String(pp?.hourly_rate ?? ''),
    priceOnline:     String(pp?.online_rate ?? ''),
    priceInPerson:   String(pp?.inperson_rate ?? ''),
    priceTrial:      String(pp?.trial_rate ?? ''),
    sessionTypes: (pp?.session_types ?? []) as string[],
    privacy:      p?.privacy_mode ?? 'public',
    vacationMode: p?.vacation_mode ?? false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview,        setAvatarPreview]        = useState<string>(p?.avatar_url ?? '')
  const [pendingAvatar,        setPendingAvatar]        = useState<File | null>(null)
  const [galleryPhotos,        setGalleryPhotos]        = useState<string[]>(p?.photos ?? [])
  const [pendingGallery,       setPendingGallery]       = useState<File[]>([])

  const [personalityTraits,    setPersonalityTraits]    = useState<string[]>(p?.personality_traits ?? [])
  const [topTraits,            setTopTraits]            = useState<string[]>(p?.top_traits ?? [])
  const [personalityInsights,  setPersonalityInsights]  = useState<string>(p?.personality_insights ?? '')
  const [mbti,                 setMbti]                 = useState<string>(p?.mbti ?? '')
  const [starSign,             setStarSign]             = useState<string>(p?.star_sign ?? '')
  const [interests,            setInterests]            = useState<string[]>(p?.interests ?? [])
  const [topInterests,         setTopInterests]         = useState<string[]>(p?.top_interests ?? [])
  const [selectedSkills,       setSelectedSkills]       = useState<string[]>((pp?.skills ?? []).filter((s: string) => !SOCIAL_SKILL_OPTIONS.includes(s)))
  const [selectedSocialSkills, setSelectedSocialSkills] = useState<string[]>((pp?.skills ?? []).filter((s: string) => SOCIAL_SKILL_OPTIONS.includes(s)))
  const [skillsDescription,    setSkillsDescription]    = useState<string>(pp?.description ?? '')
  const [topSkills,            setTopSkills]            = useState<string[]>(pp?.top_skills ?? [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [educationEntries,     setEducationEntries]     = useState<EduEntry[]>((p?.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' })))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experienceEntries,    setExperienceEntries]    = useState<ExpEntry[]>((p?.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' })))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [qualifications,       setQualifications]       = useState<QualEntry[]>((p?.qualifications ?? []).map((q: any) => ({ title: q.title ?? '', issuer: q.issuer ?? '', year: q.year ?? '' })))
  const [achievements,         setAchievements]         = useState<string[]>(p?.achievements ?? [])
  const [availLocations,       setAvailLocations]       = useState<string[]>(pp?.availability?.locations ?? [])
  const [availLocationDates,   setAvailLocationDates]   = useState<{ location: string; from: string; to: string }[]>(pp?.availability?.location_dates ?? [])
  const [availDaySchedule,     setAvailDaySchedule]     = useState<Record<string, { from: string; to: string }[]>>(() => {
    const av = pp?.availability
    if (av?.day_schedule) return av.day_schedule
    const oldDays: string[] = av?.days ?? []
    const slot = { from: av?.time_from ?? '', to: av?.time_to ?? '' }
    const result: Record<string, { from: string; to: string }[]> = {}
    oldDays.forEach(day => { result[day] = [{ ...slot }] })
    return result
  })
  const [newLocation,          setNewLocation]          = useState('')
  const [deletedEduIds,        setDeletedEduIds]        = useState<string[]>([])
  const [deletedExpIds,        setDeletedExpIds]        = useState<string[]>([])
  const [addedSections, setAddedSections] = useState<OptionalSection[]>(() => {
    const s: OptionalSection[] = []
    if (Object.keys(pp?.availability?.day_schedule ?? {}).length || (pp?.availability?.days ?? []).length) s.push('schedule')
    if ((p?.experience ?? []).length) s.push('experience')
    if ((p?.education ?? []).length) s.push('education')
    if ((p?.qualifications ?? []).length) s.push('qualifications')
    if ((p?.achievements ?? []).filter(Boolean).length) s.push('achievements')
    return s
  })
  const [openSections, setOpenSections] = useState<Set<OptionalSection>>(new Set())
  const [addedSocialSections, setAddedSocialSections] = useState<SocialSection[]>(() => {
    const s: SocialSection[] = []
    if ((p?.personality_traits ?? []).length) s.push('personality')
    if (p?.mbti || p?.star_sign || p?.personality_insights) s.push('insights')
    if ((p?.interests ?? []).length) s.push('interests')
    return s
  })
  const [openSocialSections, setOpenSocialSections] = useState<Set<SocialSection>>(new Set())

  useEffect(() => {
    if (!p) return
    const pp2 = p.provider_profile
    setUserType(p.user_type ?? 'seeker')
    setForm({
      name:            p.name ?? '',
      title:           pp2?.title ?? '',
      bio:             p.bio ?? '',
      location:        p.location ?? '',
      birthYear:       String(p.birth_year ?? ''),
      gender:          p.gender ?? '',
      price:           String(pp2?.hourly_rate ?? ''),
      priceOnline:     String(pp2?.online_rate ?? ''),
      priceInPerson:   String(pp2?.inperson_rate ?? ''),
      priceTrial:      String(pp2?.trial_rate ?? ''),
      sessionTypes: pp2?.session_types ?? [],
      privacy:      p.privacy_mode ?? 'public',
      vacationMode: p.vacation_mode ?? false,
    })
    setPersonalityTraits(p.personality_traits ?? [])
    setTopTraits(p.top_traits ?? [])
    setPersonalityInsights(p.personality_insights ?? '')
    setMbti(p.mbti ?? '')
    setStarSign(p.star_sign ?? '')
    setInterests(p.interests ?? [])
    setTopInterests(p.top_interests ?? [])
    setSelectedSkills((pp2?.skills ?? []).filter((s: string) => !SOCIAL_SKILL_OPTIONS.includes(s)))
    setSelectedSocialSkills((pp2?.skills ?? []).filter((s: string) => SOCIAL_SKILL_OPTIONS.includes(s)))
    setSkillsDescription(pp2?.description ?? '')
    setTopSkills(pp2?.top_skills ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEducationEntries((p.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setExperienceEntries((p.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setQualifications((p.qualifications ?? []).map((q: any) => ({ title: q.title ?? '', issuer: q.issuer ?? '', year: q.year ?? '' })))
    setAchievements(p.achievements ?? [])
    setAvailLocations(pp2?.availability?.locations ?? [])
    setAvailLocationDates(pp2?.availability?.location_dates ?? [])
    const av2 = pp2?.availability
    if (av2?.day_schedule) {
      setAvailDaySchedule(av2.day_schedule)
    } else {
      const oldDays2: string[] = av2?.days ?? []
      const slot2 = { from: av2?.time_from ?? '', to: av2?.time_to ?? '' }
      const result2: Record<string, { from: string; to: string }[]> = {}
      oldDays2.forEach((day: string) => { result2[day] = [{ ...slot2 }] })
      setAvailDaySchedule(result2)
    }
    setAvatarPreview(p.avatar_url ?? '')
    setGalleryPhotos(p.photos ?? [])
    const pp2av = pp2?.availability
    const sections: OptionalSection[] = []
    if (Object.keys(pp2av?.day_schedule ?? {}).length || (pp2av?.days ?? []).length) sections.push('schedule')
    if ((p.experience ?? []).length) sections.push('experience')
    if ((p.education ?? []).length) sections.push('education')
    if ((p.qualifications ?? []).length) sections.push('qualifications')
    if ((p.achievements ?? []).filter(Boolean).length) sections.push('achievements')
    setAddedSections(sections)
    const socialSections: SocialSection[] = []
    if ((p.personality_traits ?? []).length) socialSections.push('personality')
    if (p.mbti || p.star_sign || p.personality_insights) socialSections.push('insights')
    if ((p.interests ?? []).length) socialSections.push('interests')
    setAddedSocialSections(socialSections)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedProfile])

  const removeEdu = (i: number) => {
    const e = educationEntries[i]
    if (e.id) setDeletedEduIds(prev => [...prev, e.id!])
    setEducationEntries(prev => prev.filter((_, j) => j !== i))
  }
  const removeExp = (i: number) => {
    const e = experienceEntries[i]
    if (e.id) setDeletedExpIds(prev => [...prev, e.id!])
    setExperienceEntries(prev => prev.filter((_, j) => j !== i))
  }
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError(t('edit_profile.image_type_error')); return }
    if (file.size > 5 * 1024 * 1024) { setError(t('edit_profile.image_size_error')); return }
    setError(null)
    setPendingAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const addLoc = () => {
    const loc = newLocation.trim()
    if (loc && !availLocations.includes(loc)) { setAvailLocations(prev => [...prev, loc]); setNewLocation('') }
  }

  const handleUserTypeChange = (type: 'seeker' | 'provider' | 'both') => {
    setUserType(type)
  }

  const tabs = [
    { id: 'skills' as const, label: t('edit_profile.tab_skills') },
    { id: 'social' as const, label: t('edit_profile.tab_social') },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)

    if (pendingAvatar) {
      // TODO: move cleanup to server-side (R2 Worker) when switching away from Supabase storage
      const { data: existing } = await supabase.storage.from('avatars').list(user.id)
      if (existing?.length) {
        await supabase.storage.from('avatars').remove(existing.map(f => `${user.id}/${f.name}`))
      }
      const ext = pendingAvatar.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, pendingAvatar, { upsert: true })
      if (upErr) { setError(upErr.message); setSaving(false); return }
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await updateProfile(user.id, { avatar_url: `${publicUrl}?t=${Date.now()}` } as any)
      setPendingAvatar(null)
    }

    // Upload any new gallery photos
    let finalGallery = galleryPhotos.filter(url => !url.startsWith('blob:'))
    if (pendingGallery.length > 0) {
      const uploaded: string[] = []
      for (const file of pendingGallery) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
        const { error: gErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
        if (!gErr) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
          uploaded.push(publicUrl)
        }
      }
      finalGallery = [...finalGallery, ...uploaded]
      setPendingGallery([])
    }
    setGalleryPhotos(finalGallery)

    const { error: profileErr } = await updateProfile(user.id, {
      name:          form.name,
      bio:           form.bio,
      location:      form.location,
      user_type:     userType,
      privacy_mode:  form.privacy as 'public' | 'hidden' | 'anonymous',
      photos:        finalGallery,
    } as any)
    if (profileErr) { setError(profileErr.message); setSaving(false); return }

    await updateProfile(user.id, {
      vacation_mode:        form.vacationMode,
      birth_year:           form.birthYear ? Number(form.birthYear) : null,
      gender:               form.gender || null,
      personality_traits:   personalityTraits,
      top_traits:           topTraits,
      interests,
      top_interests:        topInterests,
      personality_insights: personalityInsights || null,
      mbti:                 mbti || null,
      star_sign:            starSign || null,
      qualifications,
      achievements,
    } as any).catch(() => {})

    const saves: Promise<unknown>[] = []

    if (isProvider) {
      saves.push(updateProviderProfile(user.id, {
        title:        form.title,
        description:  skillsDescription || null,
        skills:       [...selectedSkills, ...selectedSocialSkills],
        top_skills:   topSkills,
        hourly_rate:   Number(form.price) || undefined,
        online_rate:   Number(form.priceOnline) || undefined,
        inperson_rate: Number(form.priceInPerson) || undefined,
        trial_rate:    Number(form.priceTrial) || undefined,
        session_types: form.sessionTypes,
      }))
      saves.push(
        updateProviderProfile(user.id, { availability: { days: Object.keys(availDaySchedule), day_schedule: availDaySchedule, locations: availLocations, location_dates: availLocationDates } } as any)
          .catch(() => {})
      )
    }

    deletedEduIds.forEach(id => saves.push(removeEducation(id)))
    educationEntries.forEach(entry => saves.push(
      entry.id
        ? updateEducation(entry.id, { degree: entry.degree, school: entry.school, year: entry.year || null })
        : addEducation({ profile_id: user.id, degree: entry.degree, school: entry.school, year: entry.year || null })
    ))

    deletedExpIds.forEach(id => saves.push(removeExperience(id)))
    experienceEntries.forEach(entry => saves.push(
      entry.id
        ? updateExperience(entry.id, { role: entry.role, company: entry.company, years: entry.years || null })
        : addExperience({ profile_id: user.id, role: entry.role, company: entry.company, years: entry.years || null })
    ))

    await Promise.all(saves)
    await refreshProfile()
    navigate('/dashboard')
  }

  const sectionLabels: Record<OptionalSection, string> = {
    schedule:       t('edit_profile.section_schedule'),
    experience:     t('edit_profile.label_experience'),
    education:      t('edit_profile.label_education'),
    qualifications: t('edit_profile.section_qualifications'),
    achievements:   t('edit_profile.section_achievements'),
  }

  const addSection = (section: OptionalSection) => {
    setAddedSections(prev => [...prev, section])
    setOpenSections(prev => new Set([...prev, section]))
  }

  const removeSection = (section: OptionalSection) => {
    setAddedSections(prev => prev.filter(s => s !== section))
    setOpenSections(prev => { const n = new Set(prev); n.delete(section); return n })
  }

  const sectionSummary = (section: OptionalSection): string => {
    switch (section) {
      case 'schedule': {
        const days = Object.keys(availDaySchedule)
        return days.length ? t('edit_profile.summary_schedule_set', { days: days.join(', ') }) : t('edit_profile.summary_schedule_empty')
      }
      case 'experience': {
        const n = experienceEntries.length
        return n ? t('edit_profile.summary_entries', { n, suffix: n !== 1 ? 'ies' : 'y' }) : t('edit_profile.summary_experience_empty')
      }
      case 'education': {
        const n = educationEntries.length
        return n ? t('edit_profile.summary_entries', { n, suffix: n !== 1 ? 'ies' : 'y' }) : t('edit_profile.summary_education_empty')
      }
      case 'qualifications': {
        const n = qualifications.length
        return n ? t('edit_profile.summary_count', { n }) : t('edit_profile.summary_qualifications_empty')
      }
      case 'achievements': {
        const n = achievements.filter(Boolean).length
        return n ? t('edit_profile.summary_count', { n }) : t('edit_profile.summary_achievements_empty')
      }
    }
  }

  const socialSectionLabels: Record<SocialSection, string> = {
    personality: t('edit_profile.section_personality'),
    insights:    t('edit_profile.section_personality_insights'),
    interests:   t('edit_profile.section_interests'),
  }

  const addSocialSection = (section: SocialSection) => {
    setAddedSocialSections(prev => [...prev, section])
    setOpenSocialSections(prev => new Set([...prev, section]))
  }

  const removeSocialSection = (section: SocialSection) => {
    setAddedSocialSections(prev => prev.filter(s => s !== section))
    setOpenSocialSections(prev => { const n = new Set(prev); n.delete(section); return n })
  }

  const socialSectionSummary = (section: SocialSection): string => {
    switch (section) {
      case 'personality': return personalityTraits.length ? `${personalityTraits.length} trait${personalityTraits.length !== 1 ? 's' : ''} selected` : 'How would you describe yourself?'
      case 'insights':    return mbti || starSign ? [mbti, starSign].filter(Boolean).join(' · ') : 'MBTI, star sign, personality notes'
      case 'interests':   return interests.length ? `${interests.length} interest${interests.length !== 1 ? 's' : ''} selected` : 'What do you enjoy?'
    }
  }

  if (!cachedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm" style={{ color: '#aaa' }}>
          {authLoading ? 'Loading...' : 'Profile not found. Please sign out and sign back in.'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-3xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>{t('edit_profile.title')}</h1>
            <p className="text-sm mt-1" style={{ color: '#7A6060' }}>{t('edit_profile.subtitle')}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm transition-colors hover:opacity-70" style={{ color: '#5C0A1E' }}>
            {t('edit_profile.back')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '0.5px solid #FCA5A5' }}>
              {error}
            </div>
          )}

          {/* ── Tab toggle ── */}
          {/* ── Account type — always at top ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.account_type_label')} />
            <div className="flex rounded-xl overflow-hidden" style={{ border: '0.5px solid #E8DDD5' }}>
              {(['seeker', 'both', 'provider'] as const).map((type, i) => {
                const isActive = userType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleUserTypeChange(type)}
                    className="flex-1 text-sm py-2.5 transition-colors"
                    style={{
                      backgroundColor: isActive ? '#5C0A1E' : '#fff',
                      color: isActive ? '#fff' : '#7A6060',
                      fontWeight: isActive ? 600 : 400,
                      borderRight: i < 2 ? '0.5px solid #E8DDD5' : undefined,
                    }}
                  >
                    {t(`edit_profile.account_type_${type}`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Skills / Social tab toggle ── */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '0.5px solid #E8DDD5', backgroundColor: '#fff' }}>
            {tabs.map((tab, i) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 text-sm py-3 transition-colors"
                  style={{
                    backgroundColor: isActive ? '#5C0A1E' : '#fff',
                    color: isActive ? '#fff' : '#7A6060',
                    fontWeight: isActive ? 600 : 400,
                    borderRight: i < tabs.length - 1 ? '0.5px solid #E8DDD5' : undefined,
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* ── Photo ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_photo')} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => {
                const files = Array.from(e.target.files ?? [])
                const remaining = 5 - galleryPhotos.length - pendingGallery.length
                const toAdd = files.slice(0, remaining)
                setPendingGallery(prev => [...prev, ...toAdd])
                e.target.value = ''
              }} />

            {/* Profile photo */}
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl overflow-hidden"
                style={{ backgroundColor: '#FDF0E0', border: '2px solid #E8DDD5' }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : form.name ? form.name[0].toUpperCase() : '?'
                }
              </div>
              <div>
                <button type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm px-4 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: '#FDF0E0', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {pendingAvatar ? t('edit_profile.photo_selected') : t('edit_profile.upload_photo')}
                </button>
                <p className="text-xs mt-2" style={{ color: '#aaa' }}>{t('edit_profile.photo_hint')}</p>
              </div>
            </div>

            {/* Gallery photos */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#5C0A1E' }}>{t('edit_profile.section_gallery')} <span style={{ color: '#aaa', fontWeight: 400 }}>({galleryPhotos.length + pendingGallery.length}/5)</span></p>
              <div className="flex flex-wrap gap-2">
                {galleryPhotos.map((url, i) => (
                  <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden" style={{ border: '0.5px solid #E8DDD5' }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button"
                      onClick={() => setGalleryPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}>✕</button>
                  </div>
                ))}
                {pendingGallery.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden" style={{ border: '0.5px solid #B8860B' }}>
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button type="button"
                      onClick={() => setPendingGallery(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}>✕</button>
                  </div>
                ))}
                {(galleryPhotos.length + pendingGallery.length) < 5 && (
                  <button type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl flex flex-col items-center justify-center text-xs gap-1"
                    style={{ border: '1px dashed #E8DDD5', color: '#aaa' }}>
                    <span className="text-lg">+</span>
                    {t('edit_profile.add_photo')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Basic info (always visible) ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_basic')} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>{t('edit_profile.label_name')}</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              {isProvider && (
                <div>
                  <label style={labelStyle}>{t('edit_profile.label_title')}</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                </div>
              )}
              <div className="col-span-2">
                <label style={labelStyle}>{t('edit_profile.label_location')}</label>
                <select
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                >
                  <option value="">{t('nav.select_location')}</option>
                  {LOCATION_GROUPS.map(group => (
                    <optgroup key={group.group} label={isJa ? group.groupJa : group.group}>
                      {group.items.map(item => (
                        <option key={`${group.group}-${item.value}`} value={item.value}>
                          {isJa ? item.ja : isZh ? (ZH_CITY[item.value] ?? item.value) : item.value}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('edit_profile.label_birth_year')}</label>
                <input type="number" placeholder="e.g. 1990" min={1940} max={new Date().getFullYear() - 16}
                  value={form.birthYear}
                  onChange={e => setForm({ ...form, birthYear: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              <div>
                <label style={labelStyle}>{t('edit_profile.label_gender')}</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">{t('nav.gender_prefer_not')}</option>
                  <option value="male">{t('nav.gender_male')}</option>
                  <option value="female">{t('nav.gender_female')}</option>
                  <option value="non-binary">{t('nav.gender_nonbinary')}</option>
                  <option value="prefer-not-to-say">{t('nav.gender_prefer_not')}</option>
                </select>
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>{t('edit_profile.label_bio')}</label>
                <p className="text-xs mb-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                  {t('edit_profile.language_tip')}
                </p>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
            </div>
          </div>

          {/* ── Skills tab (provider/both) ── */}
          {activeTab === 'skills' && isProvider && (
            <>
              {/* Skills — always visible */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.section_skills')} />
                <ChipPicker options={SKILL_OPTIONS} selected={selectedSkills}
                  onToggle={v => toggle(selectedSkills, v, setSelectedSkills)}
                  labels={isJa ? SKILL_OPTIONS_JA : isZh ? SKILL_OPTIONS_ZH : undefined} />
                <div className="mt-5">
                  <label style={labelStyle}>{t('edit_profile.skills_description_label')}</label>
                  {(isJa || isZh) && (
                    <p className="text-xs mb-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#FDF0E0', color: '#7A4A00' }}>
                      {t('edit_profile.language_tip', { lang: isJa ? '日本語' : '中文' })}
                    </p>
                  )}
                  <textarea
                    value={skillsDescription}
                    onChange={e => setSkillsDescription(e.target.value)}
                    rows={4}
                    placeholder={t('edit_profile.skills_description_placeholder')}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  />
                </div>
              </div>

              {/* Bookings — always visible (session types + pricing) */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.bookings_title')} hint={t('edit_profile.bookings_hint')} />
                <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>{t('edit_profile.session_types_label')}</p>
                <div className="flex flex-col gap-3 mb-6">
                  {([
                    ['1-on-1 Session',    t('edit_profile.session_1on1')],
                    ['Group Meetup',      t('edit_profile.session_group')],
                    ['Online Call',       t('edit_profile.session_online')],
                    ['Social Experience', t('edit_profile.session_social')],
                  ] as const).map(([type, label]) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.sessionTypes.includes(type)}
                        onChange={() => setForm(prev => ({
                          ...prev,
                          sessionTypes: prev.sessionTypes.includes(type)
                            ? prev.sessionTypes.filter((st: string) => st !== type)
                            : [...prev.sessionTypes, type],
                        }))}
                        className="w-4 h-4" style={{ accentColor: '#B8860B' }} />
                      <span className="text-sm" style={{ color: '#1A0208' }}>{label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>{t('edit_profile.pricing_label')}</p>
                {([
                  [t('edit_profile.price_online'),    'priceOnline',   t('edit_profile.price_online_hint')],
                  [t('edit_profile.price_inperson'),  'priceInPerson', t('edit_profile.price_inperson_hint')],
                  [t('edit_profile.price_trial'),     'priceTrial',    t('edit_profile.price_trial_hint')],
                ] as const).map(([label, key, hint]) => (
                  <div key={key} className="flex items-center gap-3 mb-4 last:mb-0">
                    <div style={{ width: '90px' }}>
                      <p className="text-sm font-medium" style={{ color: '#1A0208' }}>{label}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{hint}</p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#5C0A1E' }}>¥</span>
                    <input type="number" value={form[key]} min={0} step={1} placeholder="—"
                      onKeyDown={e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                      onChange={e => setForm({ ...form, [key]: e.target.value === '' ? '' : String(Math.max(0, Math.floor(Number(e.target.value)))) })}
                      style={{ ...inputStyle, width: '140px' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                    <span className="text-sm" style={{ color: '#aaa' }}>{t('profile.per_hr')}</span>
                  </div>
                ))}
              </div>

              {/* Added optional sections */}
              {addedSections.map(section => (
                <CollapsibleSection
                  key={section}
                  title={sectionLabels[section]}
                  summary={sectionSummary(section)}
                  defaultOpen={openSections.has(section)}
                  onRemove={() => removeSection(section)}
                >
                  {section === 'experience' && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                        {[t('edit_profile.label_role'), t('edit_profile.label_company'), t('edit_profile.label_years_exp')].map(h => (
                          <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 mb-3">
                        {experienceEntries.map((entry, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2 items-start">
                            <input placeholder="Role" value={entry.role}
                              onChange={e => setExperienceEntries(prev => prev.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <input placeholder="Company" value={entry.company}
                              onChange={e => setExperienceEntries(prev => prev.map((x, j) => j === i ? { ...x, company: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <div className="flex gap-2">
                              <input type="number" placeholder="Years" min={0} max={60} value={entry.years}
                                onChange={e => setExperienceEntries(prev => prev.map((x, j) => j === i ? { ...x, years: e.target.value } : x))}
                                style={{ ...inputStyle, fontSize: '13px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                                onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                              <button type="button" onClick={() => removeExp(i)}
                                className="text-xs px-2 rounded-lg flex-shrink-0"
                                style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button"
                        onClick={() => setExperienceEntries(prev => [...prev, { role: '', company: '', years: '' }])}
                        className="text-xs px-4 py-2 rounded-xl"
                        style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                        {t('edit_profile.add_experience')}
                      </button>
                    </>
                  )}
                  {section === 'education' && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                        {[t('edit_profile.label_degree'), t('edit_profile.label_school'), t('edit_profile.label_year')].map(h => (
                          <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 mb-3">
                        {educationEntries.map((entry, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2 items-start">
                            <input placeholder="Degree" value={entry.degree}
                              onChange={e => setEducationEntries(prev => prev.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <input placeholder="School" value={entry.school}
                              onChange={e => setEducationEntries(prev => prev.map((x, j) => j === i ? { ...x, school: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <div className="flex gap-2">
                              <input type="number" placeholder="Year" min={1970} max={new Date().getFullYear()} value={entry.year}
                                onChange={e => setEducationEntries(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))}
                                style={{ ...inputStyle, fontSize: '13px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                                onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                              <button type="button" onClick={() => removeEdu(i)}
                                className="text-xs px-2 rounded-lg flex-shrink-0"
                                style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button"
                        onClick={() => setEducationEntries(prev => [...prev, { degree: '', school: '', year: '' }])}
                        className="text-xs px-4 py-2 rounded-xl"
                        style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                        {t('edit_profile.add_education')}
                      </button>
                    </>
                  )}
                  {section === 'qualifications' && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                        {[t('edit_profile.label_degree'), t('edit_profile.label_issuer'), t('edit_profile.label_year')].map(h => (
                          <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 mb-3">
                        {qualifications.map((entry, i) => (
                          <div key={i} className="grid grid-cols-3 gap-2 items-start">
                            <input placeholder={t('edit_profile.cert_placeholder')} value={entry.title}
                              onChange={e => setQualifications(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <input placeholder={t('edit_profile.issuer_placeholder')} value={entry.issuer}
                              onChange={e => setQualifications(prev => prev.map((x, j) => j === i ? { ...x, issuer: e.target.value } : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <div className="flex gap-2">
                              <input type="number" placeholder="Year" min={1970} max={new Date().getFullYear() + 5} value={entry.year}
                                onChange={e => setQualifications(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))}
                                style={{ ...inputStyle, fontSize: '13px' }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                                onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                              <button type="button" onClick={() => setQualifications(prev => prev.filter((_, j) => j !== i))}
                                className="text-xs px-2 rounded-lg flex-shrink-0"
                                style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button"
                        onClick={() => setQualifications(prev => [...prev, { title: '', issuer: '', year: '' }])}
                        className="text-xs px-4 py-2 rounded-xl"
                        style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                        {t('edit_profile.add_qualification')}
                      </button>
                    </>
                  )}
                  {section === 'achievements' && (
                    <>
                      <div className="flex flex-col gap-3 mb-3">
                        {achievements.map((ach, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <input placeholder={t('edit_profile.achievement_placeholder')} value={ach}
                              onChange={e => setAchievements(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                              style={{ ...inputStyle, fontSize: '13px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <button type="button" onClick={() => setAchievements(prev => prev.filter((_, j) => j !== i))}
                              className="text-xs px-2 py-3 rounded-lg flex-shrink-0"
                              style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <button type="button"
                        onClick={() => setAchievements(prev => [...prev, ''])}
                        className="text-xs px-4 py-2 rounded-xl"
                        style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                        {t('edit_profile.add_achievement')}
                      </button>
                    </>
                  )}
                  {section === 'schedule' && (
                    <>
                      <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>
                        {t('edit_profile.schedule_days')}
                      </p>
                      <div className="flex flex-col gap-2 mb-6">
                        {DAYS.map(day => {
                          const slots = availDaySchedule[day] ?? []
                          const enabled = slots.length > 0
                          return (
                            <div key={day} className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #E8DDD5' }}>
                              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                style={{ backgroundColor: enabled ? '#FDF0E0' : '#fff' }}>
                                <input type="checkbox" checked={enabled}
                                  onChange={() => {
                                    if (enabled) {
                                      setAvailDaySchedule(prev => { const n = { ...prev }; delete n[day]; return n })
                                    } else {
                                      setAvailDaySchedule(prev => ({ ...prev, [day]: [{ from: '', to: '' }] }))
                                    }
                                  }}
                                  className="w-4 h-4 flex-shrink-0" style={{ accentColor: '#5C0A1E' }} />
                                <span className="text-sm font-medium w-10 flex-shrink-0"
                                  style={{ color: enabled ? '#1A0208' : '#aaa' }}>{day}</span>
                                {!enabled && <span className="text-xs" style={{ color: '#ccc' }}>{t('edit_profile.unavailable')}</span>}
                              </label>
                              {enabled && (
                                <div className="px-4 pb-3 flex flex-col gap-2" style={{ borderTop: '0.5px solid #E8DDD5' }}>
                                  {slots.map((slot, si) => (
                                    <div key={si} className="flex items-center gap-2 pt-2">
                                      <span className="text-xs" style={{ color: '#aaa', whiteSpace: 'nowrap' }}>{t('edit_profile.time_from')}</span>
                                      <select value={slot.from}
                                        onChange={e => setAvailDaySchedule(prev => ({
                                          ...prev,
                                          [day]: prev[day].map((s, i) => i === si ? { ...s, from: e.target.value } : s)
                                        }))}
                                        style={{ ...inputStyle, fontSize: '13px', cursor: 'pointer' }}>
                                        <option value="">—</option>
                                        {FROM_TIMES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                                      </select>
                                      <span className="text-xs" style={{ color: '#aaa', whiteSpace: 'nowrap' }}>{t('edit_profile.time_to')}</span>
                                      <select value={slot.to}
                                        onChange={e => setAvailDaySchedule(prev => ({
                                          ...prev,
                                          [day]: prev[day].map((s, i) => i === si ? { ...s, to: e.target.value } : s)
                                        }))}
                                        style={{ ...inputStyle, fontSize: '13px', cursor: 'pointer' }}>
                                        <option value="">—</option>
                                        {TO_TIMES.map(tt => <option key={tt} value={tt}>{tt}</option>)}
                                      </select>
                                      {slots.length > 1 && (
                                        <button type="button"
                                          onClick={() => setAvailDaySchedule(prev => ({
                                            ...prev,
                                            [day]: prev[day].filter((_, i) => i !== si)
                                          }))}
                                          className="text-xs px-2 py-2 rounded-lg flex-shrink-0"
                                          style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                                      )}
                                    </div>
                                  ))}
                                  <button type="button"
                                    onClick={() => setAvailDaySchedule(prev => ({
                                      ...prev,
                                      [day]: [...prev[day], { from: '', to: '' }]
                                    }))}
                                    className="text-xs px-3 py-1 rounded-full mt-1 self-start"
                                    style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                                    {t('edit_profile.add_slot')}
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>
                        {t('edit_profile.schedule_location_dates')}
                      </p>
                      <div className="flex flex-col gap-3 mb-3">
                        {availLocationDates.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2 flex-wrap">
                            <input placeholder={t('edit_profile.schedule_location_dates_placeholder')} value={entry.location}
                              onChange={e => setAvailLocationDates(prev => prev.map((s, i) => i === idx ? { ...s, location: e.target.value } : s))}
                              style={{ ...inputStyle, fontSize: '13px', flex: '2 1 120px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <input type="date" value={entry.from}
                              onChange={e => setAvailLocationDates(prev => prev.map((s, i) => i === idx ? { ...s, from: e.target.value } : s))}
                              style={{ ...inputStyle, fontSize: '13px', flex: '1 1 130px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <span className="text-xs flex-shrink-0" style={{ color: '#aaa' }}>–</span>
                            <input type="date" value={entry.to}
                              onChange={e => setAvailLocationDates(prev => prev.map((s, i) => i === idx ? { ...s, to: e.target.value } : s))}
                              style={{ ...inputStyle, fontSize: '13px', flex: '1 1 130px' }}
                              onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                              onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                            <button type="button" onClick={() => setAvailLocationDates(prev => prev.filter((_, i) => i !== idx))}
                              className="text-xs px-2 py-2 rounded-lg flex-shrink-0"
                              style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setAvailLocationDates(prev => [...prev, { location: '', from: '', to: '' }])}
                        className="text-xs px-4 py-2 rounded-xl mb-6"
                        style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                        + {t('edit_profile.add_location_date')}
                      </button>

                      <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>
                        {t('edit_profile.schedule_locations')}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {availLocations.map((loc, i) => (
                          <span key={i} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: '#FDF0E0', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                            {loc}
                            <button type="button" onClick={() => setAvailLocations(prev => prev.filter((_, j) => j !== i))}
                              className="text-xs opacity-50 hover:opacity-100 ml-0.5">✕</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={newLocation} onChange={e => setNewLocation(e.target.value)}
                          placeholder={t('edit_profile.schedule_location_placeholder')}
                          style={{ ...inputStyle, fontSize: '13px' }}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLoc() } }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                        <button type="button" onClick={addLoc}
                          className="text-sm px-4 py-2 rounded-xl flex-shrink-0 transition-colors"
                          style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}>
                          {t('edit_profile.add_location')}
                        </button>
                      </div>
                    </>
                  )}
                </CollapsibleSection>
              ))}

              {/* Add more to your profile */}
              {OPTIONAL_SECTIONS.some(s => !addedSections.includes(s)) && (
                <div style={cardStyle}>
                  <p style={sectionTitle}>{t('edit_profile.add_more_title')}</p>
                  <p className="text-xs mb-3" style={{ color: '#aaa' }}>{t('edit_profile.add_more_hint')}</p>
                  <div className="flex flex-wrap gap-2">
                    {OPTIONAL_SECTIONS.filter(s => !addedSections.includes(s)).map(section => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => addSection(section)}
                        className="text-sm px-4 py-2 rounded-full transition-colors"
                        style={{ color: '#5C0A1E', border: '0.5px solid #5C0A1E', backgroundColor: '#fff' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF0E0')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                      >
                        + {sectionLabels[section]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Skills tab (seeker only) ── */}
          {activeTab === 'skills' && !isProvider && (
            <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.seeker_looking_for')} />
              <p className="text-sm" style={{ color: '#aaa' }}>{t('edit_profile.seeker_looking_for_hint')}</p>
            </div>
          )}

          {/* ── Social tab ── */}
          {activeTab === 'social' && (
            <>
              {/* Social experience — always visible */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.section_social_skills')} hint={t('edit_profile.social_skills_hint')} />
                <ChipPicker options={SOCIAL_SKILL_OPTIONS} selected={selectedSocialSkills}
                  onToggle={v => toggle(selectedSocialSkills, v, setSelectedSocialSkills)}
                  labels={isJa ? SOCIAL_SKILL_OPTIONS_JA : isZh ? SOCIAL_SKILL_OPTIONS_ZH : undefined} />
              </div>

              {/* Added optional social sections */}
              {addedSocialSections.map(section => (
                <CollapsibleSection
                  key={section}
                  title={socialSectionLabels[section]}
                  summary={socialSectionSummary(section)}
                  defaultOpen={openSocialSections.has(section)}
                  onRemove={() => removeSocialSection(section)}
                >
                  {section === 'personality' && (
                    <ChipPicker options={PERSONALITY_TRAITS} selected={personalityTraits}
                      onToggle={v => toggle(personalityTraits, v, setPersonalityTraits)}
                      labels={isJa ? PERSONALITY_TRAITS_JA : isZh ? PERSONALITY_TRAITS.map(t => TRAIT_ZH[t] ?? t) : undefined} />
                  )}
                  {section === 'insights' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label style={labelStyle}>{t('edit_profile.mbti_label')}</label>
                          <select value={mbti} onChange={e => setMbti(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="">{t('edit_profile.select_default')}</option>
                            {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
                              'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>{t('edit_profile.star_sign')}</label>
                          <select value={starSign} onChange={e => setStarSign(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="">{t('edit_profile.select_default')}</option>
                            {['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                              'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].map(s => (
                              <option key={s} value={s.toLowerCase()}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <label style={labelStyle}>{t('edit_profile.label_personality_insights')}</label>
                      <textarea value={personalityInsights} onChange={e => setPersonalityInsights(e.target.value)} rows={3}
                        placeholder={t('edit_profile.personality_insights_placeholder')}
                        style={{ ...inputStyle, resize: 'none' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                    </>
                  )}
                  {section === 'interests' && (
                    <ChipPicker options={INTEREST_OPTIONS} selected={interests}
                      onToggle={v => toggle(interests, v, setInterests)}
                      labels={isJa ? INTEREST_OPTIONS_JA : isZh ? INTEREST_OPTIONS.map(i => INTEREST_ZH[i] ?? i) : undefined} />
                  )}
                </CollapsibleSection>
              ))}

              {/* Add more to your profile */}
              {SOCIAL_SECTIONS.some(s => !addedSocialSections.includes(s)) && (
                <div style={cardStyle}>
                  <p style={sectionTitle}>{t('edit_profile.add_more_title')}</p>
                  <p className="text-xs mb-3" style={{ color: '#aaa' }}>{t('edit_profile.add_more_social_hint')}</p>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_SECTIONS.filter(s => !addedSocialSections.includes(s)).map(section => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => addSocialSection(section)}
                        className="text-sm px-4 py-2 rounded-full transition-colors"
                        style={{ color: '#5C0A1E', border: '0.5px solid #5C0A1E', backgroundColor: '#fff' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FDF0E0')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                      >
                        + {socialSectionLabels[section]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Privacy & vacation — always visible ── */}
          <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.section_privacy')} />
              <div className="flex flex-col gap-3">
                {[
                  { value: 'public',    label: t('edit_profile.privacy_public') },
                  { value: 'hidden',    label: t('edit_profile.privacy_hidden') },
                  { value: 'anonymous', label: t('edit_profile.privacy_anonymous') },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="privacy" value={opt.value} checked={form.privacy === opt.value}
                      onChange={() => setForm({ ...form, privacy: opt.value })}
                      className="w-4 h-4" style={{ accentColor: '#B8860B' }} />
                    <span className="text-sm" style={{ color: '#1A0208' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
              <hr className="my-4" style={{ borderColor: '#E8DDD5' }} />
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.vacationMode}
                  onChange={e => setForm({ ...form, vacationMode: e.target.checked })}
                  className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ accentColor: '#B8860B' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1A0208' }}>🏖️ {t('edit_profile.vacation_mode')}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{t('edit_profile.vacation_mode_hint')}</p>
                </div>
              </label>
          </div>

          <div className="flex items-center gap-4 pb-4">
            <button type="submit" disabled={saving}
              className="font-medium px-8 py-3 rounded-xl transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}>
              {saving ? '...' : t('edit_profile.save')}
            </button>
          </div>

          <DeleteAccountSection />

        </form>
      </div>
    </div>
  )
}
