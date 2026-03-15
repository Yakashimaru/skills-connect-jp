// CTABanner — full-width teal sign up prompt at the bottom of the home page
// Buttons should link to the sign up / discover pages when auth is wired up
export default function CTABanner() {
  return (
    <section className="bg-teal-500 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to connect?</h2>
        <p className="text-teal-100 text-lg mb-10">
          Join thousands of people building real connections through skills and shared experiences.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
            Get started free
          </button>
          <button className="border border-white/50 text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
            Browse profiles
          </button>
        </div>
      </div>
    </section>
  )
}
