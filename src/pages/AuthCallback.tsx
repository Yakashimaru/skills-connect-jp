import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const code = new URL(window.location.href).searchParams.get('code')

    if (code) {
      // PKCE flow — exchange the code for a session
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!mounted) return
        if (error) setError(error.message)
        else navigate('/dashboard', { replace: true })
      })
      return () => { mounted = false }
    } else {
      // Implicit flow — SDK auto-processes the URL hash; just wait for SIGNED_IN
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
          navigate('/dashboard', { replace: true })
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm font-medium" style={{ color: '#DC2626' }}>Confirmation failed: {error}</p>
        <button onClick={() => navigate('/login')} className="text-sm underline" style={{ color: '#5C0A1E' }}>
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
      <p className="text-sm" style={{ color: '#aaa' }}>Confirming your account…</p>
    </div>
  )
}
