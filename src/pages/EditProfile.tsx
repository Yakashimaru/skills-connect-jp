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
  'Coaching', 'Coder', 'Communication support', 'Companion', 'Conversation', 'Cooking', 'Copywriting',
  'Data analysis', 'Designer', 'Dog Walker',
  'English', 'Event planning',
  'Finance', 'Fitness', 'French',
  'Golf', 'Graphic design',
  'Investing', 'IT support',
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
  'コーチング', 'コーダー', 'コミュニケーションサポート', 'コンパニオン', '会話', '料理', 'コピーライティング',
  'データ分析', 'デザイナー', 'ドッグウォーカー',
  '英語', 'イベント企画',
  'ファイナンス', 'フィットネス', 'フランス語',
  'ゴルフ', 'グラフィックデザイン',
  '投資', 'ITサポート',
  '日本語',
  '韓国語',
  '中国語', 'マーケター', 'マーケティング', '武道', 'メンタリング', '音楽インストラクター', 'ミュージシャン',
  'パーソナルショッパー', 'パーソナルトレーニング', 'フォトグラファー', 'プレゼンテーション', 'プライベートハイヤー',
  'スペイン語', 'スポーツインストラクター',
  'ツアーガイド', '旅行サポート', '個別指導',
  '動画編集', 'ビデオグラファー',
  'ウェブ開発',
]

const LOCATION_EN_TO_JA: Record<string, string> = {
  'Online only': 'オンラインのみ',
  'Tokyo': '東京', 'Osaka': '大阪', 'Kyoto': '京都',
  'Yokohama': '横浜', 'Nagoya': '名古屋', 'Sapporo': '札幌',
  'Fukuoka': '福岡', 'Kobe': '神戸', 'Hiroshima': '広島',
  'Sendai': '仙台', 'Nara': '奈良', 'Kanazawa': '金沢',
  'Nagano': '長野', 'Okinawa': '沖縄', 'Naha': '那覇',
  'Kawasaki': '川崎', 'Saitama': 'さいたま', 'Chiba': '千葉',
  'Hamamatsu': '浜松', 'Kumamoto': '熊本', 'Niigata': '新潟',
  'Shizuoka': '静岡', 'Okayama': '岡山', 'Kagoshima': '鹿児島',
  'Matsuyama': '松山', 'Takamatsu': '高松', 'Tokushima': '徳島',
  'Kochi': '高知', 'Nagasaki': '長崎', 'Oita': '大分',
  'Miyazaki': '宮崎', 'Saga': '佐賀', 'Fukushima': '福島',
  'Mito': '水戸', 'Utsunomiya': '宇都宮', 'Maebashi': '前橋',
  'Gifu': '岐阜', 'Tsu': '津', 'Otsu': '大津',
  'Wakayama': '和歌山', 'Tottori': '鳥取', 'Matsue': '松江',
  'Yamaguchi': '山口', 'Akita': '秋田', 'Yamagata': '山形',
  'Morioka': '盛岡', 'Aomori': '青森', 'Hakodate': '函館',
  'Asahikawa': '旭川',
}
const LOCATION_JA_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(LOCATION_EN_TO_JA).map(([en, ja]) => [ja, en])
)

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

function TopPicker({ pool, selected, onToggle, max = 5 }: {
  pool: string[]; selected: string[]; onToggle: (v: string) => void; max?: number
}) {
  if (pool.length === 0) return (
    <p className="text-xs" style={{ color: '#aaa' }}>Select some options above first.</p>
  )
  return (
    <div className="flex flex-wrap gap-2">
      {pool.map(opt => {
        const active = selected.includes(opt)
        const disabled = !active && selected.length >= max
        return (
          <button key={opt} type="button" onClick={() => !disabled && onToggle(opt)}
            className="text-sm px-3.5 py-1.5 rounded-full transition-colors"
            style={active
              ? { backgroundColor: '#5C0A1E', color: '#fff', border: '1px solid #5C0A1E' }
              : disabled
                ? { backgroundColor: 'transparent', color: '#ccc', border: '0.5px solid #eee', cursor: 'not-allowed' }
                : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ChipPicker({ options, selected, onToggle, labels }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; labels?: string[]
}) {
  const [custom, setCustom] = useState('')

  const addCustom = () => {
    const val = custom.trim()
    if (!val) return
    onToggle(val)
    setCustom('')
  }

  // custom chips = selected values not in the preset list
  const customChips = selected.filter(s => !options.includes(s))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((opt, idx) => (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className="text-sm px-3.5 py-1.5 rounded-full transition-colors"
            style={selected.includes(opt)
              ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
              : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
            {labels ? labels[idx] : opt}
          </button>
        ))}
        {customChips.map(opt => (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className="text-sm px-3.5 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }}>
            {opt} ✕
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          placeholder="Add your own…"
          style={{ flex: 1, border: '0.5px solid #E8DDD5', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', outline: 'none', color: '#1A0208', backgroundColor: '#fff' }}
          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
        <button type="button" onClick={addCustom}
          className="text-sm px-4 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: '#5C0A1E', color: '#fff' }}>
          + Add
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

function DeleteAccountSection() {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
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
      <p className="text-sm font-semibold mb-1" style={{ color: '#7f1d1d' }}>Danger zone</p>
      <p className="text-xs mb-4" style={{ color: '#aaa' }}>Once deleted, your account and all data cannot be recovered.</p>
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
  const { user, profile: cachedProfile, refreshProfile, loading: authLoading } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = cachedProfile as any
  const pp = p?.provider_profile
  const [userType, setUserType] = useState<'seeker' | 'provider' | 'both'>(p?.user_type ?? 'seeker')
  const isProvider = userType === 'provider' || userType === 'both'

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
  const [avatarPreview,        setAvatarPreview]        = useState<string>(p?.avatar_url ?? '')
  const [uploadingAvatar,      setUploadingAvatar]      = useState(false)

  const [personalityTraits,    setPersonalityTraits]    = useState<string[]>(p?.personality_traits ?? [])
  const [topTraits,            setTopTraits]            = useState<string[]>(p?.top_traits ?? [])
  const [personalityInsights,  setPersonalityInsights]  = useState<string>(p?.personality_insights ?? '')
  const [mbti,                 setMbti]                 = useState<string>(p?.mbti ?? '')
  const [loveLanguage,         setLoveLanguage]         = useState<string>(p?.love_language ?? '')
  const [starSign,             setStarSign]             = useState<string>(p?.star_sign ?? '')
  const [interests,            setInterests]            = useState<string[]>(p?.interests ?? [])
  const [topInterests,         setTopInterests]         = useState<string[]>(p?.top_interests ?? [])
  const [selectedSkills,       setSelectedSkills]       = useState<string[]>(pp?.skills ?? [])
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
  const [bioTone,              setBioTone]              = useState('friendly')
  const [bioLang,              setBioLang]              = useState(() => i18n.language.startsWith('ja') ? 'ja' : 'en')
  const [generatingBio,        setGeneratingBio]        = useState(false)

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
    setLoveLanguage(p.love_language ?? '')
    setStarSign(p.star_sign ?? '')
    setInterests(p.interests ?? [])
    setTopInterests(p.top_interests ?? [])
    setSelectedSkills(pp2?.skills ?? [])
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
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return }
    setUploadingAvatar(true)
    setError(null)
    // TODO: move cleanup to server-side (R2 Worker) when switching away from Supabase storage
    const { data: existing } = await supabase.storage.from('avatars').list(user.id)
    if (existing?.length) {
      await supabase.storage.from('avatars').remove(existing.map(f => `${user.id}/${f.name}`))
    }
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploadingAvatar(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile(user.id, { avatar_url: publicUrl } as any)
    await refreshProfile()
    setAvatarPreview(publicUrl)
    setUploadingAvatar(false)
  }

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const generateBio = async () => {
    setGeneratingBio(true)
    const { data, error } = await supabase.functions.invoke('generate-bio', {
      body: {
        name:         form.name,
        role:         isProvider ? 'provider' : 'seeker',
        tone:         bioTone,
        language:     bioLang,
        location:     form.location,
        traits:       personalityTraits,
        interests,
        skills:       isProvider ? selectedSkills : [],
        mbti,
        loveLanguage,
        starSign,
      },
    })
    setGeneratingBio(false)
    if (!error && data?.bio) setForm(prev => ({ ...prev, bio: data.bio }))
  }
  useEffect(() => {
    setForm(prev => {
      const loc = prev.location
      if (!loc) return prev
      const translated = isJa
        ? (LOCATION_EN_TO_JA[loc] ?? loc)
        : (LOCATION_JA_TO_EN[loc] ?? loc)
      return translated !== loc ? { ...prev, location: translated } : prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJa])

  const addLoc = () => {
    const loc = newLocation.trim()
    if (loc && !availLocations.includes(loc)) { setAvailLocations(prev => [...prev, loc]); setNewLocation('') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)

    // Base fields — always exist in the original schema
    const { error: profileErr } = await updateProfile(user.id, {
      name:             form.name,
      bio:              form.bio,
      location:         form.location,
      user_type:     userType,
      privacy_mode:  form.privacy as 'public' | 'hidden' | 'anonymous',
      vacation_mode: form.vacationMode,
    } as any)
    if (profileErr) { setError(profileErr.message); setSaving(false); return }

    // Extended fields — added by migrations 005 & 007; silently skip if columns not yet applied
    await updateProfile(user.id, {
      birth_year:           form.birthYear ? Number(form.birthYear) : null,
      gender:               form.gender || null,
      personality_traits:   personalityTraits,
      top_traits:           topTraits,
      interests,
      top_interests:        topInterests,
      personality_insights: personalityInsights || null,
      mbti:                 mbti || null,
      love_language:        loveLanguage || null,
      star_sign:            starSign || null,
      qualifications,
      achievements,
    } as any).catch(() => {})

    const saves: Promise<unknown>[] = []

    if (isProvider) {
      saves.push(updateProviderProfile(user.id, {
        title:        form.title,
        skills:       selectedSkills,
        top_skills:   topSkills,
        hourly_rate:   Number(form.price) || undefined,
        online_rate:   Number(form.priceOnline) || undefined,
        inperson_rate: Number(form.priceInPerson) || undefined,
        trial_rate:    Number(form.priceTrial) || undefined,
        session_types: form.sessionTypes,
      }))
      // availability column added by migration 005 — silently skip if not yet applied
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

          {/* ── Account type ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_account')} />
            <p className="text-sm font-medium mb-3" style={{ color: '#1A0208' }}>{t('edit_profile.account_type_label')}</p>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '0.5px solid #E8DDD5' }}>
              {(['seeker', 'both', 'provider'] as const).map((type, i) => {
                const isActive = userType === type
                const isDisabled = (userType === 'provider' && type === 'seeker') ||
                                   (userType === 'seeker' && type === 'provider')
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => !isDisabled && setUserType(type)}
                    disabled={isDisabled}
                    className="flex-1 text-sm py-2.5 transition-colors"
                    style={{
                      backgroundColor: isActive ? '#5C0A1E' : '#fff',
                      color: isActive ? '#fff' : isDisabled ? '#D5C8C0' : '#7A6060',
                      fontWeight: isActive ? 600 : 400,
                      borderRight: i < 2 ? '0.5px solid #E8DDD5' : undefined,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {t(`edit_profile.account_type_${type}`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Photo ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_photo')} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl overflow-hidden"
                style={{ backgroundColor: '#FDF0E0', border: '2px solid #E8DDD5' }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : form.name ? form.name[0].toUpperCase() : '?'
                }
              </div>
              <div>
                <button type="button" disabled={uploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                  style={{ backgroundColor: '#FDF0E0', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {uploadingAvatar ? 'Uploading...' : t('edit_profile.upload_photo')}
                </button>
                <p className="text-xs mt-2" style={{ color: '#aaa' }}>{t('edit_profile.photo_hint')}</p>
              </div>
            </div>
          </div>

          {/* ── Basic info ── */}
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
                <input list="location-list" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Tokyo, Osaka, or type your own…"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                <datalist id="location-list">
                  {Object.entries(LOCATION_EN_TO_JA).map(([en, ja]) => (
                    <option key={en} value={isJa ? ja : en} />
                  ))}
                </datalist>
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
                  <option value="">— prefer not to say —</option>
                  <option value="male">{t('nav.gender_male')}</option>
                  <option value="female">{t('nav.gender_female')}</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>{t('edit_profile.label_bio')}</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />

                {/* AI generate */}
                <div className="mt-3 rounded-xl p-3 flex flex-wrap items-center gap-2" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5' }}>
                  <span className="text-xs font-medium" style={{ color: '#5C0A1E' }}>✨ {t('edit_profile.generate_with_ai')}</span>
                  {(personalityTraits.length === 0 && interests.length === 0 && selectedSkills.length === 0) ? (
                    <span className="text-xs" style={{ color: '#aaa' }}>— {t('edit_profile.generate_select_first')}</span>
                  ) : (
                    <>
                      <select value={bioTone} onChange={e => setBioTone(e.target.value)}
                        style={{ fontSize: '12px', border: '0.5px solid #E8DDD5', borderRadius: '8px', padding: '4px 8px', color: '#1A0208', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' }}>
                        <option value="friendly">{t('edit_profile.generate_tone_friendly')}</option>
                        <option value="professional">{t('edit_profile.generate_tone_professional')}</option>
                        <option value="casual">{t('edit_profile.generate_tone_casual')}</option>
                        <option value="creative">{t('edit_profile.generate_tone_creative')}</option>
                      </select>
                      <select value={bioLang} onChange={e => setBioLang(e.target.value)}
                        style={{ fontSize: '12px', border: '0.5px solid #E8DDD5', borderRadius: '8px', padding: '4px 8px', color: '#1A0208', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' }}>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                      </select>
                      <button type="button" onClick={generateBio} disabled={generatingBio}
                        className="text-xs px-4 py-1.5 rounded-full font-medium disabled:opacity-50 ml-auto"
                        style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>
                        {generatingBio ? t('edit_profile.generate_generating') : t('edit_profile.generate_button')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Personality traits ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_personality')} hint={t('edit_profile.personality_traits_hint')} />
            <ChipPicker options={PERSONALITY_TRAITS} selected={personalityTraits}
              onToggle={v => toggle(personalityTraits, v, setPersonalityTraits)}
              labels={isJa ? PERSONALITY_TRAITS_JA : undefined} />
          </div>

          {/* ── Personality insights ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_personality_insights')} hint={t('edit_profile.optional')} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* MBTI */}
              <div>
                <label style={labelStyle}>MBTI type</label>
                <select value={mbti} onChange={e => setMbti(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— select —</option>
                  {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
                    'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Love language */}
              <div>
                <label style={labelStyle}>Love language</label>
                <select value={loveLanguage} onChange={e => setLoveLanguage(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— select —</option>
                  <option value="words-of-affirmation">Words of Affirmation</option>
                  <option value="acts-of-service">Acts of Service</option>
                  <option value="receiving-gifts">Receiving Gifts</option>
                  <option value="quality-time">Quality Time</option>
                  <option value="physical-touch">Physical Touch</option>
                </select>
              </div>

              {/* Star sign */}
              <div>
                <label style={labelStyle}>Star sign</label>
                <select value={starSign} onChange={e => setStarSign(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— select —</option>
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
          </div>

          {/* ── Interests & hobbies ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_interests')} hint={t('edit_profile.interests_hint')} />
            <ChipPicker options={INTEREST_OPTIONS} selected={interests}
              onToggle={v => toggle(interests, v, setInterests)}
              labels={isJa ? INTEREST_OPTIONS_JA : undefined} />
          </div>

          {/* ── Skills (provider only) ── */}
          {isProvider && (
            <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.section_skills')} hint={t('edit_profile.skills_hint')} />
              <ChipPicker options={SKILL_OPTIONS} selected={selectedSkills}
                onToggle={v => toggle(selectedSkills, v, setSelectedSkills)}
                labels={isJa ? SKILL_OPTIONS_JA : undefined} />
            </div>
          )}

          {/* ── Experience (provider only) ── */}
          {isProvider && (
            <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.label_experience')} hint={t('edit_profile.optional')} />
              <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                {['Role / Title', 'Company', 'Years exp.'].map(h => (
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
            </div>
          )}

          {/* ── Education ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.label_education')} hint={t('edit_profile.optional')} />
            <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
              {['Degree / Qualification', 'School / Institution', 'Year'].map(h => (
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
          </div>

          {/* ── Qualifications ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_qualifications')} hint={t('edit_profile.optional')} />
            <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
              {['Certification / Qualification', 'Issued by', 'Year'].map(h => (
                <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
              ))}
            </div>
            <div className="flex flex-col gap-3 mb-3">
              {qualifications.map((entry, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-start">
                  <input placeholder="e.g. TEFL Certificate" value={entry.title}
                    onChange={e => setQualifications(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                    style={{ ...inputStyle, fontSize: '13px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                  <input placeholder="e.g. Cambridge" value={entry.issuer}
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
          </div>

          {/* ── Achievements ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_achievements')} hint={t('edit_profile.optional')} />
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
          </div>

          {/* ── Provider-only sections ── */}
          {isProvider && (
            <>
              {/* Pricing */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.section_pricing')} hint="Leave blank any rates that don't apply." />
                {([
                  ['Online',     'priceOnline',   'Online sessions (video / call)'],
                  ['In-person',  'priceInPerson', 'Face-to-face sessions'],
                  ['Trial',      'priceTrial',    'First-session intro price'],
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
                    <span className="text-sm" style={{ color: '#aaa' }}>/hr</span>
                  </div>
                ))}
              </div>

              {/* Session types */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.section_session_types')} />
                <div className="flex flex-col gap-3">
                  {([
                    ['1-on-1 Session',   t('edit_profile.session_1on1')],
                    ['Group Meetup',     t('edit_profile.session_group')],
                    ['Online Call',      t('edit_profile.session_online')],
                    ['Social Experience',t('edit_profile.session_social')],
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
              </div>

              {/* Schedule & Availability */}
              <div style={cardStyle}>
                <SectionHeader title={t('edit_profile.section_schedule')} />

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
                          {!enabled && <span className="text-xs" style={{ color: '#ccc' }}>Unavailable</span>}
                        </label>
                        {enabled && (
                          <div className="px-4 pb-3 flex flex-col gap-2" style={{ borderTop: '0.5px solid #E8DDD5' }}>
                            {slots.map((slot, si) => (
                              <div key={si} className="flex items-center gap-2 pt-2">
                                <span className="text-xs" style={{ color: '#aaa', whiteSpace: 'nowrap' }}>From</span>
                                <select value={slot.from}
                                  onChange={e => setAvailDaySchedule(prev => ({
                                    ...prev,
                                    [day]: prev[day].map((s, i) => i === si ? { ...s, from: e.target.value } : s)
                                  }))}
                                  style={{ ...inputStyle, fontSize: '13px', cursor: 'pointer' }}>
                                  <option value="">—</option>
                                  {FROM_TIMES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                                </select>
                                <span className="text-xs" style={{ color: '#aaa', whiteSpace: 'nowrap' }}>To</span>
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
                              + Add slot
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
              </div>
            </>
          )}

          {/* ── Privacy ── */}
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

          {error && <p className="text-sm text-center" style={{ color: '#f87171' }}>{error}</p>}

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
