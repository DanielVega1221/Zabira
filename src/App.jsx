import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import heroImg from './assets/HeroLanding.webp'
import experienciaImg from './assets/experiencia.webp'
import card1Img from './assets/card1.webp'
import card2Img from './assets/card2.webp'
import card3Img from './assets/card3.webp'
import classFondoImg from './assets/classfondo.webp'
import studioImg from './assets/studio.webp'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-transition">

      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <a href="#" className="navbar__logo">
            Zabira<span>Studio</span>
          </a>

          <nav className="navbar__nav">
            <a href="#clases">Clases</a>
            <a href="#reservar">C&#243;mo funciona</a>
            <a href="#precios">Membres&#237;a</a>
            <a href="#espacio">El Estudio</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <a href="#" onClick={e => { e.preventDefault(); navigate('/pre-login') }} className="navbar__cta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Reservar
          </a>

          <button
            className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <div className="navbar__overlay">
            <button className="navbar__overlay-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menu">
              <span /><span />
            </button>
            <span className="navbar__overlay-logo">Zabira<em>Studio</em></span>
            <nav className="navbar__overlay-nav">
              <a href="#clases"       onClick={() => setMenuOpen(false)}>Clases</a>
              <a href="#reservar"     onClick={() => setMenuOpen(false)}>C&#243;mo funciona</a>
              <a href="#precios"      onClick={() => setMenuOpen(false)}>Membres&#237;a</a>
              <a href="#espacio"      onClick={() => setMenuOpen(false)}>El Estudio</a>
              <a href="#contacto"     onClick={() => setMenuOpen(false)}>Contacto</a>
            </nav>
            <a
              href="#"
              className="navbar__overlay-cta"
              onClick={e => { e.preventDefault(); setMenuOpen(false); navigate('/pre-login') }}
            >
              Reservar
            </a>
          </div>
        )}
      </header>

      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <img src={heroImg} alt="" />
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />

        <div className="hero__content">
          <p className="hero__tag">Pilates Consciente</p>
          <h1 className="hero__title">
            Entr&#233;n&#225; tu cuerpo con<br />
            <em>control y conciencia</em>
          </h1>
          <p className="hero__subtitle">
            Clases de pilates dise&#241;adas para mejorar tu postura,<br />
            fuerza y bienestar, sin impacto y con seguimiento real.
          </p>
          <div className="hero__actions">
            <a href="#" onClick={e => { e.preventDefault(); navigate('/pre-login') }} className="btn--hero">Reservar clase</a>
          </div>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      <section className="benefits" id="beneficios">
        <div className="section-inner">
          <div className="benefits__grid">
            <div className="benefit-item">
              <div className="benefit-item__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l3 3 5-5"/></svg>
              </div>
              <div>
                <h3>Mejor&#225; tu postura</h3>
                <p>Correcci&#243;n progresiva del eje corporal con trabajo consciente.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-item__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              </div>
              <div>
                <h3>Reduc&#237; tensiones y estr&#233;s</h3>
                <p>El movimiento consciente libera la carga f&#237;sica y mental del d&#237;a.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-item__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h3>Gan&#225; fuerza sin impacto</h3>
                <p>Fortalecimiento profundo sin sobrecargar articulaciones.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-item__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <div>
                <h3>Mov&#233;te sin dolor</h3>
                <p>Recuper&#225; libertad de movimiento y sentite bien en tu cuerpo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="experience" id="experiencia">
        <div className="experience__bg" aria-hidden="true">
          <img src={experienciaImg} alt="" />
        </div>
        <div className="experience__overlay" aria-hidden="true" />
        <div className="section-inner experience__inner">
          <div className="experience__left">
            <p className="section-tag light">La experiencia Zabira</p>
            <h2 className="section-title light">No es solo pilates,<br />es c&#243;mo lo trabaj&#225;s</h2>
            <p className="section-subtitle light">En Zabira cada clase est&#225; pensada para que entiendas tu cuerpo, mejores tu control y avances a tu ritmo.</p>
          </div>
          <ul className="experience__list">
            <li className="experience__item">
              <span className="experience__num">01</span>
              <div>
                <strong>Grupos reducidos</strong>
                <p>M&#225;ximo 6 personas por clase para que el trabajo sea real.</p>
              </div>
            </li>
            <li className="experience__item">
              <span className="experience__num">02</span>
              <div>
                <strong>Seguimiento personalizado</strong>
                <p>Tu progresi&#243;n se registra y se adapta clase a clase.</p>
              </div>
            </li>
            <li className="experience__item">
              <span className="experience__num">03</span>
              <div>
                <strong>Correcci&#243;n constante</strong>
                <p>Cada movimiento tiene intenci&#243;n y retroalimentaci&#243;n inmediata.</p>
              </div>
            </li>
            <li className="experience__item">
              <span className="experience__num">04</span>
              <div>
                <strong>Progresi&#243;n real</strong>
                <p>Not&#225;s la diferencia desde las primeras semanas, no los primeros meses.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="classes" id="clases">
        <div className="section-inner">
          <p className="section-tag centered">Lo que ofrecemos</p>
          <h2 className="section-title centered">Eleg&#237; c&#243;mo quer&#233;s entrenar</h2>
          <div className="classes__grid">
            <div className="class-card" style={{ backgroundImage: `url(${card1Img})` }}>
              <div className="class-card__overlay" />
              <div className="class-card__content">
                <div className="class-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <h3>Pilates Reformer</h3>
                <p>Trabajo completo con m&#225;quinas para ganar fuerza, control y movilidad.</p>
              </div>
            </div>
            <div className="class-card" style={{ backgroundImage: `url(${card2Img})` }}>
              <div className="class-card__overlay" />
              <div className="class-card__content">
                <div className="class-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                </div>
                <h3>Stretching &amp; Movilidad</h3>
                <p>Liber&#225; tensiones, mejor&#225; tu flexibilidad y recuper&#225; amplitud de movimiento.</p>
              </div>
            </div>
            <div className="class-card" style={{ backgroundImage: `url(${card3Img})` }}>
              <div className="class-card__overlay" />
              <div className="class-card__content">
                <div className="class-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Clases Personalizadas</h3>
                <p>Entrenamiento adaptado a tus objetivos, historial y ritmo de avance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="system" id="reservar">
        <div className="system__bg" aria-hidden="true">
          <img src={classFondoImg} alt="" />
        </div>
        <div className="system__overlay" aria-hidden="true" />
        <div className="section-inner system__inner">
          <div className="system__text">
            <p className="section-tag light">Tu diferencial</p>
            <h2 className="section-title light">Reserv&#225; tu lugar<br />en segundos</h2>
            <p className="section-subtitle light">Gestion&#225; tus clases de forma simple, sin idas y vueltas.</p>
            <ul className="system__features">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Eleg&#237; horario en tiempo real
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Reprogramá sin complicaciones
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Recordatorios autom&#225;ticos
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Seguimiento de tus clases
              </li>
            </ul>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/pre-login') }} className="btn--system">Reservar ahora</a>
          </div>
          <div className="system__steps">
            <div className="system__step">
              <div className="system__step-num">01</div>
              <div className="system__step-line" aria-hidden="true" />
              <div className="system__step-body">
                <h3>Eleg&#237;s tu horario</h3>
                <p>Ves los turnos disponibles en tiempo real y reserv&#225;s el que mejor te queda, en cualquier momento.</p>
              </div>
            </div>
            <div className="system__step">
              <div className="system__step-num">02</div>
              <div className="system__step-line" aria-hidden="true" />
              <div className="system__step-body">
                <h3>Confirm&#225;s tu lugar</h3>
                <p>Recib&#237;s confirmaci&#243;n instant&#225;nea y un recordatorio antes de cada clase para que no se te pase.</p>
              </div>
            </div>
            <div className="system__step">
              <div className="system__step-num">03</div>
              <div className="system__step-line last" aria-hidden="true" />
              <div className="system__step-body">
                <h3>Disfut&#225;s tu clase</h3>
                <p>Si necesit&#225;s cambiarla, reprogramar es igual de simple. Sin llamadas, sin idas y vueltas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="plans" id="precios">
        <div className="section-inner">
          <p className="section-tag centered">Membres&#237;a mensual</p>
          <h2 className="section-title centered">Un solo plan, todas las clases</h2>
          <div className="membership-split">
            <div className="membership-split__left">
              <p className="membership-split__tag">&#191;C&#243;mo funciona?</p>
              <p className="membership-split__desc">Pag&#225;s el mes y asist&#237;s a todas las clases que quieras, siempre que haya lugar disponible.</p>
              <p className="membership-split__desc">Sin paquetes, sin vencimientos, sin complicaciones.</p>
              <p className="membership-split__quote"><em>&#8220;Mov&#233;te como quer&#233;s,<br />cuando pod&#233;s.&#8221;</em></p>
            </div>
            <div className="membership-split__right">
              <ul className="membership__features">
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Acceso a todas las clases del mes
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Reserva y cancelaci&#243;n online
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Recordatorios autom&#225;ticos
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Grupos reducidos garantizados
                </li>
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Seguimiento personalizado de tu progreso
                </li>
              </ul>
              <a href="#" onClick={e => { e.preventDefault(); navigate('/registro') }} className="btn--plan-featured">Quiero empezar</a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonios">
        <div className="section-inner">
          <p className="section-tag light centered">Lo que dicen</p>
          <h2 className="section-title light centered">Resultados que se sienten</h2>
          <div className="testimonials__grid">
            <div className="testimonial-card">
              <span className="testimonial-card__quote">&#8220;</span>
              <p>Me ayud&#243; a mejorar la postura en pocas semanas. Empec&#233; a notar la diferencia en el trabajo.</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__line" />
                <span className="testimonial-card__author">Mar&#237;a G.</span>
              </div>
            </div>
            <div className="testimonial-card">
              <span className="testimonial-card__quote">&#8220;</span>
              <p>Las clases son s&#250;per guiadas, no te sent&#237;s perdida. Se nota que hay un seguimiento real.</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__line" />
                <span className="testimonial-card__author">Luc&#237;a M.</span>
              </div>
            </div>
            <div className="testimonial-card">
              <span className="testimonial-card__quote">&#8220;</span>
              <p>Es el &#250;nico lugar donde realmente noto progreso. Los grupos reducidos hacen toda la diferencia.</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__line" />
                <span className="testimonial-card__author">Sof&#237;a R.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space" id="espacio">
        <img src={studioImg} className="space__bg" alt="" />
        <div className="space__overlay" />
        <div className="section-inner space__content">
          <p className="section-tag light centered">El estudio</p>
          <h2 className="section-title light centered">Un espacio pensado<br />para tu bienestar</h2>
          <p className="section-subtitle light centered">Ambiente tranquilo, luz natural y equipamiento profesional para que entrenes con comodidad y foco.</p>
          <div className="space__features">
            <span className="space__feature">Luz natural</span>
            <span className="space__feature">Grupos reducidos</span>
            <span className="space__feature">Equipamiento profesional</span>
            <span className="space__feature">Ambiente tranquilo</span>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="section-inner cta-final__inner">
          <p className="section-tag centered">Primera clase gratuita</p>
          <h2 className="section-title centered">Empez&#225; hoy</h2>
          <p className="section-subtitle centered">Tu cuerpo lo va a notar desde la primera clase.<br />Grupos reducidos, seguimiento personalizado.</p>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/pre-login') }} className="btn--cta-final">Reservar clase <span className="btn__arrow">&#8594;</span></a>
          <p className="cta-final__note">Sin cargo &#183; Cancel&#225;s cuando quer&#233;s</p>
        </div>
      </section>

      <footer className="footer" id="contacto">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__wordmark">Zabira<em>Studio</em></span>
            <p className="footer__tagline">Pilates &amp; Movimiento consciente</p>
          </div>
          <div className="footer__cols">
          <div className="footer__links">
            <p className="footer__heading">Contacto</p>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L.057 23.882l6.198-1.625A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 0 1-4.964-1.352l-.356-.211-3.68.965.981-3.585-.232-.368A9.77 9.77 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              Instagram
            </a>
          </div>
          <div className="footer__address">
            <p className="footer__heading">Ubicaci&#243;n</p>
            <p>Av. Santa Fe 1234<br />Buenos Aires, Argentina</p>
          </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&#169; 2026 Zabira Studio. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default App
