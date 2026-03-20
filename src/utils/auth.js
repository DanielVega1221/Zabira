// Prioridad de rol para redirección post-login
const ROLE_PRIORITY = ['master', 'admin', 'instructor', 'cliente']
const ROLE_ROUTES = {
  master: '/dashboard/master',
  admin: '/dashboard/admin',
  instructor: '/dashboard/instructor',
  cliente: '/dashboard/cliente'
}

export const getRolePrimaryRoute = (roles = []) => {
  for (const rol of ROLE_PRIORITY) {
    if (roles.includes(rol)) return ROLE_ROUTES[rol]
  }
  return '/login'
}
