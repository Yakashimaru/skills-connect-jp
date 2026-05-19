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
  'Introvert', 'Extrovert', 'Analytical', 'Creative', 'Calm', 'Energetic',
  'Empathetic', 'Ambitious', 'Adventurous', 'Nurturing', 'Logical', 'Intuitive',
  'Organised', 'Spontaneous', 'Patient', 'Direct', 'Thoughtful', 'Humorous',
  'Reliable', 'Adaptable',
]

const INTEREST_OPTIONS = [
  'Music', 'Reading', 'Travel', 'Cooking', 'Sports', 'Gaming', 'Art', 'Photography',
  'Film', 'Yoga', 'Meditation', 'Hiking', 'Dancing', 'Writing', 'Tech', 'Nature',
  'Fashion', 'Foodie', 'Volunteering', 'Languages', 'Fitness', 'Cycling', 'Coffee',
  'Anime & Manga', 'Business', 'Startups', 'DIY', 'Pets', 'Theatre', 'Wine & Dining',
]

const SKILL_OPTIONS = [
  'Coaching', 'English', 'Japanese', 'Golf', 'Business', 'Fitness', 'Nutrition',
  'Music', 'Piano', 'Cooking', 'Travel', 'Mindfulness', 'Yoga', 'Startups',
  'Finance', 'Mentorship', 'Private Hire', 'Videographer', 'Photographer',
  'Dog Walker', 'Personal Shopper', 'Musician', 'Marketer', 'Designer', 'Coder',
  'Instructor (Sports / Music)',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

function ChipPicker({ options, selected, onToggle }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onToggle(opt)}
          className="text-sm px-3.5 py-1.5 rounded-full transition-colors"
          style={selected.includes(opt)
            ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
            : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
          {opt}
        </button>
      ))}
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

export default function EditProfile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, profile: cachedProfile, refreshProfile, loading: authLoading } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = cachedProfile as any
  const pp = p?.provider_profile
  const isProvider = p?.user_type === 'provider'

  const [form, setForm] = useState({
    name:         p?.name ?? '',
    title:        pp?.title ?? '',
    bio:          p?.bio ?? '',
    location:     p?.location ?? 'Tokyo',
    birthYear:    String(p?.birth_year ?? ''),
    gender:       p?.gender ?? '',
    price:        String(pp?.hourly_rate ?? ''),
    sessionTypes: (pp?.session_types ?? []) as string[],
    privacy:      p?.privacy_mode ?? 'public',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview,        setAvatarPreview]        = useState<string>(p?.avatar_url ?? '')
  const [uploadingAvatar,      setUploadingAvatar]      = useState(false)

  const [personalityTraits,    setPersonalityTraits]    = useState<string[]>(p?.personality_traits ?? [])
  const [personalityInsights,  setPersonalityInsights]  = useState<string>(p?.personality_insights ?? '')
  const [interests,            setInterests]            = useState<string[]>(p?.interests ?? [])
  const [selectedSkills,       setSelectedSkills]       = useState<string[]>(pp?.skills ?? [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [educationEntries,     setEducationEntries]     = useState<EduEntry[]>((p?.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' })))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experienceEntries,    setExperienceEntries]    = useState<ExpEntry[]>((p?.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' })))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [qualifications,       setQualifications]       = useState<QualEntry[]>((p?.qualifications ?? []).map((q: any) => ({ title: q.title ?? '', issuer: q.issuer ?? '', year: q.year ?? '' })))
  const [achievements,         setAchievements]         = useState<string[]>(p?.achievements ?? [])
  const [availDays,            setAvailDays]            = useState<string[]>(pp?.availability?.days ?? [])
  const [availLocations,       setAvailLocations]       = useState<string[]>(pp?.availability?.locations ?? [])
  const [newLocation,          setNewLocation]          = useState('')
  const [deletedEduIds,        setDeletedEduIds]        = useState<string[]>([])
  const [deletedExpIds,        setDeletedExpIds]        = useState<string[]>([])

  useEffect(() => {
    if (!p) return
    const pp2 = p.provider_profile
    setForm({
      name:         p.name ?? '',
      title:        pp2?.title ?? '',
      bio:          p.bio ?? '',
      location:     p.location ?? 'Tokyo',
      birthYear:    String(p.birth_year ?? ''),
      gender:       p.gender ?? '',
      price:        String(pp2?.hourly_rate ?? ''),
      sessionTypes: pp2?.session_types ?? [],
      privacy:      p.privacy_mode ?? 'public',
    })
    setPersonalityTraits(p.personality_traits ?? [])
    setPersonalityInsights(p.personality_insights ?? '')
    setInterests(p.interests ?? [])
    setSelectedSkills(pp2?.skills ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEducationEntries((p.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setExperienceEntries((p.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setQualifications((p.qualifications ?? []).map((q: any) => ({ title: q.title ?? '', issuer: q.issuer ?? '', year: q.year ?? '' })))
    setAchievements(p.achievements ?? [])
    setAvailDays(pp2?.availability?.days ?? [])
    setAvailLocations(pp2?.availability?.locations ?? [])
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
      name:       form.name,
      bio:        form.bio,
      location:   form.location,
      privacy_mode: form.privacy as 'public' | 'hidden' | 'anonymous',
    })
    if (profileErr) { setError(profileErr.message); setSaving(false); return }

    // Extended fields — added by migrations 005 & 007; silently skip if columns not yet applied
    await updateProfile(user.id, {
      birth_year:           form.birthYear ? Number(form.birthYear) : null,
      gender:               form.gender || null,
      personality_traits:   personalityTraits,
      interests,
      personality_insights: personalityInsights || null,
      qualifications,
      achievements,
    } as any).catch(() => {})

    const saves: Promise<unknown>[] = []

    if (isProvider) {
      saves.push(updateProviderProfile(user.id, {
        title:        form.title,
        skills:       selectedSkills,
        hourly_rate:  Number(form.price) || undefined,
        session_types: form.sessionTypes,
      }))
      // availability column added by migration 005 — silently skip if not yet applied
      saves.push(
        updateProviderProfile(user.id, { availability: { days: availDays, locations: availLocations } } as any)
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
    navigate(`/profile/${user.id}`)
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
                <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>Tokyo</option><option>Osaka</option><option>Kyoto</option><option>Online only</option>
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
              </div>
            </div>
          </div>

          {/* ── Personality traits ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_personality')} hint={t('edit_profile.personality_traits_hint')} />
            <ChipPicker options={PERSONALITY_TRAITS} selected={personalityTraits}
              onToggle={v => toggle(personalityTraits, v, setPersonalityTraits)} />
          </div>

          {/* ── Personality insights ── */}
          <div style={cardStyle}>
            <SectionHeader title={t('edit_profile.section_personality_insights')} />
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
              onToggle={v => toggle(interests, v, setInterests)} />
          </div>

          {/* ── Skills (provider only) ── */}
          {isProvider && (
            <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.section_skills')} hint={t('edit_profile.skills_hint')} />
              <ChipPicker options={SKILL_OPTIONS} selected={selectedSkills}
                onToggle={v => toggle(selectedSkills, v, setSelectedSkills)} />
            </div>
          )}

          {/* ── Experience (provider only) ── */}
          {isProvider && (
            <div style={cardStyle}>
              <SectionHeader title={t('edit_profile.label_experience')} />
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
            <SectionHeader title={t('edit_profile.label_education')} />
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
            <SectionHeader title={t('edit_profile.section_qualifications')} />
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
            <SectionHeader title={t('edit_profile.section_achievements')} />
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
                <SectionHeader title={t('edit_profile.section_pricing')} />
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: '#5C0A1E', fontWeight: 500 }}>¥</span>
                  <input type="number" value={form.price} min={0} step={1}
                    onKeyDown={e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    onChange={e => setForm({ ...form, price: String(Math.max(0, Math.floor(Number(e.target.value)))) })}
                    style={{ ...inputStyle, width: '160px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                  <span className="text-sm" style={{ color: '#aaa' }}>{t('edit_profile.per_hour')}</span>
                </div>
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
                <div className="flex flex-wrap gap-2 mb-6">
                  {DAYS.map(day => (
                    <button key={day} type="button"
                      onClick={() => toggle(availDays, day, setAvailDays)}
                      className="text-sm px-4 py-2 rounded-full transition-colors"
                      style={availDays.includes(day)
                        ? { backgroundColor: '#5C0A1E', color: '#fff', border: '1px solid #5C0A1E' }
                        : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                      {day}
                    </button>
                  ))}
                </div>

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

        </form>
      </div>
    </div>
  )
}
