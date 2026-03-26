// Signup page — dummy signup flow, redirects to dashboard on submit
// No real auth — replace with Supabase auth when backend is ready

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-teal-500 tracking-tight block text-center mb-8">
          skillconnect
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create an account</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Join the community today</p>

        {/* Role toggle */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-6">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className={`flex-1 text-sm py-2 rounded-full font-medium transition-colors ${role === 'seeker' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            I'm looking for someone
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex-1 text-sm py-2 rounded-full font-medium transition-colors ${role === 'provider' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            I offer a service
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-500 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
