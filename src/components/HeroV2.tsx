import { useTranslation } from 'react-i18next'

export default function HeroV2() {
  const { t } = useTranslation()
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
        <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">{t('hero.eyebrow')}</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          {t('hero.headline_1')}<br />{t('hero.headline_2')}<br />{t('hero.headline_3')}
        </h1>
        <div className="flex flex-wrap gap-3">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
            {t('hero.cta_start')}
          </button>
          <button className="border border-white/40 text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-colors">
            {t('hero.cta_browse')}
          </button>
        </div>
      </div>
    </section>
  )
}
