import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import App from './App.jsx'
import PreLogin from './pages/PreLogin.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ClienteDashboard from './pages/dashboards/ClienteDashboard.jsx'
import InstructorDashboard from './pages/dashboards/InstructorDashboard.jsx'
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx'
import MasterDashboard from './pages/dashboards/MasterDashboard.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      {/* Públicas */}
      <Route path="/" element={<App />} />
      <Route path="/pre-login" element={<PreLogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Protegidas por rol */}
      <Route path="/dashboard/cliente" element={
        <ProtectedRoute roles={['cliente', 'instructor', 'admin', 'master']}>
          <ClienteDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/instructor" element={
        <ProtectedRoute roles={['instructor', 'admin', 'master']}>
          <InstructorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/admin" element={
        <ProtectedRoute roles={['admin', 'master']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/master" element={
        <ProtectedRoute roles={['master']}>
          <MasterDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
