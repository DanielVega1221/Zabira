import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import CalendarioSemanal from '../../components/CalendarioSemanal'
import '../../App.css'

// Mensajes de retorno desde Mercado Pago
const PAGO_MSGS = {
  success: { texto: '¡Pago aprobado! Tu membresía fue activada.', tipo: 'ok' },
  pending: { texto: 'Pago pendiente de confirmación. Te avisaremos cuando se acredite.', tipo: 'warn' },
  failure: { texto: 'El pago no se completó. Podés intentarlo de nuevo.', tipo: 'error' }
}

export default function ClienteDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [membresia, setMembresia] = useState(null)
  const [misTurnos, setMisTurnos] = useState([])
  const [turnosDisponibles, setTurnosDisponibles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [accion, setAccion] = useState('')
  const [pagando, setPagando] = useState(false)
  const [pagoMsg, setPagoMsg] = useState(null) // { texto, tipo }

  // Detectar retorno desde Mercado Pago
  useEffect(() => {
    const pagoParam = searchParams.get('pago')
    if (pagoParam && PAGO_MSGS[pagoParam]) {
      setPagoMsg(PAGO_MSGS[pagoParam])
      // Limpiar el query param de la URL sin redirigir
      navigate('/dashboard/cliente', { replace: true })
    }
  }, [searchParams, navigate])

  const cargarDatos = useCallback(async () => {
    try {
      const [memRes, misRes, dispRes] = await Promise.all([
        api.get('/membresias/mi-membresia'),
        api.get('/turnos/cliente/mis-turnos'),
        api.get('/turnos')
      ])
      setMembresia(memRes.data)
      setMisTurnos(misRes.data.turnos)
      setTurnosDisponibles(dispRes.data.turnos)
    } catch (e) {
      console.error(e)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  // Si volvió de un pago aprobado, refrescar membresía después de 2s
  // (el webhook puede tardar un poco en activarla)
  useEffect(() => {
    if (pagoMsg?.tipo === 'ok') {
      const t = setTimeout(() => cargarDatos(), 2500)
      return () => clearTimeout(t)
    }
  }, [pagoMsg, cargarDatos])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const handlePagar = async () => {
    setPagando(true)
    setPagoMsg(null)
    try {
      const res = await api.post('/pagos/crear')
      // En dev usamos sandbox_init_point, en prod init_point
      const url = res.data.sandboxInitPoint || res.data.initPoint
      window.location.href = url
    } catch (e) {
      setPagoMsg({ texto: e.response?.data?.message || 'Error al iniciar el pago', tipo: 'error' })
      setPagando(false)
    }
  }

  const refrescarTurnos = useCallback(async () => {
    const [misRes, dispRes] = await Promise.all([
      api.get('/turnos/cliente/mis-turnos'),
      api.get('/turnos')
    ])
    setMisTurnos(misRes.data.turnos)
    setTurnosDisponibles(dispRes.data.turnos)
  }, [])

  const inscribirse = async (turnoId) => {
    await api.post(`/turnos/${turnoId}/inscribirse`)
    await refrescarTurnos()
  }

  const cancelar = async (turnoId) => {
    await api.post(`/turnos/${turnoId}/cancelar`)
    await refrescarTurnos()
  }

  const formatFecha = (fecha) =>
    new Date(fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

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
        {cargando ? (
          <p className="dashboard__loading">Cargando…</p>
        ) : (
          <>
            {/* Aviso de retorno desde MP */}
            {pagoMsg && (
              <div className={`pago-aviso pago-aviso--${pagoMsg.tipo}`}>
                {pagoMsg.texto}
                <button className="pago-aviso__cerrar" onClick={() => setPagoMsg(null)}>✕</button>
              </div>
            )}

            {/* Membresía */}
            <section className="dashboard__section">
              <h2 className="dashboard__section-title">Mi membresía</h2>
              {membresia?.membresia ? (
                <div className={`membresia-card ${membresia.vigente ? 'membresia-card--activa' : 'membresia-card--vencida'}`}>
                  <div>
                    <span className="membresia-card__badge">
                      {membresia.vigente ? '✓ Activa' : '✗ Vencida'}
                    </span>
                    <p style={{ marginTop: 6 }}>
                      Vence: <strong>{formatFecha(membresia.membresia.fechaFin)}</strong>
                    </p>
                  </div>
                  <button
                    className="turno-card__btn turno-card__btn--inscribir"
                    style={{ marginLeft: 'auto' }}
                    onClick={handlePagar}
                    disabled={pagando}
                  >
                    {pagando ? 'Redirigiendo…' : membresia.vigente ? 'Renovar (+1 mes)' : 'Reactivar membresía'}
                  </button>
                </div>
              ) : (
                <div className="membresia-card membresia-card--vencida">
                  <p>No tenés membresía activa.</p>
                  <button
                    className="turno-card__btn turno-card__btn--inscribir"
                    style={{ marginLeft: 'auto' }}
                    onClick={handlePagar}
                    disabled={pagando}
                  >
                    {pagando ? 'Redirigiendo…' : 'Contratar membresía'}
                  </button>
                </div>
              )}
            </section>

            {/* Calendario semanal */}
            <section className="dashboard__section">
              <h2 className="dashboard__section-title">Clases de la semana</h2>
              {turnosDisponibles.length === 0 ? (
                <p className="dashboard__empty">No hay turnos cargados aún.</p>
              ) : (
                <CalendarioSemanal
                  turnos={turnosDisponibles}
                  misTurnos={misTurnos}
                  membresia={membresia}
                  onInscribirse={inscribirse}
                  onCancelar={cancelar}
                />
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
