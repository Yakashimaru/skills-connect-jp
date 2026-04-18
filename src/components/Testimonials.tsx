import { useTranslation } from 'react-i18next'

const images = [
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/35.jpg',
]

export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true }) as { text: string; name: string; location: string }[]

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-3">{t('testimonials.eyebrow')}</p>
          <h2 className="text-4xl font-bold text-gray-900">{t('testimonials.heading')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm leading-relaxed mb-6">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <img src={images[i]} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
