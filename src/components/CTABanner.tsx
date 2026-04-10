// CTABanner — maroon #5C0A1E bg, gold primary button, white outline secondary

export default function CTABanner() {
  return (
    <section className="py-20" style={{ backgroundColor: '#5C0A1E' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#E8D5A0' }}>
          Join the community
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">Ready to connect?</h2>
        <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Join thousands of people building real connections through skills and shared experiences.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className="font-semibold px-8 py-3 rounded-full transition-colors"
            style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}
          >
            Get started free
          </button>
          <button
            className="font-medium px-8 py-3 rounded-full transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.4)', color: '#fff', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Browse profiles
          </button>
        </div>
      </div>
    </section>
  )
}
