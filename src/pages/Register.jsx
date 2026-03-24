import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { useAuth } from '../context/AuthContext'
import { getRolePrimaryRoute } from '../utils/auth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmar: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  // Requisitos de contraseña — coinciden exactamente con la validación del backend
  const passwordRules = [
    { label: 'Mínimo 8 caracteres',   ok: form.password.length >= 8 },
    { label: 'Al menos una mayúscula', ok: /[A-Z]/.test(form.password) },
    { label: 'Al menos una minúscula', ok: /[a-z]/.test(form.password) },
    { label: 'Al menos un número',     ok: /\d/.test(form.password) },
  ]
  const passwordValida = passwordRules.every(r => r.ok)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmar) {
      return setError('Las contraseñas no coinciden')
    }
    if (!passwordValida) {
      return setError('La contraseña no cumple los requisitos indicados')
    }

    setLoading(true)
    try {
      const { confirmar, ...datos } = form
      const user = await register(datos)
      navigate(getRolePrimaryRoute(user.roles), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
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
        <div className="auth-card auth-card--wide">
          <p className="prelogin__tag" style={{ textAlign: 'center', marginBottom: 8 }}>Primera clase gratuita</p>
          <h1 className="auth-card__title">Unite a Zabira</h1>
          <p className="auth-card__sub">Creá tu cuenta y empezá hoy mismo.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form__row">
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="nombre">Nombre</label>
                <input
                  className="auth-form__input"
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  placeholder="María"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="apellido">Apellido</label>
                <input
                  className="auth-form__input"
                  id="apellido"
                  name="apellido"
                  type="text"
                  autoComplete="family-name"
                  placeholder="González"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              <label className="auth-form__label" htmlFor="telefono">
                Teléfono <span className="auth-form__optional">(opcional)</span>
              </label>
              <input
                className="auth-form__input"
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                placeholder="+54 9 11 1234-5678"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="password">Contraseña</label>
              <input
                className="auth-form__input"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mín. 8 caracteres, mayúscula y número"
                value={form.password}
                onChange={handleChange}
                required
              />
              {form.password.length > 0 && (
                <ul className="auth-form__rules">
                  {passwordRules.map(r => (
                    <li key={r.label} className={`auth-form__rule ${r.ok ? 'auth-form__rule--ok' : 'auth-form__rule--fail'}`}>
                      <span aria-hidden="true">{r.ok ? '✓' : '×'}</span> {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="confirmar">Confirmar contraseña</label>
              <input
                className="auth-form__input"
                id="confirmar"
                name="confirmar"
                type="password"
                autoComplete="new-password"
                placeholder="Repetí tu contraseña"
                value={form.confirmar}
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
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-card__switch">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login">Ingresá acá</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
