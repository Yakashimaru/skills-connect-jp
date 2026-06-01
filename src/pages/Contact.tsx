import { useTranslation } from 'react-i18next'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-md w-full">

        {/* Card */}
        <div className="rounded-3xl p-10 text-center" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5', boxShadow: '0 4px 24px rgba(92,10,30,0.06)' }}>
          <div className="text-4xl mb-6">✉️</div>

          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#5C0A1E' }}>
            {t('contact.eyebrow')}
          </p>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A0208' }}>
            {t('contact.heading')}
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#7A6060' }}>
            {t('contact.body')}
          </p>

          <a
            href="mailto:info.kaiyui@gmail.com"
            className="flex items-center justify-center gap-2 w-full font-semibold py-4 rounded-2xl transition-colors"
            style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a0f27')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
          >
            info.kaiyui@gmail.com
          </a>

          <p className="text-xs mt-5" style={{ color: '#bbb' }}>{t('contact.info_response_value')}</p>
        </div>

      </div>
    </div>
  )
}
