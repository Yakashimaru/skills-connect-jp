import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const labelStyle = { fontSize: '12px', fontWeight: 500 as const, color: '#5C0A1E', display: 'block', marginBottom: '6px' }

  const infoItems = [
    { label: t('contact.info_email_label'), value: t('contact.info_email_value') },
    { label: t('contact.info_based_label'), value: t('contact.info_based_value') },
    { label: t('contact.info_response_label'), value: t('contact.info_response_value') },
  ]

  const subjectKeys = ['subject_general', 'subject_partnership', 'subject_report', 'subject_billing', 'subject_technical', 'subject_other'] as const

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left info */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('contact.eyebrow')}</p>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1A0208' }}>{t('contact.heading')}</h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#7A6060' }}>{t('contact.body')}</p>
          <div className="flex flex-col gap-6">
            {infoItems.map((item) => (
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
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A0208' }}>{t('contact.success_heading')}</h2>
              <p className="text-sm" style={{ color: '#7A6060' }}>{t('contact.success_body')}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="mt-6 text-sm hover:underline"
                style={{ color: '#B8860B' }}
              >
                {t('contact.send_another')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>{t('contact.label_name')}</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('contact.placeholder_name')} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('contact.label_email')}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('contact.placeholder_email')} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t('contact.label_subject')}</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DDD5')}
                >
                  <option value="">{t('contact.subject_select')}</option>
                  {subjectKeys.map((key) => (
                    <option key={key} value={key}>{t(`contact.${key}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('contact.label_message')}</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t('contact.placeholder_message')} rows={5}
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
                {t('contact.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
