// Hero section — full-width background photo with dark overlay and text
// Replace the Unsplash image URL with a real brand photo when available

export default function HeroV2() {
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
        <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-4">Skills · Personality · Connection</p>
        <h1 className="text-6xl font-bold text-white leading-tight mb-6 max-w-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          Meet people.<br />Share skills.<br />Build real connections.
        </h1>
        <p className="text-white text-lg mb-10 max-w-lg leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          Connect with coaches, mentors, and companions based on who they are — not just how they look.
        </p>
        <div className="flex gap-3">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
            Get started
          </button>
          <button className="border border-white/40 text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-colors">
            Browse profiles
          </button>
        </div>
      </div>
    </section>
  )
}
