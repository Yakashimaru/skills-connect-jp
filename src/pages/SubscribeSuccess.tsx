import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SubscribeSuccess() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="text-center px-6 max-w-sm">
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
      </div>
    </div>
  )
}
