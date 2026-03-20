import { useState } from 'react'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Lunes de la semana que contiene `fecha`
function lunesDe(fecha) {
  const d = new Date(fecha)
  const dow = d.getDay() // 0=dom
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(fecha, n) {
  const d = new Date(fecha)
  d.setDate(d.getDate() + n)
  return d
}

function mismaFecha(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function formatHora(fecha) {
  return new Date(fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function formatDia(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

// ─────────────────────────────────────────────────────────────────────────────
// Props:
//   turnos          → array completo de turnos disponibles
//   misTurnos       → array de turnos del cliente (para marcar inscriptos)
//   membresia       → { vigente: bool }
//   onInscribirse   → async (turnoId) => void
//   onCancelar      → async (turnoId) => void
// ─────────────────────────────────────────────────────────────────────────────
export default function CalendarioSemanal({ turnos, misTurnos, membresia, onInscribirse, onCancelar }) {
  const [semanaBase, setSemanaBase] = useState(() => lunesDe(new Date()))
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const [accionando, setAccionando] = useState(false)
  const [feedback, setFeedback] = useState('')

  const dias = Array.from({ length: 7 }, (_, i) => addDays(semanaBase, i))

  const turnosDeSemana = turnos.filter(t => {
    const f = new Date(t.fecha)
    return f >= semanaBase && f < addDays(semanaBase, 7)
  })

  const turnosPorDia = dias.map(dia =>
    turnosDeSemana
      .filter(t => mismaFecha(new Date(t.fecha), dia))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  )

  const estaInscripto = (turnoId) => misTurnos.some(t => t._id === turnoId)

  const semanaLabel = () => {
    const fin = addDays(semanaBase, 6)
    return `${formatDia(semanaBase)} – ${formatDia(fin)}`
  }

  const handleClick = (turno) => {
    setFeedback('')
    setTurnoSeleccionado(turnoSeleccionado?._id === turno._id ? null : turno)
  }

  const handleAccion = async (turno) => {
    setAccionando(true)
    setFeedback('')
    try {
      if (estaInscripto(turno._id)) {
        await onCancelar(turno._id)
        setFeedback('Reserva cancelada.')
      } else {
        await onInscribirse(turno._id)
        setFeedback('¡Reserva confirmada!')
      }
      setTurnoSeleccionado(null)
    } catch {
      setFeedback('Ocurrió un error. Intentá de nuevo.')
    } finally {
      setAccionando(false)
    }
  }

  return (
    <div className="cal-semanal">
      {/* Navegación de semana */}
      <div className="cal-semanal__nav">
        <button className="cal-nav-btn" onClick={() => setSemanaBase(d => addDays(d, -7))}>‹ Anterior</button>
        <span className="cal-semanal__rango">{semanaLabel()}</span>
        <button className="cal-nav-btn" onClick={() => setSemanaBase(d => addDays(d, 7))}>Siguiente ›</button>
      </div>

      {feedback && <p className="dashboard__feedback" style={{ marginBottom: 12 }}>{feedback}</p>}

      {/* Grilla */}
      <div className="cal-semanal__grid">
        {dias.map((dia, i) => {
          const esHoy = mismaFecha(dia, new Date())
          const turnos = turnosPorDia[i]
          return (
            <div key={i} className={`cal-col${esHoy ? ' cal-col--hoy' : ''}`}>
              <div className="cal-col__header">
                <span className="cal-col__dia">{DIAS[i]}</span>
                <span className="cal-col__fecha">{dia.getDate()}</span>
              </div>
              <div className="cal-col__cuerpo">
                {turnos.length === 0 && (
                  <span className="cal-col__vacio">—</span>
                )}
                {turnos.map(t => {
                  const inscripto = estaInscripto(t._id)
                  const sinCupo = t.cuposDisponibles === 0 && !inscripto
                  const seleccionado = turnoSeleccionado?._id === t._id
                  let estado = 'disponible'
                  if (inscripto) estado = 'inscripto'
                  else if (sinCupo) estado = 'lleno'

                  return (
                    <div key={t._id}>
                      <button
                        className={`cal-turno cal-turno--${estado}${seleccionado ? ' cal-turno--sel' : ''}`}
                        onClick={() => handleClick(t)}
                        disabled={sinCupo}
                        title={sinCupo ? 'Sin cupos disponibles' : ''}
                      >
                        <span className="cal-turno__hora">{formatHora(t.fecha)}</span>
                        <span className="cal-turno__nombre">{t.tipoClase?.nombre}</span>
                        {!sinCupo && (
                          <span className="cal-turno__cupos">{t.cuposDisponibles} cupo{t.cuposDisponibles !== 1 ? 's' : ''}</span>
                        )}
                        {sinCupo && <span className="cal-turno__cupos">Lleno</span>}
                      </button>

                      {/* Panel de acción inline */}
                      {seleccionado && (
                        <div className="cal-turno__panel">
                          {t.instructor && (
                            <p className="cal-turno__panel-info">
                              Instructor: {t.instructor.nombre} {t.instructor.apellido}
                            </p>
                          )}
                          {!membresia?.vigente && !inscripto ? (
                            <p className="cal-turno__panel-warn">Necesitás membresía activa para reservar.</p>
                          ) : (
                            <button
                              className={`cal-turno__panel-btn${inscripto ? ' cal-turno__panel-btn--cancelar' : ''}`}
                              onClick={() => handleAccion(t)}
                              disabled={accionando}
                            >
                              {accionando ? '…' : inscripto ? 'Cancelar reserva' : 'Confirmar reserva'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
