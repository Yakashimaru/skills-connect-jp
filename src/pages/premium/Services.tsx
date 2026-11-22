import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero } from '../../components/premium/Sections'

export default function Services() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>Services – Kaiyui</title>
        <meta name="description" content={c.pillarsIntro.body} />
      </Helmet>

      <PageHero
        eyebrow={c.pillarsIntro.eyebrow}
        title={c.pillarsIntro.title}
        body={c.pillarsIntro.body}
        image="/4Lounge13.jpg"
      />

      <section className="bg-paper">
        {c.pillars.map((p, i) => (
          <div key={p.number} className={i % 2 ? 'bg-ivory' : 'bg-paper'}>
            <Container className="grid gap-10 py-24 md:grid-cols-[10rem_1fr_1fr] md:gap-16">
              <p className="font-display text-7xl leading-none text-gold">{p.number}</p>
              <div>
                <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl">{p.title}</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">{p.summary}</p>
              </div>
              <ul className="space-y-4 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                {p.points.map(pt => (
                  <li key={pt} className="flex gap-3 text-ink/85">
                    <span className="mt-[0.7rem] h-px w-5 shrink-0 bg-gold" />
                    {pt}
                  </li>
                ))}
              </ul>
            </Container>
          </div>
        ))}
      </section>

      <ClosingCTA />
    </>
  )
}
