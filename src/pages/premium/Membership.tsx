import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { ClosingCTA, Container, PageHero, ProgrammeCard, SectionHeading } from '../../components/premium/Sections'

export default function Membership() {
  const c = usePremiumContent()

  return (
    <>
      <Helmet>
        <title>{`${c.nav.membership} – Kaiyui`}</title>
        <meta name="description" content={c.membershipIntro.metaDescription} />
      </Helmet>

      <PageHero
        eyebrow={c.membershipIntro.eyebrow}
        title={c.membershipIntro.title}
        body={c.membershipIntro.heroBody}
      />

      <section className="bg-ivory py-28">
        <Container>
          <div className="grid items-stretch gap-8 lg:grid-cols-3 lg:gap-0">
            {c.programmes.map(p => (
              <ProgrammeCard key={p.id} programme={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Journey recap */}
      <section className="bg-paper py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading title={c.journeyIntro.title} />
          <ol className="border-t border-line">
            {c.journey.map(s => (
              <li key={s.step} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-line py-7">
                <span className="font-display text-3xl text-gold">{s.step}</span>
                <div>
                  <h3 className="font-display text-2xl text-ink">
                    {s.title}
                    {s.highlight && <span className="block text-base font-body font-semibold text-maroon sm:ml-3 sm:inline">{s.highlight}</span>}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="bg-ink py-28 text-ivory">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading dark eyebrow={c.addOns.eyebrow} title={c.addOns.title} body={c.addOns.note} />
          <dl className="border-t border-white/15">
            {c.addOns.rows.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-6">
                <dt className="text-ivory/80">{label}</dt>
                <dd className="font-display text-2xl text-gold-light">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ClosingCTA />
    </>
  )
}
