import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resetPasswordForEmail } from '../lib/auth'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await resetPasswordForEmail(email)
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md p-8 rounded-3xl" style={{ backgroundColor: '#1A0208', border: '0.5px solid rgba(184,134,11,0.3)' }}>

        <Link to="/" className="text-xl font-semibold tracking-tight flex items-baseline justify-center gap-0 mb-8">
          <span style={{ color: '#fff' }}>KAI</span><span style={{ color: '#B8860B' }}>YUI</span>
        </Link>

        <h1 className="text-2xl font-bold text-white text-center mb-1">{t('forgot_password.heading', 'Reset password')}</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {t('forgot_password.subheading', "Enter your email and we'll send you a reset link.")}
        </p>

        {sent ? (
          <div className="text-center">
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('forgot_password.sent', 'Check your inbox — a reset link is on its way.')}
            </p>
            <Link to="/login" className="text-sm font-medium hover:underline" style={{ color: '#B8860B' }}>
              {t('forgot_password.back_to_login', 'Back to login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#B8860B' }}>
                {t('login.label_email', 'Email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(184,134,11,0.3)', color: '#fff' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(184,134,11,0.3)')}
              />
            </div>

            {error && <p className="text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium py-3 rounded-xl transition-colors mt-2 disabled:opacity-60"
              style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
            >
              {loading ? '...' : t('forgot_password.cta', 'Send reset link')}
            </button>

            <p className="text-sm text-center mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Link to="/login" className="font-medium hover:underline" style={{ color: '#B8860B' }}>
                {t('forgot_password.back_to_login', 'Back to login')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
