// Contact — maroon #5C0A1E, antique gold #B8860B, warm cream bg

import { useState } from 'react'

const subjects = ['General enquiry', 'Partnership / Business', 'Report a user', 'Billing & subscription', 'Technical issue', 'Other']

const inputStyle = {
  width: '100%',
  border: '0.5px solid #E8DDD5',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  color: '#1A0208',
  backgroundColor: '#fff',
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const labelStyle = { fontSize: '12px', fontWeight: 500 as const, color: '#5C0A1E', display: 'block', marginBottom: '6px' }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left info */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>Get in touch</p>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1A0208' }}>Contact us</h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#7A6060' }}>
            Have a question, a partnership idea, or need help? Fill in the form and we'll get back to you within 1–2 business days.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { label: 'Email', value: 'hello@skillconnect.jp' },
              { label: 'Based in', value: 'Tokyo, Japan' },
              { label: 'Response time', value: '1–2 business days' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1A0208' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#7A6060' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div>
          {submitted ? (
            <div className="rounded-3xl p-10 text-center" style={{ backgroundColor: '#FDF0E0', border: '0.5px solid rgba(184,134,11,0.3)' }}>
              <p className="text-4xl mb-4">✅</p>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A0208' }}>Message sent!</h2>
              <p className="text-sm" style={{ color: '#7A6060' }}>We'll get back to you within 1–2 business days.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="mt-6 text-sm hover:underline"
                style={{ color: '#B8860B' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?" rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                />
              </div>
              <button
                type="submit"
                className="w-full font-medium py-3 rounded-xl transition-colors mt-2"
                style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}
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
