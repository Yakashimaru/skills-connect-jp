import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Status = 'verifying' | 'success' | 'error'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('verifying')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const code = new URL(window.location.href).searchParams.get('code')

    const onSuccess = () => {
      if (!mounted) return
      setStatus('success')
      setTimeout(() => { if (mounted) navigate('/dashboard', { replace: true }) }, 3000)
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!mounted) return
        if (error) { setError(error.message); setStatus('error') }
        else onSuccess()
      })
    } else {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) onSuccess()
      })
      return () => subscription.unsubscribe()
    }

    return () => { mounted = false }
  }, [navigate])

  if (status === 'error') return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#faf8f5' }}>
      <div className="text-center">
        <p className="text-4xl mb-4">❌</p>
        <p className="font-semibold mb-2" style={{ color: '#1A0208' }}>Something went wrong</p>
        <p className="text-sm mb-6" style={{ color: '#aaa' }}>{error}</p>
        <a href="/login" className="text-sm underline" style={{ color: '#B8860B' }}>Back to login</a>
      </div>
    </div>
  )

  if (status === 'success') return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#faf8f5' }}>
      <div className="rounded-3xl p-10 text-center max-w-sm w-full" style={{ backgroundColor: '#fff', border: '0.5px solid #E8DDD5', boxShadow: '0 4px 24px rgba(92,10,30,0.06)' }}>
        <p className="text-5xl mb-5">🎉</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1A0208' }}>Email confirmed!</h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A6060' }}>
          Welcome to <span style={{ color: '#5C0A1E', fontWeight: 600 }}>KAI</span><span style={{ color: '#B8860B', fontWeight: 600 }}>YUI</span>. Your account is ready.
        </p>
        <p className="text-xs" style={{ color: '#aaa' }}>Taking you to your dashboard...</p>
        <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F0E8E0' }}>
          <div className="h-full rounded-full" style={{ backgroundColor: '#B8860B', animation: 'grow 3s linear forwards', width: '0%' }} />
        </div>
        <style>{`@keyframes grow { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
      <p className="text-sm" style={{ color: '#aaa' }}>Verifying...</p>
    </div>
  )
}
