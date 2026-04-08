// SubscriptionPlans — pricing section shown on home page after How it works
// Three tiers: Standard, Premium, Elite (seeker-facing)
// Prices based on Amanda's brief

const plans = [
  {
    name: 'Standard',
    price: '¥5,000',
    period: '/month',
    description: 'Great for getting started and exploring the platform.',
    features: [
      'View limited profiles',
      '5 connections per month',
      'Basic search filters',
      'Basic profile visibility',
    ],
    cta: 'Get started',
    highlighted: false,
    dark: false,
  },
  {
    name: 'Premium',
    price: '¥10,000',
    period: '/month',
    description: 'For those who want more connections and better matches.',
    features: [
      'View unlimited profiles',
      'Advanced filters',
      'Priority matching suggestions',
      'See who viewed your profile',
      'Enhanced profile visibility',
    ],
    cta: 'Get Premium',
    highlighted: true,
    dark: false,
  },
  {
    name: 'Elite',
    price: '¥50,000',
    period: '/month',
    description: 'Exclusive access for serious seekers who want the best.',
    features: [
      'Everything in Premium',
      'Concierge service',
      'Access to elite providers',
      'Priority booking',
      'Private events & membership lounge',
      'Personal matchmaking suggestions',
    ],
    cta: 'Go Elite',
    highlighted: false,
    dark: true,
  },
]

export default function SubscriptionPlans() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-teal-500 text-xs font-semibold tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find the right plan for you</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Start free, upgrade when you're ready. All plans include access to our verified community.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 border transition-all ${
                plan.highlighted
                  ? 'bg-teal-500 border-teal-500 shadow-2xl md:scale-105'
                  : plan.dark
                  ? 'bg-gray-900 border-gray-900 shadow-xl'
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-lg'
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-teal-100' : plan.dark ? 'text-gray-400' : 'text-teal-500'}`}>{plan.name}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className={`text-4xl font-bold ${plan.highlighted || plan.dark ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.highlighted ? 'text-teal-100' : plan.dark ? 'text-gray-500' : 'text-gray-400'}`}>{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 leading-relaxed ${plan.highlighted ? 'text-teal-100' : plan.dark ? 'text-gray-400' : 'text-gray-400'}`}>{plan.description}</p>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className={`mt-0.5 text-xs ${plan.highlighted ? 'text-teal-200' : plan.dark ? 'text-gray-500' : 'text-teal-500'}`}>✔</span>
                    <span className={`text-sm ${plan.highlighted || plan.dark ? 'text-white' : 'text-gray-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                plan.highlighted
                  ? 'bg-white text-teal-600 hover:bg-gray-50'
                  : plan.dark
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
