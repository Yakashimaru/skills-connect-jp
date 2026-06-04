import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import SubscriptionPlans from '../components/SubscriptionPlans'

export default function Subscribe() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
      <SubscriptionPlans />
    </div>
  )
}
