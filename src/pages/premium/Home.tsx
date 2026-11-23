import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PillarCard, ProgrammeCard, SectionHeading } from '../../components/premium/Sections'

export default function Home() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`Kaiyui – ${c.hero.title}`}</title>
        <meta name="description" content={c.hero.subtitle} />
        <link rel="canonical" href="https://www.kaiyui.com/" />
      </Helmet>

      {/* Hero */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-ink text-ivory">
        <img src="/the-reading-room.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />

        <Container className="relative w-full pb-20 pt-40 md:pb-28">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
            {c.hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">{c.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/apply" className="btn-gold">
              {c.hero.primary}
            </Link>
            <Link to="/membership" className="btn-outline text-ivory">
              {c.hero.secondary}
            </Link>
          </div>
          <p className="mt-16 border-t border-white/15 pt-6 text-[0.7rem] uppercase tracking-[0.25em] text-ivory/50">
            {c.hero.tagline}
          </p>
        </Container>
      </section>

      {/* Statement */}
      <section className="bg-paper py-28 md:py-36">
        <Container className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <p className="eyebrow">{c.statement.eyebrow}</p>
          <div>
            <blockquote className="font-display text-3xl leading-snug text-ink md:text-5xl">
              “{c.statement.quote}”
            </blockquote>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{c.statement.body}</p>
          </div>
        </Container>
      </section>

      {/* Four pillars */}
      <section className="bg-ivory py-28">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow={c.pillarsIntro.eyebrow} title={c.pillarsIntro.title} body={c.pillarsIntro.body} />
            <Link to="/services" className="btn-outline shrink-0 text-ink">
              {c.nav.services}
            </Link>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {c.pillars.map(p => (
              <PillarCard key={p.number} pillar={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="relative overflow-hidden bg-ink py-28 text-ivory">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading dark eyebrow={c.audience.eyebrow} title={c.audience.title} body={c.audience.body} />
          </div>
          <ul className="grid grid-cols-1 border-t border-white/15 sm:grid-cols-2">
            {c.audience.groups.map(g => (
              <li key={g} className="border-b border-white/15 py-6 font-display text-2xl text-ivory/90 sm:odd:pr-6">
                {g}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Journey */}
      <section className="bg-paper py-28">
        <Container>
          <SectionHeading eyebrow={c.journeyIntro.eyebrow} title={c.journeyIntro.title} />
          <ol className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-5">
            {c.journey.map(s => (
              <li key={s.step} className="flex flex-col bg-paper p-8">
                <span className="font-display text-4xl text-gold">{s.step}</span>
                <h3 className="mt-6 font-display text-2xl leading-tight text-ink">{s.title}</h3>
                {s.price && <p className="mt-2 text-sm font-semibold tracking-wide text-maroon">{s.price}</p>}
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Membership preview */}
      <section className="bg-ivory py-28">
        <Container>
          <SectionHeading
            center
            eyebrow={c.membershipIntro.eyebrow}
            title={c.membershipIntro.title}
            body={c.membershipIntro.body}
          />
          <div className="mt-20 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-0">
            {c.programmes.map(p => (
              <ProgrammeCard key={p.id} programme={p} />
            ))}
          </div>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
