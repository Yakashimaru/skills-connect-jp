import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PillarCard, SectionHeading, TwoLineTitle } from '../../components/premium/Sections'

export default function Home() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`Kaiyui – ${c.hero.title}`}</title>
        <meta name="description" content={c.hero.metaDescription} />
        <link rel="canonical" href="https://www.kaiyui.com/" />
      </Helmet>

      {/* Hero */}
      {/* Text sits on solid colour for legibility; the photo is framed at
          close to its native size so it stays sharp on large screens. */}
      <section
        className="relative overflow-hidden text-ivory"
        style={{
          background:
            'radial-gradient(ellipse at 80% 40%, rgba(92,10,30,0.55), transparent 60%), #17090D',
        }}
      >
        <Container className="relative grid min-h-screen items-center gap-14 pb-20 pt-32 md:grid-cols-[1.2fr_0.8fr] md:gap-12 lg:gap-20">
          <div>
            <p className="eyebrow">{c.hero.eyebrow}</p>
            <h1 className="hero-title mt-6 font-display text-5xl leading-[1.04] lg:whitespace-nowrap lg:text-6xl">{c.hero.title}</h1>
            {/* Each sentence is kept whole, so narrow screens break between sentences */}
            <p className="mt-6 font-display text-xl italic text-gold-light [word-break:auto-phrase] md:text-2xl">
              {c.hero.subtitle.split(/(?<=[.。])\s*/).filter(Boolean).map(sentence => (
                <span key={sentence} className="inline-block pr-[0.3em]">
                  {sentence}
                </span>
              ))}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/apply" className="btn-gold">
                {c.hero.primary}
              </Link>
              <Link to="/services" className="btn-outline text-ivory">
                {c.hero.secondary}
              </Link>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[26rem]">
            {/* offset gold frame */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full border border-gold/50" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
              <img
                src="/the-reading-room.jpg"
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: '48% center' }}
              />
            </div>
          </figure>
        </Container>
      </section>

      {/* Statement */}
      <section className="bg-paper py-28 md:py-36">
        <Container className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <span className="block h-px w-16 bg-gold" />
            <p className="eyebrow mt-6">{c.statement.eyebrow}</p>
          </div>
          <div>
            {/* On wider screens each clause gets its own line */}
            <h2 className="font-display text-3xl leading-snug text-ink md:text-5xl">
              {c.statement.title.split(/(?<=[,。])\s*/).filter(Boolean).map(part => (
                <span key={part} className="md:block">
                  {part}{' '}
                </span>
              ))}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{c.statement.body}</p>
          </div>
        </Container>
      </section>

      {/* Four pillars */}
      <section className="bg-ivory py-28">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading rule gold title={c.pillarsIntro.title} />
            <Link to="/services" className="btn-outline shrink-0 text-ink">
              {c.nav.services}
            </Link>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {c.pillars.map(p => (
              <PillarCard key={p.number} pillar={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="relative overflow-hidden bg-ink py-28 text-ivory">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto block h-px w-16 bg-gold" />
            <h2 className="mt-8 font-display text-3xl leading-[1.1] text-gold-light md:text-4xl">{c.audience.title}</h2>
            <p className="mt-6 text-base leading-relaxed text-ivory/65 [text-wrap:balance] [word-break:auto-phrase] md:text-lg">{c.audience.body}</p>
          </div>
        </Container>
      </section>

      {/* Journey */}
      <section className="bg-paper py-28">
        <Container>
          <SectionHeading rule gold title={c.journeyIntro.title} />
          <ol className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-5">
            {c.journey.map(s => (
              // On wider screens every step shares the same four rows (number,
              // title, highlight, description) so the descriptions line up
              <li key={s.step} className="flex flex-col bg-paper p-8 md:row-span-4 md:grid md:grid-rows-subgrid">
                <span className="font-display text-4xl text-maroon/80">{s.step}</span>
                <h3 className="mt-6 font-display text-2xl leading-tight text-ink">
                  <TwoLineTitle text={s.title} />
                </h3>
                <p className="mt-2 text-sm font-semibold tracking-wide text-maroon">{s.highlight}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
