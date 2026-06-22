import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../lib/profiles'

const C = {
  brand: '#5C0A1E',
  gold: '#B8860B',
  cream: '#FDF0E0',
  muted: '#7A6060',
  text: '#1A0208',
  border: '#E8DDD5',
  bg: '#FDF8F2',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: `0.5px solid ${C.border}`,
  borderRadius: '1.25rem',
  padding: '1.5rem',
  marginBottom: '1rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: '0.625rem',
  border: `0.5px solid ${C.border}`,
  fontSize: '0.875rem',
  color: C.text,
  backgroundColor: '#fff',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: C.muted,
  marginBottom: '0.375rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

function StatusBanner({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  return (
    <div className="text-sm px-4 py-2.5 rounded-xl mb-4" style={{
      backgroundColor: type === 'success' ? '#F0FDF4' : '#FEF2F2',
      color: type === 'success' ? '#166534' : '#991B1B',
      border: `0.5px solid ${type === 'success' ? '#BBF7D0' : '#FECACA'}`,
    }}>
      {msg}
    </div>
  )
}

export default function PrivacySettings() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [phoneForm, setPhoneForm] = useState({ phone: (profile as any)?.phone ?? '' })

  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [phoneStatus, setPhoneStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [emailLoading, setEmailLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailForm.newEmail) return
    setEmailLoading(true)
    setEmailStatus(null)
    const { error } = await supabase.auth.updateUser({ email: emailForm.newEmail })
    setEmailLoading(false)
    if (error) {
      setEmailStatus({ type: 'error', msg: error.message })
    } else {
      setEmailStatus({ type: 'success', msg: t('privacy.email_confirm_sent', 'Confirmation sent to your new email address. Please verify it to complete the change.') })
      setEmailForm({ newEmail: '', password: '' })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirm) {
      setPassStatus({ type: 'error', msg: t('privacy.password_mismatch', 'Passwords do not match.') })
      return
    }
    if (passwordForm.newPass.length < 8) {
      setPassStatus({ type: 'error', msg: t('privacy.password_too_short', 'Password must be at least 8 characters.') })
      return
    }
    setPassLoading(true)
    setPassStatus(null)
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass })
    setPassLoading(false)
    if (error) {
      setPassStatus({ type: 'error', msg: error.message })
    } else {
      setPassStatus({ type: 'success', msg: t('privacy.password_updated', 'Password updated successfully.') })
      setPasswordForm({ current: '', newPass: '', confirm: '' })
    }
  }

  const handlePhoneSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setPhoneLoading(true)
    setPhoneStatus(null)
    const { error } = await updateProfile(user.id, { phone: phoneForm.phone } as any)
    setPhoneLoading(false)
    if (error) {
      setPhoneStatus({ type: 'error', msg: (error as any).message ?? t('privacy.save_error', 'Failed to save.') })
    } else {
      setPhoneStatus({ type: 'success', msg: t('privacy.phone_saved', 'Phone number saved.') })
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm mb-6 flex items-center gap-1"
          style={{ color: C.brand }}
        >
          ← {t('common.back', 'Back')}
        </button>

        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: C.brand }}>
          {t('privacy.eyebrow', 'Account')}
        </p>
        <h1 className="text-2xl font-bold mb-6" style={{ color: C.text }}>
          {t('privacy.heading', 'Privacy & Security')}
        </h1>

        {/* Current email display */}
        <div style={cardStyle}>
          <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>
            {t('privacy.current_email', 'Current email')}
          </p>
          <p className="text-sm" style={{ color: C.muted }}>{user?.email}</p>
          {user?.email_confirmed_at && (
            <p className="text-xs mt-1" style={{ color: '#16a34a' }}>✔ {t('privacy.email_verified', 'Verified')}</p>
          )}
        </div>

        {/* Change email */}
        <div style={cardStyle}>
          <p className="text-sm font-semibold mb-3" style={{ color: C.text }}>
            {t('privacy.change_email', 'Change email address')}
          </p>
          {emailStatus && <StatusBanner type={emailStatus.type} msg={emailStatus.msg} />}
          <form onSubmit={handleEmailChange} className="flex flex-col gap-3">
            <div>
              <label style={labelStyle}>{t('privacy.new_email_label', 'New email address')}</label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
                placeholder="new@email.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              className="text-sm font-semibold py-2.5 rounded-xl transition-opacity"
              style={{ backgroundColor: C.brand, color: '#fff', opacity: emailLoading ? 0.6 : 1 }}
            >
              {emailLoading ? t('common.saving', 'Saving…') : t('privacy.send_confirmation', 'Send confirmation')}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={cardStyle}>
          <p className="text-sm font-semibold mb-3" style={{ color: C.text }}>
            {t('privacy.change_password', 'Change password')}
          </p>
          {passStatus && <StatusBanner type={passStatus.type} msg={passStatus.msg} />}
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            <div>
              <label style={labelStyle}>{t('privacy.new_password_label', 'New password')}</label>
              <input
                type="password"
                value={passwordForm.newPass}
                onChange={e => setPasswordForm(f => ({ ...f, newPass: e.target.value }))}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                minLength={8}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>{t('privacy.confirm_password_label', 'Confirm new password')}</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              disabled={passLoading}
              className="text-sm font-semibold py-2.5 rounded-xl transition-opacity"
              style={{ backgroundColor: C.brand, color: '#fff', opacity: passLoading ? 0.6 : 1 }}
            >
              {passLoading ? t('common.saving', 'Saving…') : t('privacy.update_password', 'Update password')}
            </button>
          </form>
        </div>

        {/* Phone number */}
        <div style={cardStyle}>
          <p className="text-sm font-semibold mb-3" style={{ color: C.text }}>
            {t('privacy.phone_number', 'Phone number')}
          </p>
          {phoneStatus && <StatusBanner type={phoneStatus.type} msg={phoneStatus.msg} />}
          <form onSubmit={handlePhoneSave} className="flex flex-col gap-3">
            <div>
              <label style={labelStyle}>{t('privacy.phone_label', 'Phone number')}</label>
              <input
                type="tel"
                value={phoneForm.phone}
                onChange={e => setPhoneForm({ phone: e.target.value })}
                placeholder="+81 90-0000-0000"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = C.border)}
              />
              <p className="text-xs mt-1" style={{ color: '#aaa' }}>
                {t('privacy.phone_hint', 'Used for account verification and important notifications only.')}
              </p>
            </div>
            <button
              type="submit"
              disabled={phoneLoading}
              className="text-sm font-semibold py-2.5 rounded-xl transition-opacity"
              style={{ backgroundColor: C.brand, color: '#fff', opacity: phoneLoading ? 0.6 : 1 }}
            >
              {phoneLoading ? t('common.saving', 'Saving…') : t('common.save', 'Save')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
