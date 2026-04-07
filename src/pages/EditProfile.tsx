// EditProfile — allows users to update their profile information
// Accessible from Dashboard → Edit profile button
// Dummy form — no backend yet, replace with Supabase when ready

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const skillOptions = ['Coaching', 'English', 'Japanese', 'Golf', 'Business', 'Fitness', 'Nutrition', 'Music', 'Piano', 'Cooking', 'Travel', 'Mindfulness', 'Yoga', 'Startups', 'Finance', 'Mentorship']

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

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit profile</h1>
            <p className="text-sm text-gray-400 mt-1">Update your public profile information</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back to dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Photo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Profile photo</h2>
            <div className="flex items-center gap-5">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100" />
              <div>
                <button type="button" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors">
                  Upload new photo
                </button>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Basic information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Title / Role</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors bg-white text-gray-700"
                >
                  <option>Tokyo</option>
                  <option>Osaka</option>
                  <option>Kyoto</option>
                  <option>Online only</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Skills</h2>
            <p className="text-xs text-gray-400 mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Education & Experience */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Education & Experience</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Education</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">¥</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-40 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
              />
              <span className="text-sm text-gray-400">per hour</span>
            </div>
          </div>

          {/* Session types */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Session types offered</h2>
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
                        : [...prev.sessionTypes, type]
                    }))}
                    className="accent-teal-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Privacy</h2>
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
                    className="accent-teal-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-xl transition-colors"
            >
              Save changes
            </button>
            {saved && <p className="text-sm text-teal-500">✔ Profile saved!</p>}
          </div>

        </form>
      </div>
    </div>
  )
}
