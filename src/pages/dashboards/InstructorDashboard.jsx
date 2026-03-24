import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import CalendarioMensual from '../../components/CalendarioMensual'
import '../../App.css'

export default function InstructorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const [inscriptos, setInscriptos] = useState([])
  const [cargandoInscriptos, setCargandoInscriptos] = useState(false)

  const cargarTurnos = useCallback(async () => {
    try {
      const res = await api.get('/turnos')
      const misTurnos = res.data.turnos.filter(
        t => t.instructor && (t.instructor._id === user._id || t.instructor === user._id)
      )
      setTurnos(misTurnos)
    } catch (e) {
      console.error(e)
    } finally {
      setCargando(false)
    }
  }, [user._id])

  useEffect(() => { cargarTurnos() }, [cargarTurnos])

  const handleLogout = async () => { await logout(); navigate('/', { replace: true }) }

  const formatFecha = fecha =>
    new Date(fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

  const handleClickCalendario = async (turno) => {
    if (turnoSeleccionado?._id === turno._id) {
      setTurnoSeleccionado(null)
      setInscriptos([])
      return
    }
    setTurnoSeleccionado(turno)
    setCargandoInscriptos(true)
    try {
      const res = await api.get(`/turnos/${turno._id}`)
      setInscriptos(res.data.turno.inscriptos || [])
    } catch (e) {
      console.error(e)
    } finally {
      setCargandoInscriptos(false)
    }
  }

  const hoy = new Date()
  const turnosFuturos = turnos.filter(t => new Date(t.fecha) >= hoy)
  const turnosPasados = turnos.filter(t => new Date(t.fecha) < hoy)

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <span className="prelogin__logo">Zabira<em>Studio</em></span>
        <div className="dashboard__user">
          <span className="dashboard__greeting">Hola, <strong>{user?.nombre}</strong></span>
          <button className="dashboard__logout" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main className="dashboard__main">
        <p className="prelogin__tag">Panel de instructor</p>
        <h1 className="auth-card__title" style={{ marginBottom: 32 }}>Mis clases</h1>

        {cargando ? (
          <p className="dashboard__loading">Cargando…</p>
        ) : turnos.length === 0 ? (
          <div className="dashboard__welcome">
            <p className="auth-card__sub">No tenés turnos asignados por el momento.</p>
          </div>
        ) : (
          <>
            <div className="dashboard__stats">
              <div className="stat-card">
                <span className="stat-card__num">{turnosFuturos.length}</span>
                <span className="stat-card__label">Próximas clases</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__num">{turnosPasados.length}</span>
                <span className="stat-card__label">Clases dadas</span>
              </div>
              <div className="stat-card">
                <span className="stat-card__num">{turnos.length}</span>
                <span className="stat-card__label">Total asignadas</span>
              </div>
            </div>

            <section className="dashboard__section">
              <h2 className="dashboard__section-title">Calendario de clases</h2>
              <CalendarioMensual
                turnos={turnosFuturos}
                onClickTurno={handleClickCalendario}
                turnoActivo={turnoSeleccionado?._id}
              />
            </section>

            {turnoSeleccionado && (
              <section className="dashboard__section">
                <h2 className="dashboard__section-title">
                  Inscriptas — {turnoSeleccionado.tipoClase?.nombre} · {formatFecha(turnoSeleccionado.fecha)}
                </h2>
                {cargandoInscriptos ? (
                  <p className="dashboard__loading">Cargando…</p>
                ) : inscriptos.length === 0 ? (
                  <p className="dashboard__empty">Nadie inscripta aún.</p>
                ) : (
                  <ul className="inscriptos-lista">
                    {inscriptos.map((ins, i) => {
                      const u = ins.usuario || ins
                      return (
                        <li key={u._id || i} className="inscripto-item">
                          <span className="inscripto-item__nombre">
                            {u.nombre} {u.apellido}
                          </span>
                          <span className="inscripto-item__email">{u.email}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )}

            {turnosPasados.length > 0 && (
              <section className="dashboard__section">
                <h2 className="dashboard__section-title">Historial de clases</h2>
                <div className="turnos-lista">
                  {turnosPasados.slice(0, 10).map(t => (
                    <div key={t._id} className="turno-card turno-card--pasado">
                      <div className="turno-card__info">
                        <strong>{t.tipoClase?.nombre}</strong>
                        <span>{formatFecha(t.fecha)}</span>
                      </div>
                      <span className="turno-card__cupos">
                        {t.inscriptos?.length || 0} alumna{t.inscriptos?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
