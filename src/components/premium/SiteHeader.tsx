import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PREMIUM_LANGS, usePremiumContent } from '../../content/premium'

function LangToggle() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en').slice(0, 2)
  return (
    <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.15em]">
      {PREMIUM_LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          {i > 0 && <span className="text-ivory/30">/</span>}
          <button
            onClick={() => i18n.changeLanguage(l.code)}
            className={current === l.code ? 'text-gold-light' : 'text-ivory/60 hover:text-ivory'}
            aria-pressed={current === l.code}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  )
}

export default function SiteHeader() {
  const c = usePremiumContent()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Transparent over the home hero, solid everywhere else / once scrolled
  const overHero = pathname === '/' && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/philosophy', label: c.nav.philosophy },
    { to: '/services', label: c.nav.services },
    { to: '/membership', label: c.nav.membership },
    { to: '/coaches', label: c.nav.coaches },
    { to: '/experiences', label: c.nav.experiences },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-body transition-colors duration-300 ${
        overHero ? 'bg-transparent text-ivory' : 'bg-ink/95 text-ivory backdrop-blur border-b border-white/10'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="font-display text-3xl tracking-[0.12em]">
          KAIYUI
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold-light ${
                  isActive ? 'text-gold-light' : 'text-ivory/80'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LangToggle />
          <Link to="/login" className="text-[0.72rem] uppercase tracking-[0.2em] text-ivory/60 hover:text-ivory">
            {c.nav.login}
          </Link>
          <Link to="/apply" className="btn-gold px-6 py-3">
            {c.nav.apply}
          </Link>
        </div>

        <div className="flex items-center gap-5 lg:hidden">
          <LangToggle />
          <button
            className="text-[0.72rem] uppercase tracking-[0.2em]"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
          >
            {open ? c.nav.close : c.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-6 pb-10 pt-4 lg:hidden">
          <nav className="flex flex-col">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 font-display text-2xl text-ivory"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <Link to="/apply" onClick={() => setOpen(false)} className="btn-gold w-full">
              {c.nav.apply}
            </Link>
            <Link to="/login" onClick={() => setOpen(false)} className="text-center text-[0.72rem] uppercase tracking-[0.2em] text-ivory/60">
              {c.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
