import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero } from '../../components/premium/Sections'

export default function Experiences() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`${c.nav.experiences} – Kaiyui`}</title>
        <meta name="description" content={c.experiences.body} />
      </Helmet>

      <PageHero
        eyebrow={c.experiences.eyebrow}
        title={c.experiences.title}
        body={c.experiences.body}
        image="/the-reading-room.jpg"
      />

      <section className="bg-paper py-28">
        <Container>
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {c.experiences.items.map((e, i) => (
              <article key={e.title} className="flex flex-col bg-paper p-10 md:p-14">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{e.kind}</p>
                  <span className="font-display text-2xl text-gold/70">0{i + 1}</span>
                </div>
                <h2 className="mt-8 font-display text-4xl leading-tight text-ink">{e.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">{e.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm italic text-muted">{c.experiences.note}</p>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
