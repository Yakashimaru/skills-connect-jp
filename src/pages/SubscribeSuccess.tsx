import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getActiveSubscription } from '../lib/subscriptions'

type State = 'polling' | 'confirmed' | 'timeout'

export default function SubscribeSuccess() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [state, setState] = useState<State>('polling')

  useEffect(() => {
    if (!user) return

    let attempts = 0
    const MAX_ATTEMPTS = 10
    const INTERVAL_MS = 1500

    // Poll the DB until the webhook has written the subscription row.
    // Stripe fires the webhook asynchronously so there is a delay between
    // the success redirect and the row existing in the DB.
    const interval = setInterval(async () => {
      attempts++
      const { data } = await getActiveSubscription(user.id)
      if (data) {
        clearInterval(interval)
        setState('confirmed')
        return
      }
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval)
        setState('timeout')
      }
    }, INTERVAL_MS)

    return () => clearInterval(interval)
  }, [user])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="text-center px-6 max-w-sm">
        {state === 'polling' && (
          <>
            <div className="text-4xl mb-6 animate-pulse">⏳</div>
            <h1 className="text-xl font-bold mb-3" style={{ color: '#1A0208' }}>
              {t('subscribe.activating', 'Activating your subscription…')}
            </h1>
            <p className="text-sm" style={{ color: '#7A6060' }}>
              {t('subscribe.activating_body', 'This takes a few seconds.')}
            </p>
          </>
        )}

        {state === 'confirmed' && (
          <>
            <div className="text-5xl mb-6">🎉</div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: '#1A0208' }}>
              {t('subscribe.success_heading', "You're subscribed!")}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#7A6060' }}>
              {t('subscribe.success_body', 'Your subscription is now active. You can start chatting and booking sessions.')}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
            >
              {t('subscribe.go_to_dashboard', 'Go to dashboard')}
            </button>
          </>
        )}

        {state === 'timeout' && (
          <>
            <div className="text-4xl mb-6">✅</div>
            <h1 className="text-xl font-bold mb-3" style={{ color: '#1A0208' }}>
              {t('subscribe.timeout_heading', 'Payment received')}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#7A6060' }}>
              {t('subscribe.timeout_body', 'Your account is being activated — it may take a minute to reflect. Check your dashboard shortly.')}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
            >
              {t('subscribe.go_to_dashboard', 'Go to dashboard')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
