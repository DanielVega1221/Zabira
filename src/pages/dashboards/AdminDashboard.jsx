import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import CalendarioMensual from '../../components/CalendarioMensual'
import '../../App.css'

// ─── Subcomponente: formulario de turno ────────────────────────────────────
function FormTurno({ tiposClase, instructores, turnoEditar, onGuardado, onCancelar }) {
  const hoy = new Date()
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset())
  const minFecha = hoy.toISOString().slice(0, 16)

  const [form, setForm] = useState({
    tipoClase: turnoEditar?.tipoClase?._id || turnoEditar?.tipoClase || '',
    fecha: turnoEditar?.fecha ? new Date(turnoEditar.fecha).toISOString().slice(0, 16) : '',
    instructor: turnoEditar?.instructor?._id || turnoEditar?.instructor || '',
    cupoMaximo: turnoEditar?.cupoMaximo || ''
  })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const payload = {
        tipoClase: form.tipoClase,
        fecha: form.fecha,
        instructor: form.instructor || null,
        cupoMaximo: Number(form.cupoMaximo)
      }
      if (turnoEditar) {
        await api.put(`/turnos/${turnoEditar._id}`, payload)
      } else {
        await api.post('/turnos', payload)
      }
      onGuardado()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <div className="auth-form__field">
          <label className="auth-form__label">Tipo de clase</label>
          <select className="auth-form__input" name="tipoClase" value={form.tipoClase} onChange={handleChange} required>
            <option value="">Seleccioná un tipo</option>
            {tiposClase.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
          </select>
        </div>
        <div className="auth-form__field">
          <label className="auth-form__label">Fecha y hora</label>
          <input className="auth-form__input" type="datetime-local" name="fecha" min={minFecha}
            value={form.fecha} onChange={handleChange} required />
        </div>
        <div className="auth-form__field">
          <label className="auth-form__label">Instructor <span className="auth-form__optional">(opcional)</span></label>
          <select className="auth-form__input" name="instructor" value={form.instructor} onChange={handleChange}>
            <option value="">Sin asignar</option>
            {instructores.map(i => <option key={i._id} value={i._id}>{i.nombre} {i.apellido}</option>)}
          </select>
        </div>
        <div className="auth-form__field">
          <label className="auth-form__label">Cupo máximo</label>
          <input className="auth-form__input" type="number" name="cupoMaximo" min="1" max="100"
            value={form.cupoMaximo} onChange={handleChange} required />
        </div>
      </div>
      {error && <p className="auth-form__error">{error}</p>}
      <div className="admin-form__actions">
        <button type="submit" className="auth-form__btn" style={{ maxWidth: 160 }} disabled={guardando}>
          {guardando ? 'Guardando…' : turnoEditar ? 'Guardar cambios' : 'Crear turno'}
        </button>
        <button type="button" className="admin-form__cancel" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

// ─── Subcomponente: activar membresía ──────────────────────────────────────
function FormMembresia({ onActivado }) {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [tipo, setTipo] = useState('')  // 'ok' | 'error'
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    setCargando(true)
    try {
      // Buscar usuario por email primero
      const usersRes = await api.get(`/usuarios/buscar?email=${encodeURIComponent(email)}`)
      const usuarioId = usersRes.data.usuario._id
      await api.post(`/membresias/activar/${usuarioId}`)
      setMsg(`Membresía activada para ${usersRes.data.usuario.nombre} ${usersRes.data.usuario.apellido}`)
      setTipo('ok')
      setEmail('')
      onActivado?.()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error al activar membresía')
      setTipo('error')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <div className="auth-form__field" style={{ gridColumn: '1 / -1' }}>
          <label className="auth-form__label">Email del alumno</label>
          <input className="auth-form__input" type="email" value={email}
            onChange={e => { setEmail(e.target.value); setMsg('') }}
            placeholder="alumna@email.com" required />
        </div>
      </div>
      {msg && <p className={tipo === 'ok' ? 'dashboard__feedback' : 'auth-form__error'}>{msg}</p>}
      <div className="admin-form__actions">
        <button type="submit" className="auth-form__btn" style={{ maxWidth: 200 }} disabled={cargando}>
          {cargando ? 'Activando…' : 'Activar membresía (+1 mes)'}
        </button>
      </div>
    </form>
  )
}

// ─── Subcomponente: tipos de clase ─────────────────────────────────────────
function PanelTiposClase({ onCambio }) {
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', duracion: '', cupoDefault: '' })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)

  const cargar = useCallback(async () => {
    const res = await api.get('/tipos-clase/todos')
    setTipos(res.data.tipos)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      await api.post('/tipos-clase', {
        nombre: form.nombre,
        descripcion: form.descripcion,
        duracion: Number(form.duracion),
        cupoDefault: Number(form.cupoDefault)
      })
      setForm({ nombre: '', descripcion: '', duracion: '', cupoDefault: '' })
      setMostrarForm(false)
      cargar()
      onCambio?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActiva = async (tipo) => {
    if (!window.confirm(`¿Eliminar "${tipo.nombre}"? Los turnos históricos conservarán su nombre.`)) return
    try {
      await api.delete(`/tipos-clase/${tipo._id}`)
      cargar()
      onCambio?.()
    } catch (e) { console.error(e) }
  }

  const toggleDesactivar = async (tipo) => {
    try {
      if (tipo.activa) {
        await api.patch(`/tipos-clase/${tipo._id}/desactivar`)
      } else {
        await api.patch(`/tipos-clase/${tipo._id}/activar`)
      }
      cargar()
      onCambio?.()
    } catch (e) { console.error(e) }
  }

  return (
    <section className="dashboard__section">
      <div className="dashboard__section-header">
        <h2 className="dashboard__section-title">Tipos de clase</h2>
        <button className="admin-btn-add" onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? '✕ Cancelar' : '+ Nuevo tipo'}
        </button>
      </div>

      {mostrarForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div className="admin-form__grid">
            <div className="auth-form__field">
              <label className="auth-form__label">Nombre</label>
              <input className="auth-form__input" name="nombre" value={form.nombre}
                onChange={handleChange} placeholder="Pilates Reformer" required />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Descripción <span className="auth-form__optional">(opcional)</span></label>
              <input className="auth-form__input" name="descripcion" value={form.descripcion}
                onChange={handleChange} placeholder="Descripción breve" />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Duración (min)</label>
              <input className="auth-form__input" type="number" name="duracion" min="1" max="300"
                value={form.duracion} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Cupo por defecto</label>
              <input className="auth-form__input" type="number" name="cupoDefault" min="1" max="100"
                value={form.cupoDefault} onChange={handleChange} required />
            </div>
          </div>
          {error && <p className="auth-form__error">{error}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="auth-form__btn" style={{ maxWidth: 160 }} disabled={guardando}>
              {guardando ? 'Guardando…' : 'Crear tipo'}
            </button>
          </div>
        </form>
      )}

      <div className="tipos-lista">
        {tipos.length === 0 && <p className="dashboard__empty">No hay tipos de clase creados.</p>}
        {tipos.map(t => (
          <div key={t._id} className={`tipo-card${!t.activa ? ' tipo-card--inactiva' : ''}`}>
            <div className="tipo-card__info">
              <strong>{t.nombre}</strong>
              <span>{t.duracion} min · cupo default: {t.cupoDefault}</span>
              {t.descripcion && <span className="tipo-card__desc">{t.descripcion}</span>}
              {!t.activa && <span className="tipo-card__inactiva-badge">Desactivada</span>}
            </div>
            <div className="tipo-card__acciones">
              <button className="turno-card__btn" onClick={() => toggleDesactivar(t)}>
                {t.activa ? 'Desactivar' : 'Activar'}
              </button>
              <button className="turno-card__btn turno-card__btn--cancelar" onClick={() => toggleActiva(t)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── PanelInstructores (compartido, accesible desde admin y master) ───────────
function PanelInstructores({ rutaBase = '/usuarios/instructores' }) {
  const [instructores, setInstructores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', password: '' })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      const res = await api.get('/usuarios?roles=instructor')
      setInstructores(res.data.usuarios || [])
    } finally { setCargando(false) }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ nombre: '', apellido: '', email: '', telefono: '', password: '' })
    setError('')
    setMostrarForm(true)
  }

  const abrirEditar = (inst) => {
    setEditando(inst)
    setForm({ nombre: inst.nombre, apellido: inst.apellido, email: inst.email, telefono: inst.telefono || '', password: '' })
    setError('')
    setMostrarForm(true)
  }

  const cerrar = () => { setMostrarForm(false); setEditando(null) }
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const payload = { nombre: form.nombre, apellido: form.apellido, email: form.email, telefono: form.telefono }
      if (!editando || form.password) payload.password = form.password
      if (editando) {
        await api.put(`${rutaBase}/${editando._id}`, payload)
      } else {
        await api.post(rutaBase, payload)
      }
      cerrar(); cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally { setGuardando(false) }
  }

  const eliminar = async (inst) => {
    if (!window.confirm(`¿Eliminar a ${inst.nombre} ${inst.apellido}? Esta acción no se puede deshacer.`)) return
    try { await api.delete(`${rutaBase}/${inst._id}`); cargar() }
    catch (e) { console.error(e) }
  }

  return (
    <section className="dashboard__section">
      <div className="dashboard__section-header">
        <h2 className="dashboard__section-title">Instructores</h2>
        <button className="admin-btn-add" onClick={abrirNuevo}>+ Nuevo instructor</button>
      </div>

      {mostrarForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <div className="admin-form__grid">
            <div className="auth-form__field">
              <label className="auth-form__label">Nombre</label>
              <input className="auth-form__input" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Apellido</label>
              <input className="auth-form__input" name="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Email</label>
              <input className="auth-form__input" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">Teléfono <span className="auth-form__optional">(opcional)</span></label>
              <input className="auth-form__input" name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
            <div className="auth-form__field">
              <label className="auth-form__label">
                Contraseña {editando && <span className="auth-form__optional">(dejar vacío para no cambiar)</span>}
              </label>
              <input className="auth-form__input" type="password" name="password" value={form.password}
                onChange={handleChange} {...(!editando && { required: true })} minLength={6} />
            </div>
          </div>
          {error && <p className="auth-form__error">{error}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="auth-form__btn" style={{ maxWidth: 180 }} disabled={guardando}>
              {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear instructor'}
            </button>
            <button type="button" className="admin-form__cancel" onClick={cerrar}>Cancelar</button>
          </div>
        </form>
      )}

      {cargando ? (
        <p className="dashboard__loading">Cargando…</p>
      ) : instructores.length === 0 ? (
        <p className="dashboard__empty">No hay instructores registrados.</p>
      ) : (
        <div className="tipos-lista">
          {instructores.map(inst => (
            <div key={inst._id} className="tipo-card">
              <div className="tipo-card__info">
                <strong>{inst.nombre} {inst.apellido}</strong>
                <span>{inst.email}</span>
                {inst.telefono && <span>{inst.telefono}</span>}
              </div>
              <div className="tipo-card__acciones">
                <button className="turno-card__btn" onClick={() => abrirEditar(inst)}>Editar</button>
                <button className="turno-card__btn turno-card__btn--cancelar" onClick={() => eliminar(inst)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Subcomponente: Panel de Métricas ─────────────────────────────────────
function PanelMetricas() {
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/metricas')
      .then(r => setData(r.data))
      .catch(() => setError('No se pudieron cargar las métricas.'))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p className="dashboard__section-desc">Cargando métricas...</p>
  if (error) return <p className="metricas-error">{error}</p>

  const { resumen, ingresosChart, turnosPorTipo, turnosPorInstructor, ocupacionPromedio } = data

  const maxIngreso = Math.max(...ingresosChart.map(m => m.total), 1)

  return (
    <section className="dashboard__section">
      <h2 className="dashboard__section-title">Métricas del estudio</h2>

      {/* Tarjetas resumen */}
      <div className="metricas-grid">
        <div className="metrica-card">
          <span className="metrica-card__valor">{resumen.totalClientes}</span>
          <span className="metrica-card__label">Alumnos</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-card__valor">{resumen.totalInstructores}</span>
          <span className="metrica-card__label">Instructores</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-card__valor">{resumen.turnosProximos}</span>
          <span className="metrica-card__label">Turnos próximos</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-card__valor">{resumen.membresiasActivas}</span>
          <span className="metrica-card__label">Membresías activas</span>
        </div>
        <div className="metrica-card">
          <span className="metrica-card__valor">{resumen.nuevosClientes}</span>
          <span className="metrica-card__label">Nuevos alumnos (30d)</span>
        </div>
        <div className="metrica-card metrica-card--accent">
          <span className="metrica-card__valor">
            ${resumen.totalMesActual?.toLocaleString('es-AR') ?? '0'}
          </span>
          <span className="metrica-card__label">Ingresos del mes</span>
        </div>
      </div>

      {/* Gráfico de ingresos últimos 6 meses */}
      <div className="metricas-bloque">
        <h3 className="metricas-subtitulo">Ingresos últimos 6 meses</h3>
        <div className="metricas-chart">
          {ingresosChart.map((m, i) => (
            <div key={i} className="metricas-chart__col">
              <span className="metricas-chart__monto">
                ${m.total?.toLocaleString('es-AR') ?? '0'}
              </span>
              <div className="metricas-chart__barra-wrap">
                <div
                  className="metricas-chart__barra"
                  style={{ height: `${Math.round((m.total / maxIngreso) * 100)}%` }}
                />
              </div>
              <span className="metricas-chart__mes">{m.mes}</span>
              <span className="metricas-chart__count">{m.cantidad} pago{m.cantidad !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ocupación promedio */}
      <div className="metricas-bloque">
        <h3 className="metricas-subtitulo">Ocupación promedio (próximos 30 días)</h3>
        <div className="metricas-progreso-wrap">
          <div className="metricas-progreso">
            <div
              className="metricas-progreso__fill"
              style={{ width: `${ocupacionPromedio}%` }}
            />
          </div>
          <span className="metricas-progreso__label">{ocupacionPromedio}%</span>
        </div>
      </div>

      <div className="metricas-dos-col">
        {/* Top tipos de clase */}
        <div className="metricas-bloque">
          <h3 className="metricas-subtitulo">Clases más populares</h3>
          <ul className="metricas-lista">
            {turnosPorTipo.map((t, i) => (
              <li key={i} className="metricas-lista__item">
                <span className="metricas-lista__nombre">{t._id || 'Sin nombre'}</span>
                <span className="metricas-lista__badge">{t.totalTurnos} turno{t.totalTurnos !== 1 ? 's' : ''} · {t.totalInscriptos} inscripto{t.totalInscriptos !== 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top instructores */}
        <div className="metricas-bloque">
          <h3 className="metricas-subtitulo">Instructores más activos</h3>
          <ul className="metricas-lista">
            {turnosPorInstructor.map((inst, i) => (
              <li key={i} className="metricas-lista__item">
                <span className="metricas-lista__nombre">{inst.nombre} {inst.apellido}</span>
                <span className="metricas-lista__badge">{inst.totalTurnos} turno{inst.totalTurnos !== 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const TABS = [
  { id: 'turnos', label: 'Turnos' },
  { id: 'tipos', label: 'Tipos de clase' },
  { id: 'instructores', label: 'Instructores' },
  { id: 'membresias', label: 'Membresías' },
  { id: 'metricas', label: 'Métricas' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('turnos')
  const [tiposClase, setTiposClase] = useState([])
  const [instructores, setInstructores] = useState([])
  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormTurno, setMostrarFormTurno] = useState(false)
  const [turnoEditar, setTurnoEditar] = useState(null)
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)

  const cargarTurnos = useCallback(async () => {
    const res = await api.get('/turnos/admin/todos')
    setTurnos(res.data.turnos)
  }, [])

  const cargarTiposClase = useCallback(async () => {
    const res = await api.get('/tipos-clase/todos')
    setTiposClase(res.data.tipos)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const [turnosRes, tiposRes, instructoresRes] = await Promise.all([
          api.get('/turnos/admin/todos'),
          api.get('/tipos-clase/todos'),
          api.get('/usuarios?roles=instructor'),
        ])
        setTurnos(turnosRes.data.turnos)
        setTiposClase(tiposRes.data.tipos)
        setInstructores(instructoresRes.data.usuarios || [])
      } catch (e) {
        console.error(e)
      } finally {
        setCargando(false)
      }
    }
    init()
  }, [])

  const handleLogout = () => { logout(); navigate('/', { replace: true }) }

  const formatFecha = fecha =>
    new Date(fecha).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

  const handleEliminarTurno = async (id) => {
    if (!window.confirm('¿Eliminar este turno? Esta acción no se puede deshacer.')) return
    try {
      await api.delete(`/turnos/${id}`)
      cargarTurnos()
    } catch (e) { console.error(e) }
  }

  const abrirEditar = (turno) => {
    setTurnoEditar(turno)
    setMostrarFormTurno(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cerrarForm = () => {
    setMostrarFormTurno(false)
    setTurnoEditar(null)
  }

  const handleTurnoGuardado = () => {
    cerrarForm()
    cargarTurnos()
  }

  const handleClickCalendario = (turno) => {
    setTurnoSeleccionado(ts => ts?._id === turno._id ? null : turno)
  }

  const handleAsignarInstructor = async (instructorId) => {
    try {
      const res = await api.put(`/turnos/${turnoSeleccionado._id}`, {
        instructor: instructorId || null
      })
      setTurnoSeleccionado(res.data.turno)
      cargarTurnos()
    } catch (e) { console.error(e) }
  }

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
        <p className="prelogin__tag">Administración</p>
        <h1 className="auth-card__title" style={{ marginBottom: 24 }}>Panel de gestión</h1>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t.id}
              className={`admin-tab${tab === t.id ? ' admin-tab--active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="dashboard__loading">Cargando…</p>
        ) : (
          <>
            {/* ── TAB: TURNOS ─────────────────────────────────────── */}
            {tab === 'turnos' && (
              <div>
                <div className="dashboard__stats" style={{ marginBottom: 24 }}>
                  <div className="stat-card">
                    <span className="stat-card__num">{turnos.length}</span>
                    <span className="stat-card__label">Turnos totales</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card__num">
                      {turnos.filter(t => new Date(t.fecha) >= new Date()).length}
                    </span>
                    <span className="stat-card__label">Próximos</span>
                  </div>
                </div>

                <section className="dashboard__section">
                  <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">
                      {turnoEditar ? 'Editar turno' : mostrarFormTurno ? 'Nuevo turno' : 'Turnos'}
                    </h2>
                    {!mostrarFormTurno && (
                      <button className="admin-btn-add" onClick={() => setMostrarFormTurno(true)}>
                        + Nuevo turno
                      </button>
                    )}
                  </div>

                  {mostrarFormTurno && (
                    <FormTurno
                      tiposClase={tiposClase.filter(t => t.activa)}
                      instructores={instructores}
                      turnoEditar={turnoEditar}
                      onGuardado={handleTurnoGuardado}
                      onCancelar={cerrarForm}
                    />
                  )}

                  {/* Calendario mensual */}
                  <CalendarioMensual
                    turnos={turnos}
                    onClickTurno={handleClickCalendario}
                    turnoActivo={turnoSeleccionado?._id}
                  />
                  {turnos.length === 0 && (
                    <p className="dashboard__empty" style={{ marginTop: 12 }}>No hay turnos creados aún.</p>
                  )}

                  {/* Panel de detalle del turno seleccionado */}
                  {turnoSeleccionado && (
                    <div className="cal-detalle">
                      <div className="cal-detalle__info">
                        <strong>{turnoSeleccionado.tipoClase?.nombre}</strong>
                        <span>{formatFecha(turnoSeleccionado.fecha)}</span>
                        <span>{(turnoSeleccionado.cuposDisponibles ?? turnoSeleccionado.cupoMaximo)}/{turnoSeleccionado.cupoMaximo} cupos</span>
                        <div className="cal-detalle__instructor">
                          <label className="cal-detalle__instructor-label">Instructor</label>
                          <select
                            className="cal-detalle__instructor-sel"
                            value={turnoSeleccionado.instructor?._id || turnoSeleccionado.instructor || ''}
                            onChange={e => handleAsignarInstructor(e.target.value)}
                          >
                            <option value="">Sin asignar</option>
                            {instructores.map(i => (
                              <option key={i._id} value={i._id}>{i.nombre} {i.apellido}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="cal-detalle__acciones">
                        <button className="turno-card__btn" onClick={() => { abrirEditar(turnoSeleccionado); setTurnoSeleccionado(null) }}>Editar</button>
                        <button className="turno-card__btn turno-card__btn--cancelar" onClick={() => { handleEliminarTurno(turnoSeleccionado._id); setTurnoSeleccionado(null) }}>Eliminar</button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ── TAB: TIPOS DE CLASE ─────────────────────────────── */}
            {tab === 'tipos' && <PanelTiposClase onCambio={cargarTiposClase} />}

            {/* ── TAB: INSTRUCTORES ───────────────────────────────── */}
            {tab === 'instructores' && <PanelInstructores />}

            {/* ── TAB: MEMBRESÍAS ─────────────────────────────────── */}
            {tab === 'membresias' && (
              <section className="dashboard__section">
                <h2 className="dashboard__section-title">Activar membresía</h2>
                <p className="dashboard__section-desc">
                  Ingresá el email del alumno para activarle o extenderle la membresía por 1 mes.
                </p>
                <FormMembresia />
              </section>
            )}

            {/* ── TAB: MÉTRICAS ────────────────────────────────────── */}
            {tab === 'metricas' && <PanelMetricas />}
          </>
        )}
      </main>
    </div>
  )
}
