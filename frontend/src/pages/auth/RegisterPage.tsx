import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type Role = 'company' | 'freelancer'

export default function RegisterPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('company')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await register({ name, email, password, role })
    } catch (err) {
      console.error(err)
      setError('Unable to register with the provided details.')
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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
      <div className="form-field">
        <label htmlFor="role">Register as</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="company">Company</option>
          <option value="freelancer">Freelancer</option>
        </select>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Create Account'}
      </button>
      <div className="auth-footer">
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
      </div>
    </form>
  )
}

