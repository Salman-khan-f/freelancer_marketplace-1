import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { taskApi, type Task } from '../../api/taskApi'

export default function FreelancerBrowseTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    taskApi.listOpenTasks()
      .then((data) => setTasks(data.content || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading available tasks...</div>

  return (
    <section>
      <h1 className="dashboard-section-title">Browse tasks</h1>
      
      {tasks.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No open tasks available at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/freelancer/tasks/${task.id}`}
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
              <div style={{ textAlign: 'right' }}>
                <span className="tag" style={{ marginBottom: '0.5rem', display: 'block' }}>{task.status}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Apply Now &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

