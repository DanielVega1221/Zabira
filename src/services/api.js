import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // enviar y recibir cookies httpOnly en cada request
})

// Manejar 401 globalmente (cookie expirada / inválida)
// Solo redirigir si el usuario estaba en una ruta protegida,
// no en páginas públicas (evita loop al verificar la cookie en /login, /, etc.)
const RUTAS_PUBLICAS = ['/', '/login', '/registro', '/pre-login']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !RUTAS_PUBLICAS.includes(window.location.pathname)
    ) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
