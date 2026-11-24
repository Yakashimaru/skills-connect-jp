import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { usePremiumContent } from '../../content/premium'
import { Container } from '../../components/premium/Sections'
import { submitContact } from '../../lib/contact'

const field =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-0'
const label = 'block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted'

export default function Apply() {
  const c = usePremiumContent()
  const f = c.apply.form
  const [params] = useSearchParams()
  const initialProgramme = c.programmes.some(p => p.id === params.get('programme')) ? params.get('programme')! : ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profile: '0',
    programme: initialProgramme,
    level: '1',
    goals: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.goals.trim()) {
      setError(f.required)
      return
    }
    setError('')
    setStatus('sending')

    const programme = c.programmes.find(p => p.id === form.programme)
    const message = [
      `Phone: ${form.phone || '-'}`,
      `Title & organisation: ${form.role || '-'}`,
      `Profile: ${f.profileOptions[+form.profile]}`,
      `Programme of interest: ${programme ? programme.duration : f.undecided}`,
      `English level: ${f.levelOptions[+form.level]}`,
      '',
      'Goals:',
      form.goals,
    ].join('\n')

    const { error: err } = await submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: `Membership application – ${programme?.name ?? f.undecided}`,
      message,
    })

    if (err) {
      setStatus('error')
      setError(f.error)
    } else {
      setStatus('sent')
    }
  }

  return (
    <>
      <Helmet>
        <title>{`${c.cta.button} – Kaiyui`}</title>
        <meta name="description" content={c.apply.metaDescription} />
      </Helmet>

      <section className="bg-ink pb-16 pt-44 text-ivory">
        <Container>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">{c.apply.title}</h1>
        </Container>
      </section>

      <section className="bg-paper py-24">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          {/* Left: application steps */}
          <aside>
            <ol className="space-y-5">
              {c.apply.steps.map((s, i) => (
                <li key={s} className="flex gap-5">
                  <span className="font-display text-2xl text-gold">0{i + 1}</span>
                  <span className="pt-1 text-ink/85">{s}</span>
                </li>
              ))}
            </ol>
          </aside>

          {/* Right: form */}
          {status === 'sent' ? (
            <div className="flex flex-col justify-center border border-line bg-ivory p-12">
              <h2 className="font-display text-5xl text-ink">{f.successTitle}</h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{f.successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-8 border border-line bg-ivory p-8 md:grid-cols-2 md:p-12">
              <div>
                <label className={label} htmlFor="name">{f.name} *</label>
                <input id="name" className={field} value={form.name} onChange={set('name')} autoComplete="name" />
              </div>
              <div>
                <label className={label} htmlFor="email">{f.email} *</label>
                <input id="email" type="email" className={field} value={form.email} onChange={set('email')} autoComplete="email" />
              </div>
              <div>
                <label className={label} htmlFor="phone">{f.phone}</label>
                <input id="phone" type="tel" className={field} value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </div>
              <div>
                <label className={label} htmlFor="role">{f.role}</label>
                <input id="role" className={field} value={form.role} onChange={set('role')} autoComplete="organization-title" />
              </div>
              <div>
                <label className={label} htmlFor="profile">{f.profile}</label>
                <select id="profile" className={field} value={form.profile} onChange={set('profile')}>
                  {f.profileOptions.map((o, i) => <option key={o} value={i}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="level">{f.level}</label>
                <select id="level" className={field} value={form.level} onChange={set('level')}>
                  {f.levelOptions.map((o, i) => <option key={o} value={i}>{o}</option>)}
                </select>
              </div>

              <fieldset className="md:col-span-2">
                <legend className={label}>{f.programme}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[...c.programmes.map(p => ({ id: p.id, title: p.duration, sub: p.sessions })), { id: '', title: f.undecided, sub: '' }].map(opt => (
                    <label
                      key={opt.id || 'undecided'}
                      className={`cursor-pointer border p-4 text-sm transition-colors ${
                        form.programme === opt.id ? 'border-gold bg-paper' : 'border-line hover:border-gold/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="programme"
                        value={opt.id}
                        checked={form.programme === opt.id}
                        onChange={set('programme')}
                        className="sr-only"
                      />
                      <span className="block font-medium text-ink">{opt.title}</span>
                      {opt.sub && <span className="mt-1 block text-xs text-muted">{opt.sub}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="md:col-span-2">
                <label className={label} htmlFor="goals">{f.goals} *</label>
                <textarea id="goals" rows={4} className={`${field} resize-none`} value={form.goals} onChange={set('goals')} />
              </div>

              <div className="md:col-span-2">
                {error && <p className="mb-4 text-sm text-maroon">{error}</p>}
                <button type="submit" className="btn-gold w-full disabled:opacity-60 sm:w-auto" disabled={status === 'sending'}>
                  {status === 'sending' ? f.submitting : f.submit}
                </button>
                <p className="mt-4 text-xs text-muted">{f.privacy}</p>
              </div>
            </form>
          )}
        </Container>
      </section>
    </>
  )
}
