import { useState } from 'react'

const DIAS_HEADER = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function primerLunesDelMes(año, mes) {
  // Primer día del mes
  const primero = new Date(año, mes, 1)
  const dow = primero.getDay() // 0=dom
  // Retroceder al lunes anterior (o quedarse si ya es lunes)
  const diff = dow === 0 ? -6 : 1 - dow
  const lunes = new Date(primero)
  lunes.setDate(primero.getDate() + diff)
  return lunes
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

// ─────────────────────────────────────────────────────────────────────────────
// Props:
//   turnos        → array de turnos
//   onClickTurno  → (turno) => void  — callback al clickear un turno
//   turnoActivo   → _id del turno seleccionado (opcional, para resaltar)
// ─────────────────────────────────────────────────────────────────────────────
export default function CalendarioMensual({ turnos, onClickTurno, turnoActivo }) {
  const hoy = new Date()
  const [año, setAño] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth())

  const irMesAnterior = () => {
    if (mes === 0) { setMes(11); setAño(a => a - 1) }
    else setMes(m => m - 1)
  }
  const irMesSiguiente = () => {
    if (mes === 11) { setMes(0); setAño(a => a + 1) }
    else setMes(m => m + 1)
  }

  // Construir semanas del mes (siempre comenzando en lunes)
  const semanas = []
  let dia = primerLunesDelMes(año, mes)
  while (true) {
    const semana = Array.from({ length: 7 }, (_, i) => addDays(dia, i))
    semanas.push(semana)
    dia = addDays(dia, 7)
    // Terminamos cuando todos los días de la semana son del mes siguiente
    if (semana.every(d => d.getMonth() !== mes && d > new Date(año, mes, 1))) break
    if (semanas.length > 6) break
  }

  const turnosPorFecha = (fecha) =>
    turnos.filter(t => mismaFecha(new Date(t.fecha), fecha))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  return (
    <div className="cal-mensual">
      {/* Navegación */}
      <div className="cal-semanal__nav">
        <button className="cal-nav-btn" onClick={irMesAnterior}>‹</button>
        <span className="cal-semanal__rango">{MESES[mes]} {año}</span>
        <button className="cal-nav-btn" onClick={irMesSiguiente}>›</button>
      </div>

      {/* Cabecera días */}
      <div className="cal-mensual__grid">
        {DIAS_HEADER.map(d => (
          <div key={d} className="cal-mensual__header-dia">{d}</div>
        ))}

        {/* Celdas */}
        {semanas.flat().map((fecha, i) => {
          const esMes = fecha.getMonth() === mes
          const esHoy = mismaFecha(fecha, hoy)
          const tsDia = turnosPorFecha(fecha)

          return (
            <div key={i} className={`cal-mensual__celda${!esMes ? ' cal-mensual__celda--fuera' : ''}${esHoy ? ' cal-mensual__celda--hoy' : ''}`}>
              <span className={`cal-mensual__num${esHoy ? ' cal-mensual__num--hoy' : ''}`}>
                {fecha.getDate()}
              </span>
              <div className="cal-mensual__eventos">
                {tsDia.map(t => {
                  const sel = turnoActivo === t._id
                  const cupos = t.cuposDisponibles ?? (t.cupoMaximo - (t.inscriptos?.length || 0))
                  const lleno = cupos === 0
                  return (
                    <button
                      key={t._id}
                      className={`cal-evento${lleno ? ' cal-evento--lleno' : ''}${sel ? ' cal-evento--sel' : ''}`}
                      onClick={() => onClickTurno?.(t)}
                      title={`${t.tipoClase?.nombre} ${formatHora(t.fecha)} — ${cupos} cupo${cupos !== 1 ? 's' : ''}`}
                    >
                      <span className="cal-evento__hora">{formatHora(t.fecha)}</span>
                      <span className="cal-evento__nombre">{t.tipoClase?.nombre}</span>
                    </button>
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
