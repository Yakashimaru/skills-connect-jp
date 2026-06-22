import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createCheckoutSession } from '../lib/subscriptions'
import type { SubscriptionPlan } from '../lib/types'

const prices     = ['¥5,000', '¥10,000', '¥50,000']
const trialPrices = ['¥2,500',  '¥5,000', '¥25,000']
const styleKeys = ['standard', 'premium', 'elite'] as const

const cardStyle = {
  standard: { background: '#fff', border: '0.5px solid #E8DDD5' },
  premium: { background: '#5C0A1E', border: '1.5px solid #B8860B' },
  elite: { background: '#1A0208', border: '0.5px solid rgba(184,134,11,0.25)' },
}

export default function SubscriptionPlans() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState<SubscriptionPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(plan: SubscriptionPlan) {
    if (!user) { navigate('/login'); return }
    setLoading(plan)
    setError(null)
    const result = await createCheckoutSession(plan)
    setLoading(null)
    if ('error' in result) { setError(result.error); return }
    window.location.href = result.url
  }

  const plans = styleKeys.map((key, i) => ({
    style: key,
    price: prices[i],
    trialPrice: trialPrices[i],
    name: t(`plans.${key}.name`),
    description: t(`plans.${key}.description`),
    cta: t(`plans.${key}.cta`),
    features: t(`plans.${key}.features`, { returnObjects: true }) as string[],
  }))

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('plans.eyebrow')}</p>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1A0208' }}>{t('plans.heading')}</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#7A6060' }}>{t('plans.subheading')}</p>
        </div>

        {error && (
          <p className="text-center text-sm mb-6" style={{ color: '#f87171' }}>{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan) => (
            <div
              key={plan.style}
              className={`rounded-3xl p-8 transition-all ${plan.style === 'premium' ? 'md:scale-105' : ''}`}
              style={cardStyle[plan.style]}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold" style={{ color: '#B8860B' }}>{plan.name}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#B8860B', color: '#fff' }}>{t('plans.trial_badge')}</span>
              </div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-4xl font-bold" style={{ color: plan.style === 'standard' ? '#1A0208' : '#fff' }}>{plan.trialPrice}</span>
                <span className="text-sm mb-1" style={{ color: 'rgba(184,134,11,0.7)' }}>{t('plans.period')}</span>
              </div>
              <p className="text-xs mb-2" style={{ color: plan.style === 'standard' ? '#aaa' : 'rgba(255,255,255,0.4)' }}>
                <span className="line-through">{plan.price}</span>
                {' '}{t('plans.period')}
              </p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: plan.style === 'standard' ? '#7A6060' : 'rgba(255,255,255,0.5)' }}>{plan.description}</p>

              <ul className="flex flex-col gap-2.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-0.5 text-xs" style={{ color: '#B8860B' }}>✔</span>
                    <span className="text-sm" style={{ color: plan.style === 'standard' ? '#1A0208' : '#fff' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs font-medium mb-4" style={{ color: plan.style === 'standard' ? '#5C0A1E' : 'rgba(255,255,255,0.85)' }}>{t('plans.trial_note')}</p>

              <button
                disabled={loading !== null}
                onClick={() => handleSelect(plan.style as SubscriptionPlan)}
                className="w-full py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={
                  plan.style === 'standard'
                    ? { backgroundColor: 'transparent', color: '#B8860B', border: '1px solid #B8860B' }
                    : { backgroundColor: '#B8860B', color: '#3A2400' }
                }
                onMouseEnter={e => {
                  if (loading !== null) return
                  if (plan.style === 'standard') {
                    e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.08)'
                  } else {
                    e.currentTarget.style.backgroundColor = '#9A6F09'
                  }
                }}
                onMouseLeave={e => {
                  if (plan.style === 'standard') {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  } else {
                    e.currentTarget.style.backgroundColor = '#B8860B'
                  }
                }}
              >
                {loading === plan.style ? '...' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
