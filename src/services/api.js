import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // enviar y recibir cookies httpOnly en cada request
})

// Manejar 401 globalmente (cookie expirada / inválida)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // No hay nada que limpiar en localStorage; el servidor ya
      // invalida la cookie al responder 401
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
