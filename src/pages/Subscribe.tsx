import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasSubscribedBefore } from '../lib/subscriptions'
import SubscriptionPlans from '../components/SubscriptionPlans'

export default function Subscribe() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  // null = still resolving; true/false = known. We don't render plan cards
  // until this is resolved so a returning subscriber never sees trial prices
  // flash before the DB query comes back.
  const [isReturning, setIsReturning] = useState<boolean | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setIsReturning(false); return }
    hasSubscribedBefore(user.id).then(setIsReturning)
  }, [user, authLoading])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-4 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>
          {t('plans.eyebrow')}
        </p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A0208' }}>
          {t('subscribe.heading', 'Subscription required')}
        </h1>
        <p className="text-sm leading-relaxed mb-2" style={{ color: '#7A6060' }}>
          {t('subscribe.body', 'Chat and book sessions require an active subscription. Choose a plan below to get started.')}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline"
          style={{ color: '#B8860B' }}
        >
          {t('subscribe.go_back', '← Go back')}
        </button>
      </div>
      {isReturning === null
        ? <div className="py-20 text-center text-sm" style={{ color: '#B8860B' }}>…</div>
        : <SubscriptionPlans isReturning={isReturning} />
      }
    </div>
  )
}
