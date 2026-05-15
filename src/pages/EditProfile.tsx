import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import {
  updateProfile,
  updateProviderProfile,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
} from '../lib/profiles'

const skillOptions = ['Coaching', 'English', 'Japanese', 'Golf', 'Business', 'Fitness', 'Nutrition', 'Music', 'Piano', 'Cooking', 'Travel', 'Mindfulness', 'Yoga', 'Startups', 'Finance', 'Mentorship']

const inputStyle = {
  width: '100%',
  border: '0.5px solid #E8DDD5',
  borderRadius: '12px',
  padding: '10px 16px',
  fontSize: '14px',
  outline: 'none',
  color: '#1A0208',
  backgroundColor: '#fff',
}

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '0.5px solid #E8DDD5',
  padding: '24px',
}

type EduEntry = { id?: string; degree: string; school: string; year: string }
type ExpEntry = { id?: string; role: string; company: string; years: string }

export default function EditProfile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, profile: cachedProfile, refreshProfile } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = cachedProfile as any
  const pp = p?.provider_profile
  const isProvider = p?.user_type === 'provider'

  const [form, setForm] = useState({
    name: p?.name ?? '',
    title: pp?.title ?? '',
    bio: p?.bio ?? '',
    location: p?.location ?? 'Tokyo',
    price: String(pp?.hourly_rate ?? ''),
    sessionTypes: pp?.session_types ?? [],
    privacy: p?.privacy_mode ?? 'public',
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>(pp?.skills ?? [])
  const [educationEntries, setEducationEntries] = useState<EduEntry[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p?.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' }))
  )
  const [experienceEntries, setExperienceEntries] = useState<ExpEntry[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p?.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' }))
  )
  const [deletedEduIds, setDeletedEduIds] = useState<string[]>([])
  const [deletedExpIds, setDeletedExpIds] = useState<string[]>([])

  // Sync form if cached profile loads after initial render
  useEffect(() => {
    if (!p) return
    setForm({
      name: p.name ?? '',
      title: pp?.title ?? '',
      bio: p.bio ?? '',
      location: p.location ?? 'Tokyo',
      price: String(pp?.hourly_rate ?? ''),
      sessionTypes: pp?.session_types ?? [],
      privacy: p.privacy_mode ?? 'public',
    })
    setSelectedSkills(pp?.skills ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEducationEntries((p.education ?? []).map((e: any) => ({ id: e.id, degree: e.degree, school: e.school, year: e.year ?? '' })))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setExperienceEntries((p.experience ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company, years: e.years ?? '' })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedProfile])

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])

  const removeEdu = (index: number) => {
    const entry = educationEntries[index]
    if (entry.id) setDeletedEduIds((prev) => [...prev, entry.id!])
    setEducationEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExp = (index: number) => {
    const entry = experienceEntries[index]
    if (entry.id) setDeletedExpIds((prev) => [...prev, entry.id!])
    setExperienceEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)

    const { error: profileErr } = await updateProfile(user.id, {
      name: form.name,
      bio: form.bio,
      location: form.location,
      privacy_mode: form.privacy as 'public' | 'hidden' | 'anonymous',
    })
    if (profileErr) { setError(profileErr.message); setSaving(false); return }

    // Run all remaining saves in parallel
    const saves: Promise<unknown>[] = []

    if (isProvider) {
      saves.push(updateProviderProfile(user.id, {
        title: form.title,
        skills: selectedSkills,
        hourly_rate: Number(form.price) || undefined,
        session_types: form.sessionTypes,
      }))
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

  const labelStyle = { fontSize: '12px', fontWeight: 500, color: '#5C0A1E', display: 'block', marginBottom: '6px' }
  const sectionTitle = { fontWeight: 600, color: '#1A0208', marginBottom: '16px', fontSize: '15px' }

  if (!cachedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm" style={{ color: '#aaa' }}>Loading...</p>
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

          {/* Photo */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t('edit_profile.section_photo')}</p>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#FDF0E0', border: '2px solid #E8DDD5' }}>
                {form.name ? form.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <button type="button" className="text-sm px-4 py-2 rounded-xl transition-colors" style={{ backgroundColor: '#FDF0E0', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {t('edit_profile.upload_photo')}
                </button>
                <p className="text-xs mt-2" style={{ color: '#aaa' }}>{t('edit_profile.photo_hint')}</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t('edit_profile.section_basic')}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>{t('edit_profile.label_name')}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              {isProvider && (
                <div>
                  <label style={labelStyle}>{t('edit_profile.label_title')}</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                </div>
              )}
              <div className={isProvider ? 'col-span-2' : 'col-span-2'}>
                <label style={labelStyle}>{t('edit_profile.label_location')}</label>
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>Tokyo</option><option>Osaka</option><option>Kyoto</option><option>Online only</option>
                </select>
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>{t('edit_profile.label_bio')}</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
            </div>
          </div>

          {/* Provider-only sections */}
          {isProvider && (
            <>
              {/* Skills */}
              <div style={cardStyle}>
                <p style={sectionTitle}>{t('edit_profile.section_skills')}</p>
                <p className="text-xs mb-4" style={{ color: '#aaa' }}>{t('edit_profile.skills_hint')}</p>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                      className="text-sm px-4 py-1.5 rounded-full transition-colors"
                      style={selectedSkills.includes(skill)
                        ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
                        : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div style={cardStyle}>
                <p style={sectionTitle}>{t('edit_profile.section_edu_exp')}</p>

                <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>{t('edit_profile.label_education')}</p>
                <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                  {['Degree / Qualification', 'School / Institution', 'Year'].map(h => (
                    <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
                  ))}
                </div>
                <div className="flex flex-col gap-3 mb-3">
                  {educationEntries.map((entry, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 items-start">
                      <input placeholder="Degree" value={entry.degree}
                        onChange={(e) => setEducationEntries((prev) => prev.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))}
                        style={{ ...inputStyle, fontSize: '13px' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                      <input placeholder="School" value={entry.school}
                        onChange={(e) => setEducationEntries((prev) => prev.map((x, j) => j === i ? { ...x, school: e.target.value } : x))}
                        style={{ ...inputStyle, fontSize: '13px' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Year" min={1970} max={new Date().getFullYear()}
                          value={entry.year}
                          onChange={(e) => setEducationEntries((prev) => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))}
                          style={{ ...inputStyle, fontSize: '13px' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                        <button type="button" onClick={() => removeEdu(i)}
                          className="text-xs px-2 rounded-lg flex-shrink-0" style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button"
                  onClick={() => setEducationEntries((prev) => [...prev, { degree: '', school: '', year: '' }])}
                  className="text-xs px-4 py-2 rounded-xl transition-colors" style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                  {t('edit_profile.add_education')}
                </button>

                <div className="mt-6 pt-5" style={{ borderTop: '0.5px solid #E8DDD5' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#5C0A1E' }}>{t('edit_profile.label_experience')}</p>
                  <div className="grid grid-cols-3 gap-2 mb-1 pr-9">
                    {['Role / Title', 'Company', 'Years exp.'].map(h => (
                      <p key={h} className="text-xs" style={{ color: '#aaa' }}>{h}</p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 mb-3">
                    {experienceEntries.map((entry, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 items-start">
                        <input placeholder="Role" value={entry.role}
                          onChange={(e) => setExperienceEntries((prev) => prev.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                          style={{ ...inputStyle, fontSize: '13px' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                        <input placeholder="Company" value={entry.company}
                          onChange={(e) => setExperienceEntries((prev) => prev.map((x, j) => j === i ? { ...x, company: e.target.value } : x))}
                          style={{ ...inputStyle, fontSize: '13px' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                        <div className="flex gap-2">
                          <input type="number" placeholder="Years" min={0} max={60} value={entry.years}
                            onChange={(e) => setExperienceEntries((prev) => prev.map((x, j) => j === i ? { ...x, years: e.target.value } : x))}
                            style={{ ...inputStyle, fontSize: '13px' }}
                            onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                            onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                          <button type="button" onClick={() => removeExp(i)}
                            className="text-xs px-2 rounded-lg flex-shrink-0" style={{ color: '#aaa', border: '0.5px solid #E8DDD5' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button"
                    onClick={() => setExperienceEntries((prev) => [...prev, { role: '', company: '', years: '' }])}
                    className="text-xs px-4 py-2 rounded-xl transition-colors" style={{ color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}>
                    {t('edit_profile.add_experience')}
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div style={cardStyle}>
                <p style={sectionTitle}>{t('edit_profile.section_pricing')}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: '#5C0A1E', fontWeight: 500 }}>¥</span>
                  <input type="number" value={form.price} min={0} step={1}
                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => setForm({ ...form, price: String(Math.max(0, Math.floor(Number(e.target.value)))) })}
                    style={{ ...inputStyle, width: '160px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
                  <span className="text-sm" style={{ color: '#aaa' }}>{t('edit_profile.per_hour')}</span>
                </div>
              </div>

              {/* Session types */}
              <div style={cardStyle}>
                <p style={sectionTitle}>{t('edit_profile.section_session_types')}</p>
                <div className="flex flex-col gap-3">
                  {([
                    ['1-on-1 Session', t('edit_profile.session_1on1')],
                    ['Group Meetup', t('edit_profile.session_group')],
                    ['Online Call', t('edit_profile.session_online')],
                    ['Social Experience', t('edit_profile.session_social')],
                  ] as const).map(([type, label]) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.sessionTypes.includes(type)}
                        onChange={() => setForm((prev) => ({
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
            </>
          )}

          {/* Privacy */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t('edit_profile.section_privacy')}</p>
            <div className="flex flex-col gap-3">
              {[
                { value: 'public', label: t('edit_profile.privacy_public') },
                { value: 'hidden', label: t('edit_profile.privacy_hidden') },
                { value: 'anonymous', label: t('edit_profile.privacy_anonymous') },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="privacy" value={option.value} checked={form.privacy === option.value}
                    onChange={() => setForm({ ...form, privacy: option.value })}
                    className="w-4 h-4" style={{ accentColor: '#B8860B' }} />
                  <span className="text-sm" style={{ color: '#1A0208' }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-center" style={{ color: '#f87171' }}>{error}</p>}

          {/* Submit */}
          <div className="flex items-center gap-4">
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
