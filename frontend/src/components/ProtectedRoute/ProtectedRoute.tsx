import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import type { Papel } from '../../services/usuarios'

type Props = {
  papeis?: Papel[]
}

export function ProtectedRoute({ papeis }: Props) {
  const { token, papel } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (papeis && (!papel || !papeis.includes(papel))) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
