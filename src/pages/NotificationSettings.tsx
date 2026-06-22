import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

type NotifPrefs = {
  email_on_booking: boolean
  email_on_chat: boolean
  email_on_event: boolean
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
      style={{
        width: '2.5rem',
        height: '1.375rem',
        backgroundColor: enabled ? C.brand : '#D1D5DB',
      }}
    >
      <span
        className="inline-block rounded-full bg-white transition-transform"
        style={{
          width: '1rem',
          height: '1rem',
          transform: enabled ? 'translateX(1.25rem)' : 'translateX(0.1875rem)',
        }}
      />
    </button>
  )
}

export default function NotificationSettings() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const defaultPrefs: NotifPrefs = {
    email_on_booking: true,
    email_on_chat: true,
    email_on_event: true,
  }

  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    const stored = (profile as any)?.notification_preferences
    return stored ? { ...defaultPrefs, ...stored } : defaultPrefs
  })
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = (profile as any)?.notification_preferences
    if (stored) setPrefs({ ...defaultPrefs, ...stored })
  }, [profile])

  const save = async () => {
    if (!user) return
    setSaving(true)
    setStatus(null)
    const { error } = await updateProfile(user.id, { notification_preferences: prefs } as any)
    setSaving(false)
    if (error) {
      setStatus({ type: 'error', msg: (error as any).message ?? t('common.save_error', 'Failed to save.') })
    } else {
      setStatus({ type: 'success', msg: t('notifications.saved', 'Notification preferences saved.') })
    }
  }

  const toggle = (key: keyof NotifPrefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const items: { key: keyof NotifPrefs; title: string; desc: string }[] = [
    {
      key: 'email_on_booking',
      title: t('notifications.booking_title', 'Session booking'),
      desc: t('notifications.booking_desc', 'Email me when someone books or cancels a session.'),
    },
    {
      key: 'email_on_chat',
      title: t('notifications.chat_title', 'New message'),
      desc: t('notifications.chat_desc', 'Email me when I receive a new chat message.'),
    },
    {
      key: 'email_on_event',
      title: t('notifications.event_title', 'New event'),
      desc: t('notifications.event_desc', 'Email me when a new event is posted in my groups.'),
    },
  ]

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
          {t('notifications.eyebrow', 'Settings')}
        </p>
        <h1 className="text-2xl font-bold mb-6" style={{ color: C.text }}>
          {t('notifications.heading', 'Notification preferences')}
        </h1>

        <p className="text-sm mb-6" style={{ color: C.muted }}>
          {t('notifications.subheading', 'All notifications are sent to')} <strong>{user?.email}</strong>
        </p>

        {status && (
          <div className="text-sm px-4 py-2.5 rounded-xl mb-4" style={{
            backgroundColor: status.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            color: status.type === 'success' ? '#166534' : '#991B1B',
            border: `0.5px solid ${status.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
          }}>
            {status.msg}
          </div>
        )}

        <div style={cardStyle}>
          <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>
            {t('notifications.email_section', 'Email notifications')}
          </p>
          <div className="flex flex-col gap-5">
            {items.map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: C.text }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.desc}</p>
                </div>
                <Toggle enabled={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full text-sm font-semibold py-3 rounded-xl transition-opacity"
          style={{ backgroundColor: C.brand, color: '#fff', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? t('common.saving', 'Saving…') : t('common.save_preferences', 'Save preferences')}
        </button>
      </div>
    </div>
  )
}
