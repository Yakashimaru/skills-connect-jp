// HowItWorks — 3-step explainer section for new visitors
// Helps first-timers understand the platform flow: Browse → Connect → Meet
const steps = [
  {
    number: '01',
    title: 'Browse profiles',
    description: 'Search by skill, personality, location, or price. Filter to find exactly who you need.',
  },
  {
    number: '02',
    title: 'Connect & chat',
    description: 'Send a message, learn more about them, and schedule a session that works for you.',
  },
  {
    number: '03',
    title: 'Meet & grow',
    description: 'Meet online or offline. Build real connections, learn new skills, and leave a review.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-3">Simple process</p>
          <h2 className="text-4xl font-bold text-gray-900">How it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-px bg-gray-200 hidden lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold mb-5 z-10">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
