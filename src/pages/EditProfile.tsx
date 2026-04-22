// EditProfile — maroon #5C0A1E, antique gold #B8860B, white surfaces

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function EditProfile() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState(['Coaching', 'English', 'Mindfulness'])
  const [form, setForm] = useState({
    name: 'Yuki Tanaka',
    title: 'Life Coach & English Tutor',
    bio: 'Certified life coach and English tutor with over 8 years of experience helping people build confidence, navigate career transitions, and improve their communication skills.',
    location: 'Tokyo',
    price: '8000',
    sessionTypes: ['1-on-1 Session', 'Online Call'],
    privacy: 'public',
    education: 'BA Psychology, Waseda University',
    experience: 'Senior Life Coach, Tokyo Wellness Center',
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const labelStyle = { fontSize: '12px', fontWeight: 500, color: '#5C0A1E', display: 'block', marginBottom: '6px' }
  const sectionTitle = { fontWeight: 600, color: '#1A0208', marginBottom: '16px', fontSize: '15px' }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1A0208' }}>Edit profile</h1>
            <p className="text-sm mt-1" style={{ color: '#7A6060' }}>Update your public profile information</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: '#5C0A1E' }}
          >
            ← Back to dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Photo */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Profile photo</p>
            <div className="flex items-center gap-5">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-20 h-20 rounded-2xl object-cover" style={{ border: '2px solid #E8DDD5' }} />
              <div>
                <button
                  type="button"
                  className="text-sm px-4 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: '#FDF0E0', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5E4CC')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FDF0E0')}
                >
                  Upload new photo
                </button>
                <p className="text-xs mt-2" style={{ color: '#aaa' }}>JPG, PNG or WEBP. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Basic information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Full name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              <div>
                <label style={labelStyle}>Title / Role</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>Location</label>
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option>Tokyo</option><option>Osaka</option><option>Kyoto</option><option>Online only</option>
                </select>
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Skills</p>
            <p className="text-xs mb-4" style={{ color: '#aaa' }}>Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="text-sm px-4 py-1.5 rounded-full transition-colors"
                  style={
                    selectedSkills.includes(skill)
                      ? { backgroundColor: '#B8860B', color: '#3A2400', border: '1px solid #B8860B' }
                      : { backgroundColor: 'transparent', color: '#5C0A1E', border: '0.5px solid #E8DDD5' }
                  }
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Education & Experience */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Education & Experience</p>
            <div className="flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Education</label>
                <input type="text" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
              <div>
                <label style={labelStyle}>Experience</label>
                <input type="text" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Pricing</p>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: '#5C0A1E', fontWeight: 500 }}>¥</span>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={{ ...inputStyle, width: '160px' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')} />
              <span className="text-sm" style={{ color: '#aaa' }}>per hour</span>
            </div>
          </div>

          {/* Session types */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Session types offered</p>
            <div className="flex flex-col gap-3">
              {['1-on-1 Session', 'Group Meetup', 'Online Call', 'Social Experience'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sessionTypes.includes(type)}
                    onChange={() => setForm((prev) => ({
                      ...prev,
                      sessionTypes: prev.sessionTypes.includes(type)
                        ? prev.sessionTypes.filter((t) => t !== type)
                        : [...prev.sessionTypes, type],
                    }))}
                    className="w-4 h-4"
                    style={{ accentColor: '#B8860B' }}
                  />
                  <span className="text-sm" style={{ color: '#1A0208' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div style={cardStyle}>
            <p style={sectionTitle}>Privacy</p>
            <div className="flex flex-col gap-3">
              {[
                { value: 'public', label: 'Show full profile publicly' },
                { value: 'hidden', label: 'Hide name/photo until first session' },
                { value: 'anonymous', label: 'Anonymous profile' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value={option.value}
                    checked={form.privacy === option.value}
                    onChange={() => setForm({ ...form, privacy: option.value })}
                    className="w-4 h-4"
                    style={{ accentColor: '#B8860B' }}
                  />
                  <span className="text-sm" style={{ color: '#1A0208' }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="font-medium px-8 py-3 rounded-xl transition-colors"
              style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}
            >
              Save changes
            </button>
            {saved && <p className="text-sm font-medium" style={{ color: '#B8860B' }}>✔ Profile saved!</p>}
          </div>

        </form>
      </div>
    </div>
  )
}
