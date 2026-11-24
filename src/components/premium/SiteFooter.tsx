import { Link } from 'react-router-dom'
import { usePremiumContent } from '../../content/premium'

export default function SiteFooter() {
  const c = usePremiumContent()
  const links = [
    { to: '/philosophy', label: c.nav.philosophy },
    { to: '/services', label: c.nav.services },
    { to: '/coaches', label: c.nav.coaches },
    { to: '/apply', label: c.nav.apply },
  ]

  return (
    <footer className="bg-ink font-body text-ivory/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[2fr_1fr] lg:px-10">
        <div>
          <p className="font-display text-3xl tracking-[0.12em] text-ivory">KAIYUI</p>
          <p className="mt-4 max-w-xs font-display text-xl italic text-ivory/60">{c.footer.tagline}</p>
        </div>
        <div>
          <p className="eyebrow mb-5">{c.footer.explore}</p>
          <ul className="space-y-3 text-sm">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs tracking-wide text-ivory/40 lg:px-10">
          © {new Date().getFullYear()} Kaiyui. {c.footer.rights}
        </p>
      </div>
    </footer>
  )
}
