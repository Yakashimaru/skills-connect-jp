// Contact/enquiry page
// Simple form: name, email, subject, message
// Dummy submit — no backend yet, replace with Supabase or email service later

import { useState } from 'react'

const subjects = [
  'General enquiry',
  'Partnership / Business',
  'Report a user',
  'Billing & subscription',
  'Technical issue',
  'Other',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left — info */}
        <div>
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-3">Get in touch</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact us</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Have a question, a partnership idea, or need help? Fill in the form and we'll get back to you within 1–2 business days.
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Email</p>
              <p className="text-sm text-gray-400">hello@skillconnect.jp</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Based in</p>
              <p className="text-sm text-gray-400">Tokyo, Japan</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Response time</p>
              <p className="text-sm text-gray-400">1–2 business days</p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div>
          {submitted ? (
            <div className="bg-teal-50 border border-teal-100 rounded-3xl p-10 text-center">
              <p className="text-4xl mb-4">✅</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h2>
              <p className="text-sm text-gray-400">We'll get back to you within 1–2 business days.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="mt-6 text-sm text-teal-500 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors bg-white text-gray-600"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?"
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-xl transition-colors mt-2"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
