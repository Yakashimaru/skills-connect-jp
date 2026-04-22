// Signup — dark bg, maroon card, gold accents

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'provider' | 'seeker'>('seeker')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md p-8 rounded-3xl" style={{ backgroundColor: '#1A0208', border: '0.5px solid rgba(184,134,11,0.3)' }}>

        <Link to="/" className="text-xl font-semibold tracking-tight block text-center mb-8" style={{ color: '#fff' }}>
          skillconnect
        </Link>

        <h1 className="text-2xl font-bold text-white text-center mb-1">Create an account</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Join the community today</p>

        {/* Role toggle */}
        <div className="flex p-1 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(184,134,11,0.2)' }}>
          {(['seeker', 'provider'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="flex-1 text-sm py-2 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: role === r ? '#B8860B' : 'transparent',
                color: role === r ? '#3A2400' : 'rgba(255,255,255,0.5)',
              }}
            >
              {r === 'seeker' ? "I'm looking for someone" : 'I offer a service'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Full name', type: 'text', value: name, set: setName, placeholder: 'Your name' },
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••' },
          ].map(({ label, type, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#B8860B' }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(184,134,11,0.3)', color: '#fff' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#B8860B')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(184,134,11,0.3)')}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full font-medium py-3 rounded-xl transition-colors mt-2"
            style={{ backgroundColor: '#B8860B', color: '#3A2400' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9A6F09')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B8860B')}
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: '#B8860B' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}
