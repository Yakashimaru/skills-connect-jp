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
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!mounted) return
        if (error) setError(error.message)
        else navigate('/dashboard', { replace: true })
      })
      return () => { mounted = false }
    } else {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session)
          navigate('/dashboard', { replace: true })
      })
      return () => subscription.unsubscribe()
    }
  }, [navigate])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: '#aaa' }}>Verifying...</p>
    </div>
  )
}
