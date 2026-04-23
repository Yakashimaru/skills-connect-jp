// CTABanner.tsx — updated to project maroon color scheme
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CTABanner() {
  const { t } = useTranslation()
  return (
    <section className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
          style={{ backgroundColor: '#1A0208' }}
        >
          {/* Decorative circle */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
            style={{ backgroundColor: '#B8860B', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 pointer-events-none"
            style={{ backgroundColor: '#FDF0E0', transform: 'translate(-20%, 20%)' }}
          />

          {/* Text */}
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#B8860B' }}>
              {t('cta_banner.eyebrow')}
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              {t('cta_banner.heading')}
            </h2>
            <p className="text-sm leading-relaxed max-w-md"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              {t('cta_banner.body')}
            </p>
          </div>

          {/* CTA buttons */}
          <div className="relative z-10 flex flex-col gap-3 flex-shrink-0">
            <NavLink
              to="/signup"
              className="px-8 py-3.5 rounded-xl font-semibold text-sm text-center transition-colors"
              style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#9A6F09'}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#B8860B'}
            >
              {t('cta_banner.cta_signup')}
            </NavLink>
            <NavLink
              to="/discover"
              className="px-8 py-3 rounded-xl font-medium text-sm text-center text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              {t('cta_banner.cta_browse')}
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}
