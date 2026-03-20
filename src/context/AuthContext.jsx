import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zabira_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  // Si hay token guardado, arrancamos en cargando para verificarlo
  const [loading, setLoading] = useState(() => !!localStorage.getItem('zabira_token'))

  // Verificar token al montar
  useEffect(() => {
    const token = localStorage.getItem('zabira_token')
    if (!token) return

    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('zabira_token')
        localStorage.removeItem('zabira_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, user: userData } = res.data
    localStorage.setItem('zabira_token', token)
    localStorage.setItem('zabira_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData)
    const { token, user: userData } = res.data
    localStorage.setItem('zabira_token', token)
    localStorage.setItem('zabira_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('zabira_token')
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
