import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskApi } from '../../api/taskApi'

export default function CompanyTaskCreatePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await taskApi.createTask({
        title,
        description,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
      })
      navigate('/company')
    } catch (err) {
      console.error(err)
      setError('Failed to create task. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h1 className="dashboard-section-title">Create task</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-field">
            <label htmlFor="budgetMin">Minimum budget ($)</label>
            <input
              id="budgetMin"
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="budgetMax">Maximum budget ($)</label>
            <input
              id="budgetMax"
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ resize: 'vertical' }}
            required
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save task'}
        </button>
      </form>
    </section>
  )
}

