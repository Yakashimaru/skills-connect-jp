import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero } from '../../components/premium/Sections'

export default function Philosophy() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`${c.philosophy.eyebrow} – Kaiyui`}</title>
        <meta name="description" content={c.philosophy.intro} />
      </Helmet>

      <PageHero
        eyebrow={c.philosophy.eyebrow}
        title={c.philosophy.title}
        image="/the-reading-room.jpg"
      />

      <section className="bg-ivory py-28">
        <Container className="grid gap-x-16 gap-y-16 md:grid-cols-2">
          {c.philosophy.principles.map((p, i) => (
            <article key={p.title} className="border-t border-gold/60 pt-8">
              <p className="font-display text-xl text-gold">0{i + 1}</p>
              <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">{p.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{p.body}</p>
            </article>
          ))}
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
