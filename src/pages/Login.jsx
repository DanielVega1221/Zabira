import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { useAuth } from '../context/AuthContext'
import { getRolePrimaryRoute } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(getRolePrimaryRoute(user.roles), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-transition">
      <header className="prelogin__nav">
        <Link to="/pre-login" className="prelogin__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </Link>
        <span className="prelogin__logo">Zabira<em>Studio</em></span>
        <div className="prelogin__nav-spacer" />
      </header>

      <main className="auth-page__main">
        <div className="auth-card">
          <p className="prelogin__tag" style={{ textAlign: 'center', marginBottom: 8 }}>Bienvenida de vuelta</p>
          <h1 className="auth-card__title">Ingresá a tu cuenta</h1>
          <p className="auth-card__sub">Reservá tu turno y gestioná tus clases.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">Email</label>
              <input
                className="auth-form__input"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="password">Contraseña</label>
              <input
                className="auth-form__input"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="auth-form__error">{error}</p>}

            <button
              className="auth-form__btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="auth-card__switch">
            ¿No tenés cuenta?{' '}
            <Link to="/registro">Creá una acá</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
