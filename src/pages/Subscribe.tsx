import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasSubscribedBefore, getActiveSubscription } from '../lib/subscriptions'
import SubscriptionPlans from '../components/SubscriptionPlans'

export default function Subscribe() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  // null = still resolving. We don't render plan cards until both checks finish
  // so a returning subscriber never sees trial prices flash before the DB query.
  const [isReturning, setIsReturning] = useState<boolean | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setIsReturning(false); return }
    Promise.all([
      hasSubscribedBefore(user.id),
      getActiveSubscription(user.id),
    ]).then(([returning, { data: sub }]) => {
      setIsReturning(returning)
      setCurrentPlan(sub?.plan ?? null)
    })
  }, [user, authLoading])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-4 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>
          {t('plans.eyebrow')}
        </p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A0208' }}>
          {currentPlan
            ? t('subscribe.heading_change', 'Change your plan')
            : t('subscribe.heading', 'Subscription required')}
        </h1>
        <p className="text-sm leading-relaxed mb-2" style={{ color: '#7A6060' }}>
          {currentPlan
            ? t('subscribe.body_change', 'Upgrades are charged immediately (prorated). Downgrades take effect at your next renewal.')
            : t('subscribe.body', 'Chat and book sessions require an active subscription. Choose a plan below to get started.')}
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
        : <SubscriptionPlans isReturning={isReturning} currentPlan={currentPlan ?? undefined} />
      }
    </div>
  )
}
