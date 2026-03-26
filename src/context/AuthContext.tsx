// AuthContext — dummy auth state shared across the app
// Persists login state in localStorage so it survives page refresh
// Replace with Supabase auth when backend is ready

import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true')

  const login = () => {
    localStorage.setItem('loggedIn', 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('loggedIn')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
