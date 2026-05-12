import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import * as authService from '../lib/auth'
import { getProfile } from '../lib/profiles'
import type { Profile, UserType } from '../lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoggedIn: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string, userType: UserType) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoggedIn: false,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsConfirmation: false }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession().then(async (session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) setProfile(await getProfile(currentUser.id))
      setLoading(false)
    })

    const { data: { subscription } } = authService.onAuthStateChange(async (u) => {
      setUser(u)
      setProfile(u ? await getProfile(u.id) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password)
    return { error: error?.message ?? null }
  }

  const signUp = async (email: string, password: string, name: string, userType: UserType) => {
    const { data, error } = await authService.signUp(email, password, name, userType)
    return { error: error?.message ?? null, needsConfirmation: !error && !data?.session }
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoggedIn: !!user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
