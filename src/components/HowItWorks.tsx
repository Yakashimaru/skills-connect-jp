import { useTranslation } from 'react-i18next'

const numbers = ['01', '02', '03']

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('how_it_works_section.steps', { returnObjects: true }) as { title: string; description: string }[]

  return (
    <section className="py-20" style={{ backgroundColor: '#FDF8F2' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5C0A1E' }}>{t('how_it_works_section.eyebrow')}</p>
          <h2 className="text-4xl font-bold" style={{ color: '#1A0208' }}>{t('how_it_works_section.heading')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                  {numbers[i]}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A0208' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6060' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
