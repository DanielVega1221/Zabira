import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rutas según autenticación y rol opcional.
 * - Si loading → nada (espera verificación del token)
 * - Si no autenticado → redirige a /login
 * - Si rol requerido y usuario no lo tiene → redirige a /login
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: 14 }}>Cargando…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.some(r => user.roles?.includes(r))) {
    return <Navigate to="/login" replace />
  }

  return children
}
