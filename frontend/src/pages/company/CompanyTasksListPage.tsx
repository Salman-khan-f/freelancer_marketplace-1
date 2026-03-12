import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { taskApi, type Task } from '../../api/taskApi'

export default function CompanyTasksListPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    taskApi.listCompanyTasks()
      .then(setTasks)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-screen">Loading your tasks...</div>

  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 className="dashboard-section-title" style={{ marginBottom: 0 }}>My tasks</h1>
        <Link to="/company/tasks/new" className="primary-button">
          Create task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No tasks yet. Use &quot;Create task&quot; to post your first task.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/company/tasks/${task.id}`}
              className="glass"
              style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{task.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Budget: ${task.budgetMin} - ${task.budgetMax}
                </p>
              </div>
              <span className="tag">{task.status}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

