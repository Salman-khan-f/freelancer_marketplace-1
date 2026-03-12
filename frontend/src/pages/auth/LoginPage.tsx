import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login(email, password)
    } catch (err) {
      console.error(err)
      setError('Invalid email or password.')
      setSubmitting(false)
    }
  }

  const from = (location.state as { from?: Location })?.from

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {from && (
        <p className="auth-info">
          You must be logged in to view that page.
        </p>
      )}
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Login to Account'}
      </button>
      <div className="auth-footer">
        Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
      </div>
    </form>
  )
}

