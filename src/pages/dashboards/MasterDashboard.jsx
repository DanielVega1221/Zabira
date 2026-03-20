import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'

export default function MasterDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <span className="prelogin__logo">Zabira<em>Studio</em></span>
        <div className="dashboard__user">
          <span className="dashboard__greeting">
            Hola, <strong>{user?.nombre}</strong>
          </span>
          <button className="dashboard__logout" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__welcome">
          <p className="prelogin__tag">Master</p>
          <h1 className="auth-card__title">Control total</h1>
          <p className="auth-card__sub">Próximamente: gestión completa del sistema, usuarios y roles.</p>
        </div>
      </main>
    </div>
  )
}
