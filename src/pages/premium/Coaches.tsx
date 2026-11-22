import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero, SectionHeading } from '../../components/premium/Sections'

export default function Coaches() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>Our Coaches – Kaiyui</title>
        <meta name="description" content={c.coaches.body} />
      </Helmet>

      <PageHero eyebrow={c.coaches.eyebrow} title={c.coaches.title} body={c.coaches.body} />

      {/* Placeholder profiles until real coaches are confirmed */}
      <section className="bg-ivory py-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {c.coaches.profiles.map(p => (
              <article key={p.role} className="bg-paper">
                <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-b from-ink-soft to-ink">
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

      <section className="bg-ink py-28 text-ivory">
        <Container className="grid gap-16 lg:grid-cols-2">
          <SectionHeading dark eyebrow={c.coaches.eyebrow} title={c.coaches.title} />
          <ul className="border-t border-white/15">
            {c.coaches.criteria.map(item => (
              <li key={item} className="flex gap-4 border-b border-white/15 py-6 text-lg text-ivory/85">
                <span className="mt-[0.8rem] h-px w-6 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
