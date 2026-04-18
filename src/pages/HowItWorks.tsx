import { useTranslation } from 'react-i18next'
import SubscriptionPlans from '../components/SubscriptionPlans'

const numbers = ['01', '02', '03', '04', '05']
const specials = [null, 'role', null, null, null]

export default function HowItWorksPage() {
  const { t } = useTranslation()

  const steps = t('how_it_works_page.steps', { returnObjects: true }) as {
    title: string; description: string; details: string[]
  }[]
  const seekerPoints = t('how_it_works_page.seeker_points', { returnObjects: true }) as string[]
  const providerPoints = t('how_it_works_page.provider_points', { returnObjects: true }) as string[]
  const faqs = t('how_it_works_page.faqs', { returnObjects: true }) as { q: string; a: string }[]

  return (
    <div className="bg-white min-h-screen">

      {/* ── SECTION: How it works ── */}
      <div id="how-it-works">
        <div className="py-16 text-center" style={{ backgroundColor: '#FDF8F2' }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('how_it_works_page.eyebrow')}</p>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1A0208' }}>{t('how_it_works_page.heading')}</h1>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#7A6060' }}>
            {t('how_it_works_page.intro')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
          {steps.map((step, i) => (
            <div key={i}>
              {specials[i] === 'role' ? (
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
                    >
                      {numbers[i]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A0208' }}>{step.title}</h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A6060' }}>{step.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl p-5" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('how_it_works_page.for_seekers')}</p>
                        <ul className="flex flex-col gap-2">
                          {seekerPoints.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#1A0208' }}>
                              <span className="text-xs mt-0.5" style={{ color: '#B8860B' }}>✔</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl p-5" style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('how_it_works_page.for_providers')}</p>
                        <ul className="flex flex-col gap-2">
                          {providerPoints.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#1A0208' }}>
                              <span className="text-xs mt-0.5" style={{ color: '#B8860B' }}>✔</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
                    >
                      {numbers[i]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A0208' }}>{step.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6060' }}>{step.description}</p>
                    <ul className="flex flex-col gap-2">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm" style={{ color: '#1A0208' }}>
                          <span className="text-xs" style={{ color: '#B8860B' }}>✔</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION: Fees ── */}
      <div id="fees" style={{ borderTop: '1px solid #E8DDD5' }}>
        <SubscriptionPlans />
      </div>

      {/* ── SECTION: FAQ ── */}
      <div id="faq" className="py-16" style={{ backgroundColor: '#FDF8F2' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A0208' }}>{t('how_it_works_page.faq_heading')}</h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
              >
                <p className="font-semibold mb-2" style={{ color: '#1A0208' }}>{faq.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6060' }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 rounded-2xl p-6 text-center"
            style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5' }}
          >
            <p className="font-semibold mb-2" style={{ color: '#1A0208' }}>{t('how_it_works_page.questions_not_listed')}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6060' }}>
              {t('how_it_works_page.questions_body')}
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#5C0A1E', color: '#B8860B', border: '1px solid #B8860B' }}
            >
              {t('how_it_works_page.contact_us')}
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
