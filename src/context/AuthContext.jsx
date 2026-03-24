import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // El usuario se hidrata desde localStorage solo para el nombre/rol (no sensible).
  // El token real nunca sale de la cookie httpOnly.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zabira_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  // Siempre verificamos con el servidor al montar para validar que la cookie sea válida
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user)
        localStorage.setItem('zabira_user', JSON.stringify(res.data.user))
      })
      .catch(() => {
        localStorage.removeItem('zabira_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { user: userData } = res.data
    localStorage.setItem('zabira_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData)
    const { user: userData } = res.data
    localStorage.setItem('zabira_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Si falla el servidor, de todas formas limpiamos localmente
    }
    localStorage.removeItem('zabira_user')
    setUser(null)
  }

  const hasRole = (rol) => user?.roles?.includes(rol) ?? false

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
