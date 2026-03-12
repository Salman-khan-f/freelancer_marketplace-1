import { Outlet } from 'react-router-dom'
import './layouts.css'

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1 className="auth-title">Marketplace</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        <Outlet />
      </div>
    </div>
  )
}

