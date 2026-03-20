import { Link } from 'react-router-dom'
import '../App.css'
import entrarImg from '../assets/EntrarImagen.jpg'
import unirseImg from '../assets/unirseImagen.png'

export default function PreLogin() {
  return (
    <div className="prelogin page-transition">
      <header className="prelogin__nav">
        <Link to="/" className="prelogin__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </Link>
        <span className="prelogin__logo">Zabira<em>Studio</em></span>
        <div className="prelogin__nav-spacer" />
      </header>

      <main className="prelogin__main">
        {/* Panel izquierdo — alumnos existentes */}
        <div
          className="prelogin__panel prelogin__panel--dark"
          style={{ backgroundImage: `url(${entrarImg})` }}
        >
          <div className="prelogin__panel-overlay" aria-hidden="true" />
          <div className="prelogin__panel-inner">
            <p className="prelogin__tag">Ya sos parte de Zabira</p>
            <h2 className="prelogin__heading">¿Ya hacés pilates en Zabira?</h2>
            <p className="prelogin__sub">
              Ingresá a tu cuenta para ver los horarios disponibles y reservar tu turno en segundos.
            </p>
            <Link to="/login" className="prelogin__btn prelogin__btn--outline">
              Reservar mi turno
            </Link>
          </div>
        </div>

        <div className="prelogin__divider" aria-hidden="true">
          <span>o</span>
        </div>

        {/* Panel derecho — nuevos alumnos */}
        <div
          className="prelogin__panel prelogin__panel--light"
          style={{ backgroundImage: `url(${unirseImg})` }}
        >
          <div className="prelogin__panel-overlay" aria-hidden="true" />
          <div className="prelogin__panel-inner">
            <p className="prelogin__tag">Primera vez</p>
            <h2 className="prelogin__heading">¿Aún no hacés pilates en Zabira?</h2>
            <p className="prelogin__sub">
              Creá tu cuenta y empezá con una clase de prueba gratuita. Sin compromiso.
            </p>
            <Link to="/registro" className="prelogin__btn prelogin__btn--filled">
              Quiero unirme
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
