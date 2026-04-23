// HeroV2.tsx — clean hero; personality & skills moved to own section below
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export default function HeroV2() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark maroon overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,2,8,0.68)' }} />
      {/* Radial vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(26,2,8,0.55) 100%)',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">

        {/* Eyebrow */}
        <p className="text-sm font-semibold tracking-widest uppercase mb-5" style={{ color: '#B8860B' }}>
          PERSONALITY · SKILLS · CONNECTION
        </p>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}
        >
          {t('hero.headline_1')}<br />
          Learn and Share skills.<br />
          {t('hero.headline_3')}
        </h1>

        {/* Sub-text */}
        <p className="text-base mb-8 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Connect through <strong className="text-white">who you are</strong> and{' '}
          <strong className="text-white">what you know</strong> — find language partners, coaches, guides and more across all of Japan.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <NavLink
            to="/discover"
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all text-white"
            style={{ backgroundColor: '#5C0A1E' }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#3A0612'}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#5C0A1E'}
          >
            {t('hero.cta_start')}
          </NavLink>
          <NavLink
            to="/discover"
            className="px-8 py-3 rounded-full font-medium text-sm text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.35)' }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.10)'}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          >
            {t('hero.cta_browse')}
          </NavLink>
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap items-center gap-6 mt-10 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
        >
          {[
            { value: '2,400+', label: 'Verified hosts' },
            { value: '47',     label: 'Prefectures' },
            { value: '12K+',   label: 'Sessions done' },
            { value: '4.9★',   label: 'Avg. rating' },
          ].map(stat => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <span className="font-bold text-white text-lg">{stat.value}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
