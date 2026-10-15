import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'

export function ProtectedRoute() {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
