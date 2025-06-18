import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'


interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true'
  })

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem('loggedIn', 'true')
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('loggedIn')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
