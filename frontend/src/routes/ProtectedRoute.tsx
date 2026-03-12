import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Role = 'admin' | 'company' | 'freelancer'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as Role)) {
    // Redirect authenticated users with wrong role to their home dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    if (user.role === 'company') {
      return <Navigate to="/company" replace />
    }

    if (user.role === 'freelancer') {
      return <Navigate to="/freelancer" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

