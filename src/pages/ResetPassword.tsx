import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/dashboard')
  }

  const fields = [
    { label: t('reset_password.label_password', 'New password'), value: password, set: setPassword },
    { label: t('reset_password.label_confirm', 'Confirm password'), value: confirm, set: setConfirm },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md p-8 rounded-3xl" style={{ backgroundColor: '#1A0208', border: '0.5px solid rgba(184,134,11,0.3)' }}>

        <Link to="/" className="text-xl font-semibold tracking-tight block text-center mb-8" style={{ color: '#fff' }}>
          skillconnect
        </Link>

        <h1 className="text-2xl font-bold text-white text-center mb-1">
          {t('reset_password.heading', 'Set new password')}
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {t('reset_password.subheading', 'Choose a strong password for your account.')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(({ label, value, set }) => (
            <div key={label}>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#B8860B' }}>{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(184,134,11,0.3)', color: '#fff' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(184,134,11,0.3)')}
              />
            </div>
          ))}

          {error && <p className="text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium py-3 rounded-xl transition-colors mt-2 disabled:opacity-60"
            style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}
          >
            {loading ? '...' : t('reset_password.cta', 'Update password')}
          </button>
        </form>
      </div>
    </div>
  )
}
