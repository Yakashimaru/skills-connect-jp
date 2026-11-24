import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { usePremiumContent, type Pillar, type Programme } from '../../content/premium'

export function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
  center = false,
  rule = false,
  gold = false,
}: {
  eyebrow?: string
  title: string
  body?: string
  dark?: boolean
  center?: boolean
  /** Short gold line above the heading to anchor it */
  rule?: boolean
  /** Gold heading, used for section titles so they stand apart from statements */
  gold?: boolean
}) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {rule && <span className={`mb-8 block h-px w-16 bg-gold ${center ? 'mx-auto' : ''}`} />}
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2
        className={`font-display text-4xl leading-[1.1] md:text-5xl ${gold ? 'text-gold' : dark ? 'text-ivory' : 'text-ink'}`}
      >
        {title}
      </h2>
      {body && (
        <p className={`mt-6 text-base leading-relaxed md:text-lg ${dark ? 'text-ivory/65' : 'text-muted'}`}>
          {body}
        </p>
      )}
    </div>
  )
}

/** Page header used on every inner page (sits under the fixed nav). */
export function PageHero({
  eyebrow,
  title,
  body,
  image,
}: {
  eyebrow?: string
  title: string
  body?: string
  image?: string
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-24 pt-44 text-ivory">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(23,9,13,0.8), rgba(23,9,13,0.75) 50%, #17090D)' }} />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        {body && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/70">{body}</p>}
      </div>
    </section>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-6 lg:px-10 ${className}`}>{children}</div>
}

/** On wider screens, break before the last word so card titles are all
 *  two lines and the text under them lines up. Titles without spaces
 *  (e.g. Japanese) wrap normally. */
export function TwoLineTitle({ text }: { text: string }) {
  const lastSpace = text.lastIndexOf(' ')
  if (lastSpace <= 0) return <>{text}</>
  return (
    <>
      {text.slice(0, lastSpace)}
      <br className="hidden md:block" /> {text.slice(lastSpace + 1)}
    </>
  )
}

export function PillarCard({ pillar, detailed = false }: { pillar: Pillar; detailed?: boolean }) {
  return (
    <article className="flex h-full flex-col border-t border-gold/60 pt-8">
      <p className="font-display text-5xl text-maroon/80">{pillar.number}</p>
      {/* Reserve two lines so descriptions line up across cards */}
      <h3 className="mt-6 font-display text-3xl leading-tight text-ink md:min-h-[2.5em]">
        <TwoLineTitle text={pillar.title} />
      </h3>
      <p className="mt-4 leading-relaxed text-muted">{pillar.summary}</p>
      {detailed && (
        <ul className="mt-6 space-y-3 text-sm text-ink/80">
          {pillar.points.map(p => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function ProgrammeCard({ programme }: { programme: Programme }) {
  const c = usePremiumContent()
  const featured = !!programme.recommended
  return (
    <article
      className={`relative flex h-full flex-col p-10 ${
        featured ? 'bg-ink text-ivory shadow-2xl lg:-my-6 lg:py-16' : 'border border-line bg-paper text-ink'
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-10 bg-gold px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink">
          {c.membershipIntro.recommended}
        </span>
      )}
      <p className="eyebrow">{programme.tier}</p>
      <h3 className="mt-4 font-display text-3xl">{programme.duration}</h3>
      <p className={`mt-3 text-sm ${featured ? 'text-ivory/60' : 'text-muted'}`}>{programme.sessions}</p>
      <div className={`my-8 h-px ${featured ? 'bg-white/15' : 'bg-line'}`} />
      <ul className="flex-1 space-y-4 text-sm">
        {programme.features.map(f => (
          <li key={f} className="flex gap-3">
            <span className="mt-[0.55rem] h-px w-4 shrink-0 bg-gold" />
            <span className={featured ? 'text-ivory/85' : 'text-ink/80'}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={`/apply?programme=${programme.id}`}
        className={`mt-10 ${featured ? 'btn-gold' : 'btn-outline text-ink'}`}
      >
        {c.membershipIntro.cta}
      </Link>
    </article>
  )
}

export function ClosingCTA() {
  const c = usePremiumContent()
  return (
    <section className="relative overflow-hidden bg-maroon-deep py-28 text-ivory">
      <img src="/4Lounge13.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #3A0612, rgba(58,6,18,0.88) 50%, rgba(58,6,18,0.7))' }} />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-4xl font-display text-3xl leading-tight md:text-5xl">
          {c.cta.title}
          <span className="block">{c.cta.body}</span>
        </h2>
        <Link to="/apply" className="btn-gold mt-10">
          {c.cta.button}
        </Link>
      </Container>
    </section>
  )
}
