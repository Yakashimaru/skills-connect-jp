import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export default function HowItWorks() {
  const { t, i18n } = useTranslation()
  const steps = t('how_it_works_page.steps', { returnObjects: true }) as { title: string; description: string }[]

  return (
    <section className="py-20" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('how_it_works_page.eyebrow')}</p>
          <h2 className="text-4xl font-bold" style={{ color: '#1A0208' }}>{t('how_it_works_page.heading')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-px hidden lg:block" style={{ backgroundColor: 'rgba(92,10,30,0.15)' }} />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-5 z-10"
                  style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-semibold" style={{ color: '#1A0208' }}>{step.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <NavLink
            to="/how-it-works"
            className="text-sm font-medium underline-offset-2 hover:underline"
            style={{ color: '#5C0A1E' }}
          >
            {i18n.language === 'ja' ? '詳しく見る →' : 'Learn more →'}
          </NavLink>
        </div>
      </div>
    </section>
  )
}
