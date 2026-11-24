import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero } from '../../components/premium/Sections'

export default function Coaches() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`${c.coaches.eyebrow} – Kaiyui`}</title>
        <meta name="description" content={c.coaches.body} />
      </Helmet>

      <PageHero title={c.coaches.eyebrow} body={c.coaches.body} />

      {/* Placeholder profiles until real coaches are confirmed */}
      <section className="bg-ivory py-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {c.coaches.profiles.map(p => (
              <article key={p.role} className="bg-paper">
                <div className="flex aspect-[4/5] items-center justify-center" style={{ background: 'linear-gradient(to bottom, #2A1418, #17090D)' }}>
                  <span className="font-display text-7xl text-gold/40">K</span>
                </div>
                <div className="p-8">
                  <p className="eyebrow">{c.coaches.placeholder}</p>
                  <h3 className="mt-3 font-display text-3xl text-ink">{p.role}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.focus}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-sm italic text-muted">{c.coaches.comingSoon}</p>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
